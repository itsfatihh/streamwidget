'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

interface StreamEvent {
  id: string;
  type: 'follower' | 'subscriber' | 'host' | 'gifted';
  username: string;
  count?: number;
  time: string;
}

export default function StreamEventsWidget() {
  const searchParams = useSearchParams();
  const channel = searchParams.get('channel') || 'itsfatih';
  const accent = searchParams.get('accent') || '53FC18';
  const limit = parseInt(searchParams.get('limit') || '3', 10);
  const activeEventsParam = searchParams.get('events') || 'follower,subscriber,host,gifted';
  const activeEvents = activeEventsParam.split(',');

  const [events, setEvents] = useState<StreamEvent[]>([]);

  useEffect(() => {
    let isSubscribed = true;
    let pusherInstance: Pusher | null = null;
    let channelInstance: any = null;

    async function initPusher() {
      try {
        const res = await fetch(`https://kick.com/api/v2/channels/${channel}`);
        const data = await res.json();
        const chatroomId = data.chatroom?.id;
        if (!chatroomId || !isSubscribed) return;

        pusherInstance = new Pusher('32cbd69e4b950ba97666', {
          cluster: 'us2',
          wsHost: 'ws-us2.pusher.com',
          wsPort: 443,
          wssPort: 443,
          forceTLS: true,
          enabledTransports: ['ws', 'wss'],
        });

        channelInstance = pusherInstance.subscribe(`chatrooms.${chatroomId}.v2`);

        channelInstance.bind('App\\Events\\FollowersUpdated', (event: any) => {
          if (!activeEvents.includes('follower')) return;
          addEvent({
            id: Math.random().toString(),
            type: 'follower',
            username: event.username || 'Yeni Takipçi',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        });

        channelInstance.bind('App\\Events\\SubscriptionEvent', (event: any) => {
          if (!activeEvents.includes('subscriber')) return;
          addEvent({
            id: Math.random().toString(),
            type: 'subscriber',
            username: event.username || 'Yeni Abone',
            count: event.months,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        });

        channelInstance.bind('App\\Events\\HostEvent', (event: any) => {
          if (!activeEvents.includes('host')) return;
          addEvent({
            id: Math.random().toString(),
            type: 'host',
            username: event.host_username || 'Host',
            count: event.viewers_count,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        });
      } catch (err) {
        console.error('Kick Event Hatası:', err);
      }
    }

    initPusher();

    return () => {
      isSubscribed = false;
      if (pusherInstance && channelInstance) {
        pusherInstance.unsubscribe(channelInstance.name);
        pusherInstance.disconnect();
      }
    };
  }, [channel, activeEventsParam]);

  const addEvent = (newEvent: StreamEvent) => {
    setEvents((prev) => [newEvent, ...prev].slice(0, limit));
  };

  const getEventBadge = (type: StreamEvent['type']) => {
    switch (type) {
      case 'follower':
        return { label: 'TAKİP', icon: '👤', color: '#38bdf8' };
      case 'subscriber':
        return { label: 'ABONE', icon: '⭐', color: `#${accent}` };
      case 'host':
        return { label: 'HOST', icon: '🚀', color: '#f43f5e' };
      case 'gifted':
        return { label: 'HEDİYE SUB', icon: '🎁', color: '#a855f7' };
    }
  };

  return (
    <main className="flex items-center gap-3 p-4 select-none bg-transparent font-sans">
      {events.length === 0 ? (
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white/50 text-xs font-mono">
          Yayın olayları bekleniyor...
        </div>
      ) : (
        events.map((evt) => {
          const badge = getEventBadge(evt.type);
          return (
            <div
              key={evt.id}
              className="flex items-center gap-2.5 bg-black/75 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl shadow-lg transition-all"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: `${badge.color}25`, color: badge.color }}
              >
                {badge.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-extrabold tracking-wider" style={{ color: badge.color }}>
                  {badge.label} {evt.count ? `(${evt.count})` : ''}
                </span>
                <span className="text-white text-xs font-semibold max-w-[130px] truncate">
                  {evt.username}
                </span>
              </div>
            </div>
          );
        })
      )}
    </main>
  );
}
