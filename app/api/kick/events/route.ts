import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json({ error: 'Kanal adı gerekli' }, { status: 400 });
  }

  try {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'application/json',
    };

    // 1. Kanal genel bilgileri ve son veriler
    const chanRes = await fetch(`https://kick.com/api/v2/channels/${channel}`, {
      headers,
      next: { revalidate: 15 },
    });
    const chanData = await chanRes.json();

    // 2. Kanal liderlik tablosu (Hediye / Abone hareketleri)
    const leaderRes = await fetch(
      `https://kick.com/api/v2/channels/${channel}/leaderboards`,
      { headers, next: { revalidate: 15 } }
    );
    const leaderData = leaderRes.ok ? await leaderRes.json() : null;

    const events: Array<{
      id: string;
      type: 'follower' | 'subscriber' | 'gifted';
      username: string;
      detail: string;
      time: string;
    }> = [];

    // En çok hediye edenler / son hediye edenler
    if (leaderData?.gifts && Array.isArray(leaderData.gifts)) {
      leaderData.gifts.slice(0, 3).forEach((item: any, idx: number) => {
        if (item.username) {
          events.push({
            id: `gift-${idx}-${item.username}`,
            type: 'gifted',
            username: item.username,
            detail: `${item.quantity || 1} Hediye`,
            time: 'Lider Tablosu',
          });
        }
      });
    }

    // Son takipçi / toplam takipçi bilgisi
    if (chanData?.followers_count !== undefined) {
      events.push({
        id: `followers-total`,
        type: 'follower',
        username: `${chanData.followers_count.toLocaleString('tr-TR')} Takipçi`,
        detail: 'Toplam',
        time: 'Canlı',
      });
    }

    return NextResponse.json({
      success: true,
      channel: chanData?.user?.username || channel,
      events,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Veri çekilemedi' },
      { status: 500 }
    );
  }
}
