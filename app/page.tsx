import Link from 'next/link';

export default function Home() {
  const widgets = [
    {
      id: 'irl-hud',
      title: 'IRL Stream HUD',
      desc: 'Hava durumu, şarj, anlık konum, hız ve izleyici sayacı.',
      badge: 'Popüler',
      href: '/builder/irl-hud',
      color: 'from-emerald-500/20 to-lime-500/10 border-lime-500/30 text-lime-400',
    },
    {
      id: 'sub-goal',
      title: 'Sub & Follow Goal',
      desc: 'Canlı abonelik ve takipçi hedef çubuğu animasyonları.',
      badge: 'Canlı',
      href: '/builder/sub-goal',
      color: 'from-blue-500/20 to-cyan-500/10 border-cyan-500/30 text-cyan-400',
    },
    {
      id: 'events',
      title: 'Son Olaylar (Stream Labels)',
      desc: 'Son takipçi, abone, host ve hediye sub rozetleri (1-3-5 limitli).',
      badge: 'Yeni',
      href: '/builder/events',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full space-y-12">
        <header className="space-y-4 text-center md:text-left">
          <div className="inline-block bg-[#53FC18]/10 border border-[#53FC18]/30 px-3 py-1 rounded-full text-[#53FC18] text-xs font-bold uppercase tracking-wider">
            Kick Canlı Yayın Araçları
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            StreamWidget<span className="text-[#53FC18]">.live</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-2xl">
            Kick yayıncıları için yüksek performanslı, modern ve tamamen ücretsiz OBS yayın widgetları.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {widgets.map((w) => (
            <Link
              key={w.id}
              href={w.href}
              className={`p-6 rounded-2xl border bg-gradient-to-b ${w.color} backdrop-blur-md transition-all hover:scale-[1.02] hover:border-white/40 flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-white/10 text-white">
                    {w.badge}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{w.title}</h2>
                <p className="text-xs text-white/70 leading-relaxed">{w.desc}</p>
              </div>
              <div className="text-xs font-bold flex items-center gap-1.5 pt-2">
                Oluşturucuya Git <span>→</span>
              </div>
            </Link>
          ))}
        </section>
      </div>

      <footer className="text-center text-white/40 text-xs py-6 border-t border-white/10 mt-12">
        StreamWidget.live &copy; {new Date().getFullYear()} — Tüm Hakları Saklıdır.
      </footer>
    </main>
  );
}
