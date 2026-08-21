'use client';

import { use, useEffect, useState } from "react";

function FollowerGoalWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || "itsfatih").toLowerCase().trim();
  const target = parseInt(searchParams.target || "1000", 10);
  const accent = searchParams.accent || "#53FC18";
  const [current, setCurrent] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/kick?channel=" + encodeURIComponent(channel), { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.followers_count === "number") {
            setCurrent(data.followers_count);
            setLoaded(true);
            return;
          }
        }
      } catch (e) {}

      // Fallback: dogrudan Kick API
      try {
        const resDirect = await fetch("https://kick.com/api/v1/channels/" + encodeURIComponent(channel));
        if (resDirect.ok) {
          const d = await resDirect.json();
          if (d && typeof d.followers_count === "number") {
            setCurrent(d.followers_count);
            setLoaded(true);
          }
        }
      } catch (err) {}
    };

    fetchStats();
    const interval = setInterval(fetchStats, 8000);
    return () => clearInterval(interval);
  }, [channel]);

  const percentage = Math.min(100, Math.max(0, Math.round((current / target) * 100)));

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent p-6 select-none font-sans">
      <div className="w-full max-w-md bg-[#0a0d14]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center justify-between text-xs font-black tracking-wider uppercase">
          <span className="text-white/90 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
            TAKİPÇİ HEDEFİ
          </span>
          <span className="text-white font-mono">
            {loaded ? current.toLocaleString() : "..."} / {target.toLocaleString()} ({percentage}%)
          </span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: percentage + "%", backgroundColor: accent, boxShadow: "0 0 12px " + accent }}
          />
        </div>
      </div>
    </div>
  );
}

function SubGoalWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || "itsfatih").toLowerCase().trim();
  const target = parseInt(searchParams.target || "50", 10);
  const accent = searchParams.accent || "#53FC18";
  const [current, setCurrent] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/kick?channel=" + encodeURIComponent(channel), { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.subscribers_count === "number") {
            setCurrent(data.subscribers_count);
            setLoaded(true);
            return;
          }
        }
      } catch (e) {}
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [channel]);

  const percentage = Math.min(100, Math.max(0, Math.round((current / target) * 100)));

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent p-6 select-none font-sans">
      <div className="w-full max-w-md bg-[#0a0d14]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center justify-between text-xs font-black tracking-wider uppercase">
          <span className="text-white/90 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
            ABONE HEDEFİ
          </span>
          <span className="text-white font-mono">
            {loaded ? current.toLocaleString() : "..."} / {target.toLocaleString()} ({percentage}%)
          </span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: percentage + "%", backgroundColor: accent, boxShadow: "0 0 12px " + accent }}
          />
        </div>
      </div>
    </div>
  );
}

function KickViewersWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || "itsfatih").toLowerCase().trim();
  const [viewers, setViewers] = useState<number>(0);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("https://kick.com/api/v2/channels/" + channel + "/livestream");
        if (res.ok) {
          const data = await res.json();
          if (data && data.data) {
            setViewers(data.data.viewers || 0);
            setIsLive(true);
            return;
          }
        }
        setIsLive(false);
      } catch (e) {
        setIsLive(false);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [channel]);

  return (
    <div className="w-screen h-screen flex items-start justify-start p-6 bg-transparent select-none">
      <div className="bg-[#0a0d14]/90 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-2 shadow-2xl flex items-center gap-2.5">
        <span className={"w-2.5 h-2.5 rounded-full " + (isLive ? "bg-[#53FC18] animate-pulse" : "bg-white/30")} />
        <span className="text-xs font-black uppercase tracking-wider text-white">
          {isLive ? viewers.toLocaleString() + " İZLEYİCİ" : "ÇEVRİMDIŞI"}
        </span>
      </div>
    </div>
  );
}

function KickChatWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const channel = (searchParams.channel || "itsfatih").toLowerCase().trim();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    const startSocket = async () => {
      ws = new WebSocket("wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false");
      ws.onopen = () => {
        ws?.send(JSON.stringify({
          event: "pusher:subscribe",
          data: { auth: "", channel: "chatrooms.1917711.v2" }
        }));
      };
      ws.onmessage = (ev) => {
        try {
          const parsed = JSON.parse(ev.data);
          if (parsed.event && parsed.event.includes("ChatMessageEvent")) {
            const d = typeof parsed.data === "string" ? JSON.parse(parsed.data) : parsed.data;
            setMessages((prev) => [...prev.slice(-20), {
              id: d.id || Date.now(),
              user: d.sender?.username || "Kullanici",
              content: d.content || "",
              color: d.sender?.identity?.color || "#53FC18"
            }]);
          }
        } catch (e) {}
      };
    };
    startSocket();
    return () => { if (ws) ws.close(); };
  }, [channel]);

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-6 bg-transparent select-none space-y-2">
      {messages.map((m) => (
        <div key={m.id} className="bg-[#0a0d14]/85 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-xs shadow-lg max-w-lg">
          <span className="font-black mr-2 uppercase" style={{ color: m.color }}>{m.user}:</span>
          <span className="text-white/90 font-medium">{m.content}</span>
        </div>
      ))}
    </div>
  );
}

function IrlHudWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const city = searchParams.city || "Istanbul";
  const accent = searchParams.accent || "#53FC18";
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen flex items-start justify-start p-6 bg-transparent select-none">
      <div className="bg-[#0a0d14]/90 backdrop-blur-xl border border-white/15 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 text-xs font-black">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
          <span className="text-white uppercase tracking-wider">{city}</span>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <span className="text-white/80 font-mono tracking-widest">{time}</span>
      </div>
    </div>
  );
}

function MiniMapWidget({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const shape = searchParams.shape || "circle";
  const accent = searchParams.accent || "#53FC18";

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent p-6 select-none">
      <div
        className={"w-64 h-64 relative bg-[#0a0d14]/95 border-2 shadow-2xl overflow-hidden flex flex-col items-center justify-between p-4 " + (shape === "circle" ? "rounded-full" : "rounded-3xl")}
        style={{ borderColor: accent, boxShadow: "0 0 30px " + accent + "33" }}
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-white/50 bg-black/40 px-3 py-1 rounded-full border border-white/10 mt-2">
          GPS LIVE
        </span>
        <div className="w-4 h-4 rounded-full flex items-center justify-center relative">
          <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
          <div className="w-6 h-6 rounded-full animate-ping absolute" style={{ backgroundColor: accent, opacity: 0.5 }} />
        </div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono font-bold text-white mb-2">
          0 KM/H
        </div>
      </div>
    </div>
  );
}

function ClockWidget() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent select-none font-mono">
      <div className="bg-[#0a0d14]/90 backdrop-blur-xl border border-white/15 rounded-3xl px-8 py-4 shadow-2xl text-4xl font-black text-white tracking-widest">
        {time}
      </div>
    </div>
  );
}

export default function WidgetPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = use(params);
  const sp = use(searchParams);

  if (slug === "follower-goal") {
    return <FollowerGoalWidget searchParams={sp} />;
  }
  if (slug === "sub-goal") {
    return <SubGoalWidget searchParams={sp} />;
  }
  if (slug === "kick-viewers") {
    return <KickViewersWidget searchParams={sp} />;
  }
  if (slug === "kick-chat") {
    return <KickChatWidget searchParams={sp} />;
  }
  if (slug === "irl-hud") {
    return <IrlHudWidget searchParams={sp} />;
  }
  if (slug === "mini-map") {
    return <MiniMapWidget searchParams={sp} />;
  }
  if (slug === "clock") {
    return <ClockWidget />;
  }

  return <MiniMapWidget searchParams={sp} />;
}
