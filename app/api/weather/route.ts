import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let city = searchParams.get("city");
  let lat = searchParams.get("lat");
  let lon = searchParams.get("lon");

  try {
    // 1. Koordinat veya şehir yoksa IP üzerinden konum çöz
    if (!lat || !lon) {
      const ipRes = await fetch("https://ipapi.co/json/", { cache: "no-store" });
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        lat = String(ipData.latitude);
        lon = String(ipData.longitude);
        if (!city) city = ipData.city || "Konum";
      }
    }

    if (!lat || !lon) {
      return NextResponse.json({
        city: city || "İstanbul",
        temp: 24,
        condition: "Güneşli",
      });
    }

    // 2. Open-Meteo API ile canlı sıcaklık al
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      { cache: "no-store" }
    );

    let temp = 23;
    let weatherCode = 0;

    if (weatherRes.ok) {
      const wData = await weatherRes.json();
      if (wData.current_weather) {
        temp = Math.round(wData.current_weather.temperature);
        weatherCode = wData.current_weather.weathercode;
      }
    }

    return NextResponse.json({
      success: true,
      city: city || "İstanbul",
      temp,
      weatherCode,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      city: city || "İstanbul",
      temp: 23,
      error: err.message,
    });
  }
}
