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
    const pageRes = await fetch(`https://kick.com/${encodeURIComponent(channel)}`, { headers, cache: 'no-store' });
    const html = await pageRes.text();

    // Chatroom ID'yi kazı
    const chatroomMatch = html.match(/"chatroom"\s*:\s*\{\s*"id"\s*:\s*(\d+)/i) || 
                          html.match(/\\?\"chatroom_id\\?\"\s*:\s*(\d+)/i) ||
                          html.match(/chatrooms\.(\d+)\.v2/i);

    // Güncel Pusher App Key'i HTML içinden dinamik olarak kazı (20 karakterli hex anahtarı)
    const pusherKeyMatch = html.match(/pusher[_-]?key.*?([a-f0-9]{20})/i) || 
                           html.match(/"key"\s*:\s*"([a-f0-9]{20})"/i) ||
                           html.match(/VITE_PUSHER_APP_KEY.*?([a-f0-9]{20})/i);

    const pusherKey = pusherKeyMatch ? pusherKeyMatch[1] : 'eb1d5f28308142977d07'; // Bulamazsa fallback

    if (chatroomMatch && chatroomMatch[1]) {
      return NextResponse.json({
        chatroom: { id: Number(chatroomMatch[1]) },
        chatroom_id: Number(chatroomMatch[1]),
        pusher_key: pusherKey
      });
    }

    return NextResponse.json({ error: 'Kanal verileri bulunamadı, engellenmiş olabilir.' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Bağlantı hatası' }, { status: 500 });
  }
}
