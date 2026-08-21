'use client';

import { useState, useEffect } from 'react';

export default function IrlHudWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const city = searchParams.city || 'Istanbul';
  const accent = searchParams.accent || '#53FC18';
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen flex items-start justify-start p-6 bg-transparent select-none">
      <div className="bg-[#0a0d14]/90 backdrop-blur-xl border border-white/15 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 text-xs font-black">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
          <span className="text-white uppercase tracking-wider">{city}</span>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <span className="text-white/80 font-mono tracking-widest">{time}</span>
      </div>
    </div>
  );
}
