import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = (searchParams.get("channel") || "itsfatih").toLowerCase().trim();

  try {
    const res = await fetch("https://kick.com/api/v2/channels/" + encodeURIComponent(channel) + "/messages", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const messages = (data.data?.messages || data.messages || []).map((m: any) => ({
        id: String(m.id || Math.random()),
        user: m.sender?.username || "Kullanici",
        content: m.content || "",
        color: m.sender?.identity?.color || "#53FC18",
        createdAt: m.created_at ? new Date(m.created_at).getTime() : Date.now(),
      }));

      return NextResponse.json({ success: true, messages });
    }

    return NextResponse.json({ success: false, messages: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, messages: [], error: err.message }, { status: 500 });
  }
}
