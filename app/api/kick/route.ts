import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json({ error: 'Kanal adı gerekli' }, { status: 400 });
  }

  const clean = channel.trim().toLowerCase();

  // 1. Doğrudan veya Proxy ile Chatroom Endpoint'i (En hızlı ve hafif olan)
  const targetUrl = `https://kick.com/api/v2/channels/${clean}/chatroom`;
  const proxies = [
    `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
  ];

  for (const pUrl of proxies) {
    try {
      const res = await fetch(pUrl, { next: { revalidate: 60 } });
      if (res.ok) {
        const data = await res.json();
        if (data?.id) {
          return NextResponse.json({
            id: data.channel_id || data.id,
            chatroomId: data.id,
            slug: clean,
            username: clean,
            followersCount: 0,
          });
        }
      }
    } catch (e) {
      // Bir sonraki proxy'ye geç
    }
  }

  // 2. Full Channel verisi proxy denemesi
  try {
    const chanProxy = `https://corsproxy.io/?url=${encodeURIComponent(`https://kick.com/api/v2/channels/${clean}`)}`;
    const chanRes = await fetch(chanProxy, { next: { revalidate: 60 } });
    if (chanRes.ok) {
      const chanData = await chanRes.json();
      if (chanData?.chatroom?.id) {
        return NextResponse.json({
          id: chanData.id,
          chatroomId: chanData.chatroom.id,
          slug: clean,
          username: chanData.user?.username || clean,
          followersCount: chanData.followers_count || 0,
        });
      }
    }
  } catch (e) {}

  return NextResponse.json({
    id: null,
    chatroomId: null,
    slug: clean,
    error: 'Kick chatroom ID alinamadi',
  });
}
