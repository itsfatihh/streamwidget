'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EventsBuilderPage() {
  const [channel, setChannel] = useState('itsfatih');
  const [accent, setAccent] = useState('53FC18');
  const [limit, setLimit] = useState(3);
  const [events, setEvents] = useState({
    follower: true,
    subscriber: true,
    host: true,
    gifted: true,
  });
  const [copied, setCopied] = useState(false);

  const selectedEvents = Object.entries(events)
    .filter(([_, active]) => active)
    .map(([key]) => key)
    .join(',');

  const widgetUrl = `https://streamwidget.live/w/events?channel=${encodeURIComponent(
    channel || 'itsfatih'
  )}&limit=${limit}&accent=${accent.replace('#', '')}&events=${selectedEvents}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(widgetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Son Olaylar (Stream Labels) Builder</h1>
            <p className="text-white/60 text-sm mt-1">
              Son takip, abone, host ve hediye abonelikleri seçmeli olarak OBS'e aktarın.
            </p>
          </div>
          <Link
            href="/"
            className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
          >
            ← Ana Sayfa
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Ayarlar Formu */}
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl space-y-6">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase mb-2">
                Kick Kanal Adı
              </label>
              <input
                type="text"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#53FC18]"
                placeholder="itsfatih"
              />
            </div>

            {/* Gösterilecek Olaylar */}
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase mb-3">
                Gösterilecek Olay Tipleri
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'follower', label: '👤 Son Takip' },
                  { id: 'subscriber', label: '⭐ Son Abone' },
                  { id: 'host', label: '🚀 Son Host' },
                  { id: 'gifted', label: '🎁 Hediye Sub' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setEvents((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id as keyof typeof events],
                      }))
                    }
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition ${
                      events[item.id as keyof typeof events]
                        ? 'border-[#53FC18] bg-[#53FC18]/10 text-white'
                        : 'border-white/10 bg-slate-950 text-white/40'
                    }`}
                  >
                    <span className="text-sm">
                      {events[item.id as keyof typeof events] ? '✓' : '✕'}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gösterim Sayısı (1 - 3 - 5) */}
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase mb-2">
                Gösterilecek Olay Sayısı
              </label>
              <div className="flex gap-3">
                {[1, 3, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLimit(val)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                      limit === val
                        ? 'border-[#53FC18] bg-[#53FC18]/15 text-[#53FC18]'
                        : 'border-white/10 bg-slate-950 text-white/60 hover:border-white/20'
                    }`}
                  >
                    {val === 1 ? '1 (Yalnızca Son)' : `${val} Tane`}
                  </button>
                ))}
              </div>
            </div>

            {/* Vurgu Rengi */}
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase mb-2">
                Abone Vurgu Rengi
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={`#${accent.replace('#', '')}`}
                  onChange={(e) => setAccent(e.target.value.replace('#', ''))}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-white/60">#{accent}</span>
              </div>
            </div>
          </div>

          {/* Link Çıktısı ve Canlı Simülasyon */}
          <div className="flex flex-col justify-between bg-slate-900 border border-white/10 p-6 rounded-2xl space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                Önizleme (Temsili)
              </span>
              
              <div className="bg-slate-950 border border-white/10 rounded-xl p-4 flex flex-wrap gap-2.5 min-h-[100px] items-center">
                {events.follower && (
                  <div className="flex items-center gap-2 bg-black/80 border border-white/10 px-3 py-1.5 rounded-lg">
                    <span className="text-sky-400">👤</span>
                    <div className="text-[10px]">
                      <p className="text-sky-400 font-bold uppercase">TAKİP</p>
                      <p className="text-white font-medium">kick_fan12</p>
                    </div>
                  </div>
                )}
                {events.subscriber && (
                  <div className="flex items-center gap-2 bg-black/80 border border-white/10 px-3 py-1.5 rounded-lg">
                    <span style={{ color: `#${accent}` }}>⭐</span>
                    <div className="text-[10px]">
                      <p className="font-bold uppercase" style={{ color: `#${accent}` }}>ABONE (2)</p>
                      <p className="text-white font-medium">ahmet_99</p>
                    </div>
                  </div>
                )}
                {events.host && limit >= 3 && (
                  <div className="flex items-center gap-2 bg-black/80 border border-white/10 px-3 py-1.5 rounded-lg">
                    <span className="text-rose-400">🚀</span>
                    <div className="text-[10px]">
                      <p className="text-rose-400 font-bold uppercase">HOST (45)</p>
                      <p className="text-white font-medium">pro_streamer</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-white/70 uppercase">
                OBS Browser Source Linki
              </label>
              <input
                type="text"
                readOnly
                value={widgetUrl}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white/70 font-mono select-all"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="w-full bg-[#53FC18] hover:bg-[#45dc13] text-black font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-[#53FC18]/20"
              >
                {copied ? '✓ Link Kopyalandı!' : 'OBS Linkini Kopyala'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
