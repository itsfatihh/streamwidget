'use client';

import { useState, useEffect } from 'react';

export default function KickViewersWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const [viewers, setViewers] = useState<number>(0);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`https://kick.com/api/v2/channels/${channel}/livestream`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.data) {
            setViewers(data.data.viewers || 0);
            setIsLive(true);
            return;
          }
        }
        setIsLive(false);
      } catch (e) {
        setIsLive(false);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [channel]);

  return (
    <div className="w-screen h-screen flex items-start justify-start p-6 bg-transparent select-none">
      <div className="bg-[#0a0d14]/90 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-2 shadow-2xl flex items-center gap-2.5">
        <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-[#53FC18] animate-pulse' : 'bg-white/30'}`} />
        <span className="text-xs font-black uppercase tracking-wider text-white">
          {isLive ? `${viewers.toLocaleString()} İZLEYİCİ` : 'ÇEVRİMDIŞI'}
        </span>
      </div>
    </div>
  );
}
