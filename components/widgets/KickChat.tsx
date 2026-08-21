'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  color: string;
}

export default function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const theme = searchParams.theme || 'botrix';
  const fontSize = searchParams.fontSize || 'medium';
  const textStroke = searchParams.textStroke || 'thin';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingTimer: any = null;
    let isCancelled = false;

    const startPusherChat = async () => {
      let chatroomId = '1917711';

      // 1. Chatroom ID al
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.chatroom_id) chatroomId = String(data.chatroom_id);
        }
      } catch (e) {}

      if (isCancelled) return;

      // 2. Pusher Protokolü ile Doğrudan Bağlan
      ws = new WebSocket(
        'wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=8.4.0-rc2&flash=false'
      );

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Pusher bağlantı onaylandığında kanala abone ol
          if (data.event === 'pusher:connection_established') {
            ws?.send(
              JSON.stringify({
                event: 'pusher:subscribe',
                data: { auth: '', channel: `chatrooms.${chatroomId}.v2` },
              })
            );
          }

          // Canlı mesaj yakalama
          if (
            data.event === 'App\\Events\\ChatMessageEvent' ||
            data.event === 'ChatMessageEvent' ||
            (data.event && data.event.includes('ChatMessageEvent'))
          ) {
            const rawMsg = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
            const sender = rawMsg.sender || {};
            const identity = sender.identity || {};

            const newMsg: ChatMessage = {
              id: String(rawMsg.id || Date.now() + Math.random()),
              user: sender.username || 'Kullanıcı',
              content: rawMsg.content || '',
              color: identity.color || '#53FC18',
            };

            setMessages((prev) => [...prev.slice(-35), newMsg]);
          }
        } catch (err) {}
      };

      // 15 saniyede bir Pusher ping
      pingTimer = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
        }
      }, 15000);
    };

    startPusherChat();

    return () => {
      isCancelled = true;
      if (ws) ws.close();
      if (pingTimer) clearInterval(pingTimer);
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

  const renderCardTheme = (msg: ChatMessage) => {
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
          className={`bg-[#121622]/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col gap-0.5 ${sizeStyles}`}
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
        {messages.map((m) => renderCardTheme(m))}
      </div>
    </div>
  );
}
