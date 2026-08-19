import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json({ error: 'Kanal adı gerekli' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${channel.toLowerCase()}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      // v1 fallback
      const fallbackRes = await fetch(`https://kick.com/api/v1/channels/${channel.toLowerCase()}`);
      if (fallbackRes.ok) {
        const fbData = await fallbackRes.json();
        return NextResponse.json({
          chatroomId: fbData?.chatroom?.id,
          livestream: fbData?.livestream,
          subscriberBadges: fbData?.subscriber_badges || [],
        });
      }
      return NextResponse.json({ chatroomId: null, subscriberBadges: [] });
    }

    const data = await res.json();
    return NextResponse.json({
      chatroomId: data?.chatroom?.id,
      livestream: data?.livestream,
      subscriberBadges: data?.subscriber_badges || [],
    });
  } catch {
    return NextResponse.json({ chatroomId: null, subscriberBadges: [] });
  }
}
