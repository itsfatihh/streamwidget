'use client';

import { use, useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Pusher from 'pusher-js';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  color?: string;
}

function WidgetContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const channel = searchParams.get('channel') || 'itsfatih';
  const format = searchParams.get('format') || '24';
  const accent = searchParams.get('accent') || '#53FC18';
  const scale = Number(searchParams.get('scale') || 100) / 100;
  const title = searchParams.get('title') || 'HEDEF';
  const current = Number(searchParams.get('current') || 0);
  const target = Number(searchParams.get('target') || 100);

  const [time, setTime] = useState('');
  const [viewers, setViewers] = useState<number | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Saat Güncelleyici
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('tr-TR', {
          hour12: format === '12',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [format]);

  // Kick Veri Çekici
  const fetchKickChannelData = useCallback(async () => {
    if (!channel) return null;
    try {
      const res = await fetch(`https://kick.com/api/v1/channels/${channel.toLowerCase()}?_t=${Date.now()}`);
      if (!res.ok) {
        setIsLive(false);
        setViewers(0);
        return null;
      }

      const data = await res.json();
      const livestream = data?.livestream;
      const chatroomId = data?.chatroom?.id;

      if (livestream) {
        setIsLive(true);
        setViewers(livestream.viewer_count || 0);
      } else {
        setIsLive(false);
        setViewers(0);
      }

      return chatroomId;
    } catch (err) {
      return null;
    }
  }, [channel]);

  // Kick WebSocket (İzleyici Sayacı ve Canlı Sohbet Katmanı)
  useEffect(() => {
    if ((slug !== 'kick-viewers' && slug !== 'kick-chat') || !channel) return;

    let pusher: Pusher | null = null;
    let channelInstance: any = null;

    const init = async () => {
      const chatroomId = await fetchKickChannelData();

      if (chatroomId) {
        pusher = new Pusher('32cbd69e4b950bf97679', {
          cluster: 'us2',
          forceTLS: true,
        });

        channelInstance = pusher.subscribe(`chatrooms.${chatroomId}.v2`);

        if (slug === 'kick-viewers') {
          channelInstance.bind('App\\Events\\LivestreamUpdated', (eventData: any) => {
            if (eventData?.livestream) {
              setIsLive(true);
              setViewers(eventData.livestream.viewer_count);
            }
          });

          channelInstance.bind('App\\Events\\LivestreamEnded', () => {
            setIsLive(false);
            setViewers(0);
          });
        }

        if (slug === 'kick-chat') {
          channelInstance.bind('App\\Events\\ChatMessageEvent', (chatData: any) => {
            if (chatData?.content) {
              const newMsg: ChatMessage = {
                id: chatData.id || String(Date.now()),
                sender: chatData.sender?.username || 'izleyici',
                content: chatData.content,
                color: chatData.sender?.identity?.color || '#53FC18',
              };
              setMessages((prev) => [...prev.slice(-10), newMsg]);
            }
          });
        }
      }
    };

    init();

    const pollInterval = setInterval(() => {
      if (slug === 'kick-viewers') fetchKickChannelData();
    }, 15000);

    return () => {
      clearInterval(pollInterval);
      if (channelInstance) channelInstance.unbind_all();
      if (pusher) pusher.disconnect();
    };
  }, [slug, channel, fetchKickChannelData]);

  const percentage = Math.min(100, Math.max(0, (current / target) * 100));

  return (
    <div className="bg-transparent min-h-screen flex items-start justify-start p-4 font-sans select-none overflow-hidden">
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {/* 1. IRL HUD */}
        {slug === 'irl-hud' && (
          <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-white shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-black tracking-widest text-red-400">LIVE</span>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <span className="text-sm font-semibold font-mono tracking-wide">{time}</span>
          </div>
        )}

        {/* 2. Kick Canlı İzleyici */}
        {slug === 'kick-viewers' && (
          <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border text-white shadow-2xl" style={{ borderColor: `${accent}40` }}>
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'animate-pulse' : 'bg-neutral-600'}`} style={{ backgroundColor: isLive ? accent : undefined }} />
            <span className="text-xs font-mono font-bold text-neutral-300 uppercase">{channel}</span>
            <span className="text-sm font-black font-mono" style={{ color: accent }}>
              {isLive ? (viewers !== null ? viewers.toLocaleString() : '...') : 'OFFLINE'}
            </span>
          </div>
        )}

        {/* 3. Goal Bar (Hedef Çubuğu) */}
        {slug === 'goal-bar' && (
          <div className="w-80 bg-black/85 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-white shadow-2xl space-y-2">
            <div className="flex justify-between text-xs font-bold font-mono">
              <span>{title}</span>
              <span style={{ color: accent }}>{current.toLocaleString()} / {target.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: accent }} />
            </div>
          </div>
        )}

        {/* 4. Kick Canlı Sohbet Katmanı (Chat Box) */}
        {slug === 'kick-chat' && (
          <div className="w-80 space-y-2">
            {messages.length === 0 && (
              <div className="text-xs text-neutral-500 font-mono italic bg-black/40 px-3 py-1.5 rounded-lg">
                Mesajlar bekleniyor...
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className="bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-white text-xs shadow-lg animate-fadeIn">
                <span className="font-bold mr-1.5" style={{ color: m.color }}>{m.sender}:</span>
                <span className="text-slate-200">{m.content}</span>
              </div>
            ))}
          </div>
        )}

        {/* 5. Minimal Saat */}
        {slug === 'clock' && (
          <div className="bg-black/85 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/10 text-white shadow-2xl">
            <span className="text-xl font-black font-mono tracking-wider">{time}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DynamicWidgetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <Suspense fallback={null}>
      <WidgetContent slug={slug} />
    </Suspense>
  );
}
