import { NextResponse } from 'next/server';

// Global bellek deposu
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
    return NextResponse.json({
      lat: 49.4875,
      lng: 8.4660,
      speed: 0,
      heading: 0,
      status: 'waiting',
    });
  }

  return NextResponse.json({
    ...data,
    status: Date.now() - data.updatedAt < 10000 ? 'live' : 'stale',
  });
}
