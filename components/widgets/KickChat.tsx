'use client';

import { useState, useEffect } from 'react';

export default function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    const startSocket = async () => {
      ws = new WebSocket('wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false');
      ws.onopen = () => {
        ws?.send(JSON.stringify({
          event: 'pusher:subscribe',
          data: { auth: '', channel: 'chatrooms.1917711.v2' }
        }));
      };
      ws.onmessage = (ev) => {
        try {
          const parsed = JSON.parse(ev.data);
          if (parsed.event && parsed.event.includes('ChatMessageEvent')) {
            const d = typeof parsed.data === 'string' ? JSON.parse(parsed.data) : parsed.data;
            setMessages((prev) => [...prev.slice(-20), {
              id: d.id || Date.now(),
              user: d.sender?.username || 'Kullanici',
              content: d.content || '',
              color: d.sender?.identity?.color || '#53FC18'
            }]);
          }
        } catch (e) {}
      };
    };
    startSocket();
    return () => { if (ws) ws.close(); };
  }, [channel]);

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-6 bg-transparent select-none space-y-2">
      {messages.map((m) => (
        <div key={m.id} className="bg-[#0a0d14]/85 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-xs shadow-lg max-w-lg">
          <span className="font-black mr-2 uppercase" style={{ color: m.color }}>{m.user}:</span>
          <span className="text-white/90 font-medium">{m.content}</span>
        </div>
      ))}
    </div>
  );
}
