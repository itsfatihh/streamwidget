'use client';
import { WIDGETS_LIST } from "@/lib/widgets";



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
  if (!content) return '';
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

function getWeatherIcon(code: number) {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌡️';
}

function WidgetContent({ slug }: { slug: string }) {
  
  const searchParams = useSearchParams();
  const channel = searchParams.get('channel') || 'itsfatih';
  const format = searchParams.get('format') || '24';
  
  // IRL HUD Parametreleri
  const showLive = searchParams.get('showLive') !== 'false';
  const showClock = searchParams.get('showClock') !== 'false';
  const showLocation = searchParams.get('showLocation') !== 'false';
  const initialRawLocation = searchParams.get('location') || 'auto';
  const showWeather = searchParams.get('showWeather') !== 'false';
  const showBattery = searchParams.get('showBattery') !== 'false';

  const defaultAccent = slug === 'sub-goal' ? '#A970FF' : '#53FC18';
  const defaultTitle = slug === 'sub-goal' ? 'ABONE HEDEFİ' : (slug === 'follower-goal' ? 'TAKİPÇİ HEDEFİ' : 'HEDEF');
  const defaultTarget = slug === 'sub-goal' ? 25 : 500;
  
  const currentParam = searchParams.get('current');
  const initialCurrent = currentParam ? Number(currentParam) : 0;

  const accent = searchParams.get('accent') || defaultAccent;
  const scale = Number(searchParams.get('scale') || 100) / 100;
  const title = searchParams.get('title') || defaultTitle;
  const target = Number(searchParams.get('target') || defaultTarget);

  const [time, setTime] = useState('00:00:00');
  const [viewers, setViewers] = useState<number | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [subBadges, setSubBadges] = useState<SubscriberBadgeItem[]>([]);
  
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [subCount, setSubCount] = useState<number>(initialCurrent);
  
  // Konum & Hava Durumu
  const [activeLocationQuery, setActiveLocationQuery] = useState<string>(initialRawLocation);
  const [cityName, setCityName] = useState<string>(initialRawLocation !== 'auto' && initialRawLocation ? initialRawLocation : 'Konum aranıyor...');
  const [temperature, setTemperature] = useState<string>('...');
  const [weatherCode, setWeatherCode] = useState<number>(0);

  // Pil Durumu (Sadece gerçek veri varsa number olur, yoksa null kalıp gizlenir)
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  // 1. Saat
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

  // 2. Gerçek Cihaz Batarya Sensörü
  useEffect(() => {
    if (slug !== 'irl-hud' || !showBattery) return;

    let batteryInstance: any = null;

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((bat: any) => {
        batteryInstance = bat;
        setBatteryLevel(Math.round(bat.level * 100));
        setIsCharging(bat.charging);

        bat.addEventListener('levelchange', () => setBatteryLevel(Math.round(bat.level * 100)));
        bat.addEventListener('chargingchange', () => setIsCharging(bat.charging));
      }).catch(() => {
        setBatteryLevel(null);
      });
    } else {
      setBatteryLevel(null);
    }

    return () => {
      if (batteryInstance) {
        batteryInstance.removeEventListener('levelchange', () => {});
        batteryInstance.removeEventListener('chargingchange', () => {});
      }
    };
  }, [slug, showBattery]);

  // 3. Konum ve Hava Durumu Çözümleyici
  const resolveLocationAndWeather = useCallback(async (locQuery: string) => {
    let lat: number | null = null;
    let lon: number | null = null;
    let detectedName = '';

    try {
      if (!locQuery || locQuery.toLowerCase() === 'auto') {
        const ipRes = await fetch('https://ipwho.is/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData?.success) {
            detectedName = ipData.city || ipData.region || 'Canlı Konum';
            lat = ipData.latitude;
            lon = ipData.longitude;
            setCityName(detectedName);
          }
        }
      } else {
        detectedName = locQuery;
        setCityName(detectedName);
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locQuery)}&count=1&language=tr&format=json`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData?.results?.[0]) {
            lat = geoData.results[0].latitude;
            lon = geoData.results[0].longitude;
          }
        }
      }

      if (lat !== null && lon !== null) {
        const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
        if (wRes.ok) {
          const wData = await wRes.json();
          if (wData?.current) {
            setTemperature(`${Math.round(wData.current.temperature_2m)}°C`);
            setWeatherCode(wData.current.weather_code);
          }
        }
      }
    } catch (err) {
      console.error('Weather error:', err);
      if (!detectedName) setCityName('Canlı Konum');
      setTemperature('25°C');
    }
  }, []);

  useEffect(() => {
    if (slug !== 'irl-hud') return;
    resolveLocationAndWeather(activeLocationQuery);
    const interval = setInterval(() => resolveLocationAndWeather(activeLocationQuery), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [slug, activeLocationQuery, resolveLocationAndWeather]);

  // 4. Kick Kanal Verileri
  const fetchChannelData = useCallback(async () => {
    if (!channel) return null;
    const cleanChannel = channel.toLowerCase().trim();

    try {
      const res = await fetch(`https://kick.com/api/v1/channels/${cleanChannel}?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        
        if (data?.subscriber_badges && Array.isArray(data.subscriber_badges)) {
          setSubBadges(data.subscriber_badges);
        }

        const fCount =
          extractNumber(data?.followersCount) ??
          extractNumber(data?.followers_count) ??
          extractNumber(data?.followers) ??
          extractNumber(data?.user?.followers_count) ??
          null;

        if (fCount !== null) setFollowerCount(fCount);

        if (!currentParam) {
          const sCount =
            extractNumber(data?.subscribers_count) ??
            extractNumber(data?.subscribersCount) ??
            extractNumber(data?.subscriber_count) ??
            null;
          if (sCount !== null && sCount > 0) setSubCount(sCount);
        }

        if (data?.livestream) {
          setIsLive(true);
          setViewers(data.livestream.viewer_count || 0);
        } else {
          setIsLive(false);
          setViewers(0);
        }

        if (data?.chatroom?.id) return { chatroomId: data.chatroom.id };
      }

      return null;
    } catch {
      return null;
    }
  }, [channel, currentParam]);

  // 5. Pusher WebSocket (!konum komutu)
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

        // Canlı Chat Dinleyicisi
        chatroomInstance.bind('App\\Events\\ChatMessageEvent', (chatData: any) => {
          if (chatData?.content) {
            const rawContent = (chatData.content || '').trim();
            const extractedBadges: KickBadge[] =
              chatData.sender?.identity?.badges ||
              chatData.sender?.badges ||
              [];

            const isAuthorized = extractedBadges.some(
              (b) => {
                const t = (b.type || '').toLowerCase();
                return t === 'broadcaster' || t === 'moderator' || t === 'mod';
              }
            );

            // !konum Komutu
            if (isAuthorized && (rawContent.startsWith('!konum ') || rawContent.startsWith('!location '))) {
              const newLoc = rawContent.replace(/^!(konum|location)\s+/i, '').trim();
              if (newLoc) {
                setActiveLocationQuery(newLoc);
              }
            }

            if (slug === 'kick-chat') {
              const newMsg: ChatMessage = {
                id: chatData.id || String(Date.now() + Math.random()),
                sender: chatData.sender?.username || 'izleyici',
                content: chatData.content,
                color: chatData.sender?.identity?.color || '#53FC18',
                badges: extractedBadges,
              };
              setMessages((prev) => [...prev.slice(-15), newMsg]);
            }
          }
        });

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

        if (slug === 'follower-goal') {
          chatroomInstance.bind('App\\Events\\FollowersUpdated', (data: any) => {
            const count = extractNumber(data?.followersCount) ?? extractNumber(data?.followers_count);
            if (count !== null) {
              setFollowerCount(count);
            } else {
              setFollowerCount((prev) => prev + 1);
            }
          });
        }

        if (slug === 'sub-goal') {
          chatroomInstance.bind('App\\Events\\SubscriptionEvent', () => {
            setSubCount((prev) => prev + 1);
          });

          chatroomInstance.bind('App\\Events\\GiftedSubscriptionsEvent', (data: any) => {
            const count = data?.gifted_usernames?.length || 1;
            setSubCount((prev) => prev + count);
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

  const currentGoalValue = slug === 'sub-goal' ? subCount : followerCount;
  const percentage = Math.min(100, Math.max(0, (currentGoalValue / target) * 100));

  const getBatteryColor = () => {
    if (isCharging) return '#53FC18';
    if (batteryLevel === null) return '#53FC18';
    if (batteryLevel <= 20) return '#ef4444';
    if (batteryLevel <= 45) return '#f59e0b';
    return '#53FC18';
  };

  return (
    <div className="bg-transparent min-h-screen p-4 font-sans select-none overflow-hidden block">
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {/* 1. Kick Chat */}
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
          <div className="inline-flex items-center gap-3 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border text-white shadow-2xl" style={{ borderColor: `${accent}40` }}>
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'animate-pulse' : 'bg-neutral-600'}`} style={{ backgroundColor: isLive ? accent : undefined }} />
            <span className="text-xs font-mono font-bold text-neutral-300 uppercase">{channel}</span>
            <span className="text-sm font-black font-mono" style={{ color: accent }}>
              {isLive ? (viewers !== null ? viewers.toLocaleString() : '...') : 'OFFLINE'}
            </span>
          </div>
        )}

        {/* 3. Takipçi Hedefi */}
        {slug === 'follower-goal' && (
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
              <span>{Math.max(0, target - followerCount)} takipçi kaldı</span>
            </div>
          </div>
        )}

        {/* 4. Abone Hedefi */}
        {slug === 'sub-goal' && (
          <div className="w-80 bg-black/85 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-white shadow-2xl space-y-2">
            <div className="flex justify-between items-center text-xs font-bold font-mono">
              <span className="tracking-wide text-neutral-200">{title}</span>
              <span style={{ color: accent }} className="text-sm font-black">
                {subCount.toLocaleString()} / {target.toLocaleString()}
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
              <span>{Math.max(0, target - subCount)} abone kaldı</span>
            </div>
          </div>
        )}

        {/* 5. Modüler IRL CANLI YAYIN HUD */}
        {slug === 'irl-hud' && (
          <div className="inline-flex items-center gap-3.5 bg-black/85 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-white shadow-2xl text-xs font-semibold">
            {showLive && (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-black tracking-widest text-red-400">LIVE</span>
              </div>
            )}

            {showClock && (
              <>
                {showLive && <div className="h-4 w-[1px] bg-white/20" />}
                <span className="font-mono tracking-wide text-slate-100">{time}</span>
              </>
            )}

            {showLocation && (
              <>
                {(showLive || showClock) && <div className="h-4 w-[1px] bg-white/20" />}
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <span className="text-emerald-400 text-sm">📍</span>
                  <span>{cityName}</span>
                </span>
              </>
            )}

            {showWeather && (
              <>
                {(showLive || showClock || showLocation) && <div className="h-4 w-[1px] bg-white/20" />}
                <span className="flex items-center gap-1.5 text-amber-300 font-mono font-bold">
                  <span>{getWeatherIcon(weatherCode)}</span>
                  <span>{temperature}</span>
                </span>
              </>
            )}

            {showBattery && batteryLevel !== null && (
              <>
                {(showLive || showClock || showLocation || showWeather) && <div className="h-4 w-[1px] bg-white/20" />}
                <span className="flex items-center gap-1 font-mono font-bold" style={{ color: getBatteryColor() }}>
                  <span>{isCharging ? '⚡🔋' : '🔋'}</span>
                  <span>{batteryLevel}%</span>
                </span>
              </>
            )}
          </div>
        )}

        {/* 6. Minimal Saat */}
        
        {/* 7. Son Olaylar (Events / Stream Labels) */}
        {slug === 'events' && (
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-white shadow-2xl">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accent || '#53FC18' }} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: accent || '#53FC18' }}>
                {channel || 'itsfatih'}
              </span>
              <span className="text-xs text-neutral-300 font-mono">Stream Labels Active</span>
            </div>
          </div>
        )}

        {slug === 'clock' && (
          <div className="inline-block bg-black/85 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/10 text-white shadow-2xl">
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
    <Suspense fallback={<div className="bg-transparent min-h-screen" />}>
      <WidgetContent slug={slug} />
    </Suspense>
  );
}


