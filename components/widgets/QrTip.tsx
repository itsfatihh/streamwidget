'use client';

import React from 'react';

export default function QrTipWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const url = searchParams?.url || 'https://streamwidget.live';
  const title = searchParams?.title || 'BAĞIŞ YAP';
  const color = searchParams?.color || '#22c55e';

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}&bgcolor=0b0e14&color=${color.replace('#', '')}&margin=4`;

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 bg-transparent select-none font-sans">
      <div className="bg-[#0b0e14]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col items-center gap-3">
        <div className="w-40 h-40 rounded-xl overflow-hidden border border-white/5 bg-black/50 flex items-center justify-center p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrImageUrl} alt="QR Code" className="w-full h-full object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
          <span className="text-xs font-black uppercase tracking-widest text-white/90">{title}</span>
        </div>
      </div>
    </div>
  );
}
