'use client';

import React, { useState, useEffect } from 'react';

export default function SubCounterWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const channel = (searchParams?.channel || 'itsfatih').toLowerCase().trim();
  const style = searchParams?.style || 'badge';
  const color = searchParams?.color || '#a855f7';

  const [subs, setSubs] = useState<number | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchSubs = async () => {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && typeof data.subscribers_count === 'number') {
            setSubs(data.subscribers_count);
            return;
          }
        }
      } catch (e) {}

      if (!isCancelled && subs === null) setSubs(0);
    };

    fetchSubs();
    const interval = setInterval(fetchSubs, 20000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [channel]);

  const count = subs !== null ? subs : 0;

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 bg-transparent select-none font-sans">
      {style === 'big' ? (
        <div className="bg-[#0b0e14]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-1 min-w-[200px]">
          <span className="text-[11px] font-black uppercase tracking-widest text-white/50">AKTİF ABONE</span>
          <span className="text-5xl font-black font-mono tracking-tight" style={{ color }}>{count}</span>
        </div>
      ) : (
        <div className="bg-[#0b0e14]/95 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 shadow-2xl flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
          <span className="text-xs font-black uppercase tracking-wider text-white/80">ABONE</span>
          <span className="text-sm font-mono font-black text-white">{count}</span>
        </div>
      )}
    </div>
  );
}
