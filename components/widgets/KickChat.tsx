'use client';

export default function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || 'itsfatih').toLowerCase().trim();

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-4 bg-transparent select-none overflow-hidden">
      <div className="w-full max-w-md h-[85vh] rounded-2xl overflow-hidden bg-transparent">
        <iframe
          src={`https://kick.com/popout/${encodeURIComponent(channel)}/chat`}
          className="w-full h-full border-0 bg-transparent"
          allow="autoplay"
        />
      </div>
    </div>
  );
}
