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
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Accept': 'application/json',
      },
      next: { revalidate: 3 }, // 3 saniyede bir tazele
    });

    if (!res.ok) {
      return NextResponse.json({ viewers: 0, isLive: false }, { status: 200 });
    }

    const data = await res.json();
    const isLive = data?.livestream !== null;
    const viewers = data?.livestream?.viewer_count || 0;

    return NextResponse.json({ viewers, isLive });
  } catch (error) {
    return NextResponse.json({ viewers: 0, isLive: false }, { status: 200 });
  }
}
