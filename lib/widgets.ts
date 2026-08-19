export interface WidgetField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'color';
  defaultValue?: string | number;
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
      { name: 'channel', label: 'Kick Kanal Adı', type: 'text', defaultValue: 'itsfatih', placeholder: 'Kanal adı (örn: itsfatih)' },
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
    id: 'goal-bar',
    name: 'Kick Otomatik Hedef Çubuğu (Goal Bar)',
    category: 'Kick',
    description: 'Kick takipçi veya abone sayısını otomatik çeken ve yeni takipte canlı ilerleyen bar.',
    fields: [
      { name: 'channel', label: 'Kick Kanal Adı', type: 'text', defaultValue: 'itsfatih', placeholder: 'Kanal adı' },
      { name: 'goalType', label: 'Hedef Türü', type: 'select', defaultValue: 'followers', options: [{ label: 'Takipçi Hedefi (Followers)', value: 'followers' }, { label: 'Abone Hedefi (Subscribers)', value: 'subscribers' }] },
      { name: 'title', label: 'Hedef Başlığı', type: 'text', defaultValue: 'TAKİPÇİ HEDEFİ', placeholder: 'Örn: YENİ HEDEF' },
      { name: 'target', label: 'Hedeflenen Sayı', type: 'number', defaultValue: 500, placeholder: '500' },
      { name: 'accent', label: 'Bar Rengi', type: 'color', defaultValue: '#53FC18' },
      { name: 'scale', label: 'Boyut (%)', type: 'select', defaultValue: '100', options: [{ label: 'Normal (%100)', value: '100' }, { label: 'Büyük (%125)', value: '125' }] },
    ],
  },
  {
    id: 'irl-hud',
    name: 'IRL Canlı Yayın HUD',
    category: 'IRL',
    description: 'Dış mekan yayınları için dinamik saat ve canlı LIVE durum rozeti.',
    fields: [
      { name: 'format', label: 'Saat Formatı', type: 'select', defaultValue: '24', options: [{ label: '24 Saat (19:30)', value: '24' }, { label: '12 Saat (07:30 PM)', value: '12' }] },
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
