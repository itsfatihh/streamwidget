import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json({ error: 'Kanal adı gerekli' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${channel}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Kanal bulunamadı' }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      id: data?.id,
      slug: data?.slug,
      username: data?.user?.username,
      followersCount: data?.followers_count || 0,
      chatroomId: data?.chatroom?.id,
      livestream: data?.livestream,
      subscriberBadges: data?.subscriber_badges || [],
      recentGifts: data?.recent_gifts || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Kick API hatası' },
      { status: 500 }
    );
  }
}
