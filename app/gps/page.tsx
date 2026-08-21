'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function GpsTransmitter() {
  const searchParams = useSearchParams();
  const initialSession = searchParams.get('session') || 'itsfatih';

  const [session, setSession] = useState(initialSession);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number; speed: number; heading: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Cihazınızda GPS / Konum desteği bulunamadı.');
      return;
    }

    setError(null);
    setIsTransmitting(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const speedKmh = pos.coords.speed !== null ? Math.round(pos.coords.speed * 3.6) : 0;
        const currentData = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          speed: speedKmh,
          heading: pos.coords.heading || 0,
        };

        setGpsData(currentData);

        try {
          await fetch('/api/gps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session,
              ...currentData,
            }),
          });
        } catch (e) {}
      },
      (err) => {
        setError(err.message);
        setIsTransmitting(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTransmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            STREAMWIDGET GPS RADAR
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">Canlı Konum Vericisi</h1>
          <p className="text-xs text-slate-400">Bu sayfayı yayındayken telefonunuzda açık tutun.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Yayıncı / Oturum Adı</label>
          <input
            type="text"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            disabled={isTransmitting}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {gpsData && (
          <div className="grid grid-cols-2 gap-3 bg-black/30 p-4 rounded-2xl border border-white/5 font-mono text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Hız</div>
              <div className="text-2xl font-black text-emerald-400">{gpsData.speed} <span className="text-xs">km/s</span></div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Pusula</div>
              <div className="text-2xl font-black text-white">{Math.round(gpsData.heading)}°</div>
            </div>
          </div>
        )}

        <button
          onClick={isTransmitting ? stopTracking : startTracking}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition shadow-lg ${
            isTransmitting
              ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
          }`}
        >
          {isTransmitting ? 'Takibi Durdur' : 'GPS Bağlantısını Başlat'}
        </button>
      </div>
    </div>
  );
}

export default function GpsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090b10]" />}>
      <GpsTransmitter />
    </Suspense>
  );
}
