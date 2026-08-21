import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = (searchParams.get("channel") || "itsfatih").toLowerCase().trim();

  try {
    const res = await fetch("https://kick.com/api/v2/channels/" + encodeURIComponent(channel) + "/chatroom", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        success: true,
        pinned: data.pinned_message || null,
      });
    }

    // Alternatif v1 endpoint
    const v1Res = await fetch("https://kick.com/api/v1/channels/" + encodeURIComponent(channel), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (v1Res.ok) {
      const v1Data = await v1Res.json();
      return NextResponse.json({
        success: true,
        pinned: v1Data.pinned_message || (v1Data.chatroom && v1Data.chatroom.pinned_message) || null,
      });
    }

    return NextResponse.json({ success: false, pinned: null, status: res.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, pinned: null, error: err.message });
  }
}
