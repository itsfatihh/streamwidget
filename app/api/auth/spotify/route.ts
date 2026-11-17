import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get('channel') || 'default';

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.streamwidget.live';

  // Kimlik bilgisi yoksa OAuth akışını başlatma; builder'a devre dışı bayrağıyla dön.
  if (!clientId) {
    return NextResponse.redirect(`${baseUrl}/builder/now-playing?error=spotify_disabled`);
  }

  const redirectUri = `${baseUrl}/api/auth/spotify/callback`;

  const scope = 'user-read-currently-playing user-read-playback-state';
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
    scope
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(channel)}`;

  return NextResponse.redirect(spotifyAuthUrl);
}
