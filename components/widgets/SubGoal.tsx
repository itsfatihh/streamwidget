'use client';

import React, { useState, useEffect } from 'react';

export default function SubGoalWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const channel = (searchParams?.channel || 'itsfatih').trim().toLowerCase();
  const target = parseInt(searchParams?.target || '50', 10);
  const title = searchParams?.title || 'ABONE HEDEFİ';
  const barColor = searchParams?.bar_color || '#00e701';

  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    let isCancelled = false;

    async function fetchSubs() {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        const data = await res.json();
        const count = data?.subscriber_count ?? data?.subscribers_count ?? 0;
        if (!isCancelled) setCurrent(Number(count));
      } catch (err) {}
    }

    fetchSubs();
    const interval = setInterval(fetchSubs, 30000);

    return () => {
      isCancelled = true;
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
