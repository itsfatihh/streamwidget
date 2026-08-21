'use client';

export default function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();
  const theme = searchParams.theme || 'botrix';
  const fontSize = searchParams.fontSize || 'medium';
  const textStroke = searchParams.textStroke || 'thin';

  // Tema stilleri (BotRix presetleri)
  const getThemeClass = () => {
    switch (theme) {
      case 'botrix':
        return 'bg-[#0e1015]/85 backdrop-blur-md border-l-4 border-[#53FC18] rounded-r-2xl border-t border-r border-b border-white/5 shadow-2xl';
      case 'bubble':
        return 'bg-[#141721]/90 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl';
      case 'neon':
        return 'bg-[#080a0f]/95 border border-[#53FC18] rounded-xl shadow-[0_0_20px_rgba(83,252,24,0.2)]';
      case 'minimal':
      default:
        return 'bg-transparent border-0 shadow-none';
    }
  };

  const scaleClass =
    fontSize === 'small' ? 'scale-90 origin-bottom-left' : fontSize === 'large' ? 'scale-110 origin-bottom-left' : 'scale-100';

  const strokeFilter =
    textStroke === 'thick'
      ? 'drop-shadow(0 1.5px 1.5px #000) drop-shadow(0 -1.5px 1.5px #000) drop-shadow(1.5px 0 1.5px #000) drop-shadow(-1.5px 0 1.5px #000)'
      : textStroke === 'thin'
      ? 'drop-shadow(0 1px 1px #000) drop-shadow(1px 0 1px #000)'
      : 'none';

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-6 bg-transparent select-none overflow-hidden font-sans">
      <div className={`w-full max-w-md h-[88vh] relative overflow-hidden ${getThemeClass()} ${scaleClass} transition-all duration-200`}>
        
        {/* Canlı Chat İframe - Başlık ve sayaç kırpılmış */}
        <iframe
          src={`https://kick.com/popout/${encodeURIComponent(channel)}/chat`}
          className="w-full h-[calc(100%+160px)] -mt-[75px] border-0 bg-transparent"
          style={{
            filter: strokeFilter,
            pointerEvents: 'none',
          }}
          allow="autoplay"
        />

        {/* Alt input maskeleme */}
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
