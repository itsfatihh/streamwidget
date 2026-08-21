import { LangCode } from './i18n';

export interface WidgetOption {
  label: Record<LangCode, string>;
  value: string;
}

export interface WidgetField {
  name: string;
  label: Record<LangCode, string>;
  type: 'text' | 'number' | 'select' | 'color';
  defaultValue?: string | number;
  placeholder?: string;
  options?: WidgetOption[];
}

export interface WidgetDef {
  id: string;
  category: 'Kick' | 'Twitch' | 'IRL' | 'Genel';
  name: Record<LangCode, string>;
  description: Record<LangCode, string>;
  fields: WidgetField[];
}

export const WIDGETS_LIST: WidgetDef[] = [
  {
    id: 'mini-map',
    category: 'IRL',
    name: {
      tr: 'NFS Mini-Map Radar',
      en: 'NFS Mini-Map Radar',
      de: 'NFS Mini-Map Radar',
      es: 'NFS Mini-Map Radar',
      pt: 'NFS Mini-Map Radar',
      ru: 'NFS Мини-карта Радар',
      ja: 'NFS ミニマップ レーダー',
      pl: 'NFS Mini-Mapa Radar',
      ar: 'رادار الخريطة المصغرة NFS',
    },
    description: {
      tr: 'Canlı radar mini haritası, hız kadranı ve cihaz GPS takibi.',
      en: 'Live radar mini-map, speedometer HUD, and device GPS tracking.',
      de: 'Live-Radarkarte, Tacho-HUD und Geräte-GPS-Tracking.',
      es: 'Mini mapa de radar en vivo, velocímetro y seguimiento GPS del dispositivo.',
      pt: 'Mini mapa de radar ao vivo, velocímetro e rastreamento GPS do dispositivo.',
      ru: 'Живая мини-карта радар со спидометром и GPS отслеживанием.',
      ja: 'ライブレーダーミニマップ、速度計HUD、デバイスGPS追跡。',
      pl: 'Radarowa mini-mapa na żywo, prędkościomierz i śledzenie GPS urządzenia.',
      ar: 'خريطة رادار مصغرة مباشرة، وعداد سرعة، وتتبع GPS للجهاز.',
    },
    fields: [
      {
        name: 'shape',
        label: {
          tr: 'Harita Şekli',
          en: 'Map Shape',
          de: 'Kartenform',
          es: 'Forma del Mapa',
          pt: 'Formato do Mapa',
          ru: 'Форма карты',
          ja: 'マップの形状',
          pl: 'Kształt mapy',
          ar: 'شكل الخريطة',
        },
        type: 'select',
        defaultValue: 'circle',
        options: [
          {
            label: { tr: 'Yuvarlak (NFS/Radar)', en: 'Circle (Radar)', de: 'Kreis', es: 'Círculo', pt: 'Círculo', ru: 'Круг', ja: '円形', pl: 'Okrągły', ar: 'دائري' },
            value: 'circle',
          },
          {
            label: { tr: 'Kare (GTA/Modern)', en: 'Square (GTA)', de: 'Quadrat', es: 'Cuadrado', pt: 'Quadrado', ru: 'Квадрат', ja: '正方形', pl: 'Kwadratowy', ar: 'مربع' },
            value: 'square',
          },
        ],
      },
      {
        name: 'accent',
        label: {
          tr: 'Vurgu Rengi',
          en: 'Accent Color',
          de: 'Akzentfarbe',
          es: 'Color de acento',
          pt: 'Cor de destaque',
          ru: 'Цвет акцента',
          ja: 'アクセントカラー',
          pl: 'Kolor akcentu',
          ar: 'لون التمييز',
        },
        type: 'color',
        defaultValue: '#53FC18',
      },
    ],
  },
  {
    id: 'kick-viewers',
    category: 'Kick',
    name: {
      tr: 'Kick Canlı İzleyici',
      en: 'Kick Live Viewers',
      de: 'Kick Live-Zuschauer',
      es: 'Espectadores en vivo de Kick',
      pt: 'Espectadores ao vivo da Kick',
      ru: 'Зрители Kick онлайн',
      ja: 'Kick ライブ視聴者数',
      pl: 'Widzowie Kick na żywo',
      ar: 'مشاهدو Kick المباشرون',
    },
    description: {
      tr: 'Kick kanalınızın anlık canlı izleyici sayısını şık bir sayaçla gösterir.',
      en: 'Displays real-time live viewer count of your Kick channel.',
      de: 'Zeigt die Echtzeit-Zuschauerzahl Ihres Kick-Kanals an.',
      es: 'Muestra el recuento de espectadores en vivo en tiempo real de tu canal de Kick.',
      pt: 'Exibe a contagem de espectadores ao vivo em tempo real do seu canal Kick.',
      ru: 'Показывает количество зрителей вашего канала Kick в реальном времени.',
      ja: 'Kickチャンネルのリアルタイム視聴者数を表示します。',
      pl: 'Wyświetla liczbę widzów Twojego kanału Kick na żywo w czasie rzeczywistym.',
      ar: 'يعرض عدد المشاهدين المباشرين لقناتك على Kick في الوقت الفعلي.',
    },
    fields: [
      {
        name: 'channel',
        label: {
          tr: 'Kanal Adı',
          en: 'Channel Name',
          de: 'Kanalname',
          es: 'Nombre del canal',
          pt: 'Nome do canal',
          ru: 'Имя канала',
          ja: 'チャンネル名',
          pl: 'Nazwa kanału',
          ar: 'اسم القناة',
        },
        type: 'text',
        defaultValue: 'itsfatih',
        placeholder: 'itsfatih',
      },
    ],
  },
  {
    id: 'kick-chat',
    category: 'Kick',
    name: {
      tr: 'Kick Sohbet Kutusu',
      en: 'Kick Chat Box',
      de: 'Kick Chatbox',
      es: 'Caja de chat de Kick',
      pt: 'Caixa de chat da Kick',
      ru: 'Чат Kick',
      ja: 'Kick チャットボックス',
      pl: 'Czat Kick',
      ar: 'صندوق دردشة Kick',
    },
    description: {
      tr: 'Kick canlı yayın sohbetini şeffaf ve animasyonlu olarak OBS ekranına yansıtır.',
      en: 'Streams Kick chat messages onto your OBS with custom styling.',
      de: 'Streamt Kick-Chat-Nachrichten mit individuellem Design in OBS.',
      es: 'Muestra los mensajes de chat de Kick en tu OBS con estilo personalizado.',
      pt: 'Transmite mensagens de chat da Kick no seu OBS com estilo personalizado.',
      ru: 'Транслирует сообщения чата Kick в OBS.',
      ja: 'KickのチャットメッセージをカスタムスタイルでOBSに表示します。',
      pl: 'Wyświetla wiadomości z czatu Kick w OBS z własnym stylem.',
      ar: 'يعرض رسائل دردشة Kick على OBS بتصميم مخصص.',
    },
    fields: [
      {
        name: 'channel',
        label: {
          tr: 'Kanal Adı',
          en: 'Channel Name',
          de: 'Kanalname',
          es: 'Nombre del canal',
          pt: 'Nome do canal',
          ru: 'Имя канала',
          ja: 'チャンネル名',
          pl: 'Nazwa kanału',
          ar: 'اسم القناة',
        },
        type: 'text',
        defaultValue: 'itsfatih',
        placeholder: 'itsfatih',
      },
    ],
  },
  {
    id: 'clock',
    category: 'Genel',
    name: {
      tr: 'Dijital Saat HUD',
      en: 'Digital Clock HUD',
      de: 'Digitale Uhr HUD',
      es: 'HUD de Reloj Digital',
      pt: 'HUD de Relógio Digital',
      ru: 'Цифровые часы HUD',
      ja: 'デジタル時計 HUD',
      pl: 'Cyfrowy Zegar HUD',
      ar: 'شاشة ساعة رقمية HUD',
    },
    description: {
      tr: 'Yayınınız için minimalist ve modern dijital saat katmanı.',
      en: 'Minimalist and modern digital clock overlay for your stream.',
      de: 'Minimalistisches und modernes digitales Uhren-Overlay für Ihren Stream.',
      es: 'Superposición de reloj digital minimalista y moderna para tu transmisión.',
      pt: 'Sobreposição de relógio digital minimalista e moderna para sua transmissão.',
      ru: 'Минималистичный и современный оверлей цифровых часов.',
      ja: '配信用のミニマリストでモダンなデジタル時計オーバーレイ。',
      pl: 'Minimalistyczna i nowoczesna nakładka z zegarem cyfrowym na stream.',
      ar: 'طبقة ساعة رقمية حديثة وبسيطة لبثك.',
    },
    fields: [],
  },
];
