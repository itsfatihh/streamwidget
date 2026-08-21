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
        label: { tr: 'Kanal Adı', en: 'Channel Name', de: 'Kanalname', es: 'Nombre del canal', pt: 'Nome do canal', ru: 'Имя канала', ja: 'チャンネル名', pl: 'Nazwa kanału', ar: 'اسم القناة' },
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
      tr: 'Kick Canlı Sohbet (Chat Box)',
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
      tr: 'OBS için ultra hafif, resmi Kick rozetleri ve ifadeleriyle canlı sohbet.',
      en: 'Ultra-light live chat for OBS with official Kick badges and emotes.',
      de: 'Ultraleichter Live-Chat für OBS mit offiziellen Kick-Badges und Emotes.',
      es: 'Chat en vivo ultraligero para OBS con insignias y emoticonos oficiales de Kick.',
      pt: 'Chat ao vivo ultraleve para OBS com emblemas e emotes oficiais da Kick.',
      ru: 'Ультралегкий чат для OBS с официальными значками и смайликами Kick.',
      ja: '公式Kickバッジとエモートを備えたOBS用超軽量ライブチャット。',
      pl: 'Niezwykle lekki czat na żywo dla OBS z oficjalnymi odznakami i emotikonami Kick.',
      ar: 'دردشة مباشرة خفيفة للغاية لـ OBS مع شارات ورموز Kick الرسمية.',
    },
    fields: [
      {
        name: 'channel',
        label: { tr: 'Kanal Adı', en: 'Channel Name', de: 'Kanalname', es: 'Nombre del canal', pt: 'Nome do canal', ru: 'Имя канала', ja: 'チャンネル名', pl: 'Nazwa kanału', ar: 'اسم القناة' },
        type: 'text',
        defaultValue: 'itsfatih',
        placeholder: 'itsfatih',
      },
    ],
  },
  {
    id: 'kick-pinned',
    category: 'Kick',
    name: {
      tr: 'Sabitlenmiş Mesaj HUD',
      en: 'Pinned Message HUD',
      de: 'Angepinnte Nachricht HUD',
      es: 'HUD de Mensaje Fijado',
      pt: 'HUD de Mensagem Fixada',
      ru: 'Закрепленное сообщение HUD',
      ja: 'ピン留めメッセージ HUD',
      pl: 'Przypięta Wiadomość HUD',
      ar: 'HUD الرسالة المثبتة',
    },
    description: {
      tr: 'Chatte sabitlenen mesajı ekranda sesli bildirimle kalıcı olarak gösterir.',
      en: 'Permanently displays pinned chat messages on stream with audio alert.',
      de: 'Zeigt angepinnte Chat-Nachrichten mit Sound auf dem Stream an.',
      es: 'Muestra permanentemente mensajes fijados con alerta de sonido.',
      pt: 'Exibe mensagens fixadas permanentemente com alerta sonoro.',
      ru: 'Показывает закрепленное сообщение со звуком до его снятия.',
      ja: 'ピン留めされたメッセージを音声通知とともに画面に常時表示します。',
      pl: 'Wyświetla przypiętą wiadomość na stałe z dźwiękiem do momentu odpięcia.',
      ar: 'يعرض الرسالة المثبتة بشكل دائم مع تنبيه صوتي حتى إزالتها.',
    },
    fields: [
      {
        name: 'channel',
        label: { tr: 'Kanal Adı', en: 'Channel Name', de: 'Kanalname', es: 'Nombre del canal', pt: 'Nome do canal', ru: 'Имя канала', ja: 'チャンネル名', pl: 'Nazwa kanału', ar: 'اسم القناة' },
        type: 'text',
        defaultValue: 'itsfatih',
        placeholder: 'itsfatih',
      },
      {
        name: 'position',
        label: { tr: 'Ekran Konumu', en: 'Screen Position', de: 'Position', es: 'Posición', pt: 'Posição', ru: 'Позиция', ja: '位置', pl: 'Pozycja', ar: 'الموضع' },
        type: 'select',
        defaultValue: 'top-left',
        options: [
          { label: { tr: 'Sol Üst', en: 'Top Left', de: 'Oben Links', es: 'Arriba Izquierda', pt: 'Canto Superior Esquerdo', ru: 'Сверху Слева', ja: '左上', pl: 'Góra Lewo', ar: 'أعلى اليسار' }, value: 'top-left' },
          { label: { tr: 'Sağ Üst', en: 'Top Right', de: 'Oben Rechts', es: 'Arriba Derecha', pt: 'Canto Superior Direito', ru: 'Сверху Справа', ja: '右上', pl: 'Góra Prawo', ar: 'أعلى اليمين' }, value: 'top-right' },
          { label: { tr: 'Alt Orta', en: 'Bottom Center', de: 'Unten Mitte', es: 'Abajo Centro', pt: 'Centro Inferior', ru: 'Снизу Центр', ja: '下部中央', pl: 'Dół Środek', ar: 'أسفل الوسط' }, value: 'bottom-center' },
        ],
      },
      {
        name: 'accent',
        label: { tr: 'Vurgu Rengi', en: 'Accent Color', de: 'Akzentfarbe', es: 'Color de acento', pt: 'Cor de destaque', ru: 'Цвет акцента', ja: 'アクセントカラー', pl: 'Kolor akcentu', ar: 'لون التمييز' },
        type: 'color',
        defaultValue: '#53FC18',
      },
    ],
  },
  {
    id: 'mini-map',
    category: 'IRL',
    name: {
      tr: 'Mini-Map Radar',
      en: 'Mini-Map Radar',
      de: 'Mini-Map Radar',
      es: 'Mini-Map Radar',
      pt: 'Mini-Map Radar',
      ru: 'Мини-карта Радар',
      ja: 'ミニマップ レーダー',
      pl: 'Mini-Mapa Radar',
      ar: 'رادار الخريطة المصغرة',
    },
    description: {
      tr: 'Canlı radar haritası, hız kadranı ve telefondan anlık GPS takibi.',
      en: 'Live radar map, speedometer HUD, and real-time GPS tracking.',
      de: 'Live-Radarkarte, Tacho-HUD und Echtzeit-GPS-Tracking.',
      es: 'Mini mapa de radar en vivo, velocímetro y seguimiento GPS.',
      pt: 'Mini mapa de radar ao vivo, velocímetro e rastreamento GPS.',
      ru: 'Живая мини-карта радар со спидометром и GPS отслеживанием.',
      ja: 'ライブレーダーマップ、速度計HUD、リアルタイムGPS追跡。',
      pl: 'Radarowa mini-mapa na żywo, prędkościomierz i śledzenie GPS.',
      ar: 'خريطة رادار مصغرة مباشرة، وعداد سرعة، وتتبع GPS.',
    },
    fields: [
      {
        name: 'channel',
        label: { tr: 'Oturum / Kanal Adı', en: 'Session / Channel Name', de: 'Sitzungs- / Kanalname', es: 'Nombre de sesión / canal', pt: 'Nome da sessão / canal', ru: 'Имя сессии / канала', ja: 'セッション / チャンネル名', pl: 'Nazwa sesji / kanału', ar: 'اسم الجلسة / القناة' },
        type: 'text',
        defaultValue: 'itsfatih',
        placeholder: 'itsfatih',
      },
      {
        name: 'shape',
        label: { tr: 'Harita Şekli', en: 'Map Shape', de: 'Kartenform', es: 'Forma del Mapa', pt: 'Formato do Mapa', ru: 'Форма карты', ja: 'マップの形状', pl: 'Kształt mapy', ar: 'شكل الخريطة' },
        type: 'select',
        defaultValue: 'circle',
        options: [
          { label: { tr: 'Yuvarlak', en: 'Circle', de: 'Kreis', es: 'Círculo', pt: 'Círculo', ru: 'Круг', ja: '円形', pl: 'Okrągły', ar: 'دائري' }, value: 'circle' },
          { label: { tr: 'Kare', en: 'Square', de: 'Quadrat', es: 'Cuadrado', pt: 'Quadrado', ru: 'Квадрат', ja: '正方形', pl: 'Kwadratowy', ar: 'مربع' }, value: 'square' },
        ],
      },
      {
        name: 'accent',
        label: { tr: 'Vurgu Rengi', en: 'Accent Color', de: 'Akzentfarbe', es: 'Color de acento', pt: 'Cor de destaque', ru: 'Цвет акцента', ja: 'アクセントカラー', pl: 'Kolor akcentu', ar: 'لون التمييز' },
        type: 'color',
        defaultValue: '#53FC18',
      },
    ],
  },
  {
    id: 'clock',
    category: 'Genel',
    name: {
      tr: 'Minimal Dijital Saat',
      en: 'Minimal Digital Clock',
      de: 'Minimalistische Digitaluhr',
      es: 'Reloj Digital Mínimo',
      pt: 'Relógio Digital Mínimo',
      ru: 'Минимальные цифровые часы',
      ja: 'ミニマルデジタル時計',
      pl: 'Minimalistyczny Zegar Cyfrowy',
      ar: 'ساعة رقمية بسيطة',
    },
    description: {
      tr: 'Şık ve cam efektli ekran üzeri dijital saat katmanı.',
      en: 'Sleek and glass-morphic on-screen digital clock overlay.',
      de: 'Elegantes digitales Uhren-Overlay mit Glaseffekt.',
      es: 'Elegante superposición de reloj digital con efecto de cristal.',
      pt: 'Sobreposição de relógio digital elegante com efeito de vidro.',
      ru: 'Стильный оверлей цифровых часов с эффектом стекла.',
      ja: '洗練されたガラスモーフィズムの画面上デジタル時計オーバーレイ。',
      pl: 'Elegancka nakładka z zegarem cyfrowym z efektem szkła.',
      ar: 'طبقة ساعة رقمية أنيقة بتأثير زجاجي.',
    },
    fields: [],
  },
];
