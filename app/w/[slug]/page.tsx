import React from 'react';
import { notFound } from 'next/navigation';
import { WIDGETS_LIST } from '@/lib/widgets';
import IrlHudWidget from '@/components/widgets/IrlHud';
import MiniMapWidget from '@/components/widgets/MiniMap';
import FollowerGoalWidget from '@/components/widgets/FollowerGoal';
import SubGoalWidget from '@/components/widgets/SubGoal';
import ChatOverlayWidget from '@/components/widgets/ChatOverlay';
import SubCounterWidget from '@/components/widgets/SubCounter';
import NowPlayingWidget from '@/components/widgets/NowPlaying';
import QrTipWidget from '@/components/widgets/QrTip';
import KickViewersWidget from '@/components/widgets/KickViewers';
import StreamUptimeWidget from '@/components/widgets/StreamUptime';
import SocialBannerWidget from '@/components/widgets/SocialBanner';

export default async function WidgetRenderPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const parsedParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === 'string') {
      parsedParams[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      parsedParams[key] = value[0];
    }
  }

  // "Yakında" olarak işaretli widget'lar (now-playing, sub-counter, sub-goal)
  // gerçek veri üretemiyor. OBS'de 0'da takılı bir sayaç ya da sahte veri
  // göstermek yerine, şeffaf bir "Yakında" yer tutucu render ediyoruz.
  const widgetDef = WIDGETS_LIST.find((w) => w.id === slug);
  if (widgetDef?.comingSoon) {
    return (
      <div className="w-screen h-screen flex items-center justify-center p-4 bg-transparent select-none font-sans">
        <div className="bg-[#0b0e14]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center gap-3 max-w-sm">
          <span className="text-xl">🔧</span>
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-black uppercase tracking-widest text-amber-400">STREAMWIDGET</span>
            <span className="text-sm font-extrabold text-white">Yakında / Coming soon</span>
          </div>
        </div>
      </div>
    );
  }

  if (slug === 'irl-hud') return <IrlHudWidget searchParams={parsedParams} />;
  if (slug === 'mini-map') return <MiniMapWidget searchParams={parsedParams} />;
  if (slug === 'follower-goal') return <FollowerGoalWidget searchParams={parsedParams} />;
  if (slug === 'sub-goal') return <SubGoalWidget searchParams={parsedParams} />;
  if (slug === 'chat-overlay') return <ChatOverlayWidget searchParams={parsedParams} />;
  if (slug === 'sub-counter') return <SubCounterWidget searchParams={parsedParams} />;
  if (slug === 'now-playing') return <NowPlayingWidget searchParams={parsedParams} />;
  if (slug === 'qr-tip') return <QrTipWidget searchParams={parsedParams} />;
  if (slug === 'kick-viewers') return <KickViewersWidget searchParams={parsedParams} />;
  if (slug === 'stream-uptime') return <StreamUptimeWidget searchParams={parsedParams} />;
  if (slug === 'social-banner') return <SocialBannerWidget searchParams={parsedParams} />;

  notFound();
}
