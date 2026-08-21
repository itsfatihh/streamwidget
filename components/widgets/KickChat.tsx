'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  color: string;
}

const CHANNEL_CHATROOM_MAP: Record<string, string> = {
  itsfatih: '1917711',
  batuhankaradeniz: '2437618',
  elraenn: '2437618',
  kendinemuzisyen: '2437618',
};

export default function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const theme = searchParams.theme || 'framed';
  const fontSize = searchParams.fontSize || 'small';
  const textStroke = searchParams.textStroke || 'none';

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

      if (channel === 'batuhankaradeniz') chatroomId = '2437618';
      if (channel === 'itsfatih') chatroomId = '1917711';

      if (isCancelled) return;

      ws = new WebSocket(
        'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false'
      );

      const subscribe = () => {
        ws?.send(
          JSON.stringify({
            event: 'pusher:subscribe',
            data: { auth: '', channel: `chatrooms.${chatroomId}.v2` }
          })
        );
      };

      ws.onopen = () => {
        subscribe();
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.event === 'pusher:connection_established') {
            subscribe();
          }

          if (payload.event && payload.event.includes('ChatMessageEvent')) {
            let data = payload.data;
            if (typeof data === 'string') {
              data = JSON.parse(data);
            }

            const sender = data.sender || {};
            const identity = sender.identity || {};

            const newMsg: ChatMessage = {
              id: String(data.id || Date.now() + Math.random()),
              user: sender.username || 'Kullanıcı',
              content: data.content || '',
              color: identity.color || '#53FC18',
            };

            setMessages((prev) => [...prev.slice(-40), newMsg]);
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
      ? 'text-[11px] py-1 px-2.5'
      : fontSize === 'large'
      ? 'text-[15px] py-2.5 px-4'
      : 'text-xs py-1.5 px-3';

  const strokeStyle =
    textStroke === 'thick'
      ? { textShadow: '-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000, 0 2px 4px rgba(0,0,0,0.9)' }
      : textStroke === 'thin'
      ? { textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 1px 2px rgba(0,0,0,0.9)' }
      : {};

  const renderCard = (msg: ChatMessage) => {
    // Minimal Tema (Sadece Saf Metin)
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

    // Çerçeveli Tema (Cam Zemin + Sol Renk Çizgili Kart)
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
        className="flex flex-col space-y-2 max-h-[90vh] overflow-y-auto scrollbar-none pr-2 max-w-md"
      >
        {messages.map((m) => renderCard(m))}
      </div>
    </div>
  );
}
