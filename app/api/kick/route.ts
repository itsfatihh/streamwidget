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
      
      // Kanalın yüklediği abone rozetleri haritası
      if (Array.isArray(data.subscriber_badges)) {
        data.subscriber_badges.forEach((b: any) => {
          const months = b.months;
          const url = b.badge_image?.url || b.badge_image?.src || (b.badge_image?.id ? "https://files.kick.com/subscriber_badges/" + b.badge_image.id + "/fullsize" : null);
          if (months !== undefined && url) {
            subBadges[months] = url;
          }
        });
      }

      return NextResponse.json({
        success: true,
        chatroom_id: data.chatroom?.id || data.id,
        subscriber_badges: subBadges,
      });
    }

    return NextResponse.json({ success: false, error: "Channel not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
