'use client';

import React, { useState, useEffect } from 'react';

export default function KickGoalWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const title = searchParams.title || 'Takipçi Hedefi';
  const target = Math.max(1, parseInt(searchParams.target || '100', 10));
  const theme = searchParams.theme || 'minimal';
  const barColor = searchParams.barColor || '#53FC18';
  
  // Manuel girilmiş başlangıç değeri varsa al, yoksa 0'dan başlatıp API'den çekecek
  const manualStart = searchParams.startCount ? parseInt(searchParams.startCount, 10) : null;

  const [current, setCurrent] = useState<number>(manualStart ?? 0);
  const [initialLoaded, setInitialLoaded] = useState<boolean>(manualStart !== null);

  useEffect(() => {
    let isCancelled = false;

    const fetchFollowers = async () => {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && typeof data.followers_count === 'number') {
            setCurrent(data.followers_count);
            setInitialLoaded(true);
          }
        }
      } catch (e) {}
    };

    fetchFollowers();
    // 10 saniyede bir güncel takipçiyi sorgula
    const interval = setInterval(fetchFollowers, 10000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [channel]);

  const percentage = Math.min(100, Math.max(0, Math.round((current / target) * 100)));

  return (
    <div className="w-screen h-screen flex items-center justify-center p-6 bg-transparent select-none font-sans">
      <div
        className={`w-full max-w-md p-5 transition-all duration-300 ${
          theme === 'framed'
            ? 'bg-[#0a0d14]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)]'
            : 'bg-transparent'
        }`}
      >
        {/* Başlık ve Sayı */}
        <div className="flex justify-between items-baseline mb-2 text-white font-bold">
          <span className="text-sm tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {title}
          </span>
          <span className="text-xs font-mono text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {initialLoaded ? current : '...'} / {target} ({percentage}%)
          </span>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="w-full h-4 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: barColor,
              boxShadow: `0 0 12px ${barColor}80`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
