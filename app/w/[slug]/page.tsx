import React from 'react';
import { notFound } from 'next/navigation';
import IrlHudWidget from '@/components/widgets/IrlHud';
import MiniMapWidget from '@/components/widgets/MiniMap';
import FollowerGoalWidget from '@/components/widgets/FollowerGoal';
import SubGoalWidget from '@/components/widgets/SubGoal';
import GoalBarWidget from '@/components/widgets/GoalBar';
import ChatOverlayWidget from '@/components/widgets/ChatOverlay';
import SubCounterWidget from '@/components/widgets/SubCounter';
import NowPlayingWidget from '@/components/widgets/NowPlaying';
import QrTipWidget from '@/components/widgets/QrTip';

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

  if (slug === 'irl-hud') return <IrlHudWidget searchParams={parsedParams} />;
  if (slug === 'mini-map') return <MiniMapWidget searchParams={parsedParams} />;
  if (slug === 'follower-goal') return <FollowerGoalWidget searchParams={parsedParams} />;
  if (slug === 'sub-goal') return <SubGoalWidget searchParams={parsedParams} />;
  if (slug === 'goal-bar') return <GoalBarWidget searchParams={parsedParams} />;
  if (slug === 'chat-overlay') return <ChatOverlayWidget searchParams={parsedParams} />;
  if (slug === 'sub-counter') return <SubCounterWidget searchParams={parsedParams} />;
  if (slug === 'now-playing') return <NowPlayingWidget searchParams={parsedParams} />;
  if (slug === 'qr-tip') return <QrTipWidget searchParams={parsedParams} />;

  notFound();
}
