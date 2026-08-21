'use client';

import React, { useState, useEffect } from 'react';

// Esnek boolean kontrolü (boolean, string "true"/"false", "1"/"0")
const isEnabled = (val: any, defaultVal = true): boolean => {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (val === false || val === 'false' || val === '0' || val === 'hide') return false;
  return true;
};

export default function IrlHudWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const showLive = isEnabled(searchParams?.showLive, true);
  const showClock = isEnabled(searchParams?.showClock, true);
  const showLocation = isEnabled(searchParams?.showLocation, true);
  const showWeather = isEnabled(searchParams?.showWeather, true);
  
  const customCity = searchParams?.city || '';
  const theme = searchParams?.theme || 'framed';

  const [time, setTime] = useState<string>('00:00:00');
  const [city, setCity] = useState<string>(customCity || 'Yükleniyor...');
  const [temp, setTemp] = useState<number | null>(null);

  // 1. Canlı Saat Sayacı
  useEffect(() => {
    if (!showClock) return;
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [showClock]);

  // 2. Konum ve Canlı Hava Durumu
  useEffect(() => {
    if (!showLocation && !showWeather) return;

    let isCancelled = false;
    const fetchWeather = async () => {
      try {
        const url = customCity
          ? `/api/weather?city=${encodeURIComponent(customCity)}`
          : '/api/weather';
        
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setCity(data.city || 'İstanbul');
            setTemp(data.temp ?? 23);
          }
        }
      } catch (e) {
        if (!isCancelled) {
          setCity(customCity || 'İstanbul');
          setTemp(23);
        }
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [showLocation, showWeather, customCity]);

  // Aktif olan öğeleri listeye topla
  const items: React.ReactNode[] = [];

  if (showLive) {
    items.push(
      <div key="live" className="flex items-center gap-1.5 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        <span className="font-extrabold text-xs tracking-wider text-red-500">LIVE</span>
      </div>
    );
  }

  if (showClock) {
    items.push(
      <span key="clock" className="font-mono font-bold text-white text-xs tracking-wider shrink-0">
        {time}
      </span>
    );
  }

  if (showLocation) {
    items.push(
      <div key="location" className="flex items-center gap-1 text-xs font-semibold text-white/95 shrink-0">
        <span>📍</span>
        <span>{city}</span>
      </div>
    );
  }

  if (showWeather) {
    items.push(
      <div key="weather" className="flex items-center gap-1.5 text-xs font-bold text-amber-400 shrink-0">
        <span>🌤️</span>
        <span>{temp !== null ? `${temp}°C` : '...'}</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-screen h-screen flex items-start justify-start p-6 bg-transparent select-none">
        <span className="text-xs text-white/40 italic p-2 border border-dashed border-white/20 rounded-lg">
          (Tüm öğeler gizlendi)
        </span>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-start justify-start p-6 bg-transparent select-none font-sans">
      <div
        className={`inline-flex items-center gap-3 px-4 py-2 text-white font-medium text-sm transition-all duration-300 ${
          theme === 'framed'
            ? 'bg-[#090b10]/95 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
            : 'bg-black/60 rounded-full px-3 py-1.5'
        }`}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-white/20 select-none">|</span>}
            {item}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
