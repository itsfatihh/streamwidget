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
      const count =
        data.followers_count ??
        data.followersCount ??
        data.followers_count_str ??
        data.user?.followers_count ??
        0;

      return NextResponse.json({
        success: true,
        followers_count: Number(count),
        chatroom_id: data.chatroom?.id || data.id,
      });
    }

    // HTML Fallback: Sayfadan doğrudan follower sayısını regex ile çek
    const pageRes = await fetch("https://kick.com/" + encodeURIComponent(channel), { headers });
    if (pageRes.ok) {
      const html = await pageRes.text();
      const match = html.match(/"followers_count":(\d+)/) || html.match(/"followersCount":(\d+)/);
      if (match && match[1]) {
        return NextResponse.json({
          success: true,
          followers_count: parseInt(match[1], 10),
        });
      }
    }

    return NextResponse.json({ success: false, followers_count: 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, followers_count: 0, error: err.message });
  }
}
