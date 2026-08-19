"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Battery, Clock } from "lucide-react";

export default function WidgetPage() {
  const [time, setTime] = useState("");
  const [city, setCity] = useState("Yükleniyor...");
  const [country, setCountry] = useState("");
  const [batteryLevel, setBatteryLevel] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.city) setCity(data.city);
        if (data.country_name) setCountry(data.country_name);
      })
      .catch(() => {
        setCity("Canlı Yayın");
        setCountry("IRL");
      });
  }, []);

  return (
    <main className="min-h-screen w-full bg-transparent flex items-start justify-start p-6 select-none">
      <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 text-white px-4 py-2.5 rounded-2xl shadow-2xl font-sans">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-600/20 border border-red-500/40 rounded-lg text-red-400 text-xs font-semibold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          LIVE
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium border-l border-white/10 pl-3">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>{city}{country ? `, ${country}` : ""}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-zinc-300 border-l border-white/10 pl-3">
          <Clock className="w-4 h-4 text-sky-400" />
          <span className="font-mono">{time || "--:--:--"}</span>
        </div>
        {batteryLevel !== null && (
          <div className="flex items-center gap-1 text-xs text-zinc-400 border-l border-white/10 pl-3">
            <Battery className="w-3.5 h-3.5 text-amber-400" />
            <span>%{batteryLevel}</span>
          </div>
        )}
      </div>
    </main>
  );
}
