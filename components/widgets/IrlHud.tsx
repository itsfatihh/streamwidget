'use client';

import React, { useState, useEffect } from 'react';

const isEnabled = (val: any, defaultVal = true): boolean => {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (val === false || val === 'false' || val === '0' || val === 'hide') return false;
  return true;
};

const CHANNEL_CHATROOM_MAP: Record<string, string> = {
  itsfatih: '1917711',
  batuhankaradeniz: '2437618',
  cavs: '2437618',
  elraenn: '2437618',
  kendinemuzisyen: '2437618',
};

export default function IrlHudWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const channel = (searchParams?.channel || 'itsfatih').toLowerCase().trim();
  const theme = searchParams?.theme || 'framed';

  const [showLive, setShowLive] = useState<boolean>(isEnabled(searchParams?.showLive, true));
  const [showClock, setShowClock] = useState<boolean>(isEnabled(searchParams?.showClock, true));
  const [showLocation, setShowLocation] = useState<boolean>(isEnabled(searchParams?.showLocation, true));
  const [showWeather, setShowWeather] = useState<boolean>(isEnabled(searchParams?.showWeather, true));

  const [commandCity, setCommandCity] = useState<string>('');
  const [displayCity, setDisplayCity] = useState<string>('Konum alınıyor...');
  const [temp, setTemp] = useState<number | null>(null);
  const [time, setTime] = useState<string>('00:00:00');

  useEffect(() => {
    setShowLive(isEnabled(searchParams?.showLive, true));
    setShowClock(isEnabled(searchParams?.showClock, true));
    setShowLocation(isEnabled(searchParams?.showLocation, true));
    setShowWeather(isEnabled(searchParams?.showWeather, true));
  }, [searchParams]);

  // 1. Canlı Saat
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

  // 2. Client-Side IP Konumu (ipwho.is) & Open-Meteo Canlı Sıcaklık
  useEffect(() => {
    if (!showLocation && !showWeather) return;

    let isCancelled = false;

    const fetchClientLocationAndWeather = async () => {
      try {
        let lat: number | null = null;
        let lon: number | null = null;
        let cityName = '';

        // Eğer komutla manuel şehir girildiyse Geocoding yap
        if (commandCity) {
          cityName = commandCity;
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(commandCity)}&count=1&language=en&format=json`
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.results && geoData.results[0]) {
              lat = geoData.results[0].latitude;
              lon = geoData.results[0].longitude;
              cityName = geoData.results[0].name;
            }
          }
        } else {
          // Komut yoksa doğrudan tarayıcı/OBS IP'sinden ipwho.is ile gerçek konumu al
          const ipRes = await fetch('https://ipwho.is/');
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            if (ipData.success) {
              cityName = ipData.city || ipData.region || 'Konum';
              lat = ipData.latitude;
              lon = ipData.longitude;
            }
          }
        }

        if (isCancelled) return;
        setDisplayCity(cityName || 'Konum');

        // Koordinatlar çözüldüyse Open-Meteo'dan anlık sıcaklığı al
        if (lat !== null && lon !== null) {
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
          );
          if (weatherRes.ok) {
            const wData = await weatherRes.json();
            if (!isCancelled && wData.current_weather) {
              setTemp(Math.round(wData.current_weather.temperature));
            }
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setDisplayCity(commandCity || 'Konum');
        }
      }
    };

    fetchClientLocationAndWeather();
    const interval = setInterval(fetchClientLocationAndWeather, 300000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [showLocation, showWeather, commandCity]);

  // 3. Kick Chat Komutları (Pusher WS)
  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingInterval: any = null;
    let isCancelled = false;

    const chatroomId = CHANNEL_CHATROOM_MAP[channel] || '1917711';

    ws = new WebSocket(
      'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false'
    );

    const subscribe = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            event: 'pusher:subscribe',
            data: { auth: '', channel: `chatrooms.${chatroomId}.v2` },
          })
        );
      }
    };

    ws.onopen = () => {
      subscribe();
    };

    ws.onmessage = (event) => {
      if (isCancelled) return;
      try {
        const payload = JSON.parse(event.data);

        if (payload.event === 'pusher:connection_established') {
          subscribe();
        }

        if (payload.event && payload.event.includes('ChatMessageEvent')) {
          let data = payload.data;
          if (typeof data === 'string') data = JSON.parse(data);

          const content = (data.content || '').trim();
          const sender = data.sender || {};
          const badges = sender.identity?.badges || [];

          const isAuthorized =
            sender.username?.toLowerCase() === channel ||
            badges.some((b: any) =>
              ['broadcaster', 'moderator', 'mod', 'founder', 'og'].includes(b.type?.toLowerCase())
            );

          if (!isAuthorized) return;

          if (content.toLowerCase().startsWith('!city ') || content.toLowerCase().startsWith('!setcity ')) {
            const cityName = content.replace(/^!(city|setcity)\s+/i, '').trim();
            if (cityName) setCommandCity(cityName);
          } else if (content.toLowerCase() === '!resetcity' || content.toLowerCase() === '!clearcity') {
            setCommandCity('');
          } else if (content.toLowerCase() === '!setlive on') {
            setShowLive(true);
          } else if (content.toLowerCase() === '!setlive off') {
            setShowLive(false);
          } else if (content.toLowerCase() === '!setclock on') {
            setShowClock(true);
          } else if (content.toLowerCase() === '!setclock off') {
            setShowClock(false);
          } else if (content.toLowerCase() === '!setloc on') {
            setShowLocation(true);
          } else if (content.toLowerCase() === '!setloc off') {
            setShowLocation(false);
          } else if (content.toLowerCase() === '!setweather on') {
            setShowWeather(true);
          } else if (content.toLowerCase() === '!setweather off') {
            setShowWeather(false);
          }
        }
      } catch (err) {}
    };

    pingInterval = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
      }
    }, 15000);

    return () => {
      isCancelled = true;
      if (ws) ws.close();
      if (pingInterval) clearInterval(pingInterval);
    };
  }, [channel]);

  // Öğeleri birleştir
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
        <span>{displayCity}</span>
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
          (HUD Hidden)
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
