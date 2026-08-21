import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get('channel') || 'default';
  
  // Ortam değişkeni yoksa doğrudan App ID'yi kullan
  const clientId = process.env.SPOTIFY_CLIENT_ID || 'a5f826d0d1fe41bd9fcac0a4ff63f813';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.streamwidget.live';
  const redirectUri = `${baseUrl}/api/auth/spotify/callback`;

  const scope = 'user-read-currently-playing user-read-playback-state';
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
    scope
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(channel)}`;

  return NextResponse.redirect(spotifyAuthUrl);
}
