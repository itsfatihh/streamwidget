import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channel = (searchParams.get('channel') || 'itsfatih').trim().toLowerCase();

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/html, */*',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  try {
    // 1. Önce doğrudan API v2'yi dene
    const apiV2Res = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(channel)}`, { headers, cache: 'no-store' });
    if (apiV2Res.ok) {
      const data = await apiV2Res.json();
      return NextResponse.json(data);
    }

    // 2. Olmazsa API v1'i dene
    const apiV1Res = await fetch(`https://kick.com/api/v1/channels/${encodeURIComponent(channel)}`, { headers, cache: 'no-store' });
    if (apiV1Res.ok) {
      const data = await apiV1Res.json();
      return NextResponse.json(data);
    }

    // 3. Her ikisi de Cloudflare'a takılırsa HTML Scraping (Bypass)
    const pageRes = await fetch(`https://kick.com/${encodeURIComponent(channel)}`, { headers, cache: 'no-store' });
    const html = await pageRes.text();

    // Sadece kesin chatroom ID kalıplarını ara
    const chatroomMatch = html.match(/"chatroom"\s*:\s*\{\s*"id"\s*:\s*(\d+)/i) || 
                          html.match(/\\?\"chatroom_id\\?\"\s*:\s*(\d+)/i) ||
                          html.match(/chatrooms\.(\d+)\.v2/i);

    if (chatroomMatch && chatroomMatch[1]) {
      return NextResponse.json({
        chatroom: { id: Number(chatroomMatch[1]) },
        chatroom_id: Number(chatroomMatch[1])
      });
    }

    return NextResponse.json({ error: 'Chatroom ID bulunamadı, Cloudflare engeli olabilir.' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Bağlantı hatası' }, { status: 500 });
  }
}
