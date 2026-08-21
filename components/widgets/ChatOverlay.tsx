'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ChatOverlayWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const channel = (searchParams?.channel || 'itsfatih').trim().toLowerCase();
  const theme = searchParams?.theme || 'dark';
  const fontSize = searchParams?.font_size || '14';

  const [messages, setMessages] = useState<any[]>([]);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [statusText, setStatusText] = useState<string>(`Oda ID aranıyor (${channel})...`);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingInterval: NodeJS.Timeout | null = null;
    let isCancelled = false;

    async function initChat() {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        const data = await res.json();
        const chatroomId = data?.chatroom?.id || data?.chatroom_id;

        if (!chatroomId) {
          if (!isCancelled) setStatusText(`Kanal bulunamadı veya gizli (${channel})`);
          return;
        }

        if (isCancelled) return;
        setStatusText(`Bağlanılıyor... (Bulunan Oda ID: ${chatroomId})`);

        ws = new WebSocket('wss://ws-us2.pusher.com/app/eb1d5f28308142977d07?protocol=7&client=js&version=7.6.0&flash=false');

        ws.onopen = () => {
          ws?.send(
            JSON.stringify({
              event: 'pusher:subscribe',
              data: { auth: '', channel: `chatrooms.${chatroomId}.v2` },
            })
          );

          pingInterval = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
            }
          }, 20000);
        };

        ws.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            
            if (parsed.event === 'pusher:ping') {
              ws?.send(JSON.stringify({ event: 'pusher:pong', data: {} }));
              return;
            }

            if (parsed.event === 'pusher_internal:subscription_succeeded') {
              setStatusText(`Sohbete bağlanıldı ✓ (Dinlenen Oda: ${chatroomId})`);
            }

            // GELEN HER ŞEYİ EKRANA BAS (DEBUG)
            if (parsed.event !== 'pusher_internal:subscription_succeeded' && parsed.event !== 'pusher:pong') {
                const logMsg = `EVENT: ${parsed.event} | DATA: ${typeof parsed.data === 'string' ? parsed.data : JSON.stringify(parsed.data)}`;
                setDebugLogs((prev) => [...prev.slice(-5), logMsg]); // Son 5 logu tut
            }

            // Normal Mesaj Yakalama Denemesi
            if (parsed.data) {
              const msgData = typeof parsed.data === 'string' ? JSON.parse(parsed.data) : parsed.data;
              if (msgData && msgData.content && msgData.sender) {
                setMessages((prev) => [...prev.slice(-49), msgData]);
              }
            }
          } catch (e) {}
        };

        ws.onclose = () => {
          if (!isCancelled) {
            setStatusText(`Bağlantı koptu, yeniden deneniyor...`);
            setTimeout(initChat, 3000);
          }
        };
      } catch (err) {
        if (!isCancelled) setStatusText(`Bağlantı hatası (${channel})`);
      }
    }

    initChat();

    return () => {
      isCancelled = true;
      if (pingInterval) clearInterval(pingInterval);
      if (ws) ws.close();
    };
  }, [channel]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, debugLogs]);

  return (
    <div
      className="w-full h-full flex flex-col justify-end p-4 overflow-hidden bg-transparent select-none font-sans"
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
        <div className="text-emerald-400 text-xs font-bold px-3 py-2 bg-black/80 rounded-xl border border-emerald-500/30">
          {statusText}
        </div>

        {/* DEBUG LOGLARI */}
        {debugLogs.length > 0 && (
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-yellow-400 text-[10px] font-black tracking-widest uppercase">Son Gelen Veriler (Röntgen):</span>
            {debugLogs.map((log, i) => (
              <div key={i} className="text-[10px] font-mono text-white/70 bg-blue-900/40 border border-blue-500/30 p-2 rounded break-words">
                {log}
              </div>
            ))}
          </div>
        )}

        {/* NORMAL MESAJLAR */}
        {messages.map((msg, index) => (
          <div key={msg.id || index} className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/20">
            <span className="font-black" style={{ color: msg.sender?.identity?.color || '#00e701' }}>
              {msg.sender?.username}:
            </span>
            <span className="font-medium break-words">
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>
    </div>
  );
}
