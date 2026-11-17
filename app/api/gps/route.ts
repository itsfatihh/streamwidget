import { NextResponse } from 'next/server';

// Global bellek deposu (process içi, geçici).
// NOT: Vercel serverless ortamında her instance kendi belleğini tutar; kalıcı
// ve instance'lar arası tutarlı GPS için ileride Upstash Redis / Vercel KV
// eklenmelidir (future work, şu an uygulanmadı — kullanıcı DB istemedi).
declare global {
  var __STREAMWIDGET_GPS_STORE__: Record<string, { lat: number; lng: number; speed: number; heading: number; updatedAt: number }> | undefined;
}

if (!global.__STREAMWIDGET_GPS_STORE__) {
  global.__STREAMWIDGET_GPS_STORE__ = {};
}

const store = global.__STREAMWIDGET_GPS_STORE__;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const key = (body.channel || body.session || 'itsfatih').toLowerCase().trim();

    store[key] = {
      lat: Number(body.lat || body.latitude || 0),
      lng: Number(body.lng || body.longitude || 0),
      speed: Number(body.speed || 0),
      heading: Number(body.heading || 0),
      updatedAt: Date.now(),
    };

    return NextResponse.json({ success: true, key, data: store[key] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = (searchParams.get('channel') || searchParams.get('session') || 'itsfatih').toLowerCase().trim();

  const data = store[key];
  if (!data) {
    // Henüz veri yok: KOORDİNAT DÖNDÜRME. Eskiden Mannheim (49.4875, 8.4660)
    // gibi gerçek görünen sahte bir konum dönüyordu ve MiniMap bunu canlı konum
    // sanıp yayında yanlış yer gösteriyordu. Artık sadece 'waiting' durumu döner;
    // MiniMap koordinat gelmediği sürece "GPS bekleniyor" rozetinde kalır.
    return NextResponse.json({
      lat: null,
      lng: null,
      lon: null,
      speed: 0,
      heading: 0,
      status: 'waiting',
    });
  }

  return NextResponse.json({
    ...data,
    // MiniMap `data.lon` okur, store `lng` tutar: ikisini de aynı değerle ver.
    lon: data.lng,
    status: Date.now() - data.updatedAt < 10000 ? 'live' : 'stale',
  });
}
