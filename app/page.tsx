import Link from "next/link";
import { WIDGETS_LIST } from "@/lib/widgets";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8 max-w-6xl mx-auto font-sans">
      <header className="mb-12 text-center pt-8">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
          StreamWidget
        </h1>
        <p className="mt-4 text-neutral-400 max-w-lg mx-auto text-base">
          OBS ve Streamlabs için hızlı, modern ve tamamen ücretsiz yayın widget kütüphanesi.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WIDGETS_LIST.map((w) => (
          <Link
            key={w.id}
            href={"/builder/" + w.id}
            className="group flex flex-col justify-between p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-800/60 transition-all duration-200 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {w.category}
                </span>
                <span className="text-emerald-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Ayarla &rarr;
                </span>
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                {w.name}
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed">{w.description}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
              <span>OBS Uyumlu</span>
              <span>Ücretsiz</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}