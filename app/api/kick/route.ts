import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json({ error: 'Kanal adı gerekli' }, { status: 400 });
  }

  const clean = channel.trim().toLowerCase();

  try {
    // 1. Kick web sayfasını çek (HTML Cloudflare Bot kontrolünü doğrudan API'ye göre çok daha kolay geçer)
    const pageRes = await fetch(`https://kick.com/${clean}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 15 },
    });

    if (!pageRes.ok) {
      return NextResponse.json({ error: 'Kanal sayfası yüklenemedi' }, { status: pageRes.status });
    }

    const html = await pageRes.text();

    // 2. Chatroom ID ve Channel ID'yi HTML içerisindeki Next verisi veya Script JSON'dan Regex ile çıkar
    let chatroomId: string | null = null;
    let channelId: string | null = null;
    let followersCount = 0;

    // Chatroom ID arama kalıpları
    const chatroomMatch = html.match(/"chatroom"\s*:\s*\{\s*"id"\s*:\s*(\d+)/i) || 
                          html.match(/"chatroom_id"\s*:\s*(\d+)/i) ||
                          html.match(/"chatroomId"\s*:\s*(\d+)/i);
    if (chatroomMatch) {
      chatroomId = chatroomMatch[1];
    }

    // Channel ID arama kalıpları
    const channelMatch = html.match(/"channel_id"\s*:\s*(\d+)/i) ||
                         html.match(/"channelId"\s*:\s*(\d+)/i) ||
                         html.match(/channel\.(\d+)/);
    if (channelMatch) {
      channelId = channelMatch[1];
    }

    // Takipçi sayısı kalıpları
    const followersMatch = html.match(/"followersCount"\s*:\s*(\d+)/i) ||
                           html.match(/"followers_count"\s*:\s*(\d+)/i);
    if (followersMatch) {
      followersCount = parseInt(followersMatch[1], 10);
    }

    if (!chatroomId && !channelId) {
      // Alternatif genel fallback araması
      const idMatch = html.match(/id":(\d+).*?slug":"([^"]+)"/i);
      if (idMatch && idMatch[2].toLowerCase() === clean) {
        channelId = idMatch[1];
        chatroomId = idMatch[1];
      }
    }

    return NextResponse.json({
      id: channelId,
      chatroomId: chatroomId,
      slug: clean,
      username: clean,
      followersCount: followersCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
}
