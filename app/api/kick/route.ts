import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json({ error: 'Kanal adı gerekli' }, { status: 400 });
  }

  const clean = channel.trim().toLowerCase();

  // 1. Kick Webhook & Public API resolver
  try {
    const res = await fetch(`https://kick.com/api/v1/channels/${clean}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      },
      next: { revalidate: 15 },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        id: data?.id || data?.chatroom?.channel_id,
        slug: data?.slug || clean,
        username: data?.user?.username || clean,
        followersCount: data?.followersCount || data?.followers_count || 0,
        chatroomId: data?.chatroom?.id,
        livestream: data?.livestream || null,
        subscriberBadges: data?.subscriber_badges || [],
      });
    }
  } catch (e) {}

  // 2. Fallback: İstemciye bağlanması için temel veri
  return NextResponse.json({
    id: clean,
    slug: clean,
    username: clean,
    chatroomId: null,
    livestream: null,
    isFallback: true,
  });
}
