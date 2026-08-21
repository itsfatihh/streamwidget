'use client';

import React, { useState, useEffect } from 'react';

export default function FollowerGoalWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const channel = (searchParams?.channel || 'itsfatih').trim().toLowerCase();
  const target = parseInt(searchParams?.target || '1000', 10);
  const title = searchParams?.title || 'TAKİPÇİ HEDEFİ';
  const barColor = searchParams?.bar_color || '#00e701';

  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    let isCancelled = false;

    // 1. Kick API'den başlangıç takipçi sayısını çek
    async function fetchFollowers() {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        const data = await res.json();
        
        // Kick API'sindeki farklı alan adlarını güvenli yakala
        const count =
          data?.followersCount ??
          data?.followers_count ??
          data?.user?.followers_count ??
          0;

        if (!isCancelled) {
          setCurrent(Number(count));
        }
      } catch (err) {}
    }

    fetchFollowers();

    // 2. Pusher üzerinden canlı takipçi artışlarını dinle
    let ws: WebSocket | null = null;
    let pingInterval: NodeJS.Timeout | null = null;

    async function initLiveFollowers() {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        const data = await res.json();
        const chatroomId = data?.chatroom?.id;
        const channelId = data?.id || data?.user_id;

        if (!channelId || isCancelled) return;

        ws = new WebSocket('wss://ws-us2.pusher.com/app/eb1d5f28308142977d07?protocol=7&client=js&version=7.6.0&flash=false');

        ws.onopen = () => {
          // Kanal olaylarına abone ol
          ws?.send(JSON.stringify({ event: 'pusher:subscribe', data: { auth: '', channel: `channel.${channelId}` } }));
          if (chatroomId) {
            ws?.send(JSON.stringify({ event: 'pusher:subscribe', data: { auth: '', channel: `chatrooms.${chatroomId}.v2` } }));
          }

          pingInterval = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
            }
          }, 25000);
        };

        ws.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            if (
              parsed.event?.includes('FollowersUpdated') ||
              parsed.event?.includes('Follow') ||
              parsed.event?.includes('Subscription')
            ) {
              fetchFollowers();
            }
          } catch (e) {}
        };
      } catch (e) {}
    }

    initLiveFollowers();

    // Güvenlik için her 30 saniyede bir sessiz yenile
    const interval = setInterval(fetchFollowers, 30000);

    return () => {
      isCancelled = true;
      if (pingInterval) clearInterval(pingInterval);
      if (ws) ws.close();
      clearInterval(interval);
    };
  }, [channel]);

  const percentage = Math.min(100, Math.max(0, Math.round((current / (target || 1)) * 100)));

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-transparent select-none font-sans">
      <div className="bg-[#0b0e14]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-white/90">{title}</span>
          <span className="text-xs font-mono font-bold text-white/70">
            {current} / {target} ({percentage}%)
          </span>
        </div>
        <div className="w-full h-3.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${percentage}%`, backgroundColor: barColor }}
          />
        </div>
      </div>
    </div>
  );
}
