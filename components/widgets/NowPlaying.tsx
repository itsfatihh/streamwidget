'use client';

import React, { useState, useEffect } from 'react';

export default function NowPlayingWidget({ searchParams }: { searchParams: Record<string, any> }) {
  const refreshToken = searchParams?.refresh_token || '';
  const theme = searchParams?.theme || 'compact';

  const [track, setTrack] = useState<{
    isPlaying: boolean;
    title?: string;
    artist?: string;
    albumArt?: string;
    progressMs?: number;
    durationMs?: number;
  }>({
    isPlaying: false,
  });

  useEffect(() => {
    if (!refreshToken) {
      setTrack({
        isPlaying: true,
        title: 'Örnek Parça',
        artist: 'Sanatçı Adı',
        albumArt: '',
      });
      return;
    }

    let isCancelled = false;

    const fetchSong = async () => {
      try {
        const res = await fetch(`/api/spotify/now-playing?refresh_token=${encodeURIComponent(refreshToken)}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setTrack(data);
          }
        }
      } catch (err) {}
    };

    fetchSong();
    const interval = setInterval(fetchSong, 4000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [refreshToken]);

  if (!track.isPlaying && refreshToken) {
    return null; // Şarkı çalmıyorsa gizle
  }

  const progressPercent =
    track.durationMs && track.progressMs
      ? Math.min(100, Math.round((track.progressMs / track.durationMs) * 100))
      : 0;

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 bg-transparent select-none font-sans">
      <div
        className={`bg-[#0b0e14]/95 backdrop-blur-xl border border-white/10 p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center gap-3.5 max-w-sm w-full ${
          theme === 'vinyl' ? 'rounded-3xl' : 'rounded-2xl'
        }`}
      >
        {/* Albüm Kapağı */}
        <div
          className={`w-14 h-14 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden flex-shrink-0 ${
            theme === 'vinyl' ? 'rounded-full animate-[spin_8s_linear_infinite]' : ''
          }`}
        >
          {track.albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={track.albumArt} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">🎵</span>
          )}
        </div>

        {/* Bilgi ve İlerleme */}
        <div className="flex flex-col flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
            <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#1DB954]">
              SPOTIFY
            </span>
          </div>

          <span className="text-sm font-extrabold text-white truncate">{track.title || 'Parça Yok'}</span>
          <span className="text-xs font-semibold text-white/60 truncate">{track.artist || 'Sanatçı'}</span>

          {track.durationMs ? (
            <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#1DB954] transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
