import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const manualLocation = searchParams.get('location');

  let city = '';
  let lat: number | null = null;
  let lon: number | null = null;

  try {
    // 1. Manuel şehir girilmişse koordinatlarını bul
    if (manualLocation && manualLocation.toLowerCase() !== 'auto') {
      city = manualLocation;
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(manualLocation)}&count=1&language=tr&format=json`
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData?.results?.[0]) {
          lat = geoData.results[0].latitude;
          lon = geoData.results[0].longitude;
          city = geoData.results[0].name || manualLocation;
        }
      }
    } else {
      // 2. Otomatik: Vercel Edge Coğrafi Başlıklarını Kullan
      const vercelCity = req.headers.get('x-vercel-ip-city');
      const vercelLat = req.headers.get('x-vercel-ip-latitude');
      const vercelLon = req.headers.get('x-vercel-ip-longitude');

      if (vercelCity && vercelLat && vercelLon) {
        city = decodeURIComponent(vercelCity);
        lat = parseFloat(vercelLat);
        lon = parseFloat(vercelLon);
      } else {
        // Fallback: ip-api.com
        const ipRes = await fetch('http://ip-api.com/json/?fields=status,city,lat,lon');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.status === 'success') {
            city = ipData.city;
            lat = ipData.lat;
            lon = ipData.lon;
          }
        }
      }
    }

    // 3. Hava Durumunu Çek
    let temperature = null;
    let weatherCode = 0;

    if (lat !== null && lon !== null) {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`,
        { next: { revalidate: 300 } }
      );
      if (weatherRes.ok) {
        const wData = await weatherRes.json();
        if (wData?.current) {
          temperature = `${Math.round(wData.current.temperature_2m)}°C`;
          weatherCode = wData.current.weather_code;
        }
      }
    }

    return NextResponse.json({
      city: city || 'Canlı Konum',
      temperature: temperature || '24°C',
      weatherCode,
    });
  } catch (error) {
    return NextResponse.json({
      city: manualLocation && manualLocation !== 'auto' ? manualLocation : 'Canlı Konum',
      temperature: '24°C',
      weatherCode: 0,
    });
  }
}
