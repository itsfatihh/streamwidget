'use client';

export default function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-6 bg-transparent select-none overflow-hidden">
      <div className="w-full max-w-md h-[88vh] relative rounded-3xl overflow-hidden bg-transparent">
        {/* Kick Chat Popout Container */}
        <iframe
          src={`https://kick.com/popout/${encodeURIComponent(channel)}/chat`}
          className="w-full h-[calc(100%+140px)] -mt-[56px] border-0 bg-transparent"
          style={{
            filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))',
            pointerEvents: 'none',
          }}
          allow="autoplay"
        />
        {/* Alt ve Üst Kick Butonlarını Maskeleme Katmanı */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
