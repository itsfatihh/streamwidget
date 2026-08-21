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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let keepAlive: any = null;
    let isSubscribed = false;

    const startChat = async () => {
      let resolvedChatroomId: string | null = null;

      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.chatroom_id) {
            resolvedChatroomId = String(data.chatroom_id);
          }
        }
      } catch (e) {}

      ws = new WebSocket('wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false');

      ws.onopen = () => {
        if (resolvedChatroomId) {
          ws?.send(
            JSON.stringify({
              event: 'pusher:subscribe',
              data: { auth: '', channel: `chatrooms.${resolvedChatroomId}.v2` },
            })
          );
          isSubscribed = true;
        }
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const ev = parsed.event || '';

          if (ev.includes('ChatMessageEvent')) {
            const rawData = typeof parsed.data === 'string' ? JSON.parse(parsed.data) : parsed.data;

            const newMsg: ChatMessage = {
              id: String(rawData.id || Date.now() + Math.random()),
              user: rawData.sender?.username || 'Kullanıcı',
              content: rawData.content || '',
              color: rawData.sender?.identity?.color || '#53FC18',
            };

            setMessages((prev) => [...prev.slice(-40), newMsg]);
          }
        } catch (err) {}
      };

      keepAlive = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
        }
      }, 25000);
    };

    startChat();

    return () => {
      if (ws) ws.close();
      if (keepAlive) clearInterval(keepAlive);
    };
  }, [channel]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-6 bg-transparent select-none font-sans overflow-hidden">
      <div
        ref={chatContainerRef}
        className="flex flex-col space-y-2.5 max-h-[90vh] overflow-y-auto scrollbar-none pr-2"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className="bg-[#0a0d14]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5 text-xs shadow-2xl max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col gap-0.5"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="font-black tracking-wide uppercase text-[11px]"
                style={{ color: m.color }}
              >
                {m.user}
              </span>
            </div>
            <p className="text-white/95 font-medium text-xs leading-relaxed break-words">
              {m.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
