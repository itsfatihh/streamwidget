'use client';

import { use, useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Pusher from 'pusher-js';

interface KickBadge {
  type: string;
  text?: string;
  count?: number;
  months?: number;
  badge_image?: {
    url?: string;
    src?: string;
  };
  [key: string]: any;
}

interface SubscriberBadgeItem {
  id?: number;
  months?: number;
  badge_image?: {
    url?: string;
    src?: string;
  };
  url?: string;
  src?: string;
  [key: string]: any;
}

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  color?: string;
  badges?: KickBadge[];
}

function KickOfficialBadge({
  badge,
  subBadges,
}: {
  badge: KickBadge;
  subBadges: SubscriberBadgeItem[];
}) {
  const directImgUrl = badge.badge_image?.url || badge.badge_image?.src || badge.url || badge.src;
  if (directImgUrl && typeof directImgUrl === 'string') {
    return (
      <img
        src={directImgUrl}
        alt={badge.type || 'badge'}
        className="inline-block h-[18px] w-[18px] mr-1.5 align-middle select-none shrink-0 object-contain rounded-sm"
      />
    );
  }

  const type = (badge.type || '').toLowerCase();
  let subMonths = badge.count || badge.months || 1;
  if (badge.text && !badge.count && !badge.months) {
    const parsed = parseInt(badge.text.replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) subMonths = parsed;
  }

  if (type === 'subscriber' || type === 'sub') {
    if (subBadges && subBadges.length > 0) {
      const sorted = [...subBadges].sort((a, b) => (Number(b.months) || 0) - (Number(a.months) || 0));
      const matched = sorted.find((b) => subMonths >= (Number(b.months) || 1)) || sorted[sorted.length - 1];
      
      const badgeUrl =
        matched?.badge_image?.url ||
        matched?.badge_image?.src ||
        matched?.url ||
        matched?.src ||
        (matched?.badge_image && typeof matched.badge_image === 'string' ? matched.badge_image : null);

      if (badgeUrl) {
        return (
          <img
            src={badgeUrl}
            alt={`Abone ${subMonths} Ay`}
            title={`Abone (${subMonths} Ay)`}
            className="inline-block h-[18px] w-[18px] mr-1.5 align-middle select-none shrink-0 object-contain rounded-sm"
          />
        );
      }
    }

    return (
      <span
        className="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 rounded-[3px] bg-[#53FC18]/20 border border-[#53FC18] text-[#53FC18] font-bold text-[10px] mr-1.5 align-middle select-none shrink-0"
        title={`Abone (${subMonths} Ay)`}
      >
        ★
      </span>
    );
  }

  if (type === 'broadcaster' || type === 'streamer') {
    return (
      <span className="inline-flex items-center justify-center h-[18px] px-1.5 rounded-[3px] bg-[#53FC18] text-black font-extrabold text-[10px] uppercase mr-1.5 align-middle select-none shrink-0">
        YAYINCI
      </span>
    );
  }

  if (type === 'moderator' || type === 'mod') {
    return (
      <span className="inline-flex items-center justify-center h-[18px] w-[18px] rounded-[3px] bg-[#00E701] text-black mr-1.5 align-middle select-none shrink-0" title="Moderatör">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M19.707 9.293l-5-5a1 1 0 0 0-1.414 1.414L14.586 7H7a5 5 0 0 0-5 5v5a1 1 0 0 0 2 0v-5a3 3 0 0 1 3-3h7.586l-1.293 1.293a1 1 0 0 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414z" />
        </svg>
      </span>
    );
  }

  if (type === 'vip') {
    return (
      <span className="inline-flex items-center justify-center h-[18px] px-1.5 rounded-[3px] bg-[#A970FF] text-white font-extrabold text-[10px] uppercase mr-1.5 align-middle select-none shrink-0">
        VIP
      </span>
    );
  }

  if (type === 'verified') {
    return (
      <span className="inline-flex items-center justify-center h-[18px] w-[18px] rounded-full bg-[#53FC18] text-black font-black text-[10px] mr-1.5 align-middle select-none shrink-0">
        ✓
      </span>
    );
  }

  if (type === 'founder') {
    return (
      <span className="inline-flex items-center justify-center h-[18px] px-1 rounded-[3px] bg-[#FFB800] text-black font-black text-[10px] mr-1.5 align-middle select-none shrink-0">
        1ST
      </span>
    );
  }

  if (type === 'og') {
    return (
      <span className="inline-flex items-center justify-center h-[18px] px-1 rounded-[3px] bg-[#00D2FF] text-black font-bold text-[10px] mr-1.5 align-middle select-none shrink-0">
        OG
      </span>
    );
  }

  return null;
}

