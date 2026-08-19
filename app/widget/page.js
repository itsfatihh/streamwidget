"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Clock } from "lucide-react";

export default function WidgetPage() {
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("Canlı");

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
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.city) {
          setLocation(`${data.city}, ${data.country_name || ""}`);
        }
      })
      .catch(() => {
        setLocation("Canlı Yayın");
      });
  }, []);

  return (
    <main style={{ minHeight: "100vh", width: "100vw", backgroundColor: "transparent", display: "flex", padding: "24px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "rgba(0,0,0,0.85)", color: "#fff", padding: "10px 16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "8px", padding: "4px 8px", color: "#f87171", fontSize: "12px", fontWeight: "bold" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444" }}></span>
          LIVE
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", borderLeft: "1px solid rgba(255,255,255,0.15)", paddingLeft: "12px" }}>
          <MapPin style={{ width: "16px", height: "16px", color: "#34d399" }} />
          <span>{location}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#d1d5db", borderLeft: "1px solid rgba(255,255,255,0.15)", paddingLeft: "12px" }}>
          <Clock style={{ width: "16px", height: "16px", color: "#38bdf8" }} />
          <span style={{ fontFamily: "monospace" }}>{time || "--:--:--"}</span>
        </div>
      </div>
    </main>
  );
}
