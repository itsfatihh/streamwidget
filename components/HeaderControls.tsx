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

  const applyTheme = (dark: boolean) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const savedLang = (localStorage.getItem('sw_lang') as LangCode) || 'en';
    const savedTheme = localStorage.getItem('sw_theme') || 'dark';

    setCurrentLang(savedLang);
    if (onLangChange) onLangChange(savedLang);
    applyTheme(savedTheme !== 'light');
  }, []);

  const handleLang = (l: LangCode) => {
    setCurrentLang(l);
    localStorage.setItem('sw_lang', l);
    if (onLangChange) onLangChange(l);
    window.dispatchEvent(new Event('sw_lang_changed'));
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    applyTheme(nextDark);
    localStorage.setItem('sw_theme', nextDark ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center gap-3">
      {/* Dil Seçici */}
      <select
        value={lang || currentLang}
        onChange={(e) => handleLang(e.target.value as LangCode)}
        className="bg-black/5 dark:bg-white/10 text-xs font-bold px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 outline-none cursor-pointer text-zinc-900 dark:text-white"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="bg-zinc-900 text-white">
            {l.flag} {l.label}
          </option>
        ))}
      </select>

      {/* Tema Butonu */}
      <button
        onClick={toggleTheme}
        className="p-2 px-3 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 hover:border-emerald-500 text-xs font-bold transition-all text-zinc-900 dark:text-white flex items-center gap-1.5"
      >
        <span>{isDark ? '☀️ Aydınlık' : '🌙 Karanlık'}</span>
      </button>
    </div>
  );
}
