'use client';

import { useState, useEffect, useMemo } from 'react';

export default function SocialBannerWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const label = searchParams.label !== undefined && searchParams.label !== '' ? searchParams.label : 'TAKİP ET';
  const theme = searchParams.theme === 'light' ? 'light' : 'dark';
  const color = searchParams.color || '#53FC18';

  // Sağlanan sosyal kullanıcı adlarını topla (boş olanları at).
  const handles = useMemo(() => {
    return [searchParams.social_1, searchParams.social_2, searchParams.social_3]
      .map((h) => (h || '').trim())
      .filter((h) => h.length > 0);
  }, [searchParams.social_1, searchParams.social_2, searchParams.social_3]);

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Birden fazla kullanıcı adı varsa aralarında geçiş yap (fade out/in).
  useEffect(() => {
    if (handles.length <= 1) {
      setIndex(0);
      setVisible(true);
      return;
    }

    const cycle = setInterval(() => {
      // Önce soldur, sonra bir sonraki kullanıcı adına geç ve tekrar belirginleştir.
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % handles.length);
        setVisible(true);
      }, 400);
    }, 4000);

    return () => clearInterval(cycle);
  }, [handles.length]);

  const isLight = theme === 'light';
  const current = handles.length > 0 ? handles[index % handles.length] : '@kullaniciadi';

  return (
    <div className="w-screen h-screen flex items-end justify-center pb-10 bg-transparent select-none font-sans">
      <div
        className={`flex items-center gap-4 rounded-2xl px-6 py-3.5 shadow-2xl backdrop-blur-xl border ${
          isLight ? 'bg-white/90 border-black/10' : 'bg-[#0a0d14]/90 border-white/15'
        }`}
      >
        {/* Vurgulu etiket kapsülü */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-1.5"
          style={{ backgroundColor: `${color}22`, border: `1px solid ${color}55` }}
        >
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color }}>
            {label}
          </span>
        </div>

        {/* Dönen sosyal kullanıcı adı */}
        <span
          className={`text-lg font-black tracking-tight transition-all duration-[400ms] ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          } ${isLight ? 'text-slate-900' : 'text-white'}`}
        >
          {current}
        </span>
      </div>
    </div>
  );
}
