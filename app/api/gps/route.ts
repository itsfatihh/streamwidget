import { NextRequest, NextResponse } from 'next/server';

// Oturum bazlı bellek içi GPS saklama (In-memory cache)
const gpsStore = new Map<string, {
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: number;
}>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session, lat, lng, speed = 0, heading = 0 } = body;

    if (!session || lat === undefined || lng === undefined) {
      return NextResponse.json({ error: 'Eksik veri' }, { status: 400 });
    }

    gpsStore.set(session.toLowerCase().trim(), {
      lat: Number(lat),
      lng: Number(lng),
      speed: Number(speed),
      heading: Number(heading),
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Geçersiz veri' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const session = searchParams.get('session');

  if (!session) {
    return NextResponse.json({ error: 'Session gerekli' }, { status: 400 });
  }

  const data = gpsStore.get(session.toLowerCase().trim());
  if (!data) {
    return NextResponse.json({ active: false });
  }

  return NextResponse.json({ active: true, ...data });
}
