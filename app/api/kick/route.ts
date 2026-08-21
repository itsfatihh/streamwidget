import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = (searchParams.get("channel") || "itsfatih").toLowerCase().trim();

  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "application/json",
  };

  try {
    const res = await fetch("https://kick.com/api/v2/channels/" + encodeURIComponent(channel), {
      headers,
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const subBadges: Record<number, string> = {};
      if (Array.isArray(data.subscriber_badges)) {
        data.subscriber_badges.forEach((b: any) => {
          if (b.months !== undefined && b.badge_image?.url) {
            subBadges[b.months] = b.badge_image.url;
          }
        });
      }

      return NextResponse.json({
        success: true,
        chatroom_id: data.chatroom?.id || data.id,
        subscriber_badges: subBadges,
      });
    }

    const v1Res = await fetch("https://kick.com/api/v1/channels/" + encodeURIComponent(channel), {
      headers,
      cache: "no-store",
    });

    if (v1Res.ok) {
      const dataV1 = await v1Res.json();
      return NextResponse.json({
        success: true,
        chatroom_id: dataV1.chatroom?.id || dataV1.chatroom_id,
        subscriber_badges: {},
      });
    }

    return NextResponse.json({ success: false, error: "Channel not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
