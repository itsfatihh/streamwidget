'use client';

import React, { useState, use, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WIDGETS_LIST } from '@/lib/widgets';

export default function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const widget = WIDGETS_LIST.find((w: any) => w.id === slug);

  if (!widget) {
    notFound();
  }

  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<'tr' | 'en' | 'es' | 'de' | 'pt' | 'fr' | 'ru'>('tr');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  // Tarayıcıdan dil ve tema tercihini yükle
  useEffect(() => {
    const savedLang = localStorage.getItem('sw_lang') as any;
    if (savedLang) setLang(savedLang);
    const savedTheme = localStorage.getItem('sw_theme') as any;
    if (savedTheme) setThemeMode(savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
    localStorage.setItem('sw_theme', nextTheme);
  };

  const handleLangChange = (newLang: any) => {
    setLang(newLang);
    localStorage.setItem('sw_lang', newLang);
  };

  // Form State
  const initialConfig = useMemo(() => {
    const conf: Record<string, string> = {};
    widget.fields.forEach((f: any) => {
      conf[f.name] = f.defaultValue;
    });
    return conf;
  }, [widget]);

  const [config, setConfig] = useState<Record<string, string>>(initialConfig);

  const handleChange = (name: string, value: string) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const queryParams = new URLSearchParams(config).toString();
  const widgetUrl = `https://www.streamwidget.live/w/${widget.id}${queryParams ? `?${queryParams}` : ''}`;
  const previewUrl = `/w/${widget.id}${queryParams ? `?${queryParams}` : ''}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(widgetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = themeMode === 'dark';

  const t = {
    back: { tr: '← Widget Listesine Dön', en: '← Back to Widgets', es: '← Volver a Widgets', de: '← Zurück zur Liste', pt: '← Voltar para Widgets', fr: '← Retour aux Widgets', ru: '← Назад к виджетам' },
    preview: { tr: 'Canlı Önizleme', en: 'Live Preview', es: 'Vista Previa', de: 'Live-Vorschau', pt: 'Prévia ao Vivo', fr: 'Aperçu en Direct', ru: 'Предпросмотр' },
    obsLink: { tr: 'OBS Tarayıcı Kaynağı Linki', en: 'OBS Browser Source URL', es: 'Enlace de Fuente del Navegador OBS', de: 'OBS-Browserquellen-Link', pt: 'Link de Fonte do Navegador OBS', fr: 'Lien de Source de Navigateur OBS', ru: 'Ссылка на источник браузера OBS' },
    copy: { tr: 'Linki Kopyala', en: 'Copy URL', es: 'Copiar Enlace', de: 'Link kopieren', pt: 'Copiar Link', fr: 'Copier le Lien', ru: 'Копировать' },
    copied: { tr: 'Kopyalandı!', en: 'Copied!', es: '¡Copiado!', de: 'Kopiert!', pt: 'Copiado!', fr: 'Copié !', ru: 'Скопировано!' },
    commandsTitle: { tr: 'Kick Chat Komutları (Yayıncı & Mod)', en: 'Kick Chat Commands (Broadcaster & Mod)', es: 'Comandos de Kick Chat (Emisor y Mod)', de: 'Kick-Chat-Befehle (Streamer & Mod)', pt: 'Comandos do Kick Chat (Streamer & Mod)', fr: 'Commandes de Chat Kick (Streamer & Mod)', ru: 'Команды Kick чата (Стример и Мод)' },
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#07090e] text-white' : 'bg-slate-50 text-slate-900'} p-4 md:p-8 flex flex-col items-center justify-start font-sans`}>
      
      {/* Üst Bar: Navigasyon, Dil ve Tema Seçici */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-8 pb-4 border-b border-black/10 dark:border-white/10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          {t.back[lang] || t.back.en}
        </Link>

        <div className="flex items-center gap-3">
          {/* Dil Seçici */}
          <select
            value={lang}
            onChange={(e) => handleLangChange(e.target.value)}
            className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer transition-all ${
              isDark ? 'bg-[#121622] border-white/10 text-white/90' : 'bg-white border-slate-300 text-slate-800 shadow-sm'
            }`}
          >
            <option value="tr">🇹🇷 Türkçe</option>
            <option value="en">🇬🇧 English</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="es">🇪🇸 Español</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="pt">🇵🇹 Português</option>
            <option value="ru">🇷🇺 Русский</option>
          </select>

          {/* Tema Değiştirici */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center justify-center ${
              isDark ? 'bg-[#121622] border-white/10 text-amber-400 hover:bg-white/5' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
            title="Toggle Theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sol Panel: Ayarlar */}
        <div className={`lg:col-span-5 border rounded-2xl p-6 shadow-2xl flex flex-col gap-6 transition-colors ${
          isDark ? 'bg-[#0f131c] border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}>
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {widget.name[lang] || widget.name.en}
            </h1>
            <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {widget.description[lang] || widget.description.en}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {widget.fields.map((field: any) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label className={`text-xs font-bold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                  {field.label[lang] || field.label.en}
                </label>
                
                {field.type === 'select' && (
                  <select
                    value={config[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all cursor-pointer ${
                      isDark ? 'bg-[#161c28] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    {field.options?.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label[lang] || opt.label.en}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={config[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all ${
                      isDark ? 'bg-[#161c28] border-white/10 text-white placeholder:text-white/30' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder:text-slate-400'
                    }`}
                  />
                )}

                {field.type === 'color' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                    />
                    <span className={`text-xs font-mono ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      {config[field.name]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* OBS Linki Kopyalama */}
          <div className={`pt-4 border-t flex flex-col gap-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
              {t.obsLink[lang] || t.obsLink.en}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={widgetUrl}
                className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none select-all ${
                  isDark ? 'bg-[#161c28] border-white/10 text-white/70' : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}
              />
              <button
                onClick={copyToClipboard}
                className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                {copied ? (t.copied[lang] || t.copied.en) : (t.copy[lang] || t.copy.en)}
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Panel: Canlı Önizleme ve Chat Komutları */}
        <div className={`lg:col-span-7 border rounded-2xl p-6 shadow-2xl flex flex-col transition-colors ${
          isDark ? 'bg-[#0b0e14] border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}>
          <div className={`flex items-center justify-between pb-4 mb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
              {t.preview[lang] || t.preview.en}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>

          {/* Iframe Önizleme Alanı */}
          <div className={`w-full h-[220px] rounded-xl border overflow-hidden flex items-center justify-center relative ${
            isDark ? 'bg-black/60 border-white/5' : 'bg-slate-900 border-slate-800'
          }`}>
            <iframe
              src={previewUrl}
              className="w-full h-full border-0 pointer-events-none bg-transparent"
              title="Widget Preview"
            />
          </div>

          {/* IRL HUD Chat Komutları Tablosu */}
          {slug === 'irl-hud' && (
            <div className={`w-full mt-5 p-4 rounded-xl border text-left ${
              isDark ? 'bg-[#121622] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
                  {t.commandsTitle[lang] || t.commandsTitle.en}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs font-mono">
                <div className={`p-2.5 rounded-lg border flex flex-col justify-center ${isDark ? 'bg-black/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-emerald-500 font-bold">!location &lt;city&gt;</span>
                  <span className={`text-[11px] font-sans mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                    {lang === 'tr' ? 'Konumu ve havayı girilen şehre ayarlar' : 'Sets location & weather to specified city'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg border flex flex-col justify-center ${isDark ? 'bg-black/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-emerald-500 font-bold">!autolocation</span>
                  <span className={`text-[11px] font-sans mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                    {lang === 'tr' ? 'Otomatik IP konumuna geri döner' : 'Returns back to automatic IP location'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg border flex flex-col justify-center ${isDark ? 'bg-black/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-amber-500 font-bold">!setlive on / off</span>
                  <span className={`text-[11px] font-sans mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                    {lang === 'tr' ? 'LIVE rozetini açar / kapatır' : 'Toggles LIVE badge on or off'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg border flex flex-col justify-center ${isDark ? 'bg-black/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-amber-500 font-bold">!setclock on / off</span>
                  <span className={`text-[11px] font-sans mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                    {lang === 'tr' ? 'Canlı saati açar / kapatır' : 'Toggles clock display on or off'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg border flex flex-col justify-center ${isDark ? 'bg-black/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-amber-500 font-bold">!setloc on / off</span>
                  <span className={`text-[11px] font-sans mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                    {lang === 'tr' ? 'Konum göstergesini açar / kapatır' : 'Toggles location display on or off'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg border flex flex-col justify-center ${isDark ? 'bg-black/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-amber-500 font-bold">!setweather on / off</span>
                  <span className={`text-[11px] font-sans mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                    {lang === 'tr' ? 'Hava durumunu açar / kapatır' : 'Toggles weather display on or off'}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
