'use client';

import React, { useState, useEffect } from 'react';

const isEnabled = (val: any, defaultVal = true): boolean => {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (val === false || val === 'false' || val === '0' || val === 'hide') return false;
  return true;
};

export default function MiniMapWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const channel = (searchParams?.channel || 'itsfatih').toLowerCase().trim();
  const zoom = parseInt(searchParams?.zoom || '16', 10);
  const mapTheme = searchParams?.mapTheme || 'dark';
  const showSpeed = isEnabled(searchParams?.showSpeed, true);
  const shape = searchParams?.shape || 'circle';

  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [speed, setSpeed] = useState<number>(0);
  const [locationName, setLocationName] = useState<string>('GPS İzni Bekleniyor...');
  const [gpsStatus, setGpsStatus] = useState<'OK' | 'WAITING' | 'DENIED'>('WAITING');

  // 1. Cihazın Gerçek Donanımsal GPS'ini Dinle (navigator.geolocation)
  useEffect(() => {
    let watchId: number | null = null;
    let isCancelled = false;

    // Koordinat değiştikçe cadde/mahalle adını bul (Reverse Geocode)
    const reverseGeocode = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=tr,en`,
          { headers: { 'User-Agent': 'StreamWidget/1.0' } }
        );
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data) {
            const place =
              data.address?.suburb ||
              data.address?.neighbourhood ||
              data.address?.town ||
              data.address?.city_district ||
              data.address?.city ||
              data.address?.county ||
              'Canlı Konum';
            setLocationName(place);
          }
        }
      } catch (e) {}
    };

    // A. Önce doğrudan cihazın donanım GPS'ini iste
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (isCancelled) return;
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          setCoords({ lat, lon });
          setGpsStatus('OK');

          // Hız (m/s -> km/h)
          if (position.coords.speed !== null && position.coords.speed !== undefined) {
            setSpeed(Math.round(position.coords.speed * 3.6));
          }

          reverseGeocode(lat, lon);
        },
        (error) => {
          console.warn('Cihaz GPS izni alınamadı veya engellendi:', error.message);
          if (!coords && !isCancelled) {
            setGpsStatus('DENIED');
            setLocationName('GPS İzni Verilmedi');
          }
        },
        {
          enableHighAccuracy: true, // Tam donanımsal GPS çipini ve en yüksek hassasiyeti kullan
          timeout: 15000,
          maximumAge: 0, // Önbellekteki eski konumu kullanma, anlık al
        }
      );
    }

    // B. Streamlabs / Telefon GPS vericisi API entegrasyonu (/api/gps)
    const checkApiGps = async () => {
      try {
        const gpsRes = await fetch(`/api/gps?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (gpsRes.ok) {
          const data = await gpsRes.json();
          if (data?.lat && data?.lon && !isCancelled) {
            const lat = parseFloat(data.lat);
            const lon = parseFloat(data.lon);
            setCoords({ lat, lon });
            setGpsStatus('OK');
            if (data.speed !== undefined) setSpeed(Math.round(data.speed));
            if (data.city) setLocationName(data.city);
            else reverseGeocode(lat, lon);
          }
        }
      } catch (e) {}
    };

    const interval = setInterval(checkApiGps, 3000);

    return () => {
      isCancelled = true;
      if (watchId !== null && typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
      clearInterval(interval);
    };
  }, [channel]);

  // Varsayılan koordinat (izin verilene kadar)
  const lat = coords?.lat ?? 41.0082;
  const lon = coords?.lon ?? 28.9784;

  // Harita Bounding Box
  const delta = zoom >= 17 ? 0.0035 : zoom >= 15 ? 0.0075 : 0.018;
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 bg-transparent select-none font-sans">
      <div
        className={`relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.85)] border-2 transition-all duration-300 ${
          shape === 'circle' ? 'w-60 h-60 rounded-full' : 'w-72 h-56 rounded-3xl'
        } ${
          mapTheme === 'dark'
            ? 'border-emerald-500/40 bg-[#090d14]'
            : mapTheme === 'midnight'
            ? 'border-cyan-500/40 bg-[#070b19]'
            : 'border-white/30 bg-slate-100'
        }`}
      >
        {/* Harita Katmanı */}
        <div
          className={`w-full h-full relative transition-all duration-500 ${
            mapTheme === 'dark'
              ? 'invert-[0.93] hue-rotate-[185deg] brightness-[0.78] contrast-[1.25] saturate-[0.3]'
              : mapTheme === 'midnight'
              ? 'invert-[0.96] hue-rotate-[205deg] brightness-[0.72] contrast-[1.35] saturate-[0.5]'
              : 'brightness-[0.98]'
          }`}
        >
          <iframe
            src={mapEmbedUrl}
            className="w-[150%] h-[150%] -top-[25%] -left-[25%] absolute border-0 pointer-events-none"
            scrolling="no"
            title="Mini Map"
          />
        </div>

        {/* Radar Izgara Efekti */}
        {(mapTheme === 'dark' || mapTheme === 'midnight') && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffcc08_1px,transparent_1px),linear-gradient(to_bottom,#00ffcc08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 pointer-events-none scale-75" />
            <div className="absolute inset-0 rounded-full border border-emerald-500/10 pointer-events-none scale-50" />
          </>
        )}

        {/* Merkez Oyuncu Pini */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative flex items-center justify-center">
            <span className="w-6 h-6 rounded-full bg-emerald-400/30 animate-ping absolute" />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_12px_rgba(52,211,153,1)] z-10" />
          </div>
        </div>

        {/* Üst Konum Rozeti */}
        <div className="absolute top-2.5 inset-x-0 flex justify-center items-center pointer-events-none z-20 px-4">
          <div className="bg-[#0b0e14]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-lg">
            <span
              className={`w-2 h-2 rounded-full ${
                gpsStatus === 'OK'
                  ? 'bg-emerald-400 animate-pulse'
                  : gpsStatus === 'WAITING'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-[10px] font-black uppercase tracking-wider text-white truncate max-w-[130px]">
              {locationName}
            </span>
          </div>
        </div>

        {/* Alt Hız Göstergesi */}
        {showSpeed && (
          <div className="absolute bottom-2.5 inset-x-0 flex justify-center items-center pointer-events-none z-20">
            <div className="bg-[#0b0e14]/95 backdrop-blur-md px-3 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
              <span className="text-xs font-mono font-black text-emerald-400">{speed}</span>
              <span className="text-[9px] font-bold text-white/60 tracking-wider">KM/H</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
