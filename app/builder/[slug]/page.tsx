'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { WIDGETS_LIST } from '@/lib/widgets';
import { LangCode } from '@/lib/i18n';

export default function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const lang: LangCode = 'tr';
  const slug = resolvedParams.slug;

  const widget = WIDGETS_LIST.find((w) => w.id === slug) || WIDGETS_LIST[0];

  const [formState, setFormState] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    widget.fields.forEach((f) => {
      initial[f.name] = f.defaultValue !== undefined ? f.defaultValue : '';
    });
    return initial;
  });

  const [copied, setCopied] = useState(false);

  const handleFieldChange = (name: string, value: any) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const currentChannel = formState.channel || 'itsfatih';

  // OBS Bağlantı URL'i
  const queryParams = new URLSearchParams();
  Object.entries(formState).forEach(([key, val]) => {
    if (val !== undefined && val !== '') {
      queryParams.set(key, String(val));
    }
  });

  const obsUrl = `https://www.streamwidget.live/w/${widget.id}?${queryParams.toString()}`;
  const gpsTransmitterUrl = `/gps?session=${encodeURIComponent(currentChannel)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(obsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col font-sans select-none">
      {/* Üst Navigasyon */}
      <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xs font-bold text-white/60 hover:text-white flex items-center gap-2">
          ← Widget Kataloğu
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
            {widget.name[lang] || widget.name['tr']}
          </span>
        </div>
      </header>

      {/* Ana Başlık */}
      <div className="max-w-6xl w-full mx-auto px-8 pt-8 pb-4">
        <h1 className="text-3xl font-black tracking-tight text-white">{widget.name[lang] || widget.name['tr']}</h1>
        <p className="text-sm text-white/50 mt-1">{widget.description[lang] || widget.description['tr']}</p>
      </div>

      {/* Ana Çalışma Alanı */}
      <main className="max-w-6xl w-full mx-auto px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sol Panel: Ayarlar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b0e14] border border-white/10 rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white/80">AYARLAR</h2>
            </div>

            {/* Dinamik Form Alanları */}
            <div className="space-y-4">
              {widget.fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60">
                    {field.label[lang] || field.label['tr']}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={formState[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-[#07090e] border border-white/15 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-400"
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      value={formState[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full bg-[#07090e] border border-white/15 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-400"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label[lang] || opt.label['tr']}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'color' && (
                    <div className="flex items-center gap-3 bg-[#07090e] border border-white/15 rounded-xl p-2">
                      <input
                        type="color"
                        value={formState[field.name] || '#53FC18'}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono font-bold text-white/80 uppercase">
                        {formState[field.name] || '#53FC18'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* GPS Mini-Map İçin Özel Session Başlatma Buton Alanı */}
            {widget.id === 'mini-map' && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-400">Canlı GPS Vericisi</span>
                  <span className="text-white/40 text-[11px]">Mobil & Web</span>
                </div>
                <a
                  href={gpsTransmitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-center"
                >
                  📍 KONUM BAŞLATICI SAYFASINA GİT ↗
                </a>
              </div>
            )}
          </div>

          {/* OBS Bağlantı Kutusu */}
          <div className="bg-[#0b0e14] border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">OBS BROWSER BAĞLANTISI</h3>
            <div className="bg-[#07090e] border border-white/10 rounded-xl p-3 text-xs font-mono text-emerald-400 break-all select-all">
              {obsUrl}
            </div>
            <button
              onClick={handleCopy}
              className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wide transition-all ${
                copied
                  ? 'bg-white text-black'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
              }`}
            >
              {copied ? '✓ KOPYALANDI!' : 'OBS Linkini Kopyala'}
            </button>
          </div>
        </div>

        {/* Sağ Panel: Canlı Önizleme */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b0e14] border border-white/10 rounded-3xl p-6 min-h-[440px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">CANLI ÖNİZLEME</span>
              <span className="text-xs font-mono text-white/40">Live Simulator</span>
            </div>

            {/* Radar Mini-Map Canlı Önizleme */}
            <div className="flex-1 flex items-center justify-center py-6">
              {widget.id === 'mini-map' ? (
                <div
                  className={`relative ${
                    formState.shape === 'square' ? 'w-64 h-64 rounded-3xl' : 'w-64 h-64 rounded-full'
                  } border-[3px] shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300`}
                  style={{
                    borderColor: formState.accent || '#53FC18',
                    backgroundColor: '#090b10',
                    boxShadow: `0 0 35px ${formState.accent || '#53FC18'}40`,
                  }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{
                      backgroundImage: `url('https://a.basemaps.cartocdn.com/dark_all/16/33947/23019.png')`,
                      transform: 'scale(1.3)',
                    }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:14px_14px]" />
                  <div className="absolute inset-0 rounded-full border border-dashed border-white/20" />

                  {/* Oyuncu Oku */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[18px]"
                      style={{
                        borderBottomColor: formState.accent || '#53FC18',
                        filter: `drop-shadow(0 0 8px ${formState.accent || '#53FC18'})`,
                      }}
                    />
                    <div className="w-2.5 h-2.5 rounded-full bg-white -mt-1 shadow-md border border-black" />
                  </div>

                  {/* Hız */}
                  <div className="absolute bottom-3 bg-black/90 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 flex items-baseline gap-1 shadow-lg">
                    <span className="text-sm font-black font-mono text-white">0</span>
                    <span className="text-[9px] font-bold text-white/50">KM/H</span>
                  </div>

                  {/* Durum */}
                  <div className="absolute top-3 bg-black/80 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/15 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[9px] font-black text-white/90 uppercase tracking-wider">RADAR LIVE</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-mono text-white/30 uppercase">Önizleme Alanı</div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/40 flex items-center gap-2">
              💡 Soldaki ayarlarla oynadıkça önizleme ve bağlantı linki anlık olarak güncellenir.
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
