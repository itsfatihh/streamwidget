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
    id: "kick-viewers",
    category: "Kick",
    name: {
      en: "Kick Live Viewers",
      tr: "Kick Canlı İzleyici",
      es: "Espectadores en vivo de Kick",
      de: "Kick Live-Zuschauer",
      pt: "Espectadores ao vivo da Kick",
      fr: "Spectateurs en direct Kick",
      ru: "Зрители Kick онлайн",
    },
    description: {
      en: "Displays real-time live viewer count of your Kick channel in neon badge.",
      tr: "Kick kanalınızın anlık izleyici sayısını gösteren şeffaf neon rozet.",
      es: "Muestra el recuento de espectadores en vivo de tu canal de Kick.",
      de: "Zeigt die Echtzeit-Zuschauerzahl Ihres Kick-Kanals an.",
      pt: "Exibe a contagem de espectadores ao vivo do seu canal Kick.",
      fr: "Affiche le nombre de spectateurs en direct de votre chaîne Kick.",
      ru: "Показывает количество зрителей вашего канала Kick.",
    },
    fields: [
      {
        name: "channel",
        label: { en: "Channel Name", tr: "Kanal Adı", es: "Nombre del canal", de: "Kanalname", pt: "Nome do canal", fr: "Nom de la chaîne", ru: "Имя канала" },
        type: "text",
        defaultValue: "itsfatih",
        placeholder: "itsfatih",
      },
    ],
  },
  {
    id: "kick-chat",
    category: "Kick",
    name: {
      en: "Kick Pro Chat Overlay",
      tr: "Kick Gelişmiş Canlı Sohbet",
      es: "Superposición de Chat Pro Kick",
      de: "Kick Pro Chat-Overlay",
      pt: "Sobreposição de Chat Kick Pro",
      fr: "Overlay de Chat Kick Pro",
      ru: "Продвинутый чат Kick",
    },
    description: {
      en: "Modern, customizable live chat overlay with themes, text strokes, and font sizes.",
      tr: "Temalar, metin konturu ve font boyutlarına sahip gelişmiş chat katmanı.",
      es: "Superposición de chat moderna con temas, trazo de texto y tamaños de fuente.",
      de: "Modernes Chat-Overlay mit Themes, Textkonturen und Schriftgrößen.",
      pt: "Sobreposição de chat moderna com temas, contorno de texto e tamanhos.",
      fr: "Overlay de chat moderne avec thèmes, contours de texte et tailles de police.",
      ru: "Современный оверлей чата с темами, обводкой текста и размерами шрифта.",
    },
    fields: [
      {
        name: "channel",
        label: { en: "Kick Channel", tr: "Kick Kanalı", es: "Canal de Kick", de: "Kick-Kanal", pt: "Canal Kick", fr: "Chaîne Kick", ru: "Канал Kick" },
        type: "text",
        defaultValue: "itsfatih",
        placeholder: "itsfatih",
      },
      {
        name: "theme",
        label: { en: "Theme Style", tr: "Tasarım Teması", es: "Tema", de: "Design-Stil", pt: "Estilo do Tema", fr: "Style de Thème", ru: "Стиль темы" },
        type: "select",
        defaultValue: "minimal",
        options: [
          { label: { en: "Minimal", tr: "Minimal", es: "Minimalista", de: "Minimalistisch", pt: "Minimalista", fr: "Minimaliste", ru: "Минимал" }, value: "minimal" },
          { label: { en: "Framed", tr: "Çerçeveli", es: "Enmarcado", de: "Umrahmt", pt: "Com Moldura", fr: "Encadré", ru: "В рамке" }, value: "framed" },
        ],
      },
      {
        name: "fontSize",
        label: { en: "Font Size", tr: "Yazı Boyutu", es: "Tamaño de Fuente", de: "Schriftgröße", pt: "Tamanho da Fonte", fr: "Taille de Police", ru: "Размер шрифта" },
        type: "select",
        defaultValue: "medium",
        options: [
          { label: { en: "Small (Compact)", tr: "Küçük", es: "Pequeño", de: "Klein", pt: "Pequeno", fr: "Petit", ru: "Маленький" }, value: "small" },
          { label: { en: "Medium (Standard)", tr: "Orta", es: "Mediano", de: "Mittel", pt: "Médio", fr: "Moyen", ru: "Средний" }, value: "medium" },
          { label: { en: "Large (Big Screen)", tr: "Büyük", es: "Grande", de: "Groß", pt: "Grande", fr: "Grand", ru: "Большой" }, value: "large" },
        ],
      },
      {
        name: "textStroke",
        label: { en: "Text Stroke (Outline)", tr: "Metin Dış Konturu", es: "Borde de Texto", de: "Textkontur", pt: "Contorno do Texto", fr: "Contour du Texte", ru: "Обводка текста" },
        type: "select",
        defaultValue: "thin",
        options: [
          { label: { en: "Off", tr: "Kapalı", es: "Desactivado", de: "Aus", pt: "Desativado", fr: "Désactivé", ru: "Откл" }, value: "none" },
          { label: { en: "Thin (1px)", tr: "İnce (1px)", es: "Fino", de: "Dünn", pt: "Fino", fr: "Fin", ru: "Тонкая" }, value: "thin" },
          { label: { en: "Thick (2px)", tr: "Kalın (2px)", es: "Grueso", de: "Dick", pt: "Grosso", fr: "Épais", ru: "Толстая" }, value: "thick" },
        ],
      },
    ],
  },
  {
    id: "follower-goal",
    category: "Kick",
    name: {
      en: "Follower Goal",
      tr: "Takipçi Hedefi (Follower Goal)",
      es: "Objetivo de Seguidores",
      de: "Follower-Ziel",
      pt: "Meta de Seguidores",
      fr: "Objectif de Followers",
      ru: "Цель по фолловерам",
    },
    description: {
      en: "Auto-tracks Kick followers and updates progress bar in real-time.",
      tr: "Kick takipçi sayısını otomatik çeken ve yeni takip geldikçe canlı ilerleyen çubuk.",
      es: "Rastrea automáticamente seguidores de Kick con barra de progreso en vivo.",
      de: "Verfolgt automatisch Kick-Follower mit Live-Fortschrittsbalken.",
      pt: "Rastreia seguidores da Kick automaticamente com barra de progresso ao vivo.",
      fr: "Suit automatiquement les followers Kick avec barre de progression.",
      ru: "Автоматически отслеживает фолловеров Kick с полосой прогресса.",
    },
    fields: [
      {
        name: "channel",
        label: { en: "Channel Name", tr: "Kanal Adı", es: "Nombre del canal", de: "Kanalname", pt: "Nome do canal", fr: "Nom de la chaîne", ru: "Имя канала" },
        type: "text",
        defaultValue: "itsfatih",
        placeholder: "itsfatih",
      },
      {
        name: "target",
        label: { en: "Target Count", tr: "Hedef Sayısı", es: "Meta", de: "Zielwert", pt: "Meta", fr: "Objectif", ru: "Целевое число" },
        type: "number",
        defaultValue: 1000,
      },
      {
        name: "accent",
        label: { en: "Bar Color", tr: "Bar Rengi", es: "Color de barra", de: "Balkenfarbe", pt: "Cor da barra", fr: "Couleur de la barre", ru: "Цвет полосы" },
        type: "color",
        defaultValue: "#53FC18",
      },
    ],
  },
  {
    id: "sub-goal",
    category: "Kick",
    name: {
      en: "Subscriber Goal",
      tr: "Abone Hedefi (Sub Goal)",
      es: "Objetivo de Suscriptores",
      de: "Abonnenten-Ziel",
      pt: "Meta de Inscritos",
      fr: "Objectif de Subscriptions",
      ru: "Цель по подпискам",
    },
    description: {
      en: "Live progress bar updating with new Kick subscriptions and gifts.",
      tr: "Kick yeni abonelik ve hediye aboneliklerde canlı ilerleyen hedef çubuğu.",
      es: "Barra de progreso en vivo para nuevas suscripciones de Kick.",
      de: "Live-Fortschrittsbalken für neue Kick-Abonnements.",
      pt: "Barra de progresso ao vivo para novas inscrições da Kick.",
      fr: "Barre de progression en direct pour les nouveaux subs Kick.",
      ru: "Полоса прогресса для новых подписок Kick.",
    },
    fields: [
      {
        name: "channel",
        label: { en: "Channel Name", tr: "Kanal Adı", es: "Nombre del canal", de: "Kanalname", pt: "Nome do canal", fr: "Nom de la chaîne", ru: "Имя канала" },
        type: "text",
        defaultValue: "itsfatih",
        placeholder: "itsfatih",
      },
      {
        name: "target",
        label: { en: "Target Count", tr: "Hedef Sayısı", es: "Meta", de: "Zielwert", pt: "Meta", fr: "Objectif", ru: "Целевое число" },
        type: "number",
        defaultValue: 50,
      },
      {
        name: "accent",
        label: { en: "Bar Color", tr: "Bar Rengi", es: "Color de barra", de: "Balkenfarbe", pt: "Cor da barra", fr: "Couleur de la barre", ru: "Цвет полосы" },
        type: "color",
        defaultValue: "#53FC18",
      },
    ],
  },
  {
    id: "irl-hud",
    name: { en: "IRL Stream HUD", tr: "IRL Canlı Yayın HUD", es: "HUD de Transmisión IRL", de: "IRL-Stream-HUD", pt: "HUD de Transmissão IRL", fr: "HUD de Stream IRL", ru: "IRL Стрим HUD" },
    description: { en: "Real-time Live badge, clock, IP geolocation, and weather status. Controlled via Kick chat commands.", tr: "Canlı saat, IP tabanlı konum ve hava durumu. Kick chat komutlarıyla anlık yönetilebilir.", es: "Reloj en tiempo real, geolocalización por IP y clima.", de: "Echtzeituhr, IP-Geolokalisierung und Wetter.", pt: "Relógio em tempo real, geolocalização e clima.", fr: "Horloge en direct, géolocalisation et météo.", ru: "Часы в реальном времени, геолокация и погода." },
    category: "IRL",
    fields: [
      {
        name: "channel",
        label: { en: "Kick Channel Name", tr: "Kick Kanal Adı", es: "Nombre del canal de Kick", de: "Kick-Kanalname", pt: "Nome do Canal Kick", fr: "Nom de la chaîne Kick", ru: "Имя канала Kick" },
        type: "text",
        defaultValue: "itsfatih"
      },
      {
        name: "showLive",
        label: { en: "LIVE Badge", tr: "LIVE Rozeti", es: "Insignia LIVE", de: "LIVE-Abzeichen", pt: "Distintivo LIVE", fr: "Badge LIVE", ru: "Значок LIVE" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { en: "Show", tr: "Açık", es: "Mostrar", de: "Anzeigen", pt: "Mostrar", fr: "Afficher", ru: "Показать" }, value: "true" },
          { label: { en: "Hide", tr: "Kapalı", es: "Ocultar", de: "Ausblenden", pt: "Ocultar", fr: "Masquer", ru: "Скрыть" }, value: "false" }
        ]
      },
      {
        name: "showClock",
        label: { en: "Live Clock", tr: "Canlı Saat", es: "Reloj en Vivo", de: "Echtzeituhr", pt: "Relógio ao Vivo", fr: "Horloge en Direct", ru: "Живые часы" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { en: "Show", tr: "Açık", es: "Mostrar", de: "Anzeigen", pt: "Mostrar", fr: "Afficher", ru: "Показать" }, value: "true" },
          { label: { en: "Hide", tr: "Kapalı", es: "Ocultar", de: "Ausblenden", pt: "Ocultar", fr: "Masquer", ru: "Скрыть" }, value: "false" }
        ]
      },
      {
        name: "showLocation",
        label: { en: "Location", tr: "Konum (Şehir)", es: "Ubicación", de: "Standort", pt: "Localização", fr: "Emplacement", ru: "Локация" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { en: "Show", tr: "Açık", es: "Mostrar", de: "Anzeigen", pt: "Mostrar", fr: "Afficher", ru: "Показать" }, value: "true" },
          { label: { en: "Hide", tr: "Kapalı", es: "Ocultar", de: "Ausblenden", pt: "Ocultar", fr: "Masquer", ru: "Скрыть" }, value: "false" }
        ]
      },
      {
        name: "showWeather",
        label: { en: "Weather", tr: "Hava Durumu", es: "Clima", de: "Wetter", pt: "Clima", fr: "Météo", ru: "Погода" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { en: "Show", tr: "Açık", es: "Mostrar", de: "Anzeigen", pt: "Mostrar", fr: "Afficher", ru: "Показать" }, value: "true" },
          { label: { en: "Hide", tr: "Kapalı", es: "Ocultar", de: "Ausblenden", pt: "Ocultar", fr: "Masquer", ru: "Скрыть" }, value: "false" }
        ]
      },
      {
        name: "theme",
        label: { en: "Theme Style", tr: "Tasarım Teması", es: "Tema", de: "Design-Stil", pt: "Estilo", fr: "Thème", ru: "Стиль" },
        type: "select",
        defaultValue: "framed",
        options: [
          { label: { en: "Framed Capsule", tr: "Çerçeveli Kapsül", es: "Cápsula enmarcada", de: "Kapsel mit Rahmen", pt: "Cápsula com Moldura", fr: "Capsule encadrée", ru: "Капсула в рамке" }, value: "framed" },
          { label: { en: "Minimal Text", tr: "Sade Minimal", es: "Texto minimalista", de: "Minimaler Text", pt: "Texto minimalista", fr: "Texte minimaliste", ru: "Минимал текст" }, value: "minimal" }
        ]
      }
    ]
  },
  {
    id: "mini-map",
    category: "IRL",
    name: {
      en: "Mini-Map Radar",
      tr: "Mini-Map Radar",
      es: "Mini-Map Radar",
      de: "Mini-Map Radar",
      pt: "Mini-Map Radar",
      fr: "Radar Mini-Map",
      ru: "Мини-карта Радар",
    },
    description: {
      en: "Live radar map, speedometer HUD, and real-time GPS tracking.",
      tr: "Canlı radar haritası, hız kadranı ve telefondan anlık GPS takibi.",
      es: "Mini mapa de radar en vivo, velocímetro y seguimiento GPS.",
      de: "Live-Radarkarte, Tacho-HUD und Echtzeit-GPS-Tracking.",
      pt: "Mini mapa de radar ao vivo, velocímetro e rastreamento GPS.",
      fr: "Mini-carte radar en direct, compteur de vitesse et suivi GPS.",
      ru: "Живая мини-карта радар со спидометром и GPS отслеживанием.",
    },
    fields: [
      {
        name: "channel",
        label: { en: "Session Name", tr: "Oturum Adı", es: "Sesión", de: "Sitzungsname", pt: "Sessão", fr: "Nom de session", ru: "Имя сессии" },
        type: "text",
        defaultValue: "itsfatih",
        placeholder: "itsfatih",
      },
      {
        name: "shape",
        label: { en: "Map Shape", tr: "Harita Şekli", es: "Forma del Mapa", de: "Kartenform", pt: "Formato do Mapa", fr: "Forme de carte", ru: "Форма карты" },
        type: "select",
        defaultValue: "circle",
        options: [
          { label: { en: "Circle", tr: "Yuvarlak", es: "Círculo", de: "Kreis", pt: "Círculo", fr: "Cercle", ru: "Круг" }, value: "circle" },
          { label: { en: "Square", tr: "Kare", es: "Cuadrado", de: "Quadrat", pt: "Quadrado", fr: "Carré", ru: "Квадрат" }, value: "square" },
        ],
      },
      {
        name: "accent",
        label: { en: "Accent Color", tr: "Vurgu Rengi", es: "Color de acento", de: "Akzentfarbe", pt: "Cor de destaque", fr: "Couleur accent", ru: "Цвет акцента" },
        type: "color",
        defaultValue: "#53FC18",
      },
    ],
  },
  {
    id: "clock",
    category: "Genel",
    name: {
      en: "Minimal Digital Clock",
      tr: "Minimal Dijital Saat",
      es: "Reloj Digital Mínimo",
      de: "Minimalistische Digitaluhr",
      pt: "Relógio Digital Mínimo",
      fr: "Horloge Digitale Minimale",
      ru: "Минимальные цифровые часы",
    },
    description: {
      en: "Sleek and glass-morphic on-screen digital clock overlay.",
      tr: "Şık ve cam efektli ekran üzeri dijital saat katmanı.",
      es: "Elegante superposición de reloj digital con efecto de cristal.",
      de: "Elegantes digitales Uhren-Overlay mit Glaseffekt.",
      pt: "Sobreposição de relógio digital elegante com efeito de vidro.",
      fr: "Superposition horloge numérique élégante avec effet de verre.",
      ru: "Стильный оверлей цифровых часов с эффектом стекла.",
    },
    fields: [],
  },
];
