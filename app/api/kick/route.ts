import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel")?.toLowerCase().trim();

  if (!channel) {
    return NextResponse.json({ error: "Channel name required" }, { status: 400 });
  }

  try {
    // 1. Kick v1 API üzerinden sorgula
    const res = await fetch(`https://kick.com/api/v1/channels/${channel}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const chatroomId = data?.chatroom?.id || data?.id;
      if (chatroomId) {
        return NextResponse.json({
          channel,
          chatroom_id: String(chatroomId),
          user_id: data?.user_id || data?.id,
        });
      }
    }

    // 2. Kick v2 API Alternatifi
    const resV2 = await fetch(`https://kick.com/api/v2/channels/${channel}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (resV2.ok) {
      const dataV2 = await resV2.json();
      const chatroomId = dataV2?.chatroom?.id || dataV2?.id;
      if (chatroomId) {
        return NextResponse.json({
          channel,
          chatroom_id: String(chatroomId),
        });
      }
    }

    return NextResponse.json(
      { error: "Channel chatroom not found" },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to resolve kick channel", details: err.message },
      { status: 500 }
    );
  }
}
