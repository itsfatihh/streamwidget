'use client';

export default function MiniMapWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const shape = searchParams.shape || 'circle';
  const accent = searchParams.accent || '#53FC18';

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent p-6 select-none">
      <div
        className={`w-64 h-64 relative bg-[#0a0d14]/95 border-2 shadow-2xl overflow-hidden flex flex-col items-center justify-between p-4 ${
          shape === 'circle' ? 'rounded-full' : 'rounded-3xl'
        }`}
        style={{ borderColor: accent, boxShadow: `0 0 30px ${accent}33` }}
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-white/50 bg-black/40 px-3 py-1 rounded-full border border-white/10 mt-2">
          GPS LIVE
        </span>
        <div className="w-4 h-4 rounded-full flex items-center justify-center relative">
          <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
          <div className="w-6 h-6 rounded-full animate-ping absolute" style={{ backgroundColor: accent, opacity: 0.5 }} />
        </div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono font-bold text-white mb-2">
          0 KM/H
        </div>
      </div>
    </div>
  );
}
