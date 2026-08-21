import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const channel = searchParams.get('state') || 'default';

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.streamwidget.live';
  const redirectUri = `${baseUrl}/api/auth/spotify/callback`;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/builder/now-playing?error=auth_failed`);
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.refresh_token) {
      // Refresh token'ı builder sayfasına güvenli geri aktar
      return NextResponse.redirect(
        `${baseUrl}/builder/now-playing?channel=${encodeURIComponent(channel)}&refresh_token=${encodeURIComponent(
          tokenData.refresh_token
        )}&spotify_connected=true`
      );
    }
  } catch (err) {
    console.error('Spotify Auth Callback Error:', err);
  }

  return NextResponse.redirect(`${baseUrl}/builder/now-playing?error=token_exchange_failed`);
}
