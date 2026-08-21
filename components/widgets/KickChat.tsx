'use client';

import { useState, useEffect, useRef } from 'react';

interface KickMessage {
  id: string;
  user: string;
  content: string;
  color: string;
  badges: string[];
}

export default function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const [messages, setMessages] = useState<KickMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let keepAlive: any = null;
    let isCancelled = false;

    const startChat = async () => {
      let chatroomId = '1917711'; // itsfatih fallback

      // 1. Kanalın chatroom ID sini dinamik çöz
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.chatroom_id) {
            chatroomId = String(data.chatroom_id);
          }
        }
      } catch (e) {}

      if (isCancelled) return;

      // 2. Pusher WebSocket Bağlantısı
      ws = new WebSocket('wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false');

      ws.onopen = () => {
        // Chat kanalına bağlan
        ws?.send(
          JSON.stringify({
            event: 'pusher:subscribe',
            data: { auth: '', channel: `chatrooms.${chatroomId}.v2` }
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const ev = parsed.event || '';

          if (ev.includes('ChatMessageEvent')) {
            let msgData = parsed.data;
            if (typeof msgData === 'string') {
              msgData = JSON.parse(msgData);
            }

            const sender = msgData.sender || {};
            const identity = sender.identity || {};

            const newMsg: KickMessage = {
              id: String(msgData.id || Date.now() + Math.random()),
              user: sender.username || 'Kullanıcı',
              content: msgData.content || '',
              color: identity.color || '#53FC18',
              badges: identity.badges?.map((b: any) => b.type) || [],
            };

            setMessages((prev) => [...prev.slice(-25), newMsg]);
          }
        } catch (err) {}
      };

      keepAlive = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
        }
      }, 20000);
    };

    startChat();

    return () => {
      isCancelled = true;
      if (ws) ws.close();
      if (keepAlive) clearInterval(keepAlive);
    };
  }, [channel]);

  // Otomatik aşağı odaklanma
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Mesaj içindeki Kick formatlı emote ve linkleri temizleyen/işleyen yardımcı fonksiyon
  const renderContent = (content: string) => {
    // [emote:ID:NAME] formatını görsel emote olarak çevir
    const emoteRegex = /\[emote:(\d+):([a-zA-Z0-9_-]+)\]/g;
    const parts = [];
    let lastIdx = 0;
    let match;

    while ((match = emoteRegex.exec(content)) !== null) {
      if (match.index > lastIdx) {
        parts.push(content.substring(lastIdx, match.index));
      }
      const emoteId = match[1];
      const emoteName = match[2];
      parts.push(
        <img
          key={match.index}
          src={`https://files.kick.com/emotes/${emoteId}/fullsize`}
          alt={emoteName}
          className="inline-block h-5 w-auto align-middle mx-1"
        />
      );
      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < content.length) {
      parts.push(content.substring(lastIdx));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-6 bg-transparent select-none font-sans overflow-hidden">
      <div
        ref={containerRef}
        className="flex flex-col space-y-2.5 max-h-[85vh] overflow-y-auto scrollbar-none pr-2"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className="bg-[#0c0f17]/85 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5 shadow-2xl max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200 transition-all flex flex-col gap-1"
            style={{
              borderLeft: `3px solid ${m.color}`,
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Kullanıcı Başlığı & Rozetleri */}
            <div className="flex items-center gap-2">
              <span
                className="font-black text-xs uppercase tracking-wider"
                style={{ color: m.color }}
              >
                {m.user}
              </span>
            </div>

            {/* Mesaj İçeriği */}
            <div className="text-white/95 font-medium text-xs leading-relaxed break-words">
              {renderContent(m.content)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
