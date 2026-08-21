'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function GpsTrackerContent() {
  const searchParams = useSearchParams();
  const initialSession = searchParams.get('session') || searchParams.get('channel') || 'itsfatih';

  const [session, setSession] = useState(initialSession);
  const [isTracking, setIsTracking] = useState(false);
  const [status, setStatus] = useState<string>('Hazır');
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number; speed: number; heading: number; accuracy: number }>({
    lat: 0,
    lng: 0,
    speed: 0,
    heading: 0,
    accuracy: 0,
  });
  const [lastSent, setLastSent] = useState<string>('--');
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if ('wakeLock' in navigator && isTracking) {
      (navigator as any).wakeLock.request('screen').catch(() => {});
    }
  }, [isTracking]);

  const sendLocation = (lat: number, lng: number, speed: number, heading: number) => {
    const sName = session.toLowerCase().trim();
    const payload = JSON.stringify({ channel: sName, session: sName, lat, lng, speed, heading, time: Date.now() });

    fetch(`https://ntfy.sh/sw_gps_${sName}`, { method: 'POST', body: payload }).catch(() => {});
    fetch('/api/gps', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload }).catch(() => {});

    setLastSent(new Date().toLocaleTimeString('tr-TR'));
    setStatus('Canlı Gönderiliyor 🚀');
  };

  const handlePositionSuccess = (pos: GeolocationPosition) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const speedKmh = pos.coords.speed !== null && pos.coords.speed >= 0 ? Math.round(pos.coords.speed * 3.6) : 0;
    const headingDeg = pos.coords.heading !== null && !isNaN(pos.coords.heading) ? Math.round(pos.coords.heading) : 0;
    const accuracy = Math.round(pos.coords.accuracy || 0);

    setGpsData({ lat, lng, speed: speedKmh, heading: headingDeg, accuracy });
    sendLocation(lat, lng, speedKmh, headingDeg);
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Cihazınızda GPS desteği bulunamadı.');
      return;
    }

    setStatus('GPS Başlatıldı');
    setIsTracking(true);

    navigator.geolocation.getCurrentPosition(handlePositionSuccess, () => {}, { enableHighAccuracy: true, timeout: 15000 });
    watchIdRef.current = navigator.geolocation.watchPosition(handlePositionSuccess, () => {}, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    });
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setStatus('Durduruldu');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-between p-6 font-sans select-none">
      <header className="w-full max-w-md flex items-center justify-between py-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-black tracking-tight text-emerald-400">STREAMWIDGET GPS</h1>
          <p className="text-xs text-white/50">Canlı Mobil Radar Vericisi</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isTracking ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs font-bold font-mono uppercase">{isTracking ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
      </header>

      <main className="w-full max-w-md my-auto space-y-5">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
          <label className="text-xs font-bold text-white/60 uppercase tracking-wider block">Oturum / Kanal Adı</label>
          <input
            type="text"
            value={session}
            disabled={isTracking}
            onChange={(e) => setSession(e.target.value)}
            className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-base font-bold text-white focus:outline-none focus:border-emerald-400 disabled:opacity-60"
            placeholder="itsfatih"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold text-white/40 uppercase">Anlık Hız</span>
            <div className="text-3xl font-black font-mono text-emerald-400 mt-1">{gpsData.speed}</div>
            <span className="text-[10px] text-white/50 font-bold">KM/H</span>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold text-white/40 uppercase">Pusula Açısı</span>
            <div className="text-3xl font-black font-mono text-white mt-1">{gpsData.heading}°</div>
            <span className="text-[10px] text-white/50 font-bold">YÖN</span>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-white/40">Durum:</span>
            <span className="font-bold text-emerald-400">{status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Koordinat:</span>
            <span className="text-white/80">{gpsData.lat ? `${gpsData.lat.toFixed(5)}, ${gpsData.lng.toFixed(5)}` : '--'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Son Gönderim:</span>
            <span className="text-white/80">{lastSent}</span>
          </div>
        </div>

        <button
          onClick={isTracking ? stopTracking : startTracking}
          className={`w-full py-4 rounded-2xl font-black text-lg tracking-wider transition-all duration-300 shadow-xl ${
            isTracking
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
              : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
          }`}
        >
          {isTracking ? 'GPS TAKİBİNİ DURDUR' : 'KONUMU BAŞLAT'}
        </button>
      </main>

      <footer className="w-full max-w-md text-center py-3 text-[11px] text-white/30 border-t border-white/5">
        StreamWidget GPS Transmitter • Arka Planda Açık Tutunuz
      </footer>
    </div>
  );
}

export default function GpsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center">Yükleniyor...</div>}>
      <GpsTrackerContent />
    </Suspense>
  );
}
