import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const refreshToken = searchParams.get('refresh_token');

  if (!refreshToken) {
    return NextResponse.json({ isPlaying: false, message: 'No refresh token provided' }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    // 1. Yeni Access Token al
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      cache: 'no-store',
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.json({ isPlaying: false }, { status: 200 });
    }

    // 2. Currently Playing şarkıyı sorgula
    const playerRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: 'no-store',
    });

    if (playerRes.status === 204 || playerRes.status > 400) {
      return NextResponse.json({ isPlaying: false }, { status: 200 });
    }

    const songData = await playerRes.json();

    if (!songData || !songData.item) {
      return NextResponse.json({ isPlaying: false }, { status: 200 });
    }

    return NextResponse.json({
      isPlaying: songData.is_playing,
      title: songData.item.name,
      artist: songData.item.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
      album: songData.item.album?.name || '',
      albumArt: songData.item.album?.images?.[0]?.url || '',
      durationMs: songData.item.duration_ms,
      progressMs: songData.progress_ms,
    });
  } catch (error) {
    return NextResponse.json({ isPlaying: false, error: 'Failed to fetch song' }, { status: 500 });
  }
}
