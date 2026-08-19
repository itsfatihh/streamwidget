import Link from "next/link";
import { WIDGETS_LIST } from "@/lib/widgets";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 relative overflow-hidden bg-grid-pattern">
      {/* Arka Plan Neon Işıkları */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-[-100px] w-[500px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#090b10]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-emerald-500/20">
              SW
            </div>
            <span className="font-bold tracking-tight text-lg text-white">Stream<span className="text-emerald-400">Widget</span></span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> OBS & Streamlabs Uyumlu
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 mb-6 backdrop-blur-sm">
            ✨ Tamamen Ücretsiz • Giriş Yapmak Gerekmez
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Yayınların İçin <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Yeni Nesil Widget’lar
            </span>
          </h1>
          <p className="mt-5 text-slate-400 text-base sm:text-lg leading-relaxed">
            OBS, Streamlabs ve Kick yayınların için ultra hafif, özelleştirilebilir ve şeffaf katmanlar. Tek tıkla yapılandır ve yayına ekle.
          </p>
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WIDGETS_LIST.map((w) => (
            <Link
              key={w.id}
              href={"/builder/" + w.id}
              className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-emerald-400">
                    {w.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Oluştur &rarr;
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {w.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {w.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Aktif Modül
                </span>
                <span>OBS Browser</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}