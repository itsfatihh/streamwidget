'use client';

import React, { useState, useEffect } from 'react';

export default function KickGoalWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const title = searchParams.title || 'TAKİPÇİ HEDEFİ';
  const target = Math.max(1, parseInt(searchParams.target || '5000', 10));
  const theme = searchParams.theme || 'framed';
  const barColor = searchParams.barColor || '#53FC18';
  const manualStart = searchParams.startCount ? parseInt(searchParams.startCount, 10) : null;

  const [current, setCurrent] = useState<number>(manualStart ?? 0);
  const [loaded, setLoaded] = useState<boolean>(manualStart !== null);

  useEffect(() => {
    let isCancelled = false;

    const fetchFollowers = async () => {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && typeof data.followers_count === 'number') {
            setCurrent(data.followers_count);
            setLoaded(true);
          }
        }
      } catch (e) {}
    };

    fetchFollowers();
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
        className={`w-full max-w-md p-4 transition-all duration-300 ${
          theme === 'framed'
            ? 'bg-[#0a0d14]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)]'
            : 'bg-transparent'
        }`}
      >
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#53FC18] shadow-[0_0_8px_#53FC18]" />
            <span className="text-white font-extrabold text-xs uppercase tracking-wider">
              {title}
            </span>
          </div>
          <span className="text-white font-mono font-bold text-xs tracking-tight">
            {loaded ? current.toLocaleString('tr-TR') : '0'} / {target.toLocaleString('tr-TR')} ({percentage}%)
          </span>
        </div>

        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-[1px]">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: barColor,
              boxShadow: `0 0 10px ${barColor}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