function parseKickEmotes(content: string) {
  const emoteRegex = /\[emote:(\d+):([a-zA-Z0-9_]+)\]/g;
  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = emoteRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(content.substring(lastIndex, match.index));
    }
    const emoteId = match[1];
    const emoteName = match[2];
    nodes.push(
      <img
        key={`${emoteId}-${match.index}`}
        src={`https://files.kick.com/emotes/${emoteId}/fullsize`}
        alt={emoteName}
        title={emoteName}
        className="inline-block h-[22px] w-auto align-middle mx-1 my-[-4px] select-none object-contain"
        loading="lazy"
      />
    );
    lastIndex = emoteRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    nodes.push(content.substring(lastIndex));
  }

  return nodes.length > 0 ? nodes : content;
}

// Güvenli Sayı Dönüştürücü
function extractNumber(val: any): number | null {
  if (val === undefined || val === null) return null;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const clean = val.replace(/,/g, '').trim();
    const num = parseInt(clean, 10);
    return isNaN(num) ? null : num;
  }
  return null;
}

function WidgetContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const channel = searchParams.get('channel') || 'itsfatih';
  const format = searchParams.get('format') || '24';
  const accent = searchParams.get('accent') || '#53FC18';
  const scale = Number(searchParams.get('scale') || 100) / 100;
  const title = searchParams.get('title') || 'TAKİPÇİ HEDEFİ';
  const target = Number(searchParams.get('target') || 500);

  const [time, setTime] = useState('');
  const [viewers, setViewers] = useState<number | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [subBadges, setSubBadges] = useState<SubscriberBadgeItem[]>([]);
  const [followerCount, setFollowerCount] = useState<number>(0);

  // Saat
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('tr-TR', {
          hour12: format === '12',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [format]);

  // Çoklu Kaynaktan Kick Kanal Verisi Çekici
  const fetchChannelData = useCallback(async () => {
    if (!channel) return null;
    const cleanChannel = channel.toLowerCase().trim();

    try {
      // 1. Doğrudan v1 Denemesi
      const res = await fetch(`https://kick.com/api/v1/channels/${cleanChannel}?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        
        if (data?.subscriber_badges && Array.isArray(data.subscriber_badges)) {
          setSubBadges(data.subscriber_badges);
        }

        const count =
          extractNumber(data?.followersCount) ??
          extractNumber(data?.followers_count) ??
          extractNumber(data?.followers) ??
          extractNumber(data?.user?.followers_count) ??
          null;

        if (count !== null) setFollowerCount(count);

        if (data?.livestream) {
          setIsLive(true);
          setViewers(data.livestream.viewer_count || 0);
        } else {
          setIsLive(false);
          setViewers(0);
        }

        if (data?.chatroom?.id) return { chatroomId: data.chatroom.id };
      }

      // 2. v2 Fallback Denemesi
      const resV2 = await fetch(`https://kick.com/api/v2/channels/${cleanChannel}?_t=${Date.now()}`);
      if (resV2.ok) {
        const dataV2 = await resV2.json();
        
        const countV2 =
          extractNumber(dataV2?.followers_count) ??
          extractNumber(dataV2?.followersCount) ??
          extractNumber(dataV2?.followers) ??
          extractNumber(dataV2?.user?.followers_count) ??
          null;

        if (countV2 !== null) setFollowerCount(countV2);

        if (dataV2?.livestream) {
          setIsLive(true);
          setViewers(dataV2.livestream.viewer_count || 0);
        }

        if (dataV2?.chatroom?.id) return { chatroomId: dataV2.chatroom.id };
      }

      return null;
    } catch {
      return null;
    }
  }, [channel]);

  // Pusher Canlı WebSocket
  useEffect(() => {
    if (!channel) return;

    let pusher: Pusher | null = null;
    let chatroomInstance: any = null;

    const init = async () => {
      const res = await fetchChannelData();

      if (res?.chatroomId) {
        pusher = new Pusher('32cbd69e4b950bf97679', {
          cluster: 'us2',
          forceTLS: true,
        });

        chatroomInstance = pusher.subscribe(`chatrooms.${res.chatroomId}.v2`);

        if (slug === 'kick-viewers') {
          chatroomInstance.bind('App\\Events\\LivestreamUpdated', (eventData: any) => {
            if (eventData?.livestream) {
              setIsLive(true);
              setViewers(eventData.livestream.viewer_count);
            }
          });

          chatroomInstance.bind('App\\Events\\LivestreamEnded', () => {
            setIsLive(false);
            setViewers(0);
          });
        }

        if (slug === 'kick-chat') {
          chatroomInstance.bind('App\\Events\\ChatMessageEvent', (chatData: any) => {
            if (chatData?.content) {
              const extractedBadges: KickBadge[] =
                chatData.sender?.identity?.badges ||
                chatData.sender?.badges ||
                [];

              const newMsg: ChatMessage = {
                id: chatData.id || String(Date.now() + Math.random()),
                sender: chatData.sender?.username || 'izleyici',
                content: chatData.content,
                color: chatData.sender?.identity?.color || '#53FC18',
                badges: extractedBadges,
              };
              setMessages((prev) => [...prev.slice(-15), newMsg]);
            }
          });
        }

        if (slug === 'goal-bar') {
          chatroomInstance.bind('App\\Events\\FollowersUpdated', (data: any) => {
            const count = extractNumber(data?.followersCount) ?? extractNumber(data?.followers_count);
            if (count !== null) {
              setFollowerCount(count);
            } else {
              setFollowerCount((prev) => prev + 1);
            }
          });

          chatroomInstance.bind('App\\Events\\SubscriptionEvent', () => {
            setFollowerCount((prev) => prev + 1);
          });

          chatroomInstance.bind('App\\Events\\GiftedSubscriptionsEvent', (data: any) => {
            const count = data?.gifted_usernames?.length || 1;
            setFollowerCount((prev) => prev + count);
          });
        }
      }
    };

    init();

    const pollInterval = setInterval(() => {
      fetchChannelData();
    }, 15000);

    return () => {
      clearInterval(pollInterval);
      if (chatroomInstance) chatroomInstance.unbind_all();
      if (pusher) pusher.disconnect();
    };
  }, [slug, channel, fetchChannelData]);

  const percentage = Math.min(100, Math.max(0, (followerCount / target) * 100));

  return (
    <div className="bg-transparent min-h-screen flex items-start justify-start p-4 font-sans select-none overflow-hidden">
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {/* 1. Kick Canlı Chat Katmanı */}
        {slug === 'kick-chat' && (
          <div className="w-[420px] space-y-2">
            {messages.length === 0 && (
              <div className="text-xs text-neutral-400 font-mono italic bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/5">
                Canlı sohbet akışı bekleniyor...
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className="bg-[#0b0e14]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/5 text-sm leading-[22px] shadow-lg animate-fadeIn text-slate-100"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
              >
                {m.badges &&
                  m.badges.map((b, idx) => (
                    <KickOfficialBadge key={idx} badge={b} subBadges={subBadges} />
                  ))}

                <span
                  className="font-bold mr-2 text-[13px] tracking-wide align-middle"
                  style={{ color: m.color || '#53FC18' }}
                >
                  {m.sender}:
                </span>

                <span className="text-[13px] text-white font-normal align-middle break-words">
                  {parseKickEmotes(m.content)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 2. Kick Canlı İzleyici */}
        {slug === 'kick-viewers' && (
          <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border text-white shadow-2xl" style={{ borderColor: `${accent}40` }}>
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'animate-pulse' : 'bg-neutral-600'}`} style={{ backgroundColor: isLive ? accent : undefined }} />
            <span className="text-xs font-mono font-bold text-neutral-300 uppercase">{channel}</span>
            <span className="text-sm font-black font-mono" style={{ color: accent }}>
              {isLive ? (viewers !== null ? viewers.toLocaleString() : '...') : 'OFFLINE'}
            </span>
          </div>
        )}

        {/* 3. Otomatik Canlı Hedef Çubuğu */}
        {slug === 'goal-bar' && (
          <div className="w-80 bg-black/85 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-white shadow-2xl space-y-2">
            <div className="flex justify-between items-center text-xs font-bold font-mono">
              <span className="tracking-wide text-neutral-200">{title}</span>
              <span style={{ color: accent }} className="text-sm font-black">
                {followerCount.toLocaleString()} / {target.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-[1px]">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out shadow-sm" 
                style={{ 
                  width: `${percentage}%`, 
                  backgroundColor: accent,
                  boxShadow: `0 0 12px ${accent}80` 
                }} 
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>%{Math.round(percentage)}</span>
              <span>{Math.max(0, target - followerCount)} kaldı</span>
            </div>
          </div>
        )}

        {/* 4. IRL HUD */}
        {slug === 'irl-hud' && (
          <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-white shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-black tracking-widest text-red-400">LIVE</span>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <span className="text-sm font-semibold font-mono tracking-wide">{time}</span>
          </div>
        )}

        {/* 5. Minimal Saat */}
        {slug === 'clock' && (
          <div className="bg-black/85 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/10 text-white shadow-2xl">
            <span className="text-xl font-black font-mono tracking-wider">{time}</span>
          </div>
        )}
      </div>
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
