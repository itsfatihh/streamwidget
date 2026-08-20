import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json({ error: 'Kanal adı gerekli' }, { status: 400 });
  }

  const clean = channel.trim().toLowerCase();

  try {
    // 1. Kick v1 / v2 genel kanal verisi
    const res = await fetch(`https://kick.com/api/v2/channels/${clean}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
      next: { revalidate: 10 },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        id: data?.id || data?.chatroom?.channel_id,
        slug: data?.slug || clean,
        username: data?.user?.username || clean,
        followersCount: data?.followers_count || 0,
        chatroomId: data?.chatroom?.id,
        livestream: data?.livestream || null,
        subscriberBadges: data?.subscriber_badges || [],
      });
    }

    // 2. Chatroom doğrudan kontrolü
    const chatRes = await fetch(`https://kick.com/api/v2/channels/${clean}/chatroom`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
      next: { revalidate: 10 },
    });

    if (chatRes.ok) {
      const cData = await chatRes.json();
      return NextResponse.json({
        id: cData?.channel_id,
        slug: clean,
        username: clean,
        followersCount: 0,
        chatroomId: cData?.id,
        livestream: null,
        subscriberBadges: [],
      });
    }

    // 3. Fallback: İstemcinin doğrudan bağlanması için temel veri dön
    return NextResponse.json({
      id: clean,
      slug: clean,
      username: clean,
      chatroomId: null,
      livestream: null,
      isFallback: true,
    });
  } catch (err: any) {
    return NextResponse.json({
      id: clean,
      slug: clean,
      username: clean,
      chatroomId: null,
      livestream: null,
      error: err?.message,
    });
  }
}
