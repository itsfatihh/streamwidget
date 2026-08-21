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
          { label: { tr: "Aydınlık Mod", en: "Light Mode", de: "Hell", es: "Claro", fr: "Clair", pt: "Claro", ru: "Светлая" }, value: "light" }
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
        name: "theme",
        label: { tr: "Tasarım Teması", en: "Theme Style", de: "Design", es: "Estilo", fr: "Thème", pt: "Tema", ru: "Тема" },
        type: "select",
        defaultValue: "dark",
        options: [
          { label: { tr: "Karanlık Kapsül", en: "Dark Capsule", de: "Dunkel", es: "Cápsula Oscura", fr: "Sombre", pt: "Escuro", ru: "Темная" }, value: "dark" },
          { label: { tr: "Aydınlık Kapsül", en: "Light Capsule", de: "Hell", es: "Cápsula Clara", fr: "Clair", pt: "Claro", ru: "Светлая" }, value: "light" }
        ]
      }
    ]
  }
];
