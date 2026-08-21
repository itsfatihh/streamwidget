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
    <div className="min-h-screen flex flex-col font-sans select-none" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-black tracking-widest text-sm">STREAMWIDGET</span>
        </div>
        <HeaderControls lang={lang} onLangChange={setLang} />
      </header>

      {/* Hero */}
      <section className="text-center pt-16 pb-12 px-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          {t.heroTitle}
        </h1>
        <p className="text-sm md:text-base max-w-2xl mx-auto font-medium" style={{ color: 'var(--text-muted)' }}>
          {t.heroSubtitle}
        </p>
      </section>

      {/* Widgets Grid */}
      <main className="max-w-6xl w-full mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WIDGETS_LIST.map((w) => (
          <div
            key={w.id}
            className="border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:scale-[1.01] group"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {w.category}
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight group-hover:text-emerald-500 transition-colors">
                {w.name[lang] || w.name.en}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {w.description[lang] || w.description.en}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
              <Link
                href={`/builder/${w.id}`}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:bg-emerald-500 hover:text-black"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-main)',
                }}
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
