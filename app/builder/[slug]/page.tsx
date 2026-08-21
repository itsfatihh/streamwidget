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

export default function BuilderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  const widget: WidgetDef | undefined = WIDGETS_LIST.find((w) => w.id === slug);

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState('tr');

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
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4">
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

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Üst Menü */}
      <header className="w-full border-b border-white/5 bg-[#0b0e14]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <span className="text-xl">←</span>
          <span className="font-bold text-sm">Tüm Widgetlar</span>
        </Link>

        <div className="flex items-center gap-2">
          {['tr', 'en', 'de'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 text-xs font-black uppercase rounded-lg transition-all ${
                lang === l ? 'bg-white/15 text-white border border-white/20' : 'text-white/40 hover:text-white/80'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      {/* Ana Panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sol Panel: Ayarlar */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-[#0b0e14]/90 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {widget.category}
            </span>
            <h1 className="text-2xl font-black tracking-tight mt-3 text-white">
              {widget.name[lang] || widget.name['tr']}
            </h1>
            <p className="text-xs text-white/60 font-medium mt-1 leading-relaxed">
              {widget.description[lang] || widget.description['tr']}
            </p>
          </div>

          {/* Spotify Giriş Butonu */}
          {slug === 'now-playing' && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Yöntem 1: Tek Tıkla Bağlan (Önerilen)</span>
                {isSpotifyConnected && (
                  <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    BAĞLANDI ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/70 leading-normal">
                Aşağıdaki butona tıklayıp onay vermeniz yeterlidir. Token kutusunu elle doldurmanıza gerek kalmaz, sistem linkinizi otomatik oluşturur.
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
                <div className="h-[1px] bg-white/10 flex-1" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">veya manuel ayarlar</span>
                <div className="h-[1px] bg-white/10 flex-1" />
              </div>
            )}

            {widget.fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                    {field.label[lang] || field.label['tr']}
                  </label>
                  {field.name === 'refresh_token' && (
                    <span className="text-[10px] text-white/40 font-mono">Otomatik doldurulur</span>
                  )}
                </div>

                {field.type === 'select' ? (
                  <select
                    value={formValues[field.name] || field.defaultValue}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#0b0e14] text-white">
                        {opt.label[lang] || opt.label['tr']}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'color' ? (
                  <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl p-2">
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
                      className="flex-1 bg-transparent text-sm font-mono text-white focus:outline-none"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder={field.name === 'refresh_token' ? 'Spotify ile bağlandığınızda buraya otomatik gelir' : ''}
                    value={formValues[field.name] !== undefined ? formValues[field.name] : field.defaultValue}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                )}
              </div>
            ))}
          </div>

          {/* OBS Link Alanı */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/50">
              OBS TARAYICI KAYNAĞI LİNKİ
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={obsUrl}
                className="flex-1 bg-black/70 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white/70 truncate select-all focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap shadow-lg ${
                  copied
                    ? 'bg-white text-black'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-emerald-500/20'
                }`}
              >
                {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Panel: Canlı Önizleme & Açıklama */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-mono font-black uppercase tracking-widest text-white/40">
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
            <div className="bg-[#0b0e14]/90 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">💡</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Spotify Bağlantısı ve Token Hakkında Bilgi
                </span>
              </div>
              <ul className="text-xs text-white/70 space-y-2 leading-relaxed list-disc list-inside">
                <li>
                  <strong className="text-white">İkisini de yapmanız gerekmez:</strong> Sol taraftaki yeşil <span className="text-emerald-400 font-semibold">"Spotify ile Bağlan"</span> butonuna bastığınızda oturum anahtarınız otomatik alınır ve linkinize eklenir.
                </li>
                <li>
                  <strong className="text-white">Token Nerede?:</strong> Başarılı girişten sonra oluşan özel oturum anahtarı formdaki <span className="text-emerald-400 font-mono">refresh_token</span> alanına otomatik işlenir.
                </li>
                <li>
                  <strong className="text-white">Manuel Kullanım:</strong> Başka bir araçtan veya Spotify Developer panelinden aldığınız kendi Refresh Token kodunuz varsa, butona basmadan doğrudan formdaki kutuya yapıştırıp OBS linkinizi oluşturabilirsiniz.
                </li>
              </ul>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
