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
  const [locationName, setLocationName] = useState<string>('GPS Aranıyor...');
  const [gpsSource, setGpsSource] = useState<'LIVE GPS' | 'IP NET'>('IP NET');

  // 1. Canlı GPS ve IP Konum Çözücü Motoru
  useEffect(() => {
    let isCancelled = false;

    const fetchGpsLocation = async () => {
      try {
        // A. Önce yayıncının telefonundan /api/gps'e gelen canlı veriyi dene
        const gpsRes = await fetch(`/api/gps?channel=${encodeURIComponent(channel)}`, { cache: 'no-store' });
        if (gpsRes.ok) {
          const gpsData = await gpsRes.json();
          if (gpsData?.lat && gpsData?.lon) {
            if (!isCancelled) {
              setCoords({ lat: parseFloat(gpsData.lat), lon: parseFloat(gpsData.lon) });
              setSpeed(Math.round(gpsData.speed || 0));
              setGpsSource('LIVE GPS');
              if (gpsData.city) setLocationName(gpsData.city);
              return;
            }
          }
        }

        // B. Canlı telefon GPS verisi yoksa tarayıcı IP'sinden konumu çek
        if (!coords) {
          const ipRes = await fetch('https://ipwho.is/');
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            if (ipData.success && !isCancelled) {
              setCoords({ lat: ipData.latitude, lon: ipData.longitude });
              setLocationName(ipData.city || ipData.region || 'Canlı Konum');
              setGpsSource('IP NET');
            }
          }
        }
      } catch (err) {
        // Hata durumunda varsayılan koordinata geç
        if (!coords && !isCancelled) {
          setCoords({ lat: 41.0082, lon: 28.9784 });
          setLocationName('İstanbul');
        }
      }
    };

    fetchGpsLocation();
    const interval = setInterval(fetchGpsLocation, 4000); // 4 saniyede bir canlı konumu tazele

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [channel]);

  const lat = coords?.lat ?? 41.0082;
  const lon = coords?.lon ?? 28.9784;

  // OpenStreetMap Bounding Box Hesaplayıcı (Zoom seviyesine göre)
  const delta = zoom >= 17 ? 0.0035 : zoom >= 15 ? 0.0075 : 0.018;
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="w-screen h-screen flex items-start justify-start p-6 bg-transparent select-none font-sans">
      <div
        className={`relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.85)] border-2 transition-all duration-300 ${
          shape === 'circle' ? 'w-64 h-64 rounded-full' : 'w-72 h-60 rounded-3xl'
        } ${
          mapTheme === 'dark'
            ? 'border-emerald-500/40 bg-[#090d14]'
            : mapTheme === 'midnight'
            ? 'border-cyan-500/40 bg-[#070b19]'
            : 'border-white/30 bg-slate-100'
        }`}
      >
        {/* Harita Iframe Katmanı */}
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
            className="w-[140%] h-[140%] -top-[20%] -left-[20%] absolute border-0 pointer-events-none"
            scrolling="no"
            title="Mini Map"
          />
        </div>

        {/* Radar Tarama Efekti & Grid (Karanlık Temalarda) */}
        {(mapTheme === 'dark' || mapTheme === 'midnight') && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffcc08_1px,transparent_1px),linear-gradient(to_bottom,#00ffcc08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 pointer-events-none scale-75" />
            <div className="absolute inset-0 rounded-full border border-emerald-500/10 pointer-events-none scale-50" />
          </>
        )}

        {/* Merkez Oyuncu/Yayıncı Radar Pini */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative flex items-center justify-center">
            <span className="w-5 h-5 rounded-full bg-emerald-400/30 animate-ping absolute" />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_12px_rgba(52,211,153,1)] z-10" />
          </div>
        </div>

        {/* Üst Bilgi Barı (Canlı Konum Rozeti) */}
        <div className="absolute top-2.5 inset-x-0 flex justify-center items-center pointer-events-none z-20 px-4">
          <div className="bg-[#0b0e14]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-lg">
            <span
              className={`w-2 h-2 rounded-full ${
                gpsSource === 'LIVE GPS' ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
              }`}
            />
            <span className="text-[10px] font-black uppercase tracking-wider text-white truncate max-w-[120px]">
              {locationName}
            </span>
          </div>
        </div>

        {/* Alt Bilgi Barı: Hız Göstergesi */}
        {showSpeed && (
          <div className="absolute bottom-2.5 inset-x-0 flex justify-center items-center pointer-events-none z-20">
            <div className="bg-[#0b0e14]/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
              <span className="text-xs font-mono font-black text-emerald-400">{speed}</span>
              <span className="text-[9px] font-bold text-white/60 tracking-wider">KM/H</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
