'use client';

import { useState, useEffect } from 'react';

export default function FollowerGoalWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const target = parseInt(searchParams.target || '1000', 10);
  const accent = searchParams.accent || '#53FC18';
  const [current, setCurrent] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.followers_count === 'number') {
            setCurrent(data.followers_count);
            setLoaded(true);
          }
        }
      } catch (e) {}
    };

    fetchStats();
    const interval = setInterval(fetchStats, 8000);
    return () => clearInterval(interval);
  }, [channel]);

  const percentage = Math.min(100, Math.max(0, Math.round((current / target) * 100)));

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent p-6 select-none font-sans">
      <div className="w-full max-w-md bg-[#0a0d14]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center justify-between text-xs font-black tracking-wider uppercase">
          <span className="text-white/90 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
            TAKİPÇİ HEDEFİ
          </span>
          <span className="text-white font-mono">
            {loaded ? current.toLocaleString() : '...'} / {target.toLocaleString()} ({percentage}%)
          </span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%`, backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }}
          />
        </div>
      </div>
    </div>
  );
}
