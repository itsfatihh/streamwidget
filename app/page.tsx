"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [lang, setLang] = useState<"tr" | "en">("tr");

  const content = {
    tr: {
      badge: "Yayınlarınızı Üst Seviyeye Taşıyın",
      desc: "OBS, Streamlabs ve Kick için modern, şeffaf ve gerçek zamanlı canlı yayın widget katmanları.",
      btn: "Özelleştirici →",
      widgets: [
        {
          id: "viewer-count",
          title: "Kick Canlı İzleyici",
          desc: "Kick kanalınızın anlık izleyici sayısını gösteren şeffaf neon rozet.",
          href: "/builder/viewer-count",
        },
        {
          id: "chat-box",
          title: "Kick Canlı Sohbet (Chat Box)",
          desc: "OBS için ultra hafif, resmi Kick rozetleri ve ifadeleriyle canlı sohbet.",
          href: "/builder/chat-box",
        },
        {
          id: "follower-goal",
          title: "Takipçi Hedefi (Follower Goal)",
          desc: "Kick takipçi sayısını otomatik çeken ve yeni takip geldikçe canlı ilerleyen çubuk.",
          href: "/builder/follower-goal",
        },
        {
          id: "sub-goal",
          title: "Abone Hedefi (Sub Goal)",
          desc: "Kick yeni abonelik ve hediye aboneliklerde canlı ilerleyen hedef çubuğu.",
          href: "/builder/sub-goal",
        },
        {
          id: "irl-hud",
          title: "IRL Canlı Yayın HUD",
          desc: "Dış mekan yayınları için modüler LIVE rozeti, saat, konum, hava durumu ve canlı pil durumu.",
          href: "/builder/irl-hud",
        },
        {
          id: "clock",
          title: "Minimal Dijital Saat",
          desc: "Şık ve cam efektli ekran üzeri dijital saat katmanı.",
          href: "/builder/clock",
        },
        
      ],
    },
    en: {
      badge: "Level Up Your Streams",
      desc: "Modern, transparent and real-time live stream widgets for OBS, Streamlabs and Kick.",
      btn: "Customize →",
      widgets: [
        {
          id: "viewer-count",
          title: "Kick Live Viewers",
          desc: "Transparent neon badge showing real-time Kick viewer count.",
          href: "/builder/viewer-count",
        },
        {
          id: "chat-box",
          title: "Kick Live Chat Box",
          desc: "Ultra lightweight chat overlay with official Kick badges and emotes.",
          href: "/builder/chat-box",
        },
        {
          id: "follower-goal",
          title: "Follower Goal",
          desc: "Real-time progress bar pulling follower count automatically.",
          href: "/builder/follower-goal",
        },
        {
          id: "sub-goal",
          title: "Sub Goal",
          desc: "Live progress bar updating instantly with new subs and gifted subs.",
          href: "/builder/sub-goal",
        },
        {
          id: "irl-hud",
          title: "IRL Stream HUD",
          desc: "Modular LIVE badge, clock, location, weather and real-time battery status.",
          href: "/builder/irl-hud",
        },
        {
          id: "clock",
          title: "Minimal Digital Clock",
          desc: "Sleek glassmorphic digital clock overlay for streams.",
          href: "/builder/clock",
        },
        
      ],
    },
  };

  const t = content[lang];

  return (
    <main className="min-h-screen bg-[#090a0f] text-white p-6 md:p-12 font-sans flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#53FC18] animate-pulse"></span>
            <span className="font-extrabold tracking-wider text-sm">STREAMWIDGET</span>
          </div>

          <button
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            className="flex items-center gap-2 bg-[#12141c] hover:bg-[#1a1e2b] border border-white/5 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
          >
            <span>{lang === "tr" ? "🇹🇷 TR" : "🇬🇧 EN"}</span>
            <span className="text-white/40 text-[10px]">▼</span>
          </button>
        </header>

        <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {t.badge}
          </h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed">
            {t.desc}
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.widgets.map((w) => (
            <div
              key={w.id}
              className="bg-[#0f1118] border border-white/5 hover:border-white/15 p-6 rounded-2xl flex flex-col justify-between space-y-6 transition-all duration-200"
            >
              <div className="space-y-2.5">
                <h2 className="text-base font-bold text-white">{w.title}</h2>
                <p className="text-xs text-white/45 leading-relaxed">{w.desc}</p>
              </div>
              <div className="flex justify-end">
                <Link
                  href={w.href}
                  className="bg-[#161822] hover:bg-[#1e2230] border border-white/5 text-white/80 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {t.btn}
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>

      <footer className="text-center text-white/30 text-xs py-8 border-t border-white/5 mt-16">
        StreamWidget &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
