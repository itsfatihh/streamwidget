import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = (searchParams.get("channel") || "itsfatih").toLowerCase().trim();

  try {
    const res = await fetch("https://kick.com/api/v2/channels/" + encodeURIComponent(channel) + "/chatroom", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        success: true,
        chatroom_id: data.id || (data.data && data.data.id),
      });
    }

    const v1Res = await fetch("https://kick.com/api/v1/channels/" + encodeURIComponent(channel), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (v1Res.ok) {
      const dataV1 = await v1Res.json();
      return NextResponse.json({
        success: true,
        chatroom_id: dataV1.chatroom?.id || dataV1.chatroom_id,
        followers_count: dataV1.followers_count || dataV1.followersCount || 0,
        subscribers_count: dataV1.subscribers_count || dataV1.subscriber_badges?.length || 0,
      });
    }

    return NextResponse.json({ success: false, error: "Channel not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
