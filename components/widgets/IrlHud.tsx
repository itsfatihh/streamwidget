'use client';

import React, { useState, useEffect } from 'react';

export default function IrlHudWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const customCity = searchParams.city || '';
  const theme = searchParams.theme || 'framed';

  const [time, setTime] = useState<string>('00:00:00');
  const [city, setCity] = useState<string>(customCity || 'Yükleniyor...');
  const [temp, setTemp] = useState<number | null>(null);

  // 1. Canlı Saat Akışı
  useEffect(() => {
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
  }, []);

  // 2. IP Bazlı Konum & Canlı Hava Durumu
  useEffect(() => {
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
    // 5 dakikada bir hava durumunu tazele
    const interval = setInterval(fetchWeather, 300000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [customCity]);

  return (
    <div className="w-screen h-screen flex items-start justify-start p-6 bg-transparent select-none font-sans">
      <div
        className={`inline-flex items-center gap-3.5 px-4 py-2 text-white font-medium text-sm transition-all duration-300 ${
          theme === 'framed'
            ? 'bg-[#090b10]/95 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
            : 'bg-black/60 rounded-full px-3 py-1.5'
        }`}
      >
        {/* LIVE Rozeti */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="font-extrabold text-xs tracking-wider text-red-500">LIVE</span>
        </div>

        {/* Dikey Ayraç */}
        <span className="text-white/20">|</span>

        {/* Saat */}
        <span className="font-mono font-bold text-white text-xs tracking-wider">
          {time}
        </span>

        {/* Dikey Ayraç */}
        <span className="text-white/20">|</span>

        {/* Konum */}
        <div className="flex items-center gap-1 text-xs font-semibold text-white/95">
          <span>📍</span>
          <span>{city}</span>
        </div>

        {/* Dikey Ayraç */}
        <span className="text-white/20">|</span>

        {/* Hava Durumu */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
          <span>🌤️</span>
          <span>{temp !== null ? `${temp}°C` : '...'}</span>
        </div>
      </div>
    </div>
  );
}
