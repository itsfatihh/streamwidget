"use client";

import { useState, use } from "react";
import { WIDGETS_LIST } from "@/lib/widgets";
import Link from "next/link";

export default function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const widget = WIDGETS_LIST.find((w) => w.id === slug);

  const initialForm: Record<string, string> = {};
  if (widget) {
    widget.fields.forEach((f) => {
      if (f.defaultValue !== undefined) initialForm[f.name] = String(f.defaultValue);
    });
  }

  const [formState, setFormState] = useState<Record<string, string>>(initialForm);
  const [copied, setCopied] = useState(false);

  if (!widget) {
    return (
      <div className="min-h-screen bg-[#090b10] text-white flex flex-col items-center justify-center p-6 font-sans">
        <h1 className="text-2xl font-bold mb-2">Widget Bulunamadı</h1>
        <Link href="/" className="text-emerald-400 underline text-sm">Vitrine Dön</Link>
      </div>
    );
  }

  const searchParams = new URLSearchParams();
  Object.entries(formState).forEach(([key, val]) => {
    if (val) searchParams.set(key, val);
  });

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const queryString = searchParams.toString() ? "?" + searchParams.toString() : "";
  const finalObsUrl = baseUrl + "/w/" + widget.id + queryString;

  const handleCopy = () => {
    navigator.clipboard.writeText(finalObsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scale = Number(formState.scale || 100) / 100;
  const accent = formState.accent || "#53FC18";

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 font-sans relative pb-16">
      <div className="border-b border-white/5 bg-[#090b10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
            &larr; Widget Kataloğu
          </Link>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            {widget.name} Özelleştirici
          </span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{widget.name}</h1>
          <p className="text-slate-400 text-sm mt-1">{widget.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-5 border border-white/5 shadow-2xl">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Ayarlar
              </h2>

              {widget.fields.map((f) => (
                <div key={f.name} className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex justify-between">
                    <span>{f.label}</span>
                  </label>
                  {(f.type === "text" || f.type === "number") && (
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={formState[f.name] || ""}
                      onChange={(e) => setFormState({ ...formState, [f.name]: e.target.value })}
                      className="w-full bg-[#12161f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                    />
                  )}
                  {f.type === "color" && (
                    <div className="flex items-center gap-3 bg-[#12161f] border border-white/10 rounded-xl p-2">
                      <input
                        type="color"
                        value={formState[f.name] || (f.defaultValue as string)}
                        onChange={(e) => setFormState({ ...formState, [f.name]: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono uppercase text-slate-300">{formState[f.name] || f.defaultValue}</span>
                    </div>
                  )}
                  {f.type === "select" && (
                    <select
                      value={formState[f.name] || (f.defaultValue as string)}
                      onChange={(e) => setFormState({ ...formState, [f.name]: e.target.value })}
                      className="w-full bg-[#12161f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 transition"
                    >
                      {f.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/5">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">OBS Browser Bağlantısı</h3>
              <div className="bg-[#0c0f16] border border-white/10 rounded-xl p-3.5 text-xs font-mono text-emerald-400 break-all select-all">
                {finalObsUrl}
              </div>
              <button
                onClick={handleCopy}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-sm transition-all transform active:scale-[0.98] shadow-lg shadow-emerald-500/20"
              >
                {copied ? "✓ Link Kopyalandı!" : "OBS Linkini Kopyala"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 border border-white/5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Canlı Önizleme</h3>
                  <span className="text-[11px] font-mono text-slate-500">OBS Katman Simülatörü</span>
                </div>
                
                <div className="w-full h-80 rounded-xl bg-[#0e121a] border border-white/10 relative overflow-hidden flex items-center justify-center p-6 bg-grid-pattern shadow-inner">
                  <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-600 uppercase">Önizleme Alanı</div>
                  
                  <div style={{ transform: `scale(${scale})`, transition: "transform 0.2s ease" }}>
                    {widget.id === "kick-viewers" && (
                      <div className="flex items-center gap-3 bg-black/85 backdrop-blur-xl px-5 py-2.5 rounded-2xl border text-white shadow-2xl" style={{ borderColor: `${accent}50` }}>
                        <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                        <span className="text-xs font-mono font-bold text-neutral-300 uppercase">{formState.channel || "itsfatih"}</span>
                        <span className="text-sm font-black font-mono" style={{ color: accent }}>148</span>
                      </div>
                    )}

                    {widget.id === "goal-bar" && (
                      <div className="w-80 bg-black/85 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-white shadow-2xl space-y-2">
                        <div className="flex justify-between text-xs font-bold font-mono">
                          <span>{formState.title || "HEDEF"}</span>
                          <span style={{ color: accent }}>{formState.current || 0} / {formState.target || 100}</span>
                        </div>
                        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${Math.min(100, (Number(formState.current || 0) / Number(formState.target || 100)) * 100)}%`,
                              backgroundColor: accent 
                            }} 
                          />
                        </div>
                      </div>
                    )}

                    {widget.id === "kick-chat" && (
                      <div className="w-72 bg-black/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-white text-xs space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                          <span>moderator:</span>
                          <span className="text-slate-200 font-normal">Yayın harika gidiyor! 🔥</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                          <span>izleyici99:</span>
                          <span className="text-slate-200 font-normal">Yeni widgetler çok iyi olmuş</span>
                        </div>
                      </div>
                    )}

                    {widget.id === "irl-hud" && (
                      <div className="flex items-center gap-3 bg-black/85 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 text-white shadow-2xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-xs font-black tracking-widest text-red-400">LIVE</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/20" />
                        <span className="text-sm font-semibold font-mono tracking-wide">19:54:02</span>
                      </div>
                    )}

                    {widget.id === "clock" && (
                      <div className="bg-black/85 backdrop-blur-xl px-7 py-3 rounded-2xl border border-white/10 text-white shadow-2xl">
                        <span className="text-2xl font-black font-mono tracking-wider">19:54:02</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 flex items-center justify-between">
                <span>💡 Seçtiğin renk, boyut ve değerler otomatik olarak OBS bağlantısına eklenir.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
