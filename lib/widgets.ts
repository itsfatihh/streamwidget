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
      es: 'Espectadores en Vivo Kick',
      pt: 'Espectadores em Direto Kick',
      ru: 'Зрители онлайн Kick',
      ja: 'Kick 閲覧者数',
      pl: 'Kick Widzowie na Żywo',
      ar: 'مشاهدو Kick المباشر',
    },
    description: {
      tr: 'Kick kanalınızın anlık izleyici sayısını gösteren şeffaf neon rozet.',
      en: 'Transparent neon badge showing real-time Kick channel viewer count.',
      de: 'Transparenter Neon-Badge mit der aktuellen Zuschauerzahl.',
      es: 'Insignia de neón transparente con espectadores en directo.',
      pt: 'Crachá de néon transparente com contagem de espectadores.',
      ru: 'Прозрачный неоновый бейдж со зрителями стрима.',
      ja: 'Kickチャンネルの同接数を表示するネオンバッジ。',
      pl: 'Przezroczysta plakietka neonowa z liczbą widzów Kick.',
      ar: 'شارة نيون شفافة تعرض عدد المشاهدين الحاليين على Kick.',
    },
    fields: [
      {
        name: 'channel',
        label: { tr: 'Kick Kanal Adı', en: 'Kick Username', de: 'Kick-Kanalname', es: 'Canal de Kick', pt: 'Canal Kick', ru: 'Имя канала', ja: 'チャンネル名', pl: 'Nazwa kanału', ar: 'اسم القناة' },
        type: 'text',
        defaultValue: 'itsfatih',
        placeholder: 'itsfatih',
      },
      {
        name: 'accent',
        label: { tr: 'Vurgu Rengi', en: 'Accent Color', de: 'Akzentfarbe', es: 'Color de Acento', pt: 'Cor de Destaque', ru: 'Цвет', ja: 'アクセントカラー', pl: 'Kolor', ar: 'اللون' },
        type: 'color',
        defaultValue: '#53FC18',
      },
      {
        name: 'scale',
        label: { tr: 'Boyut (%)', en: 'Scale (%)', de: 'Größe (%)', es: 'Escala (%)', pt: 'Tamanho (%)', ru: 'Масштаб (%)', ja: 'サイズ (%)', pl: 'Skala (%)', ar: 'الحجم (%)' },
        type: 'select',
        defaultValue: '100',
        options: [
          { label: { tr: 'Küçük (%80)', en: 'Small (80%)', de: 'Klein (80%)', es: 'Pequeño (80%)', pt: 'Pequeno (80%)', ru: 'Маленький (80%)', ja: '小 (80%)', pl: 'Mały (80%)', ar: 'صغير (80%)' }, value: '80' },
          { label: { tr: 'Normal (%100)', en: 'Normal (100%)', de: 'Normal (100%)', es: 'Normal (100%)', pt: 'Normal (100%)', ru: 'Обычный (100%)', ja: '標準 (100%)', pl: 'Normalny (100%)', ar: 'عادي (100%)' }, value: '100' },
          { label: { tr: 'Büyük (%125)', en: 'Large (125%)', de: 'Groß (125%)', es: 'Grande (125%)', pt: 'Grande (125%)', ru: 'Большой (125%)', ja: '大 (125%)', pl: 'Duży (125%)', ar: 'كبير (125%)' }, value: '125' },
        ],
      },
    ],
  },
  {
    id: 'kick-chat',
    category: 'Kick',
    name: {
      tr: 'Kick Canlı Sohbet (Chat Box)',
      en: 'Kick Live Chat Box',
      de: 'Kick Live-Chatbox',
      es: 'Caja de Chat Kick',
      pt: 'Caixa de Chat Kick',
      ru: 'Чат-бокс Kick',
      ja: 'Kick ライブチャット',
      pl: 'Kick Czat na Żywo',
      ar: 'صندوق محادثة Kick',
    },
    description: {
      tr: 'OBS için ultra hafif, resmi Kick rozetleri ve ifadeleriyle canlı sohbet.',
      en: 'Ultra lightweight chat overlay with official Kick badges and emotes.',
      de: 'Extrem leichtes Chat-Overlay mit offiziellen Kick-Badges und Emotes.',
      es: 'Superposición de chat ultraligera con insignias y emoticonos de Kick.',
      pt: 'Overlay de chat super leve com crachás e emotes oficiais da Kick.',
      ru: 'Легковесный чат с официальными бейджами и эмодзи Kick.',
      ja: '公式Kickバッジとエモート対応の超軽量チャットオーバーレイ。',
      pl: 'Lekka nakładka na czat z oficjalnymi odznakami i emotkami Kick.',
      ar: 'طبقة دردشة خفيفة جداً مع شارات ورموز Kick الرسمية.',
    },
    fields: [
      {
        name: 'channel',
        label: { tr: 'Kick Kanal Adı', en: 'Kick Username', de: 'Kick-Kanalname', es: 'Canal de Kick', pt: 'Canal Kick', ru: 'Имя канала', ja: 'チャンネル名', pl: 'Nazwa kanału', ar: 'اسم القناة' },
        type: 'text',
        defaultValue: 'itsfatih',
        placeholder: 'itsfatih',
      },
      {
        name: 'scale',
        label: { tr: 'Boyut (%)', en: 'Scale (%)', de: 'Größe (%)', es: 'Escala (%)', pt: 'Tamanho (%)', ru: 'Масштаб (%)', ja: 'サイズ (%)', pl: 'Skala (%)', ar: 'الحجم (%)' },
        type: 'select',
        defaultValue: '100',
        options: [
          { label: { tr: 'Normal (%100)', en: 'Normal (100%)', de: 'Normal (100%)', es: 'Normal (100%)', pt: 'Normal (100%)', ru: 'Обычный (100%)', ja: '標準 (100%)', pl: 'Normalny (100%)', ar: 'عادي (100%)' }, value: '100' },
          { label: { tr: 'Büyük (%125)', en: 'Large (125%)', de: 'Groß (125%)', es: 'Grande (125%)', pt: 'Grande (125%)', ru: 'Большой (125%)', ja: '大 (125%)', pl: 'Duży (125%)', ar: 'كبير (125%)' }, value: '125' },
        ],
      },
    ],
  },
  {
    id: 'follower-goal',
    category: 'Kick',
    name: {
      tr: 'Takipçi Hedefi (Follower Goal)',
      en: 'Follower Goal Bar',
      de: 'Follower-Zielbalken',
      es: 'Meta de Seguidores',
      pt: 'Meta de Seguidores',
      ru: 'Цель по фолловерам',
      ja: 'フォロワー目標バー',
      pl: 'Pasek Celu Obserwujących',
      ar: 'شريط هدف المتابعين',
    },
    description: {
      tr: 'Kick takipçi sayısını otomatik çeken ve yeni takip geldikçe canlı ilerleyen çubuk.',
      en: 'Auto-fetches Kick followers and smoothly progresses in real-time on new follows.',
      de: 'Zieht Follower automatisch ab und füllt sich bei neuen Follows in Echtzeit.',
      es: 'Sincroniza seguidores automáticamente y avanza en vivo.',
      pt: 'Barra automática em tempo real para novos seguidores.',
      ru: 'Автоматически отображает и обновляет прогресс фолловеров.',
      ja: 'フォロワー数を自動取得し、フォロー時にリアルタイム進行。',
      pl: 'Pobiera obserwujących z Kick i aktualizuje się na żywo.',
      ar: 'يسحب عدد المتابعين تلقائياً ويتقدم مباشرة مع كل متابعة جديدة.',
    },
    fields: [
      {
        name: 'channel',
        label: { tr: 'Kick Kanal Adı', en: 'Kick Username', de: 'Kick-Kanalname', es: 'Canal de Kick', pt: 'Canal Kick', ru: 'Имя канала', ja: 'チャンネル名', pl: 'Nazwa kanału', ar: 'اسم القناة' },
        type: 'text',
        defaultValue: 'itsfatih',
        placeholder: 'itsfatih',
      },
      {
        name: 'title',
        label: { tr: 'Hedef Başlığı', en: 'Goal Title', de: 'Zieltitel', es: 'Título de la Meta', pt: 'Título da Meta', ru: 'Название цели', ja: '目標タイトル', pl: 'Tytuł Celu', ar: 'عنوان الهدف' },
        type: 'text',
        defaultValue: 'TAKİPÇİ HEDEFİ',
        placeholder: 'TAKİPÇİ HEDEFİ',
      },
      {
        name: 'target',
        label: { tr: 'Hedef Takipçi', en: 'Target Followers', de: 'Follower-Ziel', es: 'Objetivo de Seguidores', pt: 'Seguidores Alvo', ru: 'Целевое число', ja: '目標フォロワー数', pl: 'Docelowa liczba', ar: 'العدد المستهدف' },
        type: 'number',
        defaultValue: 500,
        placeholder: '500',
      },
      {
        name: 'accent',
        label: { tr: 'Bar Rengi', en: 'Bar Color', de: 'Balkenfarbe', es: 'Color de Barra', pt: 'Cor da Barra', ru: 'Цвет полосы', ja: 'バーの色', pl: 'Kolor paska', ar: 'لون الشريط' },
        type: 'color',
        defaultValue: '#53FC18',
      },
      {
        name: 'scale',
        label: { tr: 'Boyut (%)', en: 'Scale (%)', de: 'Größe (%)', es: 'Escala (%)', pt: 'Tamanho (%)', ru: 'Масштаб (%)', ja: 'サイズ (%)', pl: 'Skala (%)', ar: 'الحجم (%)' },
        type: 'select',
        defaultValue: '100',
        options: [
          { label: { tr: 'Normal (%100)', en: 'Normal (100%)', de: 'Normal (100%)', es: 'Normal (100%)', pt: 'Normal (100%)', ru: 'Обычный (100%)', ja: '標準 (100%)', pl: 'Normalny (100%)', ar: 'عادي (100%)' }, value: '100' },
          { label: { tr: 'Büyük (%125)', en: 'Large (125%)', de: 'Groß (125%)', es: 'Grande (125%)', pt: 'Grande (125%)', ru: 'Большой (125%)', ja: '大 (125%)', pl: 'Duży (125%)', ar: 'كبير (125%)' }, value: '125' },
        ],
      },
    ],
  },
  {
    id: 'sub-goal',
    category: 'Kick',
    name: {
      tr: 'Abone Hedefi (Sub Goal)',
      en: 'Subscriber Goal Bar',
      de: 'Abonnenten-Zielbalken',
      es: 'Meta de Suscriptores',
      pt: 'Meta de Subscritores',
      ru: 'Цель по подпискам',
      ja: 'サブスク目標バー',
      pl: 'Pasek Celu Subskrypcji',
      ar: 'شريط هدف المشتركين',
    },
    description: {
      tr: 'Kick yeni abonelik ve hediye aboneliklerde canlı ilerleyen hedef çubuğu.',
      en: 'Real-time progress bar for Kick subscriptions and gifted subs.',
      de: 'Echtzeit-Fortschrittsbalken für Abonnements und Geschenk-Abos.',
      es: 'Barra de progreso en tiempo real para subs y regalos.',
      pt: 'Barra de progresso em direto para novos subs e presentes.',
      ru: 'Полоса прогресса платных и подарочных подписок в реальном времени.',
      ja: '新規サブスクやギフト時にリアルタイムで進む目標バー。',
      pl: 'Pasek postępu dla nowych subskrypcji w czasie rzeczywistym.',
      ar: 'شريط تقدم مباشر للاشتراكات الجديدة والمهداة.',
    },
    fields: [
      {
        name: 'channel',
        label: { tr: 'Kick Kanal Adı', en: 'Kick Username', de: 'Kick-Kanalname', es: 'Canal de Kick', pt: 'Canal Kick', ru: 'Имя канала', ja: 'チャンネル名', pl: 'Nazwa kanału', ar: 'اسم القناة' },
        type: 'text',
        defaultValue: 'itsfatih',
        placeholder: 'itsfatih',
      },
      {
        name: 'title',
        label: { tr: 'Hedef Başlığı', en: 'Goal Title', de: 'Zieltitel', es: 'Título de la Meta', pt: 'Título da Meta', ru: 'Название цели', ja: '目標タイトル', pl: 'Tytuł Celu', ar: 'عنوان الهدف' },
        type: 'text',
        defaultValue: 'ABONE HEDEFİ',
        placeholder: 'ABONE HEDEFİ',
      },
      {
        name: 'current',
        label: { tr: 'Mevcut / Başlangıç Abone', en: 'Starting Subs', de: 'Start-Abos', es: 'Subs Iniciales', pt: 'Subs Iniciais', ru: 'Начальные сабы', ja: '開始サブスク数', pl: 'Początkowe suby', ar: 'المشتركون الحاليون' },
        type: 'number',
        defaultValue: 0,
        placeholder: '0',
      },
      {
        name: 'target',
        label: { tr: 'Hedef Abone Sayısı', en: 'Target Subscribers', de: 'Abonnenten-Ziel', es: 'Objetivo de Subs', pt: 'Subscritores Alvo', ru: 'Целевые сабы', ja: '目標サブスク数', pl: 'Docelowe suby', ar: 'الهدف المطلوب' },
        type: 'number',
        defaultValue: 25,
        placeholder: '25',
      },
      {
        name: 'accent',
        label: { tr: 'Bar Rengi', en: 'Bar Color', de: 'Balkenfarbe', es: 'Color de Barra', pt: 'Cor da Barra', ru: 'Цвет полосы', ja: 'バーの色', pl: 'Kolor paska', ar: 'لون الشريط' },
        type: 'color',
        defaultValue: '#A970FF',
      },
      {
        name: 'scale',
        label: { tr: 'Boyut (%)', en: 'Scale (%)', de: 'Größe (%)', es: 'Escala (%)', pt: 'Tamanho (%)', ru: 'Масштаб (%)', ja: 'サイズ (%)', pl: 'Skala (%)', ar: 'الحجم (%)' },
        type: 'select',
        defaultValue: '100',
        options: [
          { label: { tr: 'Normal (%100)', en: 'Normal (100%)', de: 'Normal (100%)', es: 'Normal (100%)', pt: 'Normal (100%)', ru: 'Обычный (100%)', ja: '標準 (100%)', pl: 'Normalny (100%)', ar: 'عادي (100%)' }, value: '100' },
          { label: { tr: 'Büyük (%125)', en: 'Large (125%)', de: 'Groß (125%)', es: 'Grande (125%)', pt: 'Grande (125%)', ru: 'Большой (125%)', ja: '大 (125%)', pl: 'Duży (125%)', ar: 'كبير (125%)' }, value: '125' },
        ],
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
      es: 'HUD para Transmisión IRL',
      pt: 'HUD de Transmissão IRL',
      ru: 'HUD для IRL-стримов',
      ja: 'IRL配信用HUDバー',
      pl: 'HUD do Transmisji IRL',
      ar: 'شريط HUD للبث الخارجي',
    },
    description: {
      tr: 'Dış mekan yayınları için modüler LIVE rozeti, saat, konum, hava durumu ve canlı pil durumu.',
      en: 'Modular LIVE badge, clock, dynamic location, weather, and battery for IRL streams.',
      de: 'Modulares HUD mit LIVE-Badge, Uhr, Standort, Wetter und Akkustand.',
      es: 'Insignia LIVE modular, reloj, ubicación dinámica, clima y batería.',
      pt: 'HUD modular com LIVE, relógio, localização, meteorologia e bateria.',
      ru: 'Модульный оверлей: статус LIVE, время, город, погода и батарея.',
      ja: 'LIVE表示、時計、位置情報、天気、バッテリーをまとめたバー。',
      pl: 'Modułowy pasek z plakietką LIVE, zegarem, lokalizacją i pogodą.',
      ar: 'شريط مرن يحتوي على شارة البث، الساعة، الموقع، الطقس والبطارية.',
    },
    fields: [
      {
        name: 'channel',
        label: { tr: 'Kick Kanal Adı', en: 'Kick Username', de: 'Kick-Kanalname', es: 'Canal de Kick', pt: 'Canal Kick', ru: 'Имя канала', ja: 'チャンネル名', pl: 'Nazwa kanału', ar: 'اسم القناة' },
        type: 'text',
        defaultValue: 'itsfatih',
        placeholder: 'itsfatih',
      },
      {
        name: 'showLive',
        label: { tr: 'LIVE Rozeti Gösterilsin mi?', en: 'Show LIVE Badge?', de: 'LIVE-Badge anzeigen?', es: '¿Mostrar LIVE?', pt: 'Mostrar LIVE?', ru: 'Показывать LIVE?', ja: 'LIVEバッジを表示？', pl: 'Pokazać LIVE?', ar: 'إظهار شارة LIVE؟' },
        type: 'select',
        defaultValue: 'true',
        options: [
          { label: { tr: 'Evet (Göster)', en: 'Yes (Show)', de: 'Ja (Anzeigen)', es: 'Sí (Mostrar)', pt: 'Sim (Mostrar)', ru: 'Да (Показать)', ja: 'はい (表示)', pl: 'Tak (Pokaż)', ar: 'نعم (إظهار)' }, value: 'true' },
          { label: { tr: 'Hayır (Gizle)', en: 'No (Hide)', de: 'Nein (Ausblenden)', es: 'No (Ocultar)', pt: 'Não (Ocultar)', ru: 'Нет (Скрыть)', ja: 'いいえ (非表示)', pl: 'Nie (Ukryj)', ar: 'لا (إخفاء)' }, value: 'false' },
        ],
      },
      {
        name: 'showClock',
        label: { tr: 'Saat Gösterilsin mi?', en: 'Show Clock?', de: 'Uhr anzeigen?', es: '¿Mostrar Reloj?', pt: 'Mostrar Relógio?', ru: 'Показывать часы?', ja: '時計を表示？', pl: 'Pokazać zegar?', ar: 'إظهار الساعة؟' },
        type: 'select',
        defaultValue: 'true',
        options: [
          { label: { tr: 'Evet (Göster)', en: 'Yes (Show)', de: 'Ja (Anzeigen)', es: 'Sí (Mostrar)', pt: 'Sim (Mostrar)', ru: 'Да (Показать)', ja: 'はい (表示)', pl: 'Tak (Pokaż)', ar: 'نعم (إظهار)' }, value: 'true' },
          { label: { tr: 'Hayır (Gizle)', en: 'No (Hide)', de: 'Nein (Ausblenden)', es: 'No (Ocultar)', pt: 'Não (Ocultar)', ru: 'Нет (Скрыть)', ja: 'いいえ (非表示)', pl: 'Nie (Ukryj)', ar: 'لا (إخفاء)' }, value: 'false' },
        ],
      },
      {
        name: 'format',
        label: { tr: 'Saat Formatı', en: 'Clock Format', de: 'Uhrzeitformat', es: 'Formato de Hora', pt: 'Formato da Hora', ru: 'Формат времени', ja: '時間フォーマット', pl: 'Format godziny', ar: 'تنسيق الوقت' },
        type: 'select',
        defaultValue: '24',
        options: [
          { label: { tr: '24 Saat (19:30)', en: '24-Hour (19:30)', de: '24 Stunden (19:30)', es: '24 Horas (19:30)', pt: '24 Horas (19:30)', ru: '24 часа (19:30)', ja: '24時間表記 (19:30)', pl: '24-godzinny (19:30)', ar: '24 ساعة (19:30)' }, value: '24' },
          { label: { tr: '12 Saat (07:30 PM)', en: '12-Hour (07:30 PM)', de: '12 Stunden (07:30 PM)', es: '12 Horas (07:30 PM)', pt: '12 Horas (07:30 PM)', ru: '12 часов (07:30 PM)', ja: '12時間表記 (07:30 PM)', pl: '12-godzinny (07:30 PM)', ar: '12 ساعة (07:30 PM)' }, value: '12' },
        ],
      },
      {
        name: 'showLocation',
        label: { tr: 'Konum Gösterilsin mi?', en: 'Show Location?', de: 'Standort anzeigen?', es: '¿Mostrar Ubicación?', pt: 'Mostrar Localização?', ru: 'Показывать локацию?', ja: '位置情報を表示？', pl: 'Pokazać lokalizację?', ar: 'إظهار الموقع؟' },
        type: 'select',
        defaultValue: 'true',
        options: [
          { label: { tr: 'Evet (Göster)', en: 'Yes (Show)', de: 'Ja (Anzeigen)', es: 'Sí (Mostrar)', pt: 'Sim (Mostrar)', ru: 'Да (Показать)', ja: 'はい (表示)', pl: 'Tak (Pokaż)', ar: 'نعم (إظهار)' }, value: 'true' },
          { label: { tr: 'Hayır (Gizle)', en: 'No (Hide)', de: 'Nein (Ausblenden)', es: 'No (Ocultar)', pt: 'Não (Ocultar)', ru: 'Нет (Скрыть)', ja: 'いいえ (非表示)', pl: 'Nie (Ukryj)', ar: 'لا (إخفاء)' }, value: 'false' },
        ],
      },
      {
        name: 'location',
        label: { tr: 'Konum (Boşsa otomatik)', en: 'Location (Auto if blank)', de: 'Standort (Auto wenn leer)', es: 'Ubicación (Auto)', pt: 'Localização (Auto)', ru: 'Локация (Авто)', ja: '位置情報 (自動)', pl: 'Lokalizacja (Auto)', ar: 'الموقع (تلقائي)' },
        type: 'text',
        defaultValue: 'auto',
        placeholder: 'auto',
      },
      {
        name: 'showWeather',
        label: { tr: 'Hava Durumu Gösterilsin mi?', en: 'Show Weather?', de: 'Wetter anzeigen?', es: '¿Mostrar Clima?', pt: 'Mostrar Meteorologia?', ru: 'Показывать погоду?', ja: '天気を表示？', pl: 'Pokazać pogodę?', ar: 'إظهار الطقس؟' },
        type: 'select',
        defaultValue: 'true',
        options: [
          { label: { tr: 'Evet (Göster)', en: 'Yes (Show)', de: 'Ja (Anzeigen)', es: 'Sí (Mostrar)', pt: 'Sim (Mostrar)', ru: 'Да (Показать)', ja: 'はい (表示)', pl: 'Tak (Pokaż)', ar: 'نعم (إظهار)' }, value: 'true' },
          { label: { tr: 'Hayır (Gizle)', en: 'No (Hide)', de: 'Nein (Ausblenden)', es: 'No (Ocultar)', pt: 'Não (Ocultar)', ru: 'Нет (Скрыть)', ja: 'いいえ (非表示)', pl: 'Nie (Ukryj)', ar: 'لا (إخفاء)' }, value: 'false' },
        ],
      },
      {
        name: 'scale',
        label: { tr: 'Boyut (%)', en: 'Scale (%)', de: 'Größe (%)', es: 'Escala (%)', pt: 'Tamanho (%)', ru: 'Масштаб (%)', ja: 'サイズ (%)', pl: 'Skala (%)', ar: 'الحجم (%)' },
        type: 'select',
        defaultValue: '100',
        options: [
          { label: { tr: 'Normal (%100)', en: 'Normal (100%)', de: 'Normal (100%)', es: 'Normal (100%)', pt: 'Normal (100%)', ru: 'Обычный (100%)', ja: '標準 (100%)', pl: 'Normalny (100%)', ar: 'عادي (100%)' }, value: '100' },
          { label: { tr: 'Büyük (%125)', en: 'Large (125%)', de: 'Groß (125%)', es: 'Grande (125%)', pt: 'Grande (125%)', ru: 'Большой (125%)', ja: '大 (125%)', pl: 'Duży (125%)', ar: 'كبير (125%)' }, value: '125' },
        ],
      },
    ],
  },
  {
    id: 'clock',
    category: 'Genel',
    name: {
      tr: 'Minimal Dijital Saat',
      en: 'Minimal Digital Clock',
      de: 'Minimale Digitaluhr',
      es: 'Reloj Digital Minimalista',
      pt: 'Relógio Digital Minimalista',
      ru: 'Цифровые часы',
      ja: 'ミニマルデジタル時計',
      pl: 'Minimalistyczny Zegar Cyfrowy',
      ar: 'ساعة رقمية بسيطة',
    },
    description: {
      tr: 'Şık ve cam efektli ekran üzeri dijital saat katmanı.',
      en: 'Sleek glassmorphism on-screen digital clock overlay.',
      de: 'Elegantes Glasmorphismus-Overlay mit digitaler Uhr.',
      es: 'Capa de reloj digital translúcida con efecto glassmorphism.',
      pt: 'Camada de relógio digital elegante em estilo glassmorphism.',
      ru: 'Стильные прозрачные цифровые часы на экран.',
      ja: 'ガラスモーフィズム調のスタイリッシュな画面上時計。',
      pl: 'Elegancki zegar ekranowy w stylu glassmorphism.',
      ar: 'ساعة رقمية شفافة وجذابة للشاشة بتقنية Glassmorphism.',
    },
    fields: [
      {
        name: 'format',
        label: { tr: 'Saat Formatı', en: 'Clock Format', de: 'Uhrzeitformat', es: 'Formato de Hora', pt: 'Formato da Hora', ru: 'Формат времени', ja: '時間フォーマット', pl: 'Format godziny', ar: 'تنسيق الوقت' },
        type: 'select',
        defaultValue: '24',
        options: [
          { label: { tr: '24 Saat', en: '24-Hour', de: '24 Stunden', es: '24 Horas', pt: '24 Horas', ru: '24 часа', ja: '24時間表記', pl: '24-godzinny', ar: '24 ساعة' }, value: '24' },
          { label: { tr: '12 Saat', en: '12-Hour', de: '12 Stunden', es: '12 Horas', pt: '12 Horas', ru: '12 часов', ja: '12時間表記', pl: '12-godzinny', ar: '12 ساعة' }, value: '12' },
        ],
      },
    ],
  },
  {
    id: "events",
    name: {
      tr: "Son Olaylar (Stream Labels)",
      en: "Stream Labels (Events)",
      de: "Letzte Ereignisse (Stream Labels)",
      es: "Últimos Eventos (Stream Labels)",
      pt: "Últimos Eventos (Stream Labels)",
      ru: "Последние события (Stream Labels)",
      ja: "最新イベント (Stream Labels)",
      pl: "Ostatnie zdarzenia (Stream Labels)",
      ar: "أحدث الفعاليات (Stream Labels)",
    },
    description: {
      tr: "Son takipçi, abone, host ve hediye abonelik rozetleri.",
      en: "Latest follower, subscriber, host and gifted sub badges.",
      de: "Letzte Follower-, Abonnenten-, Host- und Geschenk-Sub-Badges.",
      es: "Insignias de últimos seguidores, suscriptores, hosts y subs regaladas.",
      pt: "Emblemas de seguidores, inscritos, hosts e subs de presente.",
      ru: "Значки последних подписчиков, сабов, хостов и подарочных сабов.",
      ja: "最新のフォロワー、サブスク、ホスト、ギフトサブのバッジ。",
      pl: "Odznaki ostatnich obserwujących, subskrybentów, hostów i prezentów.",
      ar: "شارات أحدث المتابعين والمشتركين والمضيفين والاشتراكات المهدات.",
    },
    fields: [
      {
        name: "channel",
        label: { tr: "Kick Kanal Adı", en: "Kick Channel Name", de: "Kick-Kanalname", es: "Nombre del canal de Kick", pt: "Nome do Canal Kick", ru: "Имя канала Kick", ja: "Kickチャンネル名", pl: "Nazwa kanału Kick", ar: "اسم قناة Kick" },
        type: "text",
        defaultValue: "itsfatih",
      },
      {
        name: "limit",
        label: { tr: "Gösterilecek Olay Sayısı", en: "Event Limit", de: "Ereignislimit", es: "Límite de Eventos", pt: "Limite de Eventos", ru: "Лимит событий", ja: "表示イベント数", pl: "Limit zdarzeń", ar: "عدد الفعاليات" },
        type: "select",
        defaultValue: "3",
        options: [
          { label: { tr: "1 (Yalnızca En Son)", en: "1 (Latest Only)", de: "1 (Nur Letztes)", es: "1 (Solo Último)", pt: "1 (Apenas Último)", ru: "1 (Только последний)", ja: "1件（最新のみ）", pl: "1 (Tylko ostatnie)", ar: "1 (الأحدث فقط)" }, value: "1" },
          { label: { tr: "3 Olay", en: "3 Events", de: "3 Ereignisse", es: "3 Eventos", pt: "3 Eventos", ru: "3 события", ja: "3件", pl: "3 zdarzenia", ar: "3 فعاليات" }, value: "3" },
          { label: { tr: "5 Olay", en: "5 Events", de: "5 Ereignisse", es: "5 Eventos", pt: "5 Eventos", ru: "5 Ereignisse", ja: "5件", pl: "5 zdarzeń", ar: "5 فعاليات" }, value: "5" },
        ],
      },
      {
        name: "events",
        label: { tr: "Olay Tipleri", en: "Event Types", de: "Ereignistypen", es: "Tipos de Eventos", pt: "Tipos de Eventos", ru: "Типы событий", ja: "イベントタイプ", pl: "Typy zdarzeń", ar: "أنواع الفعاليات" },
        type: "select",
        defaultValue: "follower,subscriber,host,gifted",
        options: [
          { label: { tr: "Tümü (Takip, Abone, Host, Hediye)", en: "All (Follow, Sub, Host, Gift)", de: "Alle", es: "Todos", pt: "Todos", ru: "Все", ja: "すべて", pl: "Wszystkie", ar: "الكل" }, value: "follower,subscriber,host,gifted" },
          { label: { tr: "Sadece Takip ve Abone", en: "Only Follow & Sub", de: "Nur Follow & Sub", es: "Solo Follow y Sub", pt: "Apenas Follow e Sub", ru: "Только фолловы и сабы", ja: "フォロワーとサブスクのみ", pl: "Tylko obserwacje i suby", ar: "المتابعات والاشتراكات فقط" }, value: "follower,subscriber" },
          { label: { tr: "Sadece Abonelikler (Sub & Gift)", en: "Only Subs & Gifts", de: "Nur Subs & Geschenke", es: "Solo Subs y Regalos", pt: "Apenas Subs e Presentes", ru: "Только сабы и подарки", ja: "サブスクとギフトのみ", pl: "Tylko suby i prezenty", ar: "الاشتراكات والهدايا فقط" }, value: "subscriber,gifted" },
          { label: { tr: "Sadece Takipçiler", en: "Only Followers", de: "Nur Follower", es: "Solo Seguidores", pt: "Apenas Seguidores", ru: "Только подписчики", ja: "フォロワーのみ", pl: "Tylko obserwujący", ar: "المتابعون فقط" }, value: "follower" },
        ],
      },
      {
        name: "accent",
        label: { tr: "Vurgu Rengi", en: "Accent Color", de: "Akzentfarbe", es: "Color de Acento", pt: "Cor de Destaque", ru: "Цвет акцента", ja: "アクセントカラー", pl: "Kolor akcentu", ar: "لون التمييز" },
        type: "color",
        defaultValue: "#53FC18",
      },
    ],
  },
];