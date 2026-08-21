'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ChatOverlayWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const channel = (searchParams?.channel || 'itsfatih').trim().toLowerCase();
  const theme = searchParams?.theme || 'dark';
  const fontSize = searchParams?.font_size || '14';
  const showBadges = searchParams?.show_badges !== 'false';

  const [messages, setMessages] = useState<any[]>([]);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [statusText, setStatusText] = useState<string>(`Oda ID aranıyor (${channel})...`);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const renderMessageContent = (content: string) => {
    if (!content) return '';
    const emoteRegex = /\[emote:(\d+):([a-zA-Z0-9_-]+)\]/g;
    const parts: (string | React.ReactNode)[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;
    
    while ((match = emoteRegex.exec(content)) !== null) {
      if (match.index > lastIdx) parts.push(content.substring(lastIdx, match.index));
      const emoteId = match[1];
      const emoteName = match[2];
      parts.push(
        <img
          key={`${emoteId}-${match.index}`}
          src={`https://files.kick.com/emotes/${emoteId}/fullsize`}
          alt={emoteName}
          title={emoteName}
          className="inline-block align-middle mx-1 my-0.5 max-h-[1.4em] w-auto select-none object-contain"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            if (!el.src.includes('static-files.kick.com')) el.src = `https://static-files.kick.com/emotes/${emoteId}/fullsize`;
          }}
        />
      );
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < content.length) parts.push(content.substring(lastIdx));
    return parts.length > 0 ? parts : content;
  };

  useEffect(() => {
    let ws: WebSocket | null = null;
    let isCancelled = false;
    let reconnectTimer: NodeJS.Timeout;

    async function initChat() {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        const data = await res.json();
        const chatroomId = data?.chatroom?.id || data?.chatroom_id;

        if (!chatroomId) {
          if (!isCancelled) setStatusText(`Kanal gizli veya bulunamadı (${channel})`);
          return;
        }

        if (isCancelled) return;
        setStatusText(`Bağlanılıyor... (Oda ID: ${chatroomId})`);

        ws = new WebSocket('wss://ws-us2.pusher.com/app/eb1d5f28308142977d07?protocol=7&client=js&version=7.6.0&flash=false');

        ws.onopen = () => {
          setStatusText(`Soket açıldı, Pusher bekleniyor...`);
        };

        ws.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            
            if (parsed.event !== 'pusher:pong') {
                setDebugLogs((prev) => [...prev.slice(-3), `GELEN: ${parsed.event}`]);
            }

            if (parsed.event === 'pusher:connection_established') {
              setStatusText(`Pusher onayladı, odaya giriliyor...`);
              ws?.send(
                JSON.stringify({
                  event: 'pusher:subscribe',
                  data: { auth: '', channel: `chatrooms.${chatroomId}.v2` },
                })
              );
            }

            if (parsed.event === 'pusher:ping') {
              ws?.send(JSON.stringify({ event: 'pusher:pong', data: {} }));
              return;
            }

            if (parsed.event === 'pusher_internal:subscription_succeeded') {
              setStatusText(`Sohbete bağlanıldı ✓`);
              setDebugLogs((prev) => [...prev.slice(-3), `BAŞARILI: Abone olundu!`]);
            }

            if (parsed.data) {
              const msgData = typeof parsed.data === 'string' ? JSON.parse(parsed.data) : parsed.data;
              if (msgData && msgData.content && msgData.sender) {
                setMessages((prev) => [...prev.slice(-49), msgData]);
              }
            }
          } catch (e) {}
        };

        ws.onclose = (e) => {
          if (!isCancelled) {
            const code = e.code;
            setStatusText(`Koptu (Hata Kodu: ${code})`);
            reconnectTimer = setTimeout(initChat, 5000);
          }
        };
      } catch (err) {
        if (!isCancelled) setStatusText(`API Hatası (${channel})`);
      }
    }

    initChat();

    return () => {
      isCancelled = true;
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [channel]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, debugLogs]);

  const isLight = theme === 'light';

  return (
    <div className="w-full h-full flex flex-col justify-end p-4 overflow-hidden bg-transparent select-none font-sans" style={{ fontSize: `${fontSize}px` }}>
      <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
        
        <div className="text-emerald-400 text-xs font-bold px-3 py-2 bg-black/80 rounded-xl border border-emerald-500/30">
          {statusText}
        </div>

        {debugLogs.length > 0 && (
          <div className="flex flex-col gap-1 mt-1 mb-2">
            <span className="text-yellow-400 text-[9px] font-black tracking-widest uppercase">Teşhis Logları:</span>
            {debugLogs.map((log, i) => (
              <div key={i} className="text-[10px] font-mono text-white/70 bg-blue-900/40 border border-blue-500/30 p-1.5 rounded break-words">
                {log}
              </div>
            ))}
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-md animate-[fadeIn_0.2s_ease-out] ${isLight ? 'bg-white/90 border-black/5 text-slate-900 shadow-slate-200/50' : 'bg-[#0b0e14]/90 border-white/10 text-white shadow-black/40'}`}>
            {showBadges && msg.sender?.identity?.badges && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {msg.sender.identity.badges.map((b: any, i: number) => (
                  <span key={i} className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-white/15 text-white border border-white/10">{b.type}</span>
                ))}
              </div>
            )}
            <span className="font-black flex-shrink-0" style={{ color: msg.sender?.identity?.color || '#00e701' }}>{msg.sender?.username}:</span>
            <span className="font-medium break-words leading-relaxed flex-1 min-w-0">{renderMessageContent(msg.content)}</span>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>
    </div>
  );
}
