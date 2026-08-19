export interface WidgetField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'color' | 'checkbox';
  defaultValue?: string | number | boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

export interface WidgetDef {
  id: string;
  name: string;
  category: 'Kick' | 'Twitch' | 'IRL' | 'Genel';
  description: string;
  fields: WidgetField[];
}

export const WIDGETS_LIST: WidgetDef[] = [
  {
    id: 'kick-viewers',
    name: 'Kick Canlı İzleyici',
    category: 'Kick',
    description: 'Kick kanalınızın anlık izleyici sayısını gösteren şeffaf neon rozet.',
    fields: [
      { name: 'channel', label: 'Kick Kanal Adı', type: 'text', defaultValue: 'itsfatih', placeholder: 'Kanal adı' },
      { name: 'accent', label: 'Vurgu Rengi', type: 'color', defaultValue: '#53FC18' },
      { name: 'scale', label: 'Boyut (%)', type: 'select', defaultValue: '100', options: [{ label: 'Küçük (%80)', value: '80' }, { label: 'Normal (%100)', value: '100' }, { label: 'Büyük (%125)', value: '125' }, { label: 'Dev (%150)', value: '150' }] },
    ],
  },
  {
    id: 'kick-chat',
    name: 'Kick Canlı Sohbet (Chat Box)',
    category: 'Kick',
    description: 'OBS için ultra hafif, resmi Kick SVG rozetleri ve ifadeleriyle canlı sohbet.',
    fields: [
      { name: 'channel', label: 'Kick Kanal Adı', type: 'text', defaultValue: 'itsfatih', placeholder: 'Kanal adı' },
      { name: 'scale', label: 'Boyut (%)', type: 'select', defaultValue: '100', options: [{ label: 'Normal (%100)', value: '100' }, { label: 'Büyük (%125)', value: '125' }] },
    ],
  },
  {
    id: 'follower-goal',
    name: 'Takipçi Hedefi (Follower Goal)',
    category: 'Kick',
    description: 'Kick takipçi sayısını otomatik çeken ve yeni takip geldikçe canlı ilerleyen çubuk.',
    fields: [
      { name: 'channel', label: 'Kick Kanal Adı', type: 'text', defaultValue: 'itsfatih', placeholder: 'Kanal adı' },
      { name: 'title', label: 'Hedef Başlığı', type: 'text', defaultValue: 'TAKİPÇİ HEDEFİ', placeholder: 'Örn: TAKİPÇİ HEDEFİ' },
      { name: 'target', label: 'Hedef Takipçi', type: 'number', defaultValue: 500, placeholder: '500' },
      { name: 'accent', label: 'Bar Rengi', type: 'color', defaultValue: '#53FC18' },
      { name: 'scale', label: 'Boyut (%)', type: 'select', defaultValue: '100', options: [{ label: 'Normal (%100)', value: '100' }, { label: 'Büyük (%125)', value: '125' }] },
    ],
  },
  {
    id: 'sub-goal',
    name: 'Abone Hedefi (Sub Goal)',
    category: 'Kick',
    description: 'Kick yeni abonelik ve hediye aboneliklerde canlı ilerleyen hedef çubuğu.',
    fields: [
      { name: 'channel', label: 'Kick Kanal Adı', type: 'text', defaultValue: 'itsfatih', placeholder: 'Kanal adı' },
      { name: 'title', label: 'Hedef Başlığı', type: 'text', defaultValue: 'ABONE HEDEFİ', placeholder: 'Örn: YAYIN ABONE HEDEFİ' },
      { name: 'current', label: 'Mevcut / Başlangıç Abone', type: 'number', defaultValue: 0, placeholder: '0 (veya mevcut aboneniz)' },
      { name: 'target', label: 'Hedef Abone Sayısı', type: 'number', defaultValue: 25, placeholder: '25' },
      { name: 'accent', label: 'Bar Rengi', type: 'color', defaultValue: '#A970FF' },
      { name: 'scale', label: 'Boyut (%)', type: 'select', defaultValue: '100', options: [{ label: 'Normal (%100)', value: '100' }, { label: 'Büyük (%125)', value: '125' }] },
    ],
  },
  {
    id: 'irl-hud',
    name: 'IRL Canlı Yayın HUD',
    category: 'IRL',
    description: 'Dış mekan yayınları için otomatik konum & hava durumu, saat ve LIVE durum rozeti.',
    fields: [
      { name: 'showLive', label: 'LIVE Rozeti Gösterilsin mi?', type: 'select', defaultValue: 'true', options: [{ label: 'Evet (Göster)', value: 'true' }, { label: 'Hayır (Gizle)', value: 'false' }] },
      { name: 'showClock', label: 'Saat Gösterilsin mi?', type: 'select', defaultValue: 'true', options: [{ label: 'Evet (Göster)', value: 'true' }, { label: 'Hayır (Gizle)', value: 'false' }] },
      { name: 'format', label: 'Saat Formatı', type: 'select', defaultValue: '24', options: [{ label: '24 Saat (19:30)', value: '24' }, { label: '12 Saat (07:30 PM)', value: '12' }] },
      { name: 'showLocation', label: 'Konum Gösterilsin mi?', type: 'select', defaultValue: 'true', options: [{ label: 'Evet (Göster)', value: 'true' }, { label: 'Hayır (Gizle)', value: 'false' }] },
      { name: 'location', label: 'Konum (Boş bırakırsanız otomatik algılar)', type: 'text', defaultValue: 'auto', placeholder: 'auto (veya Özel Şehir Adı)' },
      { name: 'showWeather', label: 'Hava Durumu Gösterilsin mi?', type: 'select', defaultValue: 'true', options: [{ label: 'Evet (Göster)', value: 'true' }, { label: 'Hayır (Gizle)', value: 'false' }] },
      { name: 'scale', label: 'Boyut (%)', type: 'select', defaultValue: '100', options: [{ label: 'Normal (%100)', value: '100' }, { label: 'Büyük (%125)', value: '125' }] },
    ],
  },
  {
    id: 'clock',
    name: 'Minimal Dijital Saat',
    category: 'Genel',
    description: 'Şık ve cam efektli (glassmorphism) ekran üzeri dijital saat katmanı.',
    fields: [
      { name: 'format', label: 'Format', type: 'select', defaultValue: '24', options: [{ label: '24 Saat', value: '24' }, { label: '12 Saat', value: '12' }] },
    ],
  },
];
