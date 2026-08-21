import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channel = (searchParams.get('channel') || 'itsfatih').trim().toLowerCase();

  try {
    // 1. Yol: Kick Web Sayfasından Chatroom ID & User ID scraping (Cloudflare Bypass)
    const pageRes = await fetch(`https://kick.com/${encodeURIComponent(channel)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      cache: 'no-store',
    });

    const html = await pageRes.text();

    // HTML içinden chatroom id yakalama
    const chatroomMatch = html.match(/"chatroom"\s*:\s*\{[^}]*"id"\s*:\s*(\d+)/i) || 
                          html.match(/"chatroom_id"\s*:\s*(\d+)/i) ||
                          html.match(/chatrooms\.(\d+)\.v2/i);

    // HTML içinden followers_count yakalama
    const followerMatch = html.match(/"followers_count"\s*:\s*(\d+)/i) ||
                          html.match(/"followersCount"\s*:\s*(\d+)/i);

    const channelIdMatch = html.match(/"channel_id"\s*:\s*(\d+)/i) ||
                           html.match(/"user_id"\s*:\s*(\d+)/i);

    if (chatroomMatch && chatroomMatch[1]) {
      return NextResponse.json({
        id: channelIdMatch ? Number(channelIdMatch[1]) : 0,
        chatroom: {
          id: Number(chatroomMatch[1]),
        },
        followers_count: followerMatch ? Number(followerMatch[1]) : 0,
      });
    }

    // 2. Yol: API v2 Doğrudan İstek Fallback
    const apiRes = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(channel)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Chatroom not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch channel' }, { status: 500 });
  }
}
