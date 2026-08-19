'use client';

import { use, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Pusher from 'pusher-js';

function WidgetContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const channel = searchParams.get('channel') || 'itsfatih';
  const format = searchParams.get('format') || '24';

  const [time, setTime] = useState('');
  const [viewers, setViewers] = useState<number | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);

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

  // Kick WebSocket (Pusher) Gerçek Zamanlı Bağlantı
  useEffect(() => {
    if (slug !== 'kick-viewers' || !channel) return;

    let pusher: Pusher | null = null;
    let channelInstance: any = null;

    const initKickWebSocket = async () => {
      try {
        const res = await fetch(`https://kick.com/api/v1/channels/${channel.toLowerCase()}`);
        if (!res.ok) {
          setIsLive(false);
          setViewers(0);
          return;
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

        if (chatroomId) {
          pusher = new Pusher('32cbd69e4b950bf97679', {
            cluster: 'us2',
            forceTLS: true,
          });

          channelInstance = pusher.subscribe(`chatrooms.${chatroomId}.v2`);

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
      } catch (err) {
        console.error('Kick bağlantı hatası:', err);
      }
    };

    initKickWebSocket();

    return () => {
      if (channelInstance) channelInstance.unbind_all();
      if (pusher) pusher.disconnect();
    };
  }, [slug, channel]);

  return (
    <div className="bg-transparent min-h-screen flex items-center justify-start p-4 font-sans select-none overflow-hidden">
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

      {slug === 'kick-viewers' && (
        <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#53FC18]/40 text-white shadow-2xl">
          <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-[#53FC18] animate-pulse' : 'bg-neutral-600'}`} />
          <span className="text-xs font-mono font-bold text-neutral-300 uppercase">{channel}</span>
          <span className="text-sm font-black text-[#53FC18] font-mono">
            {isLive ? (viewers !== null ? viewers.toLocaleString() : '...') : 'OFFLINE'}
          </span>
        </div>
      )}

      {slug === 'clock' && (
        <div className="bg-black/85 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/10 text-white shadow-2xl">
          <span className="text-xl font-black font-mono tracking-wider">{time}</span>
        </div>
      )}
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
