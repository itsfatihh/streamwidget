'use client';

import Link from 'next/link';
import { WIDGETS_LIST } from '@/lib/widgets';
import { LangCode } from '@/lib/i18n';

export default function HomePage() {
  const lang: LangCode = 'tr';

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col font-sans select-none">
      {/* Üst Bar */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-black tracking-widest text-sm text-white">STREAMWIDGET</span>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white/70">
          🇹🇷 TR
        </div>
      </header>

      {/* Hero Başlık */}
      <section className="text-center pt-16 pb-12 px-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
          Yayınlarınızı Üst Seviyeye Taşıyın
        </h1>
        <p className="text-sm md:text-base text-white/60 max-w-2xl mx-auto font-medium">
          OBS, Streamlabs ve Kick için modern, şeffaf ve gerçek zamanlı canlı yayın widget katmanları.
        </p>
      </section>

      {/* Widget Kartları Listesi */}
      <main className="max-w-6xl w-full mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WIDGETS_LIST.map((w) => (
          <div
            key={w.id}
            className="bg-[#0b0e14] border border-white/10 hover:border-emerald-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {w.category}
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                {w.name[lang] || w.name['tr']}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                {w.description[lang] || w.description['tr']}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/5 flex justify-end">
              <Link
                href={`/builder/${w.id}`}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Özelleştirici</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
