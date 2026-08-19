"use client";

import { useState, useEffect, useRef } from "react";
import { LANGUAGES, LangCode } from "@/lib/i18n";

export default function LanguageSelector({
  currentLang,
  onSelectLang,
}: {
  currentLang: LangCode;
  onSelectLang: (lang: LangCode) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12161f]/90 border border-white/10 hover:border-white/20 text-slate-200 text-xs font-semibold backdrop-blur-md transition-all shadow-sm active:scale-95"
      >
        <span className="text-sm">{selected.flag}</span>
        <span className="uppercase font-mono tracking-wider">{selected.code}</span>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0e121a]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 z-50 animate-fadeIn divide-y divide-white/5 max-h-80 overflow-y-auto">
          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const isCurrent = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLang(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isCurrent
                      ? "bg-white/10 text-white font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {isCurrent && (
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
