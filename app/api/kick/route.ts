import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json({ error: 'Kanal adı gerekli' }, { status: 400 });
  }

  const cleanChannel = channel.trim().toLowerCase();

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    Accept: 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: `https://kick.com/${cleanChannel}`,
  };

  try {
    // 1. Öncelikle v1 API'sini dene (daha az Cloudflare filtresine takılır)
    let res = await fetch(`https://kick.com/api/v1/channels/${cleanChannel}`, {
      headers,
      next: { revalidate: 10 },
    });

    // 2. v1 başarısız olursa v2 API'sini dene
    if (!res.ok) {
      res = await fetch(`https://kick.com/api/v2/channels/${cleanChannel}`, {
        headers,
        next: { revalidate: 10 },
      });
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Kanal Kick üzerinde bulunamadı veya Cloudflare engeli oluştu', status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      id: data?.id || data?.chatroom?.channel_id,
      slug: data?.slug || cleanChannel,
      username: data?.user?.username || data?.slug || cleanChannel,
      followersCount: data?.followersCount || data?.followers_count || 0,
      chatroomId: data?.chatroom?.id,
      livestream: data?.livestream,
      subscriberBadges: data?.subscriber_badges || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Kick API bağlantı hatası' },
      { status: 500 }
    );
  }
}
