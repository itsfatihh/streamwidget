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

function MiniMapWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const shape = searchParams.shape || 'circle';
  const accent = searchParams.accent || '#53FC18';
  const showSpeed = searchParams.showSpeed !== 'false';

  const [pos, setPos] = useState<{ lat: number; lng: number; speed: number; heading: number }>({
    lat: 49.4875,
    lng: 8.4660,
    speed: 0,
    heading: 0,
  });
  const [status, setStatus] = useState<'connecting' | 'live'>('connecting');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Canlı GPS Dinleyicisi (SSE + Polling Fallback)
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(`https://ntfy.sh/sw_gps_${channel}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.message) {
            const data = JSON.parse(parsed.message);
            if (data.lat && data.lng) {
              setPos({
                lat: Number(data.lat),
                lng: Number(data.lng),
                speed: Math.round(Number(data.speed || 0)),
                heading: Number(data.heading || 0),
              });
              setStatus('live');
            }
          }
        } catch (e) {}
      };
    } catch (e) {}

    // Polling yedek kontrol
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`https://ntfy.sh/sw_gps_${channel}/json?poll=1&since=5s`);
        if (res.ok) {
          const text = await res.text();
          const lines = text.trim().split('\n');
          for (const line of lines.reverse()) {
            if (!line) continue;
            const parsed = JSON.parse(line);
            if (parsed.message) {
              const data = JSON.parse(parsed.message);
              if (data.lat && data.lng) {
                setPos({
                  lat: Number(data.lat),
                  lng: Number(data.lng),
                  speed: Math.round(Number(data.speed || 0)),
                  heading: Number(data.heading || 0),
                });
                setStatus('live');
                break;
              }
            }
          }
        }
      } catch (e) {}
    }, 1500);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
    };
  }, [channel]);

  // Leaflet Başlatma
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

  // Koordinat Değiştiğinde Harita ve Yön Oku Odaklama
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([pos.lat, pos.lng], 16, { animate: true });
    }
  }, [pos.lat, pos.lng]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent p-4 select-none">
      <div
        className={`relative overflow-hidden border-[3px] shadow-2xl transition-all duration-300 ${
          shape === 'circle' ? 'w-72 h-72 rounded-full' : 'w-72 h-72 rounded-3xl'
        }`}
        style={{
          borderColor: accent,
          backgroundColor: '#090b10',
          boxShadow: `0 0 35px ${accent}45`,
        }}
      >
        {/* Canlı Harita Katmanı */}
        <div ref={mapContainerRef} className="w-full h-full transform scale-110 pointer-events-none" />

        {/* NFS Radar Izgarası */}
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

        {/* Hız Göstergesi */}
        {showSpeed && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md px-3.5 py-1 rounded-xl border border-white/20 flex items-baseline gap-1.5 shadow-2xl pointer-events-none">
            <span className="text-lg font-black font-mono text-white tracking-wider">{pos.speed}</span>
            <span className="text-[9px] font-black text-white/50 tracking-widest uppercase">KM/H</span>
          </div>
        )}

        {/* GPS Canlı Durum */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15 flex items-center gap-1.5 shadow-lg pointer-events-none">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'live' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          <span className="text-[9px] font-black tracking-widest text-white/90 uppercase">
            {status === 'live' ? 'GPS LIVE' : 'SYNCING'}
          </span>
        </div>
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
