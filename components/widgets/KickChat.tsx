'use client';

export default function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const theme = searchParams.theme || 'glass';
  const fontSize = searchParams.fontSize || 'medium';
  const textStroke = searchParams.textStroke || 'thin';

  // Tema stilleri
  const themeContainer =
    theme === 'minimal'
      ? 'bg-transparent border-0'
      : theme === 'cyber'
      ? 'bg-[#07090e]/95 border-2 border-[#53FC18] rounded-2xl shadow-[0_0_25px_rgba(83,252,24,0.25)]'
      : 'bg-[#0a0d14]/85 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.6)]';

  // Boyut ölçeklendirmesi
  const scaleClass =
    fontSize === 'small' ? 'scale-90 origin-bottom-left' : fontSize === 'large' ? 'scale-110 origin-bottom-left' : 'scale-100';

  // Kontur filtresi
  const strokeFilter =
    textStroke === 'thick'
      ? 'drop-shadow(0 1.5px 1.5px #000) drop-shadow(0 -1.5px 1.5px #000) drop-shadow(1.5px 0 1.5px #000) drop-shadow(-1.5px 0 1.5px #000)'
      : textStroke === 'thin'
      ? 'drop-shadow(0 1px 1px #000) drop-shadow(1px 0 1px #000)'
      : 'none';

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-6 bg-transparent select-none overflow-hidden font-sans">
      <div className={`w-full max-w-md h-[86vh] relative overflow-hidden ${themeContainer} ${scaleClass} transition-all duration-300`}>
        
        {/* Canlı Chat Akışı - Üst başlık/sayaç ve alt input alanı kırpılmış temiz pencere */}
        <iframe
          src={`https://kick.com/popout/${encodeURIComponent(channel)}/chat`}
          className="w-full h-[calc(100%+160px)] -mt-[75px] border-0 bg-transparent"
          style={{
            filter: strokeFilter,
            pointerEvents: 'none',
          }}
          allow="autoplay"
        />

        {/* Alt Kick yazı barını gizleyen koruma katmanı */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
