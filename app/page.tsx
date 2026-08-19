"use client";

import { useState, useEffect } from "react";
import { WIDGETS_LIST } from "@/lib/widgets";
import { TRANSLATIONS, LangCode } from "@/lib/i18n";
import LanguageSelector from "@/components/LanguageSelector";
import Link from "next/link";

export default function HomePage() {
  const [lang, setLang] = useState<LangCode>("tr");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as LangCode;
    if (saved && TRANSLATIONS[saved]) {
      setLang(saved);
    }
  }, []);

  const handleLangChange = (newLang: LangCode) => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.tr;

  // Widget ID'sine göre doğrudan çevrilmiş başlık ve açıklama fonksiyonu
  const getWidgetInfo = (id: string) => {
    switch (id) {
      case "kick-viewers":
        return { name: t.w_viewers_name, desc: t.w_viewers_desc };
      case "kick-chat":
        return { name: t.w_chat_name, desc: t.w_chat_desc };
      case "follower-goal":
        return { name: t.w_fgoal_name, desc: t.w_fgoal_desc };
      case "sub-goal":
        return { name: t.w_sgoal_name, desc: t.w_sgoal_desc };
      case "irl-hud":
        return { name: t.w_irl_name, desc: t.w_irl_desc };
      case "clock":
        return { name: t.w_clock_name, desc: t.w_clock_desc };
      default:
        return { name: id, desc: "" };
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 font-sans relative pb-20">
      {/* Üst Bar */}
      <header className="border-b border-white/5 bg-[#090b10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#53FC18]" />
            <span className="font-extrabold text-sm tracking-widest uppercase font-mono text-white">
              STREAMWIDGET
            </span>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector currentLang={lang} onSelectLang={handleLangChange} />
          </div>
        </div>
      </header>

      {/* Hero Bölümü */}
      <main className="max-w-6xl mx-auto px-6 mt-12">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Widget Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WIDGETS_LIST.map((w) => {
            const info = getWidgetInfo(w.id);
            return (
              <div
                key={w.id}
                className="glass-card rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1 duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-emerald-400">
                      {w.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                    {info.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    {info.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                  <Link
                    href={`/builder/${w.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black text-white text-xs font-bold transition-all"
                  >
                    <span>{t.customize}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
