'use client';

import React from 'react';

export default function NowPlayingWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const theme = searchParams?.theme || 'compact';

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 bg-transparent select-none font-sans">
      <div className={`bg-[#0b0e14]/95 backdrop-blur-xl border border-white/10 p-3.5 shadow-2xl flex items-center gap-3.5 ${theme === 'vinyl' ? 'rounded-3xl' : 'rounded-2xl'}`}>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg relative overflow-hidden ${theme === 'vinyl' ? 'rounded-full animate-[spin_8s_linear_infinite]' : ''}`}>
          <span className="text-lg">🎵</span>
        </div>
        <div className="flex flex-col pr-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">ŞU AN ÇALIYOR</span>
          <span className="text-sm font-black text-white truncate max-w-[180px]">Starboy</span>
          <span className="text-xs font-medium text-white/60 truncate max-w-[180px]">The Weeknd, Daft Punk</span>
        </div>
      </div>
    </div>
  );
}
