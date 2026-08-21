'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  color: string;
  badges: string[];
}

export default function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const theme = searchParams.theme || 'glass';
  const fontSize = searchParams.fontSize || 'medium';
  const textStroke = searchParams.textStroke || 'thin';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingInterval: any = null;
    let isCancelled = false;

    const setupChat = async () => {
      let chatroomId = '1917711'; // itsfatih fallback

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

      // Kick Pusher WebSocket Bağlantısı
      ws = new WebSocket('wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false');

      ws.onopen = () => {
        ws?.send(
          JSON.stringify({
            event: 'pusher:subscribe',
            data: { auth: '', channel: `chatrooms.${chatroomId}.v2` },
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const ev = parsed.event || '';

          if (ev.includes('ChatMessageEvent')) {
            const rawData = typeof parsed.data === 'string' ? JSON.parse(parsed.data) : parsed.data;
            const sender = rawData.sender || {};
            const identity = sender.identity || {};

            const newMsg: ChatMessage = {
              id: String(rawData.id || Date.now() + Math.random()),
              user: sender.username || 'Kullanıcı',
              content: rawData.content || '',
              color: identity.color || '#53FC18',
              badges: identity.badges?.map((b: any) => b.type) || [],
            };

            setMessages((prev) => [...prev.slice(-35), newMsg]);
          }
        } catch (err) {}
      };

      pingInterval = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
        }
      }, 25000);
    };

    setupChat();

    return () => {
      isCancelled = true;
      if (ws) ws.close();
      if (pingInterval) clearInterval(pingInterval);
    };
  }, [channel]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Boyut sınıfı
  const sizeClasses =
    fontSize === 'small'
      ? 'text-[11px] leading-tight py-1.5 px-3'
      : fontSize === 'large'
      ? 'text-[15px] leading-relaxed py-3 px-4'
      : 'text-xs leading-snug py-2 px-3.5';

  // Dış kontur filtresi
  const strokeStyle =
    textStroke === 'thick'
      ? { textShadow: '-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000, 0 2px 4px rgba(0,0,0,0.8)' }
      : textStroke === 'thin'
      ? { textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 1px 2px rgba(0,0,0,0.8)' }
      : {};

  // Özel Tema Kutusu Tasarımları
  const getMessageCardStyle = (msgColor: string) => {
    if (theme === 'minimal') {
      return 'bg-transparent border-0 p-0 shadow-none';
    }
    if (theme === 'cyber') {
      return 'bg-[#07090e]/90 border border-[#53FC18]/40 rounded-xl shadow-[0_0_15px_rgba(83,252,24,0.15)]';
    }
    // Varsayılan: glass
    return 'bg-[#0c0f17]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl';
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-6 bg-transparent select-none font-sans overflow-hidden">
      <div
        ref={containerRef}
        className="flex flex-col space-y-2.5 max-h-[90vh] overflow-y-auto scrollbar-none pr-2"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-lg transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${getMessageCardStyle(
              m.color
            )} ${sizeClasses}`}
            style={strokeStyle}
          >
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span
                className="font-black uppercase tracking-wider whitespace-nowrap"
                style={{ color: m.color }}
              >
                {m.user}:
              </span>
              <span className="text-white/95 font-medium break-words">
                {m.content}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
