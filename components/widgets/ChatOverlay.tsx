'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  sender: string;
  color: string;
  content: string;
  badges: Array<{ type: string; text?: string }>;
}

export default function ChatOverlayWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const channel = (searchParams?.channel || 'itsfatih').toLowerCase().trim();
  const theme = searchParams?.theme || 'dark';
  const fontSize = searchParams?.fontSize || 'medium';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingInterval: any = null;
    let isCancelled = false;

    const connectKickChat = async () => {
      let chatroomId = '';
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.chatroom_id) chatroomId = String(data.chatroom_id);
        }
      } catch (e) {}

      if (isCancelled || !chatroomId) return;

      ws = new WebSocket(
        'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false'
      );

      const subscribe = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              event: 'pusher:subscribe',
              data: { auth: '', channel: `chatrooms.${chatroomId}.v2` },
            })
          );
        }
      };

      ws.onopen = () => subscribe();

      ws.onmessage = (event) => {
        if (isCancelled) return;
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === 'pusher:connection_established') {
            subscribe();
          }

          if (payload.event === 'App\\Events\\ChatMessageEvent') {
            const msgData = JSON.parse(payload.data);
            const newMsg: ChatMessage = {
              id: msgData.id || Math.random().toString(),
              sender: msgData.sender?.username || 'Anon',
              color: msgData.sender?.identity?.color || '#53FC18',
              content: msgData.content || '',
              badges: msgData.sender?.identity?.badges || [],
            };

            setMessages((prev) => {
              const updated = [...prev, newMsg];
              return updated.slice(-30);
            });
          }
        } catch (err) {}
      };

      pingInterval = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
        }
      }, 15000);
    };

    connectKickChat();

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

  const sizeClasses =
    fontSize === 'small' ? 'text-xs leading-relaxed' : fontSize === 'large' ? 'text-base leading-relaxed' : 'text-sm leading-relaxed';

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-6 bg-transparent select-none font-sans overflow-hidden">
      <div
        ref={containerRef}
        className="w-full max-w-md flex flex-col gap-2 overflow-y-auto max-h-[90vh] no-scrollbar scroll-smooth"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`transition-all duration-300 rounded-xl p-3 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 ${
              theme === 'neon'
                ? 'bg-black/70 border border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                : theme === 'minimal'
                ? 'bg-black/40 border-0'
                : 'bg-[#0b0e14]/85 border border-white/10 shadow-xl'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              {msg.badges.map((b, i) => (
                <span
                  key={i}
                  className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white/10 text-emerald-400 font-mono tracking-wider"
                >
                  {b.type}
                </span>
              ))}
              <span className="font-extrabold tracking-wide" style={{ color: msg.color }}>
                {msg.sender}:
              </span>
            </div>
            <p className={`text-white/95 font-medium break-words ${sizeClasses}`}>{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
