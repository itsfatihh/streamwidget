'use client';

import React, { useState, use, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WIDGETS_LIST } from '@/lib/widgets';

export default function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const widget = WIDGETS_LIST.find((w: any) => w.id === slug);

  if (!widget) {
    notFound();
  }

  const [copied, setCopied] = useState(false);

  // Form State
  const initialConfig = useMemo(() => {
    const conf: Record<string, string> = {};
    widget.fields.forEach((f: any) => {
      conf[f.name] = f.defaultValue;
    });
    return conf;
  }, [widget]);

  const [config, setConfig] = useState<Record<string, string>>(initialConfig);

  const handleChange = (name: string, value: string) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  // URL Query Üretici
  const queryParams = new URLSearchParams(config).toString();
  const widgetUrl = `https://www.streamwidget.live/w/${widget.id}${queryParams ? `?${queryParams}` : ''}`;
  const previewUrl = `/w/${widget.id}${queryParams ? `?${queryParams}` : ''}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(widgetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sol Panel: Ayarlar */}
        <div className="lg:col-span-5 bg-[#0f131c] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mb-4"
            >
              ← Widget Listesine Dön
            </Link>
            <h1 className="text-2xl font-black tracking-tight text-white">{widget.name.tr}</h1>
            <p className="text-xs text-white/60 mt-1.5 leading-relaxed">{widget.description.tr}</p>
          </div>

          <div className="flex flex-col gap-4">
            {widget.fields.map((field: any) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-white/80">{field.label.tr}</label>
                
                {field.type === 'select' && (
                  <select
                    value={config[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-[#161c28] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    {field.options?.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label.tr}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={config[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-[#161c28] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-white/30"
                  />
                )}

                {field.type === 'color' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-white/60">{config[field.name]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* OBS Linki Kopyalama */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              OBS Tarayıcı Kaynağı Linki
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={widgetUrl}
                className="w-full bg-[#161c28] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white/70 focus:outline-none select-all"
              />
              <button
                onClick={copyToClipboard}
                className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Panel: Canlı Önizleme ve Chat Komutları */}
        <div className="lg:col-span-7 bg-[#0b0e14] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">
              Canlı Önizleme
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>

          {/* Iframe Önizleme Alanı */}
          <div className="w-full h-[220px] bg-black/60 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center relative">
            <iframe
              src={previewUrl}
              className="w-full h-full border-0 pointer-events-none bg-transparent"
              title="Widget Preview"
            />
          </div>

          {/* IRL HUD Chat Komutları Tablosu */}
          {slug === 'irl-hud' && (
            <div className="w-full mt-5 p-4 rounded-xl bg-[#121622] border border-white/10 text-left">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/90">
                  Kick Chat Komutları (Yayıncı & Mod)
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="bg-black/50 p-2.5 rounded-lg border border-white/5 flex flex-col justify-center">
                  <span className="text-emerald-400 font-bold">!location &lt;şehir&gt;</span>
                  <span className="text-white/60 text-[11px] font-sans mt-0.5">Konumu ve havayı girilen şehre ayarlar</span>
                </div>
                <div className="bg-black/50 p-2.5 rounded-lg border border-white/5 flex flex-col justify-center">
                  <span className="text-emerald-400 font-bold">!autolocation</span>
                  <span className="text-white/60 text-[11px] font-sans mt-0.5">Otomatik IP konumuna geri döner</span>
                </div>
                <div className="bg-black/50 p-2.5 rounded-lg border border-white/5 flex flex-col justify-center">
                  <span className="text-amber-400 font-bold">!setlive on / off</span>
                  <span className="text-white/60 text-[11px] font-sans mt-0.5">LIVE rozetini açar / kapatır</span>
                </div>
                <div className="bg-black/50 p-2.5 rounded-lg border border-white/5 flex flex-col justify-center">
                  <span className="text-amber-400 font-bold">!setclock on / off</span>
                  <span className="text-white/60 text-[11px] font-sans mt-0.5">Canlı saati açar / kapatır</span>
                </div>
                <div className="bg-black/50 p-2.5 rounded-lg border border-white/5 flex flex-col justify-center">
                  <span className="text-amber-400 font-bold">!setloc on / off</span>
                  <span className="text-white/60 text-[11px] font-sans mt-0.5">Konum göstergesini açar / kapatır</span>
                </div>
                <div className="bg-black/50 p-2.5 rounded-lg border border-white/5 flex flex-col justify-center">
                  <span className="text-amber-400 font-bold">!setweather on / off</span>
                  <span className="text-white/60 text-[11px] font-sans mt-0.5">Hava durumunu açar / kapatır</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
