'use client';

import { useState, useEffect } from 'react';

export default function ClockWidget() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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
