'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  color: string;
}

// Bilinen yayıncıların anında bağlanması için hızlı önbellek
const CHANNEL_CHATROOM_MAP: Record<string, string> = {
  itsfatih: '1917711',
  batuhankaradeniz: '2437618',
  elraenn: '2437618',
  kendinemuzisyen: '2437618',
};

export default function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const theme = searchParams.theme || 'botrix';
  const fontSize = searchParams.fontSize || 'medium';
  const textStroke = searchParams.textStroke || 'thin';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingInterval: any = null;
    let isCancelled = false;

    const startChat = async () => {
      let chatroomId = CHANNEL_CHATROOM_MAP[channel] || '1917711';

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

      // 2 gün önce çalışan resmi Kick Pusher Soketi
      ws = new WebSocket('wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false');

      const subscribeToRooms = () => {
        // Hem v2 hem v1 ve chatroom kanallarına aynı anda abone ol (garanti yakalama)
        const channelsToSub = [
          `chatrooms.${chatroomId}.v2`,
          `chatrooms.${chatroomId}`,
          `chatroom_${chatroomId}`
        ];

        channelsToSub.forEach((ch) => {
          ws?.send(
            JSON.stringify({
              event: 'pusher:subscribe',
              data: { auth: '', channel: ch }
            })
          );
        });
      };

      ws.onopen = () => {
        subscribeToRooms();
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);

          if (parsed.event === 'pusher:connection_established') {
            subscribeToRooms();
          }

          if (parsed.event && (parsed.event.includes('ChatMessageEvent') || parsed.event.includes('Message'))) {
            let msgData = parsed.data;
            if (typeof msgData === 'string') {
              msgData = JSON.parse(msgData);
            }

            const sender = msgData.sender || {};
            const identity = sender.identity || {};

            const newMsg: ChatMessage = {
              id: String(msgData.id || Date.now() + Math.random()),
              user: sender.username || 'Kullanıcı',
              content: msgData.content || '',
              color: identity.color || '#53FC18',
            };

            setMessages((prev) => [...prev.slice(-35), newMsg]);
          }
        } catch (err) {}
      };

      pingInterval = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
        }
      }, 15000);
    };

    startChat();

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

  const sizeStyles =
    fontSize === 'small'
      ? 'text-[11px] py-1.5 px-3'
      : fontSize === 'large'
      ? 'text-[15px] py-3 px-4'
      : 'text-xs py-2 px-3.5';

  const strokeStyle =
    textStroke === 'thick'
      ? { textShadow: '-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000, 0 2px 4px rgba(0,0,0,0.9)' }
      : textStroke === 'thin'
      ? { textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 1px 2px rgba(0,0,0,0.9)' }
      : {};

  const renderCard = (msg: ChatMessage) => {
    if (theme === 'minimal') {
      return (
        <div key={msg.id} className={`animate-in fade-in slide-in-from-bottom-2 duration-200 ${sizeStyles}`} style={strokeStyle}>
          <span className="font-black uppercase tracking-wider mr-2" style={{ color: msg.color }}>
            {msg.user}:
          </span>
          <span className="text-white font-medium break-words">{msg.content}</span>
        </div>
      );
    }

    if (theme === 'bubble') {
      return (
        <div
          key={msg.id}
          className={`bg-[#121622]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col gap-0.5 ${sizeStyles}`}
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.35)', ...strokeStyle }}
        >
          <span className="font-black text-[11px] uppercase tracking-wide" style={{ color: msg.color }}>
            {msg.user}
          </span>
          <p className="text-white/95 font-medium leading-relaxed break-words">{msg.content}</p>
        </div>
      );
    }

    if (theme === 'neon') {
      return (
        <div
          key={msg.id}
          className={`bg-[#07090e]/95 border border-[#53FC18]/60 rounded-xl shadow-[0_0_15px_rgba(83,252,24,0.15)] animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-baseline gap-2 ${sizeStyles}`}
          style={strokeStyle}
        >
          <span className="font-black uppercase tracking-wider whitespace-nowrap" style={{ color: msg.color }}>
            {msg.user}:
          </span>
          <span className="text-white font-medium break-words">{msg.content}</span>
        </div>
      );
    }

    // Default BotRix Kartı
    return (
      <div
        key={msg.id}
        className={`bg-[#0a0d14]/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col gap-0.5 ${sizeStyles}`}
        style={{
          borderLeft: `4px solid ${msg.color}`,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          ...strokeStyle,
        }}
      >
        <span className="font-black text-[11px] uppercase tracking-wide" style={{ color: msg.color }}>
          {msg.user}
        </span>
        <p className="text-white/95 font-medium leading-relaxed break-words">{msg.content}</p>
      </div>
    );
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-6 bg-transparent select-none font-sans overflow-hidden">
      <div
        ref={containerRef}
        className="flex flex-col space-y-2.5 max-h-[90vh] overflow-y-auto scrollbar-none pr-2 max-w-md"
      >
        {messages.map((m) => renderCard(m))}
      </div>
    </div>
  );
}
