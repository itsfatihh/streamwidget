import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get('channel') || 'itsfatih';

  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(channel)}/chatroom`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 0 },
      cache: 'no-store',
    });

    if (!res.ok) {
      // Kanal detayından chatroom_id denemesi
      const channelRes = await fetch(`https://kick.com/api/v1/channels/${encodeURIComponent(channel)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      if (channelRes.ok) {
        const cData = await channelRes.json();
        return NextResponse.json({
          chatroom_id: cData.chatroom?.id,
          pinned_message: cData.pinned_message || null,
        });
      }
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json({
      chatroom_id: data.id,
      pinned_message: data.pinned_message || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
