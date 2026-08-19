import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json({ error: 'Kanal adı gerekli' }, { status: 400 });
  }

  const clean = channel.trim().toLowerCase();

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    Origin: 'https://kick.com',
    Referer: `https://kick.com/${clean}`,
  };

  try {
    // 1. Kick v2 Channel
    let res = await fetch(`https://kick.com/api/v2/channels/${clean}`, {
      headers,
      next: { revalidate: 15 },
    });

    // 2. Yedek: Kick v1 Channel
    if (!res.ok) {
      res = await fetch(`https://kick.com/api/v1/channels/${clean}`, {
        headers,
        next: { revalidate: 15 },
      });
    }

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        id: data?.id || data?.chatroom?.channel_id,
        slug: data?.slug || clean,
        username: data?.user?.username || data?.slug || clean,
        followersCount: data?.followersCount || data?.followers_count || 0,
        chatroomId: data?.chatroom?.id,
        livestream: data?.livestream,
        subscriberBadges: data?.subscriber_badges || [],
      });
    }

    // 3. Kick chatroom doğrudan sorgusu
    const chatRes = await fetch(`https://kick.com/api/v2/channels/${clean}/chatroom`, {
      headers,
      next: { revalidate: 15 },
    });

    if (chatRes.ok) {
      const chatData = await chatRes.json();
      return NextResponse.json({
        id: chatData?.channel_id,
        slug: clean,
        username: clean,
        followersCount: 0,
        chatroomId: chatData?.id,
        livestream: null,
        subscriberBadges: [],
      });
    }

    return NextResponse.json({
      fallback: true,
      channel: clean,
      message: 'Client-side fallback required'
    });
  } catch (err: any) {
    return NextResponse.json({
      fallback: true,
      channel: clean,
      error: err?.message
    });
  }
}
