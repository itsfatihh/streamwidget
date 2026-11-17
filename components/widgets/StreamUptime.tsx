'use client';

import { useState, useEffect } from 'react';

export default function StreamUptimeWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const [isLive, setIsLive] = useState<boolean>(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<string>('00:00:00');

  // Yayın durumunu ve başlangıç zamanını sunucu tarafı /api/kick'ten çek.
  useEffect(() => {
    let isCancelled = false;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/kick?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            const live = Boolean(data.is_live);
            setIsLive(live);
            if (live && typeof data.live_started_at === 'string') {
              const parsed = Date.parse(data.live_started_at);
              setStartedAt(Number.isFinite(parsed) ? parsed : null);
            } else {
              setStartedAt(null);
            }
          }
          return;
        }
      } catch {
        // Hata durumunda güvenli varsayılana düş.
      }
      if (!isCancelled) {
        setIsLive(false);
        setStartedAt(null);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [channel]);

  // Her saniye geçen süreyi HH:MM:SS olarak güncelle.
  useEffect(() => {
    if (!isLive || startedAt === null) {
      setElapsed('00:00:00');
      return;
    }

    const tick = () => {
      const diff = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      const pad = (n: number) => String(n).padStart(2, '0');
      setElapsed(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isLive, startedAt]);

  // Yayın açık ama başlangıç zamanı okunamadıysa süre yerine CANLI göster.
  const showUptime = isLive && startedAt !== null;

  return (
    <div className="w-screen h-screen flex items-start justify-start p-6 bg-transparent select-none">
      <div className="bg-[#0a0d14]/90 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-2 shadow-2xl flex items-center gap-2.5">
        <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-[#53FC18] animate-pulse' : 'bg-white/30'}`} />
        {isLive ? (
          <span className="text-xs font-black uppercase tracking-wider text-white font-mono">
            {showUptime ? elapsed : 'CANLI'}
          </span>
        ) : (
          <span className="text-xs font-black uppercase tracking-wider text-white">ÇEVRİMDIŞI</span>
        )}
      </div>
    </div>
  );
}
