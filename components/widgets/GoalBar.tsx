'use client';

import React, { useState, useEffect } from 'react';

export default function GoalBarWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const channel = (searchParams?.channel || 'itsfatih').toLowerCase().trim();
  const title = searchParams?.title !== undefined && searchParams?.title !== '' ? searchParams.title : 'TAKİPÇİ HEDEFİ';
  const target = Math.max(1, parseInt(searchParams?.target || '1000', 10));
  const color = searchParams?.color || '#22c55e';

  const [current, setCurrent] = useState<number | null>(null);
  const [baseStart, setBaseStart] = useState<number | null>(null);

  // 1. Kick API'den anlık mevcut takipçi sayısını başlangıç olarak otomatik çek
  useEffect(() => {
    let isCancelled = false;

    const fetchLiveFollowers = async () => {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && typeof data.followers_count === 'number') {
            const count = data.followers_count;
            setCurrent(count);
            setBaseStart((prev) => (prev === null ? count : prev));
            return;
          }
        }
      } catch (err) {}

      if (!isCancelled && current === null) {
        setCurrent(0);
        setBaseStart((prev) => (prev === null ? 0 : prev));
      }
    };

    fetchLiveFollowers();
    const interval = setInterval(fetchLiveFollowers, 20000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [channel]);

  // 2. Pusher Canlı Takipçi Event Dinleyicisi
  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingInterval: any = null;
    let isCancelled = false;

    const connectLive = async () => {
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

          if (
            payload.event?.toLowerCase().includes('follow') ||
            payload.event?.toLowerCase().includes('subscription')
          ) {
            setCurrent((prev) => (prev !== null ? prev + 1 : 1));
          }
        } catch (err) {}
      };

      pingInterval = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
        }
      }, 15000);
    };

    connectLive();

    return () => {
      isCancelled = true;
      if (ws) ws.close();
      if (pingInterval) clearInterval(pingInterval);
    };
  }, [channel]);

  const displayCount = current !== null ? current : 0;
  const percentage = Math.min(100, Math.max(0, Math.round((displayCount / target) * 100)));

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 bg-transparent select-none font-sans">
      <div className="w-full max-w-lg bg-[#0b0e14]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col gap-2.5">
        
        {/* Başlık ve Sayaç */}
        <div className="flex items-center justify-between text-xs font-mono font-bold tracking-wider">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
              style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
            />
            <span className="text-white/90 uppercase font-black">{title}</span>
          </div>

          <div className="flex items-center gap-1.5 text-white">
            <span className="text-white font-extrabold">{current !== null ? displayCount.toLocaleString('tr-TR') : '...'}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/60">{target.toLocaleString('tr-TR')}</span>
            <span className="text-white/40 font-normal">({percentage}%)</span>
          </div>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/5 relative p-0.5">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out shadow-lg"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              boxShadow: `0 0 12px ${color}80`,
            }}
          />
        </div>

      </div>
    </div>
  );
}
