import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json({ error: 'Kanal adı gerekli' }, { status: 400 });
  }

  const clean = channel.trim().toLowerCase();

  // 1. Kick API Proxy Resolver
  try {
    const res = await fetch(`https://kick-api.fynity.net/api/v1/channel/${clean}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        id: data?.id || data?.chatroom?.channel_id,
        chatroomId: data?.chatroom?.id || data?.chatroomId,
        slug: clean,
        username: data?.user?.username || clean,
        followersCount: data?.followers_count || data?.followersCount || 0,
      });
    }
  } catch (e) {}

  // 2. Alternatif Genel Proxy
  try {
    const res2 = await fetch(`https://kick-proxy.streamwidget.workers.dev/?channel=${clean}`, {
      next: { revalidate: 30 },
    });
    if (res2.ok) {
      const d = await res2.json();
      return NextResponse.json(d);
    }
  } catch (e) {}

  return NextResponse.json({
    id: null,
    chatroomId: null,
    slug: clean,
    error: 'Veri alinamadi',
  });
}
