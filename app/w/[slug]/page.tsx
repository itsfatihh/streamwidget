'use client';

import { use } from 'react';
import FollowerGoalWidget from '@/components/widgets/FollowerGoal';
import SubGoalWidget from '@/components/widgets/SubGoal';
import KickViewersWidget from '@/components/widgets/KickViewers';
import KickChatWidget from '@/components/widgets/KickChat';
import IrlHudWidget from '@/components/widgets/IrlHud';
import MiniMapWidget from '@/components/widgets/MiniMap';
import ClockWidget from '@/components/widgets/Clock';

export default function WidgetPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = use(params);
  const sp = use(searchParams);

  switch (slug) {
    case 'follower-goal':
      return <FollowerGoalWidget searchParams={sp} />;
    case 'sub-goal':
      return <SubGoalWidget searchParams={sp} />;
    case 'kick-viewers':
      return <KickViewersWidget searchParams={sp} />;
    case 'kick-chat':
      return <KickChatWidget searchParams={sp} />;
    case 'irl-hud':
      return <IrlHudWidget searchParams={sp} />;
    case 'mini-map':
      return <MiniMapWidget searchParams={sp} />;
    case 'clock':
      return <ClockWidget />;
    default:
      return <div className="w-screen h-screen bg-transparent" />;
  }
}
