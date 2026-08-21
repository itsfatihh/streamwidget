'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WIDGETS_LIST } from '@/lib/widgets';
import { LangCode, UI_TEXTS } from '@/lib/i18n';
import HeaderControls from '@/components/HeaderControls';

export default function HomePage() {
  const [lang, setLang] = useState<LangCode>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('sw_lang') as LangCode) || 'en';
    setLang(saved);

    const onLangChange = () => {
      const updated = (localStorage.getItem('sw_lang') as LangCode) || 'en';
      setLang(updated);
    };
    window.addEventListener('sw_lang_changed', onLangChange);
    return () => window.removeEventListener('sw_lang_changed', onLangChange);
  }, []);

  const t = UI_TEXTS[lang] || UI_TEXTS.en;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#07090e] text-zinc-900 dark:text-white flex flex-col font-sans select-none transition-colors duration-300">
      {/* Üst Bar */}
      <header className="border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-black tracking-widest text-sm">STREAMWIDGET</span>
        </div>
        <HeaderControls lang={lang} onLangChange={setLang} />
      </header>

      {/* Hero Başlık */}
      <section className="text-center pt-16 pb-12 px-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          {t.heroTitle}
        </h1>
        <p className="text-sm md:text-base text-zinc-600 dark:text-white/60 max-w-2xl mx-auto font-medium">
          {t.heroSubtitle}
        </p>
      </section>

      {/* Widget Kartları Listesi */}
      <main className="max-w-6xl w-full mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WIDGETS_LIST.map((w) => (
          <div
            key={w.id}
            className="bg-white dark:bg-[#0b0e14] border border-black/10 dark:border-white/10 hover:border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-xl group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {w.category}
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight group-hover:text-emerald-500 transition-colors">
                {w.name[lang] || w.name.en || w.name.tr}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-white/50 leading-relaxed">
                {w.description[lang] || w.description.en || w.description.tr}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-black/5 dark:border-white/5 flex justify-end">
              <Link
                href={`/builder/${w.id}`}
                className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-emerald-500 hover:text-black text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>{t.customize}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
