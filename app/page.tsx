export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl space-y-4">
        <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
          StreamWidget Live Aktif
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Yayıncılar İçin Canlı IRL Widget'ı
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base">
          OBS ve Streamlabs için optimize edilmiş şeffaf katmanlar.
        </p>
        <div className="pt-4">
          <a
            href="/widget"
            className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-neutral-200 transition-colors"
          >
            Widget Overlay'ini Aç
          </a>
        </div>
      </div>
    </main>
  );
}
