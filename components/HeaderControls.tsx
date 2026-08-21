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
  const [mounted, setMounted] = useState(false);

  const applyTheme = (dark: boolean) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  useEffect(() => {
    setMounted(true);
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
    window.dispatchEvent(new Event('sw_theme_changed'));
  };

  if (!mounted) {
    return <div className="h-9 w-32" />;
  }

  return (
    <div className="flex items-center gap-3">
      {/* Dil Seçici */}
      <select
        value={lang || currentLang}
        onChange={(e) => handleLang(e.target.value as LangCode)}
        className="text-xs font-bold px-3 py-2 rounded-xl border outline-none cursor-pointer transition-colors"
        style={{
          backgroundColor: 'var(--bg-input)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-main)',
        }}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="bg-[#18181b] text-white">
            {l.flag} {l.label}
          </option>
        ))}
      </select>

      {/* Tema Değiştirici */}
      <button
        onClick={toggleTheme}
        className="px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 hover:opacity-80 active:scale-95 cursor-pointer"
        style={{
          backgroundColor: 'var(--bg-input)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-main)',
        }}
      >
        <span>{isDark ? '☀️' : '🌙'}</span>
        <span>{isDark ? 'Aydınlık' : 'Karanlık'}</span>
      </button>
    </div>
  );
}
