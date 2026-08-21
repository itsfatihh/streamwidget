'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  sender: {
    username: string;
    identity?: {
      color?: string;
      badges?: Array<{ type: string; text?: string; count?: number }>;
    };
  };
  content: string;
  created_at?: string;
}

export default function ChatOverlayWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const channel = searchParams?.channel || 'itsfatih';
  const theme = searchParams?.theme || 'dark';
  const fontSize = searchParams?.font_size || '14';
  const showBadges = searchParams?.show_badges !== 'false';
  const fadeTimeout = parseInt(searchParams?.fade_timeout || '0', 10);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Kick Emote Parser: [emote:12345:emoteName] -> <img src="https://files.kick.com/emotes/12345/fullsize" />
  const renderMessageContent = (content: string) => {
    if (!content) return null;

    const emoteRegex = /\[emote:(\d+):([a-zA-Z0-9_-]+)\]/g;
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = emoteRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      const emoteId = match[1];
      const emoteName = match[2];

      parts.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${emoteId}-${match.index}`}
          src={`https://files.kick.com/emotes/${emoteId}/fullsize`}
          alt={emoteName}
          title={emoteName}
          className="inline-block align-middle mx-1 my-0.5 max-h-[1.5em] w-auto select-none object-contain"
          onError={(e) => {
            // Yedek fallback URL
            const target = e.currentTarget;
            if (!target.src.includes('static-files.kick.com')) {
              target.src = `https://static-files.kick.com/emotes/${emoteId}/fullsize`;
            }
          }}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  useEffect(() => {
    let ws: WebSocket | null = null;
    let isCancelled = false;

    async function initPusher() {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`);
        const data = await res.json();
        const chatroomId = data?.chatroom?.id;

        if (!chatroomId || isCancelled) return;

        ws = new WebSocket('wss://ws-us2.pusher.com/app/eb1d5f28308142977d07?protocol=7&client=js&version=7.6.0&flash=false');

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
            if (parsed.event === 'App\\Events\\ChatMessageEvent') {
              const msgData = typeof parsed.data === 'string' ? JSON.parse(parsed.data) : parsed.data;

              setMessages((prev) => {
                const updated = [...prev, msgData];
                return updated.slice(-40);
              });
            }
          } catch (e) {}
        };
      } catch (err) {}
    }

    initPusher();

    return () => {
      isCancelled = true;
      if (ws) ws.close();
    };
  }, [channel]);

  // Yeni mesaj geldikçe otomatik aşağı kaydır
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isLight = theme === 'light';

  return (
    <div
      className="w-full h-full flex flex-col justify-end p-4 overflow-hidden bg-transparent select-none font-sans"
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
        {messages.length === 0 && (
          <div className="text-white/40 text-xs italic px-3 py-2">
            Kick sohbeti bekleniyor ({channel})...
          </div>
        )}

        {messages.map((msg, index) => {
          const userColor = msg.sender?.identity?.color || '#00e701';

          return (
            <div
              key={msg.id || index}
              className={`flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-md animate-[fadeIn_0.2s_ease-out] ${
                isLight
                  ? 'bg-white/85 border-black/5 text-slate-900 shadow-slate-200/50'
                  : 'bg-[#0b0e14]/85 border-white/10 text-white shadow-black/40'
              }`}
            >
              {/* Rozetler */}
              {showBadges && msg.sender?.identity?.badges && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  {msg.sender.identity.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-white/15 text-white border border-white/10"
                    >
                      {b.type}
                    </span>
                  ))}
                </div>
              )}

              {/* Kullanıcı Adı */}
              <span
                className="font-black flex-shrink-0"
                style={{ color: userColor }}
              >
                {msg.sender?.username}:
              </span>

              {/* Mesaj İçeriği + Emote Görselleri */}
              <span className="font-medium break-words leading-relaxed flex-1 min-w-0">
                {renderMessageContent(msg.content)}
              </span>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>
    </div>
  );
}
