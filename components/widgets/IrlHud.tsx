'use client';

import React, { useState, useEffect } from 'react';

export default function IrlHudWidget({ searchParams }: { searchParams: Record<string, any> }) {
  // Açık/Kapalı durumlarını tüm varyasyonlarıyla doğru parse et
  const isEnabled = (val: any) => {
    if (val === undefined || val === null) return true;
    const str = String(val).trim().toLowerCase();
    return str === 'true' || str === '1' || str === 'enabled' || str === 'açık' || str === 'open';
  };

  const showBadge = isEnabled(searchParams?.show_live);
  const showClock = isEnabled(searchParams?.show_clock);
  const showLocation = isEnabled(searchParams?.show_location);
  const showWeather = isEnabled(searchParams?.show_weather);
  const theme = searchParams?.theme || 'capsule';

  const [time, setTime] = useState<string>('');
  const [location, setLocation] = useState<string>('Yükleniyor...');
  const [weather, setWeather] = useState<{ temp: string; icon: string }>({
    temp: '--°C',
    icon: '🌤️',
  });

  // Canlı Saat
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // IP Tabanlı Konum ve Hava Durumu
  useEffect(() => {
    let isCancelled = false;

    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setLocation(`${data.city}${data.country ? `, ${data.country}` : ''}`);
            setWeather({
              temp: `${data.temp}°C`,
              icon: data.icon || '🌤️',
            });
          }
        }
      } catch (err) {}
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Eğer tüm elemanlar kapatıldıysa boş render et
  if (!showBadge && !showClock && !showLocation && !showWeather) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 bg-transparent select-none">
        <span className="text-white/30 text-xs italic">Tüm modüller kapatıldı</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-start justify-start p-4 bg-transparent select-none font-sans">
      <div
        className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all ${
          theme === 'minimal'
            ? 'bg-black/60 border-white/5 text-white'
            : 'bg-[#0b0e14]/90 border-white/10 text-white'
        }`}
      >
        {/* Canlı Rozeti */}
        {showBadge && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] font-black tracking-widest uppercase">LIVE</span>
          </div>
        )}

        {/* Canlı Saat */}
        {showClock && (
          <div className={`flex items-center gap-1.5 px-2 py-0.5 ${showLocation || showWeather ? 'border-r border-white/10 pr-3' : ''}`}>
            <span className="text-xs">🕒</span>
            <span className="text-xs font-mono font-bold tracking-tight text-white/90">
              {time || '00:00:00'}
            </span>
          </div>
        )}

        {/* Konum */}
        {showLocation && (
          <div className="flex items-center gap-1.5 px-1">
            <span className="text-xs">📍</span>
            <span className="text-xs font-bold text-white/80">{location}</span>
          </div>
        )}

        {/* Hava Durumu */}
        {showWeather && (
          <div className={`flex items-center gap-1.5 pl-2 ${showLocation || showClock ? 'border-l border-white/10' : ''}`}>
            <span className="text-sm">{weather.icon}</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">{weather.temp}</span>
          </div>
        )}
      </div>
    </div>
  );
}
