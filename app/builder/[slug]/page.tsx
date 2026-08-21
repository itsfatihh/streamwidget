'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { WIDGETS_LIST, WidgetDef } from '@/lib/widgets';
import { LangCode, UI_TEXTS } from '@/lib/i18n';
import HeaderControls from '@/components/HeaderControls';

export default function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [lang, setLang] = useState<LangCode>('en');
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  const widgetDef: WidgetDef | undefined = WIDGETS_LIST.find((w) => w.id === slug);

  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    if (widgetDef) {
      widgetDef.fields.forEach((f) => {
        defaults[f.name] = f.defaultValue ?? '';
      });
    }
    return defaults;
  });

  useEffect(() => {
    const savedLang = (localStorage.getItem('sw_lang') as LangCode) || 'en';
    setLang(savedLang);
    setOrigin(window.location.origin);

    const onLangChange = () => {
      const updated = (localStorage.getItem('sw_lang') as LangCode) || 'en';
      setLang(updated);
    };
    window.addEventListener('sw_lang_changed', onLangChange);
    return () => window.removeEventListener('sw_lang_changed', onLangChange);
  }, []);

  if (!widgetDef) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
        Widget Not Found
      </div>
    );
  }

  const t = UI_TEXTS[lang] || UI_TEXTS.en;

  const queryString = new URLSearchParams(
    Object.entries(formValues).reduce((acc, [k, v]) => {
      if (v !== undefined && v !== '') acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const previewUrl = `/w/${widgetDef.id}${queryString ? `?${queryString}` : ''}`;
  const fullObsUrl = `${origin}${previewUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullObsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans select-none" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-color)' }}>
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-black tracking-widest text-sm">STREAMWIDGET</span>
        </Link>
        <HeaderControls lang={lang} onLangChange={setLang} />
      </header>

      {/* Main Builder */}
      <main className="max-w-6xl w-full mx-auto px-6 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sol Panel: Ayarlar */}
        <div
          className="lg:col-span-5 border rounded-3xl p-6 flex flex-col justify-between shadow-sm space-y-6"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="space-y-6">
            <div className="space-y-1.5">
              <Link href="/" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                ← {t.backToHome}
              </Link>
              <h2 className="text-xl font-black">{widgetDef.name[lang] || widgetDef.name.en}</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {widgetDef.description[lang] || widgetDef.description.en}
              </p>
            </div>

            {/* Form Alanları */}
            <div className="space-y-4 pt-2">
              {widgetDef.fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>
                    {field.label[lang] || field.label.en}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={formValues[field.name]}
                      onChange={(e) => setFormValues({ ...formValues, [field.name]: e.target.value })}
                      className="w-full border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-emerald-500"
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-main)',
                      }}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                          {opt.label[lang] || opt.label.en}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'color' ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formValues[field.name]}
                        onChange={(e) => setFormValues({ ...formValues, [field.name]: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                        {formValues[field.name]}
                      </span>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={formValues[field.name]}
                      placeholder={field.placeholder}
                      onChange={(e) => setFormValues({ ...formValues, [field.name]: e.target.value })}
                      className="w-full border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-emerald-500"
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-main)',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* OBS URL Kopyalama */}
          <div className="pt-6 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {t.obsUrl}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={fullObsUrl}
                className="w-full border rounded-xl px-3 py-2 text-xs font-mono select-all outline-none"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl transition-all whitespace-nowrap active:scale-95"
              >
                {copied ? t.copied : t.copyUrl}
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Panel: Canlı Önizleme */}
        <div className="lg:col-span-7 bg-[#0a0d14] border border-white/10 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[420px] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 z-10">
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">{t.livePreview}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex-1 w-full h-full relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
            <iframe src={previewUrl} className="w-full h-full border-0 absolute inset-0 pointer-events-none" />
          </div>
        </div>
      </main>
    </div>
  );
}
