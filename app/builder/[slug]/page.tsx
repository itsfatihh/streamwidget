'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WIDGETS_LIST, WidgetDef } from '@/lib/widgets';
import IrlHudWidget from '@/components/widgets/IrlHud';
import MiniMapWidget from '@/components/widgets/MiniMap';
import FollowerGoalWidget from '@/components/widgets/FollowerGoal';
import SubGoalWidget from '@/components/widgets/SubGoal';
import GoalBarWidget from '@/components/widgets/GoalBar';
import ChatOverlayWidget from '@/components/widgets/ChatOverlay';
import SubCounterWidget from '@/components/widgets/SubCounter';
import NowPlayingWidget from '@/components/widgets/NowPlaying';
import QrTipWidget from '@/components/widgets/QrTip';

const LANGUAGES = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'pt', label: 'PT' },
  { code: 'ru', label: 'RU' },
];

export default function BuilderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  const widget: WidgetDef | undefined = WIDGETS_LIST.find((w) => w.id === slug);

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState('tr');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  // Tarayıcıdan kayıtlı dil ve tema tercihini yükle
  useEffect(() => {
    const savedLang = localStorage.getItem('sw_lang');
    if (savedLang) setLang(savedLang);

    const savedTheme = localStorage.getItem('sw_theme') as 'dark' | 'light';
    if (savedTheme) setThemeMode(savedTheme);
  }, []);

  const changeLanguage = (l: string) => {
    setLang(l);
    localStorage.setItem('sw_lang', l);
  };

  const toggleTheme = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
    localStorage.setItem('sw_theme', next);
  };

  useEffect(() => {
    if (widget) {
      const initial: Record<string, string> = {};
      widget.fields.forEach((f) => {
        initial[f.name] = f.defaultValue;
      });

      const urlRefreshToken = searchParams.get('refresh_token');
      if (urlRefreshToken && slug === 'now-playing') {
        initial['refresh_token'] = urlRefreshToken;
      }

      setFormValues(initial);
    }
  }, [widget, slug, searchParams]);

  if (!widget) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${themeMode === 'dark' ? 'bg-[#07090e] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <h1 className="text-2xl font-black mb-4">Widget Bulunamadı</h1>
        <Link href="/" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const handleChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const queryParams = new URLSearchParams(formValues).toString();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.streamwidget.live';
  const obsUrl = `${baseUrl}/w/${slug}?${queryParams}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(obsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSpotifyConnected = !!(formValues['refresh_token'] || searchParams.get('spotify_connected'));
  const isDark = themeMode === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-black ${
      isDark ? 'bg-[#07090e] text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Üst Menü */}
      <header className={`w-full border-b backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-colors ${
        isDark ? 'border-white/5 bg-[#0b0e14]/80' : 'border-slate-200 bg-white/80'
      }`}>
        <Link href="/" className={`flex items-center gap-2 font-bold text-sm transition-colors ${
          isDark ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-950'
        }`}>
          <span className="text-lg">←</span>
          <span>{lang === 'tr' ? 'Tüm Widgetlar' : 'All Widgets'}</span>
        </Link>

        {/* Sağ Kontroller: Dil ve Tema Butonları */}
        <div className="flex items-center gap-3">
          {/* 7 Dil Seçeneği */}
          <div className={`flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-200/70 border-slate-300'
          }`}>
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                onClick={() => changeLanguage(item.code)}
                className={`px-2 py-1 text-[11px] font-black uppercase rounded-lg transition-all ${
                  lang === item.code
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : isDark ? 'text-white/50 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Aydınlık / Karanlık Mod Butonu */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`p-2 rounded-xl border text-sm font-bold transition-all flex items-center justify-center ${
              isDark
                ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Ana Panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sol Panel: Ayarlar */}
        <div className={`lg:col-span-5 flex flex-col gap-6 rounded-3xl p-6 md:p-8 shadow-2xl border backdrop-blur-2xl transition-colors ${
          isDark ? 'bg-[#0b0e14]/90 border-white/10' : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {widget.category}
            </span>
            <h1 className="text-2xl font-black tracking-tight mt-3">
              {widget.name[lang] || widget.name['tr']}
            </h1>
            <p className={`text-xs font-medium mt-1 leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {widget.description[lang] || widget.description['tr']}
            </p>
          </div>

          {/* Spotify Giriş Butonu */}
          {slug === 'now-playing' && (
            <div className={`p-4 rounded-2xl border flex flex-col gap-2.5 ${
              isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {lang === 'tr' ? 'Yöntem 1: Tek Tıkla Bağlan (Önerilen)' : 'Method 1: One-Click Connect'}
                </span>
                {isSpotifyConnected && (
                  <span className="text-[10px] font-mono font-black text-emerald-500 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    BAĞLANDI ✓
                  </span>
                )}
              </div>
              <p className={`text-[11px] leading-normal ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                {lang === 'tr'
                  ? 'Aşağıdaki butona tıklayıp onay vermeniz yeterlidir. Sistem linkinizi otomatik oluşturur.'
                  : 'Click the button below and authorize. The system will automatically configure your widget.'}
              </p>
              <a
                href={`/api/auth/spotify?channel=${encodeURIComponent(formValues['channel'] || 'itsfatih')}`}
                className="w-full py-2.5 px-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>🟢</span> {isSpotifyConnected ? 'Spotify Hesabını Yeniden Bağla' : 'Spotify ile Bağlan'}
              </a>
            </div>
          )}

          {/* Form Alanları */}
          <div className="flex flex-col gap-4">
            {slug === 'now-playing' && (
              <div className="flex items-center gap-2 my-1">
                <div className={`h-[1px] flex-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                <span className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                  {lang === 'tr' ? 'veya manuel ayarlar' : 'or manual settings'}
                </span>
                <div className={`h-[1px] flex-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
              </div>
            )}

            {widget.fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white/70' : 'text-slate-700'}`}>
                    {field.label[lang] || field.label['tr']}
                  </label>
                  {field.name === 'refresh_token' && (
                    <span className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                      Otomatik doldurulur
                    </span>
                  )}
                </div>

                {field.type === 'select' ? (
                  <select
                    value={formValues[field.name] || field.defaultValue}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-medium border focus:outline-none focus:border-emerald-500 transition-colors ${
                      isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className={isDark ? 'bg-[#0b0e14] text-white' : 'bg-white text-slate-900'}>
                        {opt.label[lang] || opt.label['tr']}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'color' ? (
                  <div className={`flex items-center gap-3 rounded-xl p-2 border ${
                    isDark ? 'bg-black/50 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <input
                      type="color"
                      value={formValues[field.name] || field.defaultValue}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={formValues[field.name] || field.defaultValue}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className={`flex-1 bg-transparent text-sm font-mono focus:outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder={field.name === 'refresh_token' ? 'Spotify ile bağlandığınızda buraya otomatik gelir' : ''}
                    value={formValues[field.name] !== undefined ? formValues[field.name] : field.defaultValue}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-medium border focus:outline-none focus:border-emerald-500 transition-colors ${
                      isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* OBS Link Alanı */}
          <div className={`flex flex-col gap-2 pt-2 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              OBS TARAYICI KAYNAĞI LİNKİ
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={obsUrl}
                className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs font-mono truncate select-all border focus:outline-none ${
                  isDark ? 'bg-black/70 border-white/10 text-white/70' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              />
              <button
                onClick={copyToClipboard}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap shadow-lg ${
                  copied
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-emerald-500/20'
                }`}
              >
                {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Panel: Canlı Önizleme */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className={`text-[11px] font-mono font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
              CANLI ÖNİZLEME
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="w-full aspect-video bg-[#050608] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center p-6 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]">
            {slug === 'irl-hud' && <IrlHudWidget searchParams={formValues} />}
            {slug === 'mini-map' && <MiniMapWidget searchParams={formValues} />}
            {slug === 'follower-goal' && <FollowerGoalWidget searchParams={formValues} />}
            {slug === 'sub-goal' && <SubGoalWidget searchParams={formValues} />}
            {slug === 'goal-bar' && <GoalBarWidget searchParams={formValues} />}
            {slug === 'chat-overlay' && <ChatOverlayWidget searchParams={formValues} />}
            {slug === 'sub-counter' && <SubCounterWidget searchParams={formValues} />}
            {slug === 'now-playing' && <NowPlayingWidget searchParams={formValues} />}
            {slug === 'qr-tip' && <QrTipWidget searchParams={formValues} />}
          </div>

          {/* Token Rehberi (Sadece Now Playing için) */}
          {slug === 'now-playing' && (
            <div className={`rounded-3xl p-6 shadow-xl border flex flex-col gap-3 transition-colors ${
              isDark ? 'bg-[#0b0e14]/90 border-white/10 text-white/70' : 'bg-white border-slate-200 text-slate-600 shadow-slate-200/50'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-sm">💡</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Spotify Bağlantısı ve Token Hakkında Bilgi
                </span>
              </div>
              <ul className="text-xs space-y-2 leading-relaxed list-disc list-inside">
                <li>
                  <strong className={isDark ? 'text-white' : 'text-slate-900'}>İkisini de yapmanız gerekmez:</strong> Sol taraftaki yeşil <span className="text-emerald-500 font-semibold">"Spotify ile Bağlan"</span> butonuna bastığınızda oturum anahtarınız otomatik alınır ve linkinize eklenir.
                </li>
                <li>
                  <strong className={isDark ? 'text-white' : 'text-slate-900'}>Token Nerede?:</strong> Başarılı girişten sonra oluşan özel oturum anahtarı formdaki <span className="text-emerald-500 font-mono">refresh_token</span> alanına otomatik işlenir.
                </li>
                <li>
                  <strong className={isDark ? 'text-white' : 'text-slate-900'}>Manuel Kullanım:</strong> Başka bir araçtan veya Spotify Developer panelinden aldığınız kendi Refresh Token kodunuz varsa, butona basmadan doğrudan formdaki kutuya yapıştırıp OBS linkinizi oluşturabilirsiniz.
                </li>
              </ul>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
