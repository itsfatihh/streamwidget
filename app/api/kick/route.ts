import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// İlk eşleşen regex grubunu (sayı) güvenli şekilde döndürür; bulamazsa null.
function matchNumber(html: string, patterns: RegExp[]): number | null {
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m && m[1] !== undefined) {
      const n = Number(m[1]);
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}

// subscriber_badges JSON dizisini/objesini güvenli şekilde çıkarır; bulamazsa {}.
function matchSubscriberBadges(html: string): Record<string, unknown> {
  const patterns = [
    /\\?"subscriber_badges\\?"\s*:\s*(\[[\s\S]*?\])/i,
    /"subscriber_badges"\s*:\s*(\[[\s\S]*?\])/i,
    /\\?"subscriber_badges\\?"\s*:\s*(\{[\s\S]*?\})/i,
    /"subscriber_badges"\s*:\s*(\{[\s\S]*?\})/i,
  ];
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m && m[1]) {
      try {
        // Kaçışlı tırnakları (\") normal tırnağa çevirip ayrıştırmayı dene.
        const raw = m[1].replace(/\\"/g, '"');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed as Record<string, unknown>;
        }
      } catch {
        // Ayrıştırılamazsa sessizce geç, hiçbir zaman hata fırlatma.
      }
    }
  }
  return {};
}

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

    // Kanal/kullanıcı ID'si: gömülü JSON'daki farklı kalıpları dene.
    const channelId = matchNumber(html, [
      /"id"\s*:\s*(\d+)\s*,\s*\\?"user_id\\?"/i,
      /\\?"user_id\\?"\s*:\s*(\d+)/i,
      /"user_id"\s*:\s*(\d+)/i,
      /"channel"\s*:\s*\{\s*"id"\s*:\s*(\d+)/i,
    ]);

    // Takipçi sayısı (bulunamazsa 0).
    const followersCount = matchNumber(html, [
      /\\?"followers_count\\?"\s*:\s*(\d+)/i,
      /"followers_count"\s*:\s*(\d+)/i,
      /"followersCount"\s*:\s*(\d+)/i,
    ]) ?? 0;

    // Abone sayısı (bulunamazsa 0).
    const subscribersCount = matchNumber(html, [
      /\\?"subscriber(?:s)?_count\\?"\s*:\s*(\d+)/i,
      /"subscriber(?:s)?_count"\s*:\s*(\d+)/i,
      /"subscriberCount"\s*:\s*(\d+)/i,
    ]) ?? 0;

    const subscriberBadges = matchSubscriberBadges(html);

    // Canlı yayın durumu: gömülü JSON'da livestream alanı null değilse ve
    // is_live/isLive true ise yayın açıktır. Hiçbir zaman hata fırlatma.
    let isLive = false;
    if (/\\?"is_live\\?"\s*:\s*true/i.test(html) || /"is_live"\s*:\s*true/i.test(html) || /"isLive"\s*:\s*true/i.test(html)) {
      isLive = true;
    }
    // livestream objesi açıkça null ise yayın kapalıdır (is_live eşleşmesini ezer).
    if (/\\?"livestream\\?"\s*:\s*null/i.test(html) || /"livestream"\s*:\s*null/i.test(html)) {
      isLive = false;
    }

    // Anlık izleyici sayısı (bulunamazsa 0). Farklı anahtar kalıplarını dene.
    const viewers = matchNumber(html, [
      /\\?"viewer_count\\?"\s*:\s*(\d+)/i,
      /"viewer_count"\s*:\s*(\d+)/i,
      /\\?"viewers\\?"\s*:\s*(\d+)/i,
      /"viewers"\s*:\s*(\d+)/i,
      /"viewerCount"\s*:\s*(\d+)/i,
    ]) ?? 0;

    // Yayın başlangıç zamanı (ISO string). Bulunamazsa null.
    // created_at / start_time gibi farklı kalıpları dene.
    let liveStartedAt: string | null = null;
    const startPatterns = [
      /\\?"start_time\\?"\s*:\s*\\?"([^"\\]+)\\?"/i,
      /"start_time"\s*:\s*"([^"]+)"/i,
      /\\?"created_at\\?"\s*:\s*\\?"([^"\\]+)\\?"/i,
      /"created_at"\s*:\s*"([^"]+)"/i,
    ];
    for (const pattern of startPatterns) {
      const m = html.match(pattern);
      if (m && m[1]) {
        const parsed = Date.parse(m[1]);
        if (Number.isFinite(parsed)) {
          liveStartedAt = m[1];
          break;
        }
      }
    }
    // Yayın kapalıysa başlangıç zamanı anlamsızdır; null bırak.
    if (!isLive) liveStartedAt = null;

    // Tüm tüketicilerin okuduğu alanları içeren, geriye uyumlu tek JSON objesi.
    const payload: Record<string, unknown> = {
      // Geriye uyumluluk: chatroom bulunamazsa null döner (artık 404 değil).
      chatroom: chatroomMatch && chatroomMatch[1] ? { id: Number(chatroomMatch[1]) } : null,
      chatroom_id: chatroomMatch && chatroomMatch[1] ? Number(chatroomMatch[1]) : null,
      pusher_key: pusherKey,
      // Kanal/kullanıcı kimliği (FollowerGoal data.id || data.user_id yolunu okur).
      id: channelId,
      user_id: channelId,
      // Sayaçlar.
      followers_count: followersCount,
      subscribers_count: subscribersCount,
      subscriber_count: subscribersCount,
      subscriber_badges: subscriberBadges,
      // Canlı yayın durumu + izleyici + yayın başlangıç zamanı (KickViewers/StreamUptime okur).
      is_live: isLive,
      viewers: viewers,
      live_started_at: liveStartedAt,
    };

    return NextResponse.json(payload);
  } catch (error) {
    // Yalnızca tam getirme hatasında hata statüsü döndür.
    return NextResponse.json({ error: 'Bağlantı hatası' }, { status: 500 });
  }
}
