"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function WidgetContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const channel = searchParams.get("channel") || "itsfatih";
  const format = searchParams.get("format") || "24";

  const [time, setTime] = useState("");
  const [viewers, setViewers] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("tr-TR", {
          hour12: format === "12",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [format]);

  useEffect(() => {
    if (slug === "kick-viewers") {
      setViewers(Math.floor(Math.random() * 20) + 10);
      const interval = setInterval(() => {
        setViewers((prev) => Math.max(1, prev + (Math.floor(Math.random() * 3) - 1)));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slug, channel]);

  return (
    <div className="bg-transparent min-h-screen flex items-center justify-start p-4 font-sans select-none overflow-hidden">
      {slug === "irl-hud" && (
        <div className="flex items-center gap-3 bg-black/75 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-white shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-black tracking-widest text-red-400">LIVE</span>
          </div>
          <div className="h-4 w-[1px] bg-white/20" />
          <span className="text-sm font-semibold font-mono tracking-wide">{time}</span>
        </div>
      )}

      {slug === "kick-viewers" && (
        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#53FC18]/30 text-white shadow-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-[#53FC18] animate-pulse" />
          <span className="text-xs font-mono font-bold text-neutral-300 uppercase">{channel}</span>
          <span className="text-sm font-black text-[#53FC18] font-mono">{viewers}</span>
        </div>
      )}

      {slug === "clock" && (
        <div className="bg-black/75 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/10 text-white shadow-2xl">
          <span className="text-xl font-black font-mono tracking-wider">{time}</span>
        </div>
      )}
    </div>
  );
}

export default function DynamicWidgetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <Suspense fallback={null}>
      <WidgetContent slug={slug} />
    </Suspense>
  );
}