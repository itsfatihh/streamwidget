import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json({ error: 'Kanal adı gerekli' }, { status: 400 });
  }

  const clean = channel.trim().toLowerCase();

  // 1. Doğrudan Kick v2 API (Özel Header'lar ile)
  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${clean}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
      next: { revalidate: 15 },
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        id: data?.id || data?.chatroom?.channel_id,
        chatroomId: data?.chatroom?.id,
        slug: clean,
        username: data?.user?.username || clean,
        followersCount: data?.followers_count || data?.followersCount || 0,
      });
    }
  } catch (e) {
    // API engellendiyse devam et
  }

  // 2. Genel Proxy / Mirror Üzerinden Kick JSON Çözümleme
  try {
    const proxyRes = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://kick.com/api/v2/channels/${clean}`)}`,
      { next: { revalidate: 30 } }
    );
    if (proxyRes.ok) {
      const pData = await proxyRes.json();
      if (pData?.chatroom?.id || pData?.id) {
        return NextResponse.json({
          id: pData?.id || pData?.chatroom?.channel_id,
          chatroomId: pData?.chatroom?.id,
          slug: clean,
          username: pData?.user?.username || clean,
          followersCount: pData?.followers_count || 0,
        });
      }
    }
  } catch (e) {
    // Proxy başarısız olursa devam et
  }

  // 3. Kickbot / Alternatif Genel Entegrasyon
  try {
    const kbRes = await fetch(`https://kickbot.com/api/channel/${clean}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30 },
    });
    if (kbRes.ok) {
      const kbData = await kbRes.json();
      return NextResponse.json({
        id: kbData?.channel_id || kbData?.id,
        chatroomId: kbData?.chatroom_id || kbData?.chatroom?.id,
        slug: clean,
        username: kbData?.username || clean,
        followersCount: kbData?.followers_count || 0,
      });
    }
  } catch (e) {
    // Devam et
  }

  // 4. Deterministik Fallback
  return NextResponse.json({
    id: clean,
    chatroomId: clean,
    slug: clean,
    username: clean,
    followersCount: 0,
  });
}
