'use client';

import { useState, useEffect } from 'react';

export default function KickViewersWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const [viewers, setViewers] = useState<number>(0);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    // Kick resmi API'si tarayıcıdan Cloudflare'a takıldığı için sunucu tarafı
    // /api/kick scraping yolunu kullanıyoruz (uygulamanın geri kalanıyla tutarlı).
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setIsLive(Boolean(data.is_live));
            setViewers(typeof data.viewers === 'number' ? data.viewers : 0);
          }
          return;
        }
      } catch {
        // Ağ/scrape hatasında güvenli varsayılana düş, hiçbir zaman çökme.
      }
      if (!isCancelled) {
        setIsLive(false);
        setViewers(0);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
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
