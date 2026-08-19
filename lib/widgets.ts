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
      { name: 'theme', label: 'Tema', type: 'select', defaultValue: 'dark', options: [{ label: 'Koyu Neon (Dark)', value: 'dark' }, { label: 'Şeffaf (Clean)', value: 'transparent' }] },
      { name: 'accent', label: 'Vurgu Rengi', type: 'color', defaultValue: '#53FC18' },
      { name: 'scale', label: 'Boyut (%)', type: 'select', defaultValue: '100', options: [{ label: 'Küçük (%80)', value: '80' }, { label: 'Normal (%100)', value: '100' }, { label: 'Büyük (%125)', value: '125' }, { label: 'Dev (%150)', value: '150' }] },
    ],
  },
  {
    id: 'kick-chat',
    name: 'Kick Şeffaf Sohbet (Chat Box)',
    category: 'Kick',
    description: 'OBS için ultra hafif, animasyonlu ve şeffaf Kick canlı sohbet katmanı.',
    fields: [
      { name: 'channel', label: 'Kick Kanal Adı', type: 'text', defaultValue: 'itsfatih', placeholder: 'Kanal adı' },
      { name: 'fontSize', label: 'Yazı Boyutu', type: 'select', defaultValue: '14', options: [{ label: 'Küçük (12px)', value: '12' }, { label: 'Normal (14px)', value: '14' }, { label: 'Büyük (18px)', value: '18' }] },
      { name: 'fadeTime', label: 'Mesaj Kaybolma Süresi', type: 'select', defaultValue: '0', options: [{ label: 'Hiç Kaybolmasın', value: '0' }, { label: '10 Saniye', value: '10' }, { label: '20 Saniye', value: '20' }] },
    ],
  },
  {
    id: 'goal-bar',
    name: 'Hedef Çubuğu (Goal Bar)',
    category: 'Genel',
    description: 'Takipçi, Abone veya Bağış hedefleri için modern ve şık ilerleme çubuğu.',
    fields: [
      { name: 'title', label: 'Hedef Başlığı', type: 'text', defaultValue: 'TAKİPÇİ HEDEFİ', placeholder: 'Örn: TAKİPÇİ HEDEFİ' },
      { name: 'current', label: 'Mevcut Değer', type: 'number', defaultValue: 340, placeholder: '340' },
      { name: 'target', label: 'Hedef Değer', type: 'number', defaultValue: 500, placeholder: '500' },
      { name: 'accent', label: 'Bar Rengi', type: 'color', defaultValue: '#10B981' },
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
