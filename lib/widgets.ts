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
      tr: 'Kick kanalınızın anlık izleyici sayısını gösteren şeffaf neon rozet.',
      en: 'Displays real-time live viewer count of your Kick channel in neon badge.',
      de: 'Zeigt die Echtzeit-Zuschauerzahl Ihres Kick-Kanals an.',
      es: 'Muestra el recuento de espectadores en vivo de tu canal de Kick.',
      pt: 'Exibe a contagem de espectadores ao vivo do seu canal Kick.',
      ru: 'Показывает количество зрителей вашего канала Kick.',
      ja: 'Kickチャンネルのリアルタイム視聴者数を表示します。',
      pl: 'Wyświetla liczbę widzów Twojego kanału Kick na żywo.',
      ar: 'يعرض عدد المشاهدين المباشرين لقناتك على Kick.',
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
    id: 'follower-goal',
    category: 'Kick',
    name: {
      tr: 'Takipçi Hedefi (Follower Goal)',
      en: 'Follower Goal',
      de: 'Follower-Ziel',
      es: 'Objetivo de Seguidores',
      pt: 'Meta de Seguidores',
      ru: 'Цель по фолловерам',
      ja: 'フォロワー目標',
      pl: 'Cel Obserwujących',
      ar: 'هدف المتابعين',
    },
    description: {
      tr: 'Kick takipçi sayısını otomatik çeken ve yeni takip geldikçe canlı ilerleyen çubuk.',
      en: 'Auto-tracks Kick followers and updates progress bar in real-time.',
      de: 'Verfolgt automatisch Kick-Follower mit Live-Fortschrittsbalken.',
      es: 'Rastrea automáticamente seguidores de Kick con barra de progreso en vivo.',
      pt: 'Rastreia seguidores da Kick automaticamente com barra de progresso ao vivo.',
      ru: 'Автоматически отслеживает фолловеров Kick с полосой прогресса.',
      ja: 'Kickフォロワーを自動追跡しリアルタイムでバーが進行します。',
      pl: 'Automatycznie śledzi obserwujących Kick z paskiem postępu na żywo.',
      ar: 'شريط تقدم يتتبع متابعي Kick تلقائياً مع كل متابع جديد.',
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
        name: 'target',
        label: { tr: 'Hedef Takipçi Sayısı', en: 'Target Follower Count', de: 'Ziel-Follower', es: 'Meta de seguidores', pt: 'Meta de seguidores', ru: 'Целевое число', ja: '目標数', pl: 'Cel', ar: 'العدد المستهدف' },
        type: 'number',
        defaultValue: 1000,
      },
      {
        name: 'accent',
        label: { tr: 'Bar Rengi', en: 'Bar Color', de: 'Balkenfarbe', es: 'Color de barra', pt: 'Cor da barra', ru: 'Цвет полосы', ja: 'バーの色', pl: 'Kolor paska', ar: 'لون الشريط' },
        type: 'color',
        defaultValue: '#53FC18',
      },
    ],
  },
  {
    id: 'sub-goal',
    category: 'Kick',
    name: {
      tr: 'Abone Hedefi (Sub Goal)',
      en: 'Subscriber Goal',
      de: 'Abonnenten-Ziel',
      es: 'Objetivo de Suscriptores',
      pt: 'Meta de Inscritos',
      ru: 'Цель по подпискам',
      ja: 'サブスク目標',
      pl: 'Cel Subskrypcji',
      ar: 'هدف المشتركين',
    },
    description: {
      tr: 'Kick yeni abonelik ve hediye aboneliklerde canlı ilerleyen hedef çubuğu.',
      en: 'Live progress bar updating with new Kick subscriptions and gifts.',
      de: 'Live-Fortschrittsbalken für neue Kick-Abonnements.',
      es: 'Barra de progreso en vivo para nuevas suscripciones de Kick.',
      pt: 'Barra de progresso ao vivo para novas inscrições da Kick.',
      ru: 'Полоса прогресса для новых подписок Kick.',
      ja: '新しいKickサブスクリプションで進行するライブバー。',
      pl: 'Pasek postępu na żywo dla nowych subskrypcji Kick.',
      ar: 'شريط تقدم يتحدث مباشرة مع الاشتراكات الجديدة في Kick.',
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
        name: 'target',
        label: { tr: 'Hedef Abone Sayısı', en: 'Target Sub Count', de: 'Ziel-Abonnenten', es: 'Meta de subs', pt: 'Meta de inscritos', ru: 'Целевое число', ja: '目標サブスク数', pl: 'Cel subów', ar: 'عدد المشتركين المستهدف' },
        type: 'number',
        defaultValue: 50,
      },
      {
        name: 'accent',
        label: { tr: 'Bar Rengi', en: 'Bar Color', de: 'Balkenfarbe', es: 'Color de barra', pt: 'Cor da barra', ru: 'Цвет полосы', ja: 'バーの色', pl: 'Kolor paska', ar: 'لون الشريط' },
        type: 'color',
        defaultValue: '#53FC18',
      },
    ],
  },
  {
    id: 'irl-hud',
    category: 'IRL',
    name: {
      tr: 'IRL Canlı Yayın HUD',
      en: 'IRL Live Stream HUD',
      de: 'IRL Live-Stream HUD',
      es: 'HUD de Transmisión IRL',
      pt: 'HUD de Transmissão IRL',
      ru: 'IRL Стрим HUD',
      ja: 'IRL 配信 HUD',
      pl: 'IRL Stream HUD',
      ar: 'HUD البث المباشر IRL',
    },
    description: {
      tr: 'Dış mekan yayınları için modüler LIVE rozeti, saat, konum ve canlı hava durumu.',
      en: 'Modular LIVE badge, clock, location, and live weather for outdoor streams.',
      de: 'Modulares LIVE-Badge, Uhrzeit, Standort und Live-Wetter für Outdoor-Streams.',
      es: 'Insignia LIVE modular, reloj, ubicación y clima en vivo para exteriores.',
      pt: 'Emblema LIVE modular, relógio, localização e clima ao vivo.',
      ru: 'Модульный значок LIVE, часы, локация и погода для стримов на улице.',
      ja: 'アウトドア配信用のLIVEバッジ、時計、位置情報、天気。',
      pl: 'Modułowa plakietka LIVE, zegar, lokalizacja i pogoda dla streamów w terenie.',
      ar: 'شارة LIVE مع ساعة وموقع وحالة الطقس لبث الأماكن المفتوحة.',
    },
    fields: [
      {
        name: 'city',
        label: { tr: 'Şehir / Konum', en: 'City / Location', de: 'Stadt', es: 'Ciudad', pt: 'Cidade', ru: 'Город', ja: '都市', pl: 'Miasto', ar: 'المدينة' },
        type: 'text',
        defaultValue: 'Istanbul',
        placeholder: 'Istanbul',
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
          { label: { tr: 'Sağ Üst', en: 'Top Right', de: 'Oben Rechts', es: 'Arriba Derecha', pt: 'Canto Superior Direito', ru: 'Сверху Справа', ja: '右上', pl: 'Góra Prawo', ar: 'أعلى اليمin' }, value: 'top-right' },
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
