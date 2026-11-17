export interface WidgetFieldOption {
  label: Record<string, string>;
  value: string;
}

export interface WidgetField {
  name: string;
  label: Record<string, string>;
  type: 'text' | 'select' | 'color';
  defaultValue: string;
  options?: WidgetFieldOption[];
}

export interface WidgetDef {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  category: string;
  fields: WidgetField[];
  // When true, the widget is shown on the home grid as a disabled
  // "Coming soon / Yakında" card and does not link to the builder.
  comingSoon?: boolean;
}

export const WIDGETS_LIST: WidgetDef[] = [
  {
    id: "irl-hud",
    name: {
      tr: "IRL Canlı Yayın HUD",
      en: "IRL Stream HUD",
      de: "IRL-Stream-HUD",
      es: "HUD de Transmisión IRL",
      fr: "HUD de Stream IRL",
      pt: "HUD de Stream IRL",
      ru: "IRL Стрим HUD"
    },
    description: {
      tr: "Canlı saat, IP tabanlı konum ve hava durumu. Kick chat komutlarıyla anlık yönetilebilir.",
      en: "Live clock, IP-based location and weather. Real-time controls via Kick chat.",
      de: "Live-Uhr, IP-basierter Standort und Wetter.",
      es: "Reloj en vivo, ubicación y clima basados en IP.",
      fr: "Horloge en direct, localisation par IP et météo.",
      pt: "Relógio ao vivo, localização por IP e clima.",
      ru: "Живые часы, погода и геолокация по IP."
    },
    category: "IRL",
    fields: [
      {
        name: "channel",
        label: { tr: "Kick Kanal Adı", en: "Kick Channel", de: "Kick-Kanal", es: "Canal Kick", fr: "Chaîne Kick", pt: "Canal Kick", ru: "Канал Kick" },
        type: "text",
        defaultValue: "itsfatih"
      },
      {
        name: "show_live",
        label: { tr: "Live Rozeti", en: "Live Badge", de: "Live-Badge", es: "Insignia en Vivo", fr: "Badge Live", pt: "Selo Ao Vivo", ru: "Live значок" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { tr: "Açık", en: "Enabled", de: "Aktiviert", es: "Activado", fr: "Activé", pt: "Ativado", ru: "Вкл" }, value: "true" },
          { label: { tr: "Kapalı", en: "Disabled", de: "Deaktiviert", es: "Desactivado", fr: "Désactivé", pt: "Desativado", ru: "Выкл" }, value: "false" }
        ]
      },
      {
        name: "show_clock",
        label: { tr: "Canlı Saat", en: "Live Clock", de: "Live-Uhr", es: "Reloj en Vivo", fr: "Horloge", pt: "Relógio", ru: "Часы" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { tr: "Açık", en: "Enabled", de: "Aktiviert", es: "Activado", fr: "Activé", pt: "Ativado", ru: "Вкл" }, value: "true" },
          { label: { tr: "Kapalı", en: "Disabled", de: "Deaktiviert", es: "Desactivado", fr: "Désactivé", pt: "Desativado", ru: "Выкл" }, value: "false" }
        ]
      },
      {
        name: "show_location",
        label: { tr: "Konum (Şehir)", en: "Location", de: "Standort", es: "Ubicación", fr: "Emplacement", pt: "Localização", ru: "Локация" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { tr: "Açık", en: "Enabled", de: "Aktiviert", es: "Activado", fr: "Activé", pt: "Ativado", ru: "Вкл" }, value: "true" },
          { label: { tr: "Kapalı", en: "Disabled", de: "Deaktiviert", es: "Desactivado", fr: "Désactivé", pt: "Desativado", ru: "Выкл" }, value: "false" }
        ]
      },
      {
        name: "show_weather",
        label: { tr: "Hava Durumu", en: "Weather", de: "Wetter", es: "Clima", fr: "Météo", pt: "Clima", ru: "Погода" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { tr: "Açık", en: "Enabled", de: "Aktiviert", es: "Activado", fr: "Activé", pt: "Ativado", ru: "Вкл" }, value: "true" },
          { label: { tr: "Kapalı", en: "Disabled", de: "Deaktiviert", es: "Desactivado", fr: "Désactivé", pt: "Desativado", ru: "Выкл" }, value: "false" }
        ]
      },
      {
        name: "city",
        label: { tr: "Şehir (Opsiyonel, boşsa IP)", en: "City (Optional, IP if empty)", de: "Stadt (Optional, sonst IP)", es: "Ciudad (Opcional, IP si vacío)", fr: "Ville (Optionnel, IP si vide)", pt: "Cidade (Opcional, IP se vazio)", ru: "Город (Опц., иначе по IP)" },
        type: "text",
        defaultValue: ""
      },
      {
        name: "theme",
        label: { tr: "Tasarım Teması", en: "Theme Style", de: "Design-Stil", es: "Estilo de Tema", fr: "Style de Thème", pt: "Estilo", ru: "Тема" },
        type: "select",
        defaultValue: "capsule",
        options: [
          { label: { tr: "Çerçeveli Kapsül", en: "Bordered Capsule", de: "Kapsel", es: "Cápsula", fr: "Capsule", pt: "Cápsula", ru: "Капсула" }, value: "capsule" },
          { label: { tr: "Minimal", en: "Minimal", de: "Minimal", es: "Minimalista", fr: "Minimaliste", pt: "Minimalista", ru: "Минимал" }, value: "minimal" }
        ]
      }
    ]
  },
  {
    id: "mini-map",
    name: {
      tr: "Mini Harita",
      en: "Mini Map",
      de: "Minikarte",
      es: "Mini Mapa",
      fr: "Mini Carte",
      pt: "Mini Mapa",
      ru: "Мини-карта"
    },
    description: {
      tr: "Canlı GPS takip radarı ve mini harita. Yayında anlık konumunuzu ve hızınızı şık bir harita üzerinde gösterir.",
      en: "Live GPS tracking radar and mini map. Shows current location and speed.",
      de: "Live-GPS-Tracking-Radar und Minikarte.",
      es: "Radar y mini mapa GPS en vivo.",
      fr: "Radar GPS et mini-carte en direct.",
      pt: "Radar de rastreamento GPS e mini mapa ao vivo.",
      ru: "GPS радар и мини-карта в реальном времени."
    },
    category: "IRL",
    fields: [
      {
        name: "channel",
        label: { tr: "Kanal / Kullanıcı Adı", en: "Channel Username", de: "Kanalname", es: "Nombre del Canal", fr: "Nom de Chaîne", pt: "Nome do Canal", ru: "Имя канала" },
        type: "text",
        defaultValue: "itsfatih"
      },
      {
        name: "theme",
        label: { tr: "Harita Teması", en: "Map Theme", de: "Kartenthema", es: "Tema del Mapa", fr: "Thème de Carte", pt: "Tema do Mapa", ru: "Тема карты" },
        type: "select",
        defaultValue: "dark",
        options: [
          { label: { tr: "Karanlık Mod", en: "Dark Mode", de: "Dunkel", es: "Oscuro", fr: "Sombre", pt: "Escuro", ru: "Темная" }, value: "dark" },
          { label: { tr: "Aydınlık Mod", en: "Light Mode", de: "Hell", es: "Claro", fr: "Clair", pt: "Claro", ru: "Светлая" }, value: "light" },
          { label: { tr: "Gece Mavisi", en: "Midnight", de: "Mitternacht", es: "Medianoche", fr: "Minuit", pt: "Meia-noite", ru: "Полночь" }, value: "midnight" }
        ]
      },
      {
        name: "shape",
        label: { tr: "Harita Şekli", en: "Map Shape", de: "Kartenform", es: "Forma del Mapa", fr: "Forme de Carte", pt: "Forma do Mapa", ru: "Форма карты" },
        type: "select",
        defaultValue: "circle",
        options: [
          { label: { tr: "Daire", en: "Circle", de: "Kreis", es: "Círculo", fr: "Cercle", pt: "Círculo", ru: "Круг" }, value: "circle" },
          { label: { tr: "Kare", en: "Square", de: "Quadrat", es: "Cuadrado", fr: "Carré", pt: "Quadrado", ru: "Квадрат" }, value: "square" }
        ]
      },
      {
        name: "zoom",
        label: { tr: "Harita Yakınlaştırma (12 - 18)", en: "Zoom Level (12 - 18)", de: "Zoom", es: "Zoom", fr: "Zoom", pt: "Zoom", ru: "Зум" },
        type: "text",
        defaultValue: "15"
      },
      {
        name: "show_speed",
        label: { tr: "Hız Göstergesi (km/h)", en: "Speed Indicator", de: "Geschwindigkeit", es: "Velocímetro", fr: "Vitesse", pt: "Velocidade", ru: "Скорость" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { tr: "Açık", en: "Enabled", de: "Aktiviert", es: "Activado", fr: "Activé", pt: "Ativado", ru: "Вкл" }, value: "true" },
          { label: { tr: "Kapalı", en: "Disabled", de: "Deaktiviert", es: "Desactivado", fr: "Désactivé", pt: "Desativado", ru: "Выкл" }, value: "false" }
        ]
      }
    ]
  },
  {
    id: "follower-goal",
    name: {
      tr: "Takipçi Hedefi",
      en: "Follower Goal",
      de: "Follower-Ziel",
      es: "Meta de Seguidores",
      fr: "Objectif Follower",
      pt: "Meta de Seguidores",
      ru: "Цель фолловеров"
    },
    description: {
      tr: "Kick takipçi sayısını otomatik çeken ve yeni takip geldikçe canlı ilerleyen çubuk.",
      en: "Automatically tracks Kick follower count with dynamic animated progress.",
      de: "Verfolgt automatisch die Kick-Follower-Zahl.",
      es: "Rastrea seguidores de Kick automáticamente.",
      fr: "Suit automatiquement les followers Kick.",
      pt: "Acompanha seguidores da Kick automaticamente.",
      ru: "Автоматический трекер фолловеров Kick."
    },
    category: "ENGAGE",
    fields: [
      {
        name: "channel",
        label: { tr: "Kick Kanal Adı", en: "Kick Channel", de: "Kick-Kanal", es: "Canal Kick", fr: "Chaîne Kick", pt: "Canal Kick", ru: "Канал Kick" },
        type: "text",
        defaultValue: "itsfatih"
      },
      {
        name: "target",
        label: { tr: "Hedef Sayısı", en: "Target Goal", de: "Zielanzahl", es: "Objetivo", fr: "Cible", pt: "Meta", ru: "Цель" },
        type: "text",
        defaultValue: "1000"
      },
      {
        name: "title",
        label: { tr: "Başlık Metni", en: "Title Text", de: "Titel", es: "Título", fr: "Titre", pt: "Título", ru: "Заголовок" },
        type: "text",
        defaultValue: "TAKİPÇİ HEDEFİ"
      },
      {
        name: "bar_color",
        label: { tr: "Bar Rengi", en: "Bar Color", de: "Balkenfarbe", es: "Color de Barra", fr: "Couleur de Barre", pt: "Cor da Barra", ru: "Цвет полосы" },
        type: "color",
        defaultValue: "#00e701"
      }
    ]
  },
  {
    id: "chat-overlay",
    name: {
      tr: "Canlı Sohbet Kutusu",
      en: "Chat Overlay",
      de: "Chat-Overlay",
      es: "Superposición de Chat",
      fr: "Overlay de Chat",
      pt: "Overlay de Chat",
      ru: "Чат Оверлей"
    },
    description: {
      tr: "Kick canlı sohbet mesajlarını şeffaf ve animasyonlu olarak yayına yansıtır.",
      en: "Displays live Kick chat messages with transparent custom styling.",
      de: "Zeigt Kick-Live-Chat-Nachrichten mit modernem Design an.",
      es: "Muestra el chat de Kick en vivo con estilos personalizados.",
      fr: "Affiche les messages du chat Kick en direct.",
      pt: "Exibe mensagens do chat da Kick ao vivo.",
      ru: "Отображает сообщения чата Kick с анимацией."
    },
    category: "CHAT",
    fields: [
      {
        name: "channel",
        label: { tr: "Kick Kanal Adı", en: "Kick Channel", de: "Kick-Kanal", es: "Canal Kick", fr: "Chaîne Kick", pt: "Canal Kick", ru: "Канал Kick" },
        type: "text",
        defaultValue: "itsfatih"
      },
      {
        name: "theme",
        label: { tr: "Tasarım Teması", en: "Theme Style", de: "Design-Stil", es: "Estilo", fr: "Thème", pt: "Tema", ru: "Тема" },
        type: "select",
        defaultValue: "dark",
        options: [
          { label: { tr: "Karanlık Kapsül", en: "Dark Capsule", de: "Dunkel", es: "Cápsula Oscura", fr: "Sombre", pt: "Escuro", ru: "Темная" }, value: "dark" },
          { label: { tr: "Aydınlık Kapsül", en: "Light Capsule", de: "Hell", es: "Cápsula Clara", fr: "Clair", pt: "Claro", ru: "Светлая" }, value: "light" }
        ]
      },
      {
        name: "font_size",
        label: { tr: "Yazı Boyutu (px)", en: "Font Size (px)", de: "Schriftgröße", es: "Tamaño de Fuente", fr: "Taille de Police", pt: "Tamanho da Fonte", ru: "Размер шрифта" },
        type: "text",
        defaultValue: "14"
      },
      {
        name: "show_badges",
        label: { tr: "Rozetleri Göster (Mod/Vip)", en: "Show Badges", de: "Badges anzeigen", es: "Mostrar Insignias", fr: "Afficher Badges", pt: "Mostrar Emblemas", ru: "Показывать значки" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { tr: "Açık", en: "Enabled", de: "Aktiviert", es: "Activado", fr: "Activé", pt: "Ativado", ru: "Вкл" }, value: "true" },
          { label: { tr: "Kapalı", en: "Disabled", de: "Deaktiviert", es: "Desactivado", fr: "Désactivé", pt: "Desativado", ru: "Выкл" }, value: "false" }
        ]
      }
    ]
  },
  {
    id: "now-playing",
    name: {
      tr: "Şu An Çalıyor",
      en: "Now Playing",
      de: "Aktueller Titel",
      es: "Reproduciendo Ahora",
      fr: "En Cours de Lecture",
      pt: "Tocando Agora",
      ru: "Сейчас играет"
    },
    description: {
      tr: "Spotify hesabınızda çalan şarkıyı albüm kapağı, sanatçı ve canlı süre barıyla ekrana yansıtır.",
      en: "Displays currently playing Spotify track with album art and progress bar.",
      de: "Zeigt den aktuell abgespielten Spotify-Titel an.",
      es: "Muestra la canción que se está reproduciendo en Spotify.",
      fr: "Affiche le titre Spotify en cours de lecture.",
      pt: "Exibe a música do Spotify que está tocando.",
      ru: "Отображает текущий трек Spotify с обложкой."
    },
    category: "MEDIA",
    comingSoon: true,
    fields: [
      {
        name: "channel",
        label: { tr: "Yayıncı Kullanıcı Adı", en: "Broadcaster Username", de: "Benutzername", es: "Usuario", fr: "Nom d'utilisateur", pt: "Nome de Usuário", ru: "Имя стримера" },
        type: "text",
        defaultValue: "itsfatih"
      },
      {
        name: "refresh_token",
        label: { tr: "Spotify Oturum Anahtarı", en: "Spotify Token", de: "Spotify Token", es: "Token Spotify", fr: "Token Spotify", pt: "Token Spotify", ru: "Spotify Токен" },
        type: "text",
        defaultValue: ""
      },
      {
        name: "theme",
        label: { tr: "Tasarım Teması", en: "Theme Style", de: "Design", es: "Estilo", fr: "Thème", pt: "Tema", ru: "Тема" },
        type: "select",
        defaultValue: "compact",
        options: [
          { label: { tr: "Kompakt Kart", en: "Compact Card", de: "Kompakt", es: "Tarjeta Compacta", fr: "Compact", pt: "Compacto", ru: "Компактная" }, value: "compact" },
          { label: { tr: "Minimal Bar", en: "Minimal Bar", de: "Minimal", es: "Barra Mínima", fr: "Minimal", pt: "Minimalista", ru: "Минимал" }, value: "minimal" }
        ]
      }
    ]
  },
  {
    id: "qr-tip",
    name: {
      tr: "QR Bağış & Destek",
      en: "QR Tip & Donate",
      de: "QR-Spende",
      es: "Donación por QR",
      fr: "Donation QR",
      pt: "Doação via QR",
      ru: "QR Донат"
    },
    description: {
      tr: "BBN, ByNoGame veya Kripto bağış linkinizi dinamik QR kod olarak ekranda gösterir.",
      en: "Generate custom QR codes for your tipping or crypto links.",
      de: "Generieren Sie QR-Codes für Spendenlinks.",
      es: "Genera códigos QR para enlaces de donaciones.",
      fr: "Générez des QR codes pour vos liens de dons.",
      pt: "Gere códigos QR para seus links de doação.",
      ru: "Генератор QR-кодов для донатов."
    },
    category: "ENGAGE",
    fields: [
      {
        name: "url",
        label: { tr: "Bağış / Profil Linki", en: "Tip Link / URL", de: "Spenden-URL", es: "Enlace de Donación", fr: "Lien de Don", pt: "Link de Doação", ru: "Ссылка на донат" },
        type: "text",
        defaultValue: "https://streamwidget.live"
      },
      {
        name: "title",
        label: { tr: "Başlık Metni", en: "Title Text", de: "Titel", es: "Título", fr: "Titre", pt: "Título", ru: "Заголовок" },
        type: "text",
        defaultValue: "BAĞIŞ & DESTEK"
      },
      {
        name: "color",
        label: { tr: "QR Rengi", en: "QR Color", de: "QR-Farbe", es: "Color QR", fr: "Couleur QR", pt: "Cor do QR", ru: "Цвет QR" },
        type: "color",
        defaultValue: "#22c55e"
      }
    ]
  },
  {
    id: "sub-counter",
    name: {
      tr: "Abone Sayacı",
      en: "Sub Counter",
      de: "Abo-Zähler",
      es: "Contador de Subs",
      fr: "Compteur d'Abonnés",
      pt: "Contador de Inscritos",
      ru: "Счётчик подписок"
    },
    description: {
      tr: "Kick abone sayınızı canlı olarak şık bir rozet veya büyük sayaç şeklinde gösterir.",
      en: "Shows your live Kick subscriber count as a badge or a large counter.",
      de: "Zeigt Ihre Kick-Abonnentenzahl live als Badge oder großen Zähler.",
      es: "Muestra tus suscriptores de Kick en vivo como insignia o contador grande.",
      fr: "Affiche vos abonnés Kick en direct sous forme de badge ou de grand compteur.",
      pt: "Mostra seus inscritos da Kick ao vivo como selo ou contador grande.",
      ru: "Показывает число подписчиков Kick в виде значка или большого счётчика."
    },
    category: "ENGAGE",
    // Kick'in herkese açık kanal HTML'i abone sayısını yayınlamıyor; resmi Kick
    // API'si de yok (kullanıcıda developer uygulaması yok). Dolayısıyla bu widget
    // gerçek veri üretemez ve 0'da takılır. Sahte/0 sayaç yayınlamak yerine
    // now-playing gibi "Yakında" olarak gizlendi (abone verisi erişilebilir
    // olduğunda comingSoon kaldırılabilir).
    comingSoon: true,
    fields: [
      {
        name: "channel",
        label: { tr: "Kick Kanal Adı", en: "Kick Channel", de: "Kick-Kanal", es: "Canal Kick", fr: "Chaîne Kick", pt: "Canal Kick", ru: "Канал Kick" },
        type: "text",
        defaultValue: "itsfatih"
      },
      {
        name: "style",
        label: { tr: "Görünüm Stili", en: "Display Style", de: "Anzeigestil", es: "Estilo", fr: "Style d'Affichage", pt: "Estilo", ru: "Стиль" },
        type: "select",
        defaultValue: "badge",
        options: [
          { label: { tr: "Rozet", en: "Badge", de: "Badge", es: "Insignia", fr: "Badge", pt: "Selo", ru: "Значок" }, value: "badge" },
          { label: { tr: "Büyük Sayaç", en: "Big Counter", de: "Großer Zähler", es: "Contador Grande", fr: "Grand Compteur", pt: "Contador Grande", ru: "Большой счётчик" }, value: "big" }
        ]
      },
      {
        name: "color",
        label: { tr: "Vurgu Rengi", en: "Accent Color", de: "Akzentfarbe", es: "Color de Acento", fr: "Couleur d'Accent", pt: "Cor de Destaque", ru: "Цвет акцента" },
        type: "color",
        defaultValue: "#a855f7"
      }
    ]
  },
  {
    id: "sub-goal",
    name: {
      tr: "Abone Hedefi",
      en: "Sub Goal",
      de: "Abo-Ziel",
      es: "Meta de Subs",
      fr: "Objectif d'Abonnés",
      pt: "Meta de Inscritos",
      ru: "Цель подписок"
    },
    description: {
      tr: "Kick abone sayınızı otomatik çeken ve hedefe doğru ilerleyen canlı çubuk.",
      en: "Automatically tracks your Kick subscriber count with an animated goal bar.",
      de: "Verfolgt automatisch Ihre Kick-Abonnentenzahl mit animiertem Zielbalken.",
      es: "Rastrea tus suscriptores de Kick con una barra de meta animada.",
      fr: "Suit automatiquement vos abonnés Kick avec une barre d'objectif animée.",
      pt: "Acompanha seus inscritos da Kick com uma barra de meta animada.",
      ru: "Автоматически отслеживает подписчиков Kick с анимированной полосой цели."
    },
    category: "ENGAGE",
    // Bkz. sub-counter: abone sayısı Kick public HTML'inde yok, resmi API da
    // yok. Gerçek veri gelmediği için hedef çubuğu 0'da kalır; now-playing gibi
    // "Yakında" olarak gizlendi.
    comingSoon: true,
    fields: [
      {
        name: "channel",
        label: { tr: "Kick Kanal Adı", en: "Kick Channel", de: "Kick-Kanal", es: "Canal Kick", fr: "Chaîne Kick", pt: "Canal Kick", ru: "Канал Kick" },
        type: "text",
        defaultValue: "itsfatih"
      },
      {
        name: "target",
        label: { tr: "Hedef Sayısı", en: "Target Goal", de: "Zielanzahl", es: "Objetivo", fr: "Cible", pt: "Meta", ru: "Цель" },
        type: "text",
        defaultValue: "50"
      },
      {
        name: "title",
        label: { tr: "Başlık Metni", en: "Title Text", de: "Titel", es: "Título", fr: "Titre", pt: "Título", ru: "Заголовок" },
        type: "text",
        defaultValue: "ABONE HEDEFİ"
      },
      {
        name: "bar_color",
        label: { tr: "Bar Rengi", en: "Bar Color", de: "Balkenfarbe", es: "Color de Barra", fr: "Couleur de Barre", pt: "Cor da Barra", ru: "Цвет полосы" },
        type: "color",
        defaultValue: "#00e701"
      }
    ]
  },
  {
    id: "kick-viewers",
    name: {
      tr: "Canlı İzleyici Sayısı",
      en: "Live Viewer Count",
      de: "Live-Zuschauerzahl",
      es: "Contador de Espectadores",
      fr: "Nombre de Spectateurs",
      pt: "Contador de Espectadores",
      ru: "Счётчик зрителей"
    },
    description: {
      tr: "Kick kanalınızın anlık izleyici sayısını ve canlı durumunu şık bir rozette gösterir.",
      en: "Shows your Kick channel's live viewer count and online status in a sleek badge.",
      de: "Zeigt die Live-Zuschauerzahl und den Status Ihres Kick-Kanals in einem Badge.",
      es: "Muestra el número de espectadores en vivo y el estado de tu canal de Kick.",
      fr: "Affiche le nombre de spectateurs en direct et le statut de votre chaîne Kick.",
      pt: "Mostra o número de espectadores ao vivo e o status do seu canal Kick.",
      ru: "Показывает количество зрителей и статус вашего канала Kick."
    },
    category: "ENGAGE",
    fields: [
      {
        name: "channel",
        label: { tr: "Kick Kanal Adı", en: "Kick Channel", de: "Kick-Kanal", es: "Canal Kick", fr: "Chaîne Kick", pt: "Canal Kick", ru: "Канал Kick" },
        type: "text",
        defaultValue: "itsfatih"
      }
    ]
  },
  {
    id: "stream-uptime",
    name: {
      tr: "Yayın Süresi",
      en: "Stream Uptime",
      de: "Stream-Laufzeit",
      es: "Tiempo de Transmisión",
      fr: "Durée du Stream",
      pt: "Tempo de Transmissão",
      ru: "Время эфира"
    },
    description: {
      tr: "Yayınınızın ne kadar süredir açık olduğunu canlı HH:MM:SS sayacıyla gösterir. Yayın kapalıyken çevrimdışı gösterir.",
      en: "Shows how long your stream has been live with a running HH:MM:SS counter. Displays offline when not streaming.",
      de: "Zeigt mit einem laufenden HH:MM:SS-Zähler, wie lange Ihr Stream live ist.",
      es: "Muestra cuánto tiempo lleva en vivo tu transmisión con un contador HH:MM:SS.",
      fr: "Affiche depuis combien de temps votre stream est en direct avec un compteur HH:MM:SS.",
      pt: "Mostra há quanto tempo sua transmissão está ao vivo com um contador HH:MM:SS.",
      ru: "Показывает длительность эфира счётчиком ЧЧ:ММ:СС."
    },
    category: "IRL",
    fields: [
      {
        name: "channel",
        label: { tr: "Kick Kanal Adı", en: "Kick Channel", de: "Kick-Kanal", es: "Canal Kick", fr: "Chaîne Kick", pt: "Canal Kick", ru: "Канал Kick" },
        type: "text",
        defaultValue: "itsfatih"
      }
    ]
  },
  {
    id: "social-banner",
    name: {
      tr: "Sosyal Medya Bandı",
      en: "Social Banner",
      de: "Social-Media-Banner",
      es: "Banner Social",
      fr: "Bannière Sociale",
      pt: "Banner Social",
      ru: "Соцсети Баннер"
    },
    description: {
      tr: "Sosyal medya hesaplarınızı dönüşümlü olarak gösteren, API gerektirmeyen şık bir alt bant. Her yayıncıda çalışır.",
      en: "A clean lower-third strip that cycles through your social handles. No API needed, works for everyone.",
      de: "Ein sauberes Lower-Third-Banner, das Ihre Social-Media-Handles durchläuft. Keine API nötig.",
      es: "Una franja inferior que rota tus redes sociales. Sin API, funciona para todos.",
      fr: "Une bande inférieure qui fait défiler vos réseaux sociaux. Sans API, fonctionne pour tous.",
      pt: "Uma faixa inferior que alterna suas redes sociais. Sem API, funciona para todos.",
      ru: "Нижняя плашка, которая перебирает ваши соцсети. Без API, работает у всех."
    },
    category: "ENGAGE",
    fields: [
      {
        name: "label",
        label: { tr: "Etiket Metni", en: "Label Text", de: "Beschriftung", es: "Texto de Etiqueta", fr: "Texte du Label", pt: "Texto do Rótulo", ru: "Текст метки" },
        type: "text",
        defaultValue: "TAKİP ET"
      },
      {
        name: "social_1",
        label: { tr: "1. Hesap", en: "Handle 1", de: "Konto 1", es: "Cuenta 1", fr: "Compte 1", pt: "Conta 1", ru: "Аккаунт 1" },
        type: "text",
        defaultValue: "@kullaniciadi"
      },
      {
        name: "social_2",
        label: { tr: "2. Hesap (Opsiyonel)", en: "Handle 2 (Optional)", de: "Konto 2 (Optional)", es: "Cuenta 2 (Opcional)", fr: "Compte 2 (Optionnel)", pt: "Conta 2 (Opcional)", ru: "Аккаунт 2 (Опц.)" },
        type: "text",
        defaultValue: ""
      },
      {
        name: "social_3",
        label: { tr: "3. Hesap (Opsiyonel)", en: "Handle 3 (Optional)", de: "Konto 3 (Optional)", es: "Cuenta 3 (Opcional)", fr: "Compte 3 (Optionnel)", pt: "Conta 3 (Opcional)", ru: "Аккаунт 3 (Опц.)" },
        type: "text",
        defaultValue: ""
      },
      {
        name: "theme",
        label: { tr: "Tasarım Teması", en: "Theme Style", de: "Design-Stil", es: "Estilo", fr: "Thème", pt: "Tema", ru: "Тема" },
        type: "select",
        defaultValue: "dark",
        options: [
          { label: { tr: "Karanlık", en: "Dark", de: "Dunkel", es: "Oscuro", fr: "Sombre", pt: "Escuro", ru: "Тёмная" }, value: "dark" },
          { label: { tr: "Aydınlık", en: "Light", de: "Hell", es: "Claro", fr: "Clair", pt: "Claro", ru: "Светлая" }, value: "light" }
        ]
      },
      {
        name: "color",
        label: { tr: "Vurgu Rengi", en: "Accent Color", de: "Akzentfarbe", es: "Color de Acento", fr: "Couleur d'Accent", pt: "Cor de Destaque", ru: "Цвет акцента" },
        type: "color",
        defaultValue: "#53FC18"
      }
    ]
  }
];
