'use client';

import { useState, useEffect, useRef, use } from 'react';

function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = searchParams.channel || 'itsfatih';
  return (
    <div className="w-screen h-screen flex items-end justify-start p-6 bg-transparent text-white font-sans">
      <div className="bg-black/75 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-sm space-y-2">
        <div className="text-xs font-bold text-emerald-400">Kick Chat ({channel})</div>
        <div className="text-sm">Sohbet OBS ekranında burada akar.</div>
      </div>
    </div>
  );
}

function KickViewersWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = searchParams.channel || 'itsfatih';
  const [viewers, setViewers] = useState<number | string>('--');

  useEffect(() => {
    const fetchViewers = async () => {
      try {
        const res = await fetch(`/api/kick?channel=${channel}`);
        if (res.ok) {
          const data = await res.json();
          setViewers(data.viewers || 0);
        }
      } catch (e) {}
    };
    fetchViewers();
    const interval = setInterval(fetchViewers, 5000);
    return () => clearInterval(interval);
  }, [channel]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent">
      <div className="bg-black/85 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
        <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
        <span className="text-xl font-black font-mono text-white">{viewers}</span>
        <span className="text-xs font-bold text-white/50 tracking-wider">IZLEYICI</span>
      </div>
    </div>
  );
}

function ClockWidget() {
  const [time, setTime] = useState<string>('00:00:00');
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent">
      <div className="bg-black/85 backdrop-blur-xl px-8 py-3.5 rounded-2xl border border-white/10 text-white shadow-2xl">
        <span className="text-3xl font-black font-mono tracking-wider">{time}</span>
      </div>
    </div>
  );
}

// TEK PARÇA OTO-GPS MINI-MAP (Ayrı sayfa yok, kendi konumunu kendi alır)
function MiniMapWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const shape = searchParams.shape || 'circle';
  const accent = searchParams.accent || '#53FC18';
  const showSpeed = searchParams.showSpeed !== 'false';

  const [pos, setPos] = useState<{ lat: number; lng: number; speed: number; heading: number }>({
    lat: 43.5221,
    lng: 3.9191,
    speed: 0,
    heading: 0,
  });
  const [status, setStatus] = useState<'searching' | 'live'>('searching');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Widget açıldığı an doğrudan cihazın GPS'ini dinlemeye başlar
  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return;

    const onPos = (p: GeolocationPosition) => {
      const lat = p.coords.latitude;
      const lng = p.coords.longitude;
      const speed = p.coords.speed !== null && p.coords.speed >= 0 ? Math.round(p.coords.speed * 3.6) : 0;
      const heading = p.coords.heading !== null && !isNaN(p.coords.heading) ? Math.round(p.coords.heading) : 0;

      setPos({ lat, lng, speed, heading });
      setStatus('live');
    };

    const onErr = (err: any) => {
      console.warn('GPS alımı bekleniyor...', err);
    };

    navigator.geolocation.getCurrentPosition(onPos, onErr, { enableHighAccuracy: true, timeout: 10000 });
    const watchId = navigator.geolocation.watchPosition(onPos, onErr, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 1000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Leaflet Harita Motoru
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [pos.lat, pos.lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    };

    if ((window as any).L) {
      initMap();
    } else {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => initMap();
        document.head.appendChild(script);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Konum değiştikçe haritayı güncelle
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([pos.lat, pos.lng], 16, { animate: true });
    }
  }, [pos.lat, pos.lng]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent p-4 select-none">
      <div
        className={`relative overflow-hidden border-[3px] shadow-2xl transition-all duration-300 ${
          shape === 'square' ? 'w-72 h-72 rounded-3xl' : 'w-72 h-72 rounded-full'
        }`}
        style={{
          borderColor: accent,
          backgroundColor: '#090b10',
          boxShadow: `0 0 35px ${accent}45`,
        }}
      >
        <div ref={mapContainerRef} className="w-full h-full transform scale-110 pointer-events-none" />

        {/* Radar Efekti */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute inset-0 rounded-full border border-dashed border-white/20 pointer-events-none" />

        {/* Merkez Oyuncu Yön Oku */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="relative flex flex-col items-center transition-transform duration-300"
            style={{ transform: `rotate(${pos.heading || 0}deg)` }}
          >
            <div
              className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[20px]"
              style={{ borderBottomColor: accent, filter: `drop-shadow(0 0 8px ${accent})` }}
            />
            <div className="w-3 h-3 rounded-full bg-white -mt-1 shadow-md border-2 border-black" />
          </div>
        </div>

        {/* Hız */}
        {showSpeed && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md px-3.5 py-1 rounded-xl border border-white/20 flex items-baseline gap-1.5 shadow-2xl pointer-events-none">
            <span className="text-lg font-black font-mono text-white tracking-wider">{pos.speed}</span>
            <span className="text-[9px] font-black text-white/50 tracking-widest uppercase">KM/H</span>
          </div>
        )}

        {/* GPS Durum */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15 flex items-center gap-1.5 shadow-lg pointer-events-none">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'live' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          <span className="text-[9px] font-black tracking-widest text-white/90 uppercase">
            {status === 'live' ? 'GPS LIVE' : 'GPS ARANIYOR'}
          </span>
        </div>
      </div>
    </div>
  );
}


function KickPinnedWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const position = searchParams.position || 'top-left';
  const accent = searchParams.accent || '#53FC18';

  const [pinned, setPinned] = useState<{
    id: string;
    username: string;
    content: string;
    color?: string;
  } | null>(null);

  const playPingSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  };

  useEffect(() => {
    let ws: WebSocket | null = null;
    let pollInterval: any = null;

    // 1. Kick Chatroom ID ve Mevcut Pinli Mesajı Al
    const initPinned = async () => {
      try {
        const res = await fetch(`https://kick.com/api/v2/channels/${channel}/chatroom`);
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.pinned_message) {
          setPinned({
            id: String(data.pinned_message.id || Date.now()),
            username: data.pinned_message.sender?.username || data.pinned_message.user?.username || 'Moderatör',
            content: data.pinned_message.content || data.pinned_message.message || '',
            color: data.pinned_message.sender?.identity?.color || accent,
          });
        }

        const chatroomId = data.id;
        if (!chatroomId) return;

        // 2. Pusher Canlı Soket Bağlantısı
        ws = new WebSocket('wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false');
        
        ws.onopen = () => {
          ws?.send(JSON.stringify({
            event: 'pusher:subscribe',
            data: { auth: '', channel: `chatrooms.${chatroomId}.v2` }
          }));
        };

        ws.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            const ev = parsed.event || '';

            if (ev.includes('Pinned') || ev.includes('pinned')) {
              if (ev.includes('Unpin') || ev.includes('unpin')) {
                setPinned(null);
                return;
              }
              const payload = typeof parsed.data === 'string' ? JSON.parse(parsed.data) : parsed.data;
              const msg = payload.message || payload.pinned_message || payload;
              
              setPinned({
                id: String(msg.id || Date.now()),
                username: msg.sender?.username || msg.user?.username || 'Moderatör',
                content: msg.content || msg.message || '',
                color: msg.sender?.identity?.color || accent,
              });
              playPingSound();
            }
          } catch (err) {}
        };
      } catch (e) {}
    };

    initPinned();

    // 3. Fallback: Her 5 saniyede bir API kontrolü (Soket kaçırırsa devreye girer)
    pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`https://kick.com/api/v2/channels/${channel}/chatroom`);
        if (res.ok) {
          const data = await res.json();
          if (!data.pinned_message) {
            setPinned((prev) => (prev ? null : prev));
          } else {
            const pId = String(data.pinned_message.id);
            setPinned((prev) => {
              if (!prev || prev.id !== pId) {
                playPingSound();
                return {
                  id: pId,
                  username: data.pinned_message.sender?.username || data.pinned_message.user?.username || 'Moderatör',
                  content: data.pinned_message.content || data.pinned_message.message || '',
                  color: data.pinned_message.sender?.identity?.color || accent,
                };
              }
              return prev;
            });
          }
        }
      } catch (e) {}
    }, 5000);

    return () => {
      if (ws) ws.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [channel]);

  if (!pinned) return <div className="w-screen h-screen bg-transparent" />;

  const posClass =
    position === 'top-right'
      ? 'items-start justify-end p-8'
      : position === 'bottom-center'
      ? 'items-end justify-center p-8'
      : 'items-start justify-start p-8';

  return (
    <div className={`w-screen h-screen flex ${posClass} bg-transparent select-none animate-in fade-in zoom-in-95 duration-300`}>
      <div
        className="max-w-md bg-[#0a0d14]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl relative overflow-hidden"
        style={{ borderLeft: `4px solid ${accent}`, boxShadow: `0 10px 30px ${accent}25` }}
      >
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm">📌</span>
            <span className="text-xs font-black tracking-wider uppercase" style={{ color: pinned.color || accent }}>
              {pinned.username}
            </span>
          </div>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">
            SABİTLENDİ
          </span>
        </div>
        <p className="text-sm text-white/90 font-medium leading-snug break-words pl-5">
          {pinned.content}
        </p>
      </div>
    </div>
  );
}

export default function WidgetPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const rawSlug = (resolvedParams?.slug || '').toLowerCase().trim();

  if (['mini-map', 'radar', 'radar-hud', 'map', 'nfs-mini-map'].includes(rawSlug)) {
    return <MiniMapWidget searchParams={resolvedSearchParams} />;
  }
  if (['kick-pinned', 'pinned-message', 'pinned', 'pin'].includes(rawSlug)) {
    return <KickPinnedWidget searchParams={resolvedSearchParams} />;
  }
  if (['kick-chat', 'chat-box', 'chat'].includes(rawSlug)) {
    return <KickChatWidget searchParams={resolvedSearchParams} />;
  }
  if (['kick-viewers', 'viewer-count', 'viewers'].includes(rawSlug)) {
    return <KickViewersWidget searchParams={resolvedSearchParams} />;
  }
  if (['clock', 'digital-clock'].includes(rawSlug)) {
    return <ClockWidget />;
  }

  return <MiniMapWidget searchParams={resolvedSearchParams} />;
}
