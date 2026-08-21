import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel")?.toLowerCase().trim();

  if (!channel) {
    return NextResponse.json({ error: "Channel name required" }, { status: 400 });
  }

  const defaultHeaders = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
  };

  try {
    // 1. Kick v2 API üzerinden kanal detaylarını çek
    const resV2 = await fetch(`https://kick.com/api/v2/channels/${channel}`, {
      headers: defaultHeaders,
      cache: "no-store",
    });

    if (resV2.ok) {
      const data = await resV2.json();
      const chatroomId = data?.chatroom?.id || data?.id;
      const followersCount =
        data?.followersCount ??
        data?.followers_count ??
        data?.user?.followers_count ??
        0;

      return NextResponse.json({
        channel,
        chatroom_id: chatroomId ? String(chatroomId) : null,
        followers_count: Number(followersCount),
        subscribers_count: Number(data?.subscribers_count || 0),
        user_id: data?.user_id || data?.id,
      });
    }

    // 2. Kick v1 API Alternatifi
    const resV1 = await fetch(`https://kick.com/api/v1/channels/${channel}`, {
      headers: defaultHeaders,
      cache: "no-store",
    });

    if (resV1.ok) {
      const data = await resV1.json();
      const chatroomId = data?.chatroom?.id || data?.id;
      const followersCount =
        data?.followersCount ??
        data?.followers_count ??
        data?.user?.followers_count ??
        0;

      return NextResponse.json({
        channel,
        chatroom_id: chatroomId ? String(chatroomId) : null,
        followers_count: Number(followersCount),
        subscribers_count: Number(data?.subscribers_count || 0),
        user_id: data?.user_id || data?.id,
      });
    }

    return NextResponse.json(
      { error: "Channel not found", channel, followers_count: 0 },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to resolve kick channel", details: err.message, followers_count: 0 },
      { status: 500 }
    );
  }
}
