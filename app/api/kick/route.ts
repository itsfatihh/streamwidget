import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = (searchParams.get("channel") || "itsfatih").toLowerCase().trim();

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://kick.com/",
    "Origin": "https://kick.com",
  };

  try {
    // 1. Chatroom API
    const chatroomRes = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(channel)}/chatroom`, {
      headers,
      cache: "no-store",
    });

    if (chatroomRes.ok) {
      const chatroomData = await chatroomRes.json();
      const id = chatroomData.id || chatroomData.data?.id;
      if (id) {
        return NextResponse.json({ success: true, chatroom_id: id });
      }
    }

    // 2. Channel v1 API (Yedek)
    const channelRes = await fetch(`https://kick.com/api/v1/channels/${encodeURIComponent(channel)}`, {
      headers,
      cache: "no-store",
    });

    if (channelRes.ok) {
      const channelData = await channelRes.json();
      const id = channelData.chatroom?.id || channelData.chatroom_id;
      return NextResponse.json({
        success: true,
        chatroom_id: id,
        followers_count: channelData.followers_count || 0,
        subscribers_count: channelData.subscribers_count || 0,
      });
    }

    return NextResponse.json({ success: false, error: "Channel not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
