import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channel = (searchParams.get('channel') || 'itsfatih').trim().toLowerCase();

  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(channel)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      // V1 fallback endpoint dene
      const v1Res = await fetch(`https://kick.com/api/v1/channels/${encodeURIComponent(channel)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      const v1Data = await v1Res.json();
      return NextResponse.json(v1Data);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Kick channel not found' }, { status: 500 });
  }
}
