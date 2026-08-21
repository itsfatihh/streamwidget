import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Kullanıcının gerçek IP'sini yakala
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    let clientIp = forwarded ? forwarded.split(',')[0].trim() : realIp || '';

    // Localhost testi için IP boşsa veya yerelse boş geç (servis otomatik kendi IP'sini alır)
    if (clientIp === '::1' || clientIp === '127.0.0.1') {
      clientIp = '';
    }

    // 2. IP üzerinden Konum ve Koordinat Bul (ip-api.com)
    const geoUrl = clientIp ? `http://ip-api.com/json/${clientIp}` : 'http://ip-api.com/json/';
    const geoRes = await fetch(geoUrl, { cache: 'no-store' });
    const geo = await geoRes.json();

    if (geo.status !== 'success') {
      return NextResponse.json({
        city: 'Mevcut Konum',
        country: '',
        temp: 20,
        icon: '🌤️'
      });
    }

    const { lat, lon, city, countryCode } = geo;

    // 3. Open-Meteo üzerinden canlı sıcaklık ve hava kodu çek
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      { cache: 'no-store' }
    );
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    // WMO Hava Durumu Kodları -> Emoji
    const getWmoIcon = (code: number) => {
      if (code === 0) return '☀️';
      if (code === 1 || code === 2) return '🌤️';
      if (code === 3) return '☁️';
      if ([45, 48].includes(code)) return '🌫️';
      if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
      if ([71, 73, 75, 85, 86].includes(code)) return '❄️';
      if ([95, 96, 99].includes(code)) return '⛈️';
      return '🌤️';
    };

    return NextResponse.json({
      city: city || 'Bilinmeyen Şehir',
      country: countryCode || '',
      temp: Math.round(current?.temperature ?? 20),
      icon: getWmoIcon(current?.weathercode ?? 1),
    });
  } catch (error) {
    return NextResponse.json({
      city: 'Konum Alınamadı',
      country: '',
      temp: 20,
      icon: '🌤️'
    }, { status: 200 });
  }
}
