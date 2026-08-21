import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = (searchParams.get('channel') || 'itsfatih').toLowerCase().trim();

  try {
    // 1. Doğrudan chatroom API'si
    const res = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(channel)}/chatroom`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        chatroom_id: data.id || '1917711',
        pinned: data.pinned_message || null,
      });
    }

    // 2. Fallback: v1 channel API
    const v1Res = await fetch(`https://kick.com/api/v1/channels/${encodeURIComponent(channel)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (v1Res.ok) {
      const v1Data = await v1Res.json();
      return NextResponse.json({
        chatroom_id: v1Data.chatroom?.id || '1917711',
        pinned: v1Data.pinned_message || (v1Data.chatroom && v1Data.chatroom.pinned_message) || null,
      });
    }

    return NextResponse.json({ chatroom_id: '1917711', pinned: null });
  } catch (err: any) {
    return NextResponse.json({ chatroom_id: '1917711', pinned: null, error: err.message });
  }
}
