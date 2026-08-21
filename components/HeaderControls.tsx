'use client';

import { useEffect, useState } from 'react';
import { LANGUAGES, LangCode } from '@/lib/i18n';

export default function HeaderControls({
  lang,
  onLangChange,
}: {
  lang?: LangCode;
  onLangChange?: (l: LangCode) => void;
}) {
  const [currentLang, setCurrentLang] = useState<LangCode>('en');
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const savedLang = (localStorage.getItem('sw_lang') as LangCode) || 'en';
    const savedTheme = localStorage.getItem('sw_theme') || 'dark';

    setCurrentLang(savedLang);
    if (onLangChange) onLangChange(savedLang);

    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      setIsDark(true);
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLang = (l: LangCode) => {
    setCurrentLang(l);
    localStorage.setItem('sw_lang', l);
    if (onLangChange) onLangChange(l);
    window.dispatchEvent(new Event('sw_lang_changed'));
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const theme = nextDark ? 'dark' : 'light';
    localStorage.setItem('sw_theme', theme);

    if (nextDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Dil Seçici Dropdown */}
      <select
        value={lang || currentLang}
        onChange={(e) => handleLang(e.target.value as LangCode)}
        className="bg-white/5 dark:bg-white/5 bg-black/5 text-xs font-bold px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 outline-none cursor-pointer hover:border-emerald-500 transition-colors text-zinc-900 dark:text-white"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="bg-zinc-900 text-white">
            {l.flag} {l.label}
          </option>
        ))}
      </select>

      {/* Tema Değiştirici Buton */}
      <button
        onClick={toggleTheme}
        className="p-1.5 px-2.5 rounded-xl bg-white/5 dark:bg-white/5 bg-black/5 border border-black/10 dark:border-white/10 hover:border-emerald-500 text-xs font-bold transition-all text-zinc-900 dark:text-white"
        title="Tema Değiştir"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
