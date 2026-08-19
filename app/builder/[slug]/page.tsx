"use client";

import { useState, use } from "react";
import { WIDGETS_LIST } from "@/lib/widgets";
import Link from "next/link";

export default function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const widget = WIDGETS_LIST.find((w) => w.id === slug);

  const [formState, setFormState] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  if (!widget) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Widget Bulunamadı</h1>
        <Link href="/" className="text-emerald-400 underline">Ana Sayfaya Dön</Link>
      </main>
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

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 max-w-4xl mx-auto font-sans">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-6">
        &larr; Tüm Widget lara Dön
      </Link>

      <header className="mb-8">
        <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">{widget.category}</span>
        <h1 className="text-3xl font-black mt-2">{widget.name}</h1>
        <p className="text-neutral-400 text-sm mt-1">{widget.description}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h2 className="text-lg font-bold border-b border-neutral-800 pb-3">Widget Ayarları</h2>

          {widget.fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-300">{f.label}</label>
              {f.type === "text" && (
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={formState[f.name] || ""}
                  onChange={(e) => setFormState({ ...formState, [f.name]: e.target.value })}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              )}
              {f.type === "select" && (
                <select
                  value={formState[f.name] || (f.defaultValue as string)}
                  onChange={(e) => setFormState({ ...formState, [f.name]: e.target.value })}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {f.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-lg font-bold mb-1">OBS Browser Kaynağı</h2>
              <p className="text-xs text-neutral-400 mb-4">Bu URL yi kopyalayıp OBS Browser kaynağına yapıştırın.</p>
              
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-xs font-mono text-emerald-400 break-all select-all">
                {finalObsUrl}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition active:scale-[0.98]"
            >
              {copied ? "✓ Link Kopyalandı!" : "OBS Linkini Kopyala"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}