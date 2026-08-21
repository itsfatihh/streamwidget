'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatBadge {
  type: string;
  text?: string;
  count?: number;
}

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  color: string;
  badges: ChatBadge[];
}

const CHANNEL_CHATROOM_MAP: Record<string, string> = {
  itsfatih: '1917711',
  batuhankaradeniz: '2437618',
  cavs: '2437618',
  elraenn: '2437618',
  kendinemuzisyen: '2437618',
};

// Kick Emote Parser: [emote:12345:name] -> CDN <img>
const renderParsedContent = (content: string): React.ReactNode => {
  const emoteRegex = /\[emote:(\d+):([a-zA-Z0-9_-]+)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = emoteRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    const emoteId = match[1];
    const emoteName = match[2];
    parts.push(
      <img
        key={`${emoteId}-${match.index}`}
        src={`https://files.kick.com/emotes/${emoteId}/fullsize`}
        alt={emoteName}
        title={emoteName}
        className="inline-block h-6 w-auto align-middle mx-0.5 object-contain my-[-3px]"
      />
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts.length > 0 ? parts : content;
};

// Kick Rozet Render Motoru
const renderBadge = (badge: ChatBadge, idx: number): React.ReactNode => {
  const type = badge.type?.toLowerCase() || '';

  if (type === 'subscriber' || type === 'sub') {
    const months = badge.count ?? 1;
    return (
      <span
        key={idx}
        title={`Abone: ${months} Ay`}
        className="inline-flex items-center justify-center bg-black border border-[#53FC18] text-[#53FC18] font-bold text-[9px] px-1 py-[0.5px] rounded-[3px] leading-none"
      >
        ★ {months}
      </span>
    );
  }

  if (type === 'broadcaster') {
    return (
      <span key={idx} title="Yayıncı" className="inline-flex items-center justify-center bg-[#53FC18] text-black font-black text-[9px] px-1 py-[0.5px] rounded-[3px] leading-none">
        HOST
      </span>
    );
  }

  if (type === 'moderator' || type === 'mod') {
    return (
      <span key={idx} title="Moderatör" className="inline-flex items-center justify-center bg-[#00e59b] text-black font-black text-[9px] px-1 py-[0.5px] rounded-[3px] leading-none">
        MOD
      </span>
    );
  }

  if (type === 'vip') {
    return (
      <span key={idx} title="VIP" className="inline-flex items-center justify-center bg-[#a855f7] text-white font-black text-[9px] px-1 py-[0.5px] rounded-[3px] leading-none">
        VIP
      </span>
    );
  }

  if (type === 'og' || type === 'founder') {
    return (
      <span key={idx} title="OG" className="inline-flex items-center justify-center bg-[#3b82f6] text-white font-black text-[9px] px-1 py-[0.5px] rounded-[3px] leading-none">
        OG
      </span>
    );
  }

  return null;
};

export default function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const theme = searchParams.theme || 'minimal';
  const fontSize = searchParams.fontSize || 'small';
  const textStroke = searchParams.textStroke || 'none';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingInterval: any = null;
    let isCancelled = false;

    // Statik chatroom mapping
    const chatroomId = CHANNEL_CHATROOM_MAP[channel] || '1917711';

    // Kick Resmi Pusher WebSocket Bağlantısı
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
            badges: identity.badges || [],
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
      ? 'text-[12px] py-1 px-2'
      : fontSize === 'large'
      ? 'text-[16px] py-2 px-3.5'
      : 'text-sm py-1.5 px-3';

  const strokeStyle =
    textStroke === 'thick'
      ? { textShadow: '-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000, 0 2px 4px rgba(0,0,0,0.9)' }
      : textStroke === 'thin'
      ? { textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 1px 2px rgba(0,0,0,0.9)' }
      : {};

  const renderCard = (msg: ChatMessage) => {
    if (theme === 'minimal') {
      return (
        <div key={msg.id} className={`animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center flex-wrap gap-x-1.5 ${sizeStyles}`} style={strokeStyle}>
          {msg.badges.length > 0 && (
            <span className="inline-flex items-center gap-1">
              {msg.badges.map((b, i) => renderBadge(b, i))}
            </span>
          )}
          <span className="font-black uppercase tracking-wider mr-1.5" style={{ color: msg.color }}>
            {msg.user}:
          </span>
          <span className="text-white font-medium break-words leading-relaxed">
            {renderParsedContent(msg.content)}
          </span>
        </div>
      );
    }

    return (
      <div
        key={msg.id}
        className={`bg-[#0a0d14]/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col gap-1 ${sizeStyles}`}
        style={{
          borderLeft: `4px solid ${msg.color}`,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          ...strokeStyle,
        }}
      >
        <div className="flex items-center gap-1.5">
          {msg.badges.length > 0 && (
            <span className="inline-flex items-center gap-1">
              {msg.badges.map((b, i) => renderBadge(b, i))}
            </span>
          )}
          <span className="font-black text-[11px] uppercase tracking-wide" style={{ color: msg.color }}>
            {msg.user}
          </span>
        </div>
        <div className="text-white/95 font-medium leading-relaxed break-words">
          {renderParsedContent(msg.content)}
        </div>
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
