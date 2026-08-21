export interface WidgetOption {
  label: Record<string, string>;
  value: string;
}

export interface WidgetField {
  name: string;
  label: Record<string, string>;
  type: 'text' | 'select' | 'color';
  defaultValue: string;
  options?: WidgetOption[];
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
      pt: "HUD de Transmissão IRL",
      ru: "IRL Стрим HUD"
    },
    description: {
      tr: "Canlı saat, IP tabanlı konum ve hava durumu. Kick chat komutlarıyla anlık yönetilebilir.",
      en: "Real-time Live badge, clock, IP geolocation, and weather status. Controlled via Kick chat commands.",
      de: "Echtzeituhr, IP-Geolokalisierung und Wetter. Gesteuert über Kick-Chat-Befehle.",
      es: "Reloj en tiempo real, geolocalización por IP y clima. Controlado por comandos de Kick chat.",
      fr: "Horloge en direct, géolocalisation et météo. Contrôlé par les commandes de chat Kick.",
      pt: "Relógio em tempo real, geolocalização e clima. Controlado por comandos de chat Kick.",
      ru: "Часы в реальном времени, геолокация и погода. Управление через команды чата Kick."
    },
    category: "IRL",
    fields: [
      {
        name: "channel",
        label: { tr: "Kick Kanal Adı", en: "Kick Channel Name", de: "Kick-Kanalname", es: "Nombre del canal de Kick", fr: "Nom de la chaîne Kick", pt: "Nome do Canal Kick", ru: "Имя канала Kick" },
        type: "text",
        defaultValue: "itsfatih"
      },
      {
        name: "showLive",
        label: { tr: "LIVE Rozeti", en: "LIVE Badge", de: "LIVE-Abzeichen", es: "Insignia LIVE", fr: "Badge LIVE", pt: "Distintivo LIVE", ru: "Значок LIVE" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { tr: "Açık", en: "Show", de: "Anzeigen", es: "Mostrar", fr: "Afficher", pt: "Mostrar", ru: "Показать" }, value: "true" },
          { label: { tr: "Kapalı", en: "Hide", de: "Ausblenden", es: "Ocultar", fr: "Masquer", pt: "Ocultar", ru: "Скрыть" }, value: "false" }
        ]
      },
      {
        name: "showClock",
        label: { tr: "Canlı Saat", en: "Live Clock", de: "Echtzeituhr", es: "Reloj en Vivo", fr: "Horloge en Direct", pt: "Relógio ao Vivo", ru: "Живые часы" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { tr: "Açık", en: "Show", de: "Anzeigen", es: "Mostrar", fr: "Afficher", pt: "Mostrar", ru: "Показать" }, value: "true" },
          { label: { tr: "Kapalı", en: "Hide", de: "Ausblenden", es: "Ocultar", fr: "Masquer", pt: "Ocultar", ru: "Скрыть" }, value: "false" }
        ]
      },
      {
        name: "showLocation",
        label: { tr: "Konum (Şehir)", en: "Location", de: "Standort", es: "Ubicación", fr: "Emplacement", pt: "Localização", ru: "Локация" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { tr: "Açık", en: "Show", de: "Anzeigen", es: "Mostrar", fr: "Afficher", pt: "Mostrar", ru: "Показать" }, value: "true" },
          { label: { tr: "Kapalı", en: "Hide", de: "Ausblenden", es: "Ocultar", fr: "Masquer", pt: "Ocultar", ru: "Скрыть" }, value: "false" }
        ]
      },
      {
        name: "showWeather",
        label: { tr: "Hava Durumu", en: "Weather", de: "Wetter", es: "Clima", fr: "Météo", pt: "Clima", ru: "Погода" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { tr: "Açık", en: "Show", de: "Anzeigen", es: "Mostrar", fr: "Afficher", pt: "Mostrar", ru: "Показать" }, value: "true" },
          { label: { tr: "Kapalı", en: "Hide", de: "Ausblenden", es: "Ocultar", fr: "Masquer", pt: "Ocultar", ru: "Скрыть" }, value: "false" }
        ]
      },
      {
        name: "theme",
        label: { tr: "Tasarım Teması", en: "Theme Style", de: "Design-Stil", es: "Tema", fr: "Thème", pt: "Estilo", ru: "Стиль" },
        type: "select",
        defaultValue: "framed",
        options: [
          { label: { tr: "Çerçeveli Kapsül", en: "Framed Capsule", de: "Kapsel mit Rahmen", es: "Cápsula enmarcada", fr: "Capsule encadrée", pt: "Cápsula com Moldura", ru: "Капсула в рамке" }, value: "framed" },
          { label: { tr: "Sade Minimal", en: "Minimal Text", de: "Minimaler Text", es: "Texto minimalista", fr: "Texte minimaliste", pt: "Texto minimalista", ru: "Минимал текст" }, value: "minimal" }
        ]
      }
    ]
  },
  {
    id: "mini-map",
    name: {
      tr: "Mini Harita",
      en: "Mini Map Radar",
      de: "Mini-Karten-Radar",
      es: "Mini Mapa Radar",
      fr: "Mini Carte Radar",
      pt: "Mini Mapa Radar",
      ru: "Мини-карта Радар"
    },
    description: {
      tr: "Canlı GPS takip radarı ve mini harita. Yayında anlık konumunuzu ve hızınızı şık bir harita üzerinde gösterir.",
      en: "Live GPS tracking radar and mini map. Displays your real-time location and speed on stream.",
      de: "Live-GPS-Tracking-Radar und Minikarte. Zeigt Ihren Echtzeit-Standort und Geschwindigkeit.",
      es: "Radar GPS en vivo y mini mapa. Muestra tu ubicación y velocidad en tiempo real.",
      fr: "Radar GPS en direct et mini-carte. Affiche votre position et votre vitesse en temps réel.",
      pt: "Radar de rastreamento GPS e mini mapa. Exibe sua localização e velocidade em tempo real.",
      ru: "Живой GPS-радар и мини-карта. Отображает ваше местоположение и скорость в реальном времени."
    },
    category: "IRL",
    fields: [
      {
        name: "channel",
        label: { tr: "Kanal / Cihaz Adı", en: "Kick Channel / Device ID", de: "Kanal / Geräte-ID", es: "Canal / ID de dispositivo", fr: "Chaîne / ID de l'appareil", pt: "Canal / ID do Dispositivo", ru: "Канал / ID устройства" },
        type: "text",
        defaultValue: "itsfatih"
      },
      {
        name: "zoom",
        label: { tr: "Yakınlaştırma (Zoom)", en: "Zoom Level", de: "Zoom-Stufe", es: "Nivel de Zoom", fr: "Niveau de Zoom", pt: "Nível de Zoom", ru: "Уровень масштабирования" },
        type: "select",
        defaultValue: "16",
        options: [
          { label: { tr: "Yakın (Sokak - 17)", en: "Close (Street - 17)", de: "Nah (17)", es: "Cerca (17)", fr: "Près (17)", pt: "Perto (17)", ru: "Близко (17)" }, value: "17" },
          { label: { tr: "Standart (Mahalle - 15)", en: "Standard (Neighborhood - 15)", de: "Standard (15)", es: "Estándar (15)", fr: "Standard (15)", pt: "Padrão (15)", ru: "Стандарт (15)" }, value: "15" },
          { label: { tr: "Geniş (Şehir - 13)", en: "Wide (City - 13)", de: "Weit (13)", es: "Amplio (13)", fr: "Large (13)", pt: "Amplo (13)", ru: "Широко (13)" }, value: "13" }
        ]
      },
      {
        name: "mapTheme",
        label: { tr: "Harita Teması", en: "Map Style", de: "Kartenstil", es: "Tema del Mapa", fr: "Style de Carte", pt: "Estilo do Mapa", ru: "Стиль карты" },
        type: "select",
        defaultValue: "dark",
        options: [
          { label: { tr: "Karanlık Radar (Neon)", en: "Dark Radar (Cyberpunk)", de: "Dunkler Radar", es: "Radar Oscuro", fr: "Radar Sombre", pt: "Radar Escuro", ru: "Темный радар" }, value: "dark" },
          { label: { tr: "Gece Modu (Midnight)", en: "Midnight Clean", de: "Mitternacht", es: "Modo Noche", fr: "Minuit", pt: "Meia-noite", ru: "Полночь" }, value: "midnight" },
          { label: { tr: "Sokak Haritası", en: "Standard Street", de: "Standardkarte", es: "Mapa Estándar", fr: "Rue Standard", pt: "Rua Padrão", ru: "Стандартные улицы" }, value: "light" }
        ]
      },
      {
        name: "showSpeed",
        label: { tr: "Hız Göstergesi (km/s)", en: "Speedometer", de: "Geschwindigkeit", es: "Velocímetro", fr: "Compteur de vitesse", pt: "Velocímetro", ru: "Спидометр" },
        type: "select",
        defaultValue: "true",
        options: [
          { label: { tr: "Açık", en: "Show", de: "Anzeigen", es: "Mostrar", fr: "Afficher", pt: "Mostrar", ru: "Показать" }, value: "true" },
          { label: { tr: "Kapalı", en: "Hide", de: "Ausblenden", es: "Ocultar", fr: "Masquer", pt: "Ocultar", ru: "Скрыть" }, value: "false" }
        ]
      },
      {
        name: "shape",
        label: { tr: "Harita Şekli", en: "Radar Shape", de: "Form", es: "Forma del Radar", fr: "Forme", pt: "Formato", ru: "Форма" },
        type: "select",
        defaultValue: "circle",
        options: [
          { label: { tr: "Yuvarlak Radar", en: "Round Radar (Circular)", de: "Kreis", es: "Circular", fr: "Circulaire", pt: "Circular", ru: "Круглый" }, value: "circle" },
          { label: { tr: "Kavisli Kare (Kapsül)", en: "Rounded Square", de: "Abgerundetes Quadrat", es: "Cuadrado Redondeado", fr: "Carré Arrondi", pt: "Quadrado Arredondado", ru: "Скругленный квадрат" }, value: "square" }
        ]
      }
    ]
  },
  {
    id: "follower-goal",
    name: {
      tr: "Takipçi Hedefi (Follower Goal)",
      en: "Follower Goal",
      de: "Follower-Ziel",
      es: "Objetivo de Seguidores",
      fr: "Objectif de Followers",
      pt: "Meta de Seguidores",
      ru: "Цель по фолловерам"
    },
    description: {
      tr: "Kick takipçi sayısını otomatik çeken ve yeni takip geldikçe canlı ilerleyen çubuk.",
      en: "Automatically fetches Kick follower count and smoothly progresses with live follows.",
      de: "Ruft die Kick-Follower-Zahl automatisch ab und zählt live hoch.",
      es: "Obtiene el conteo de seguidores de Kick automáticamente y progresa en vivo.",
      fr: "Récupère automatiquement le nombre de followers Kick et progresse en direct.",
      pt: "Busca automaticamente os seguidores da Kick e atualiza ao vivo.",
      ru: "Автоматически подтягивает фолловеров Kick и обновляется в реальном времени."
    },
    category: "Engage",
    fields: [
      {
        name: "channel",
        label: { tr: "Kanal Adı", en: "Kick Channel Name", de: "Kanalname", es: "Nombre del canal", fr: "Nom de la chaîne", pt: "Nome do Canal", ru: "Имя канала" },
        type: "text",
        defaultValue: "itsfatih"
      },
      {
        name: "title",
        label: { tr: "Hedef Başlığı (Sol Yazı)", en: "Goal Title", de: "Zieltitel", es: "Título del objetivo", fr: "Titre de l'objectif", pt: "Título da Meta", ru: "Текст цели" },
        type: "text",
        defaultValue: "TAKİPÇİ HEDEFİ"
      },
      {
        name: "target",
        label: { tr: "Hedef Sayısı", en: "Target Goal", de: "Zielwert", es: "Objetivo", fr: "Objectif cible", pt: "Meta", ru: "Целевое значение" },
        type: "text",
        defaultValue: "3000"
      },
      {
        name: "color",
        label: { tr: "Bar Rengi", en: "Bar Color", de: "Balkenfarbe", es: "Color de la barra", fr: "Couleur de la barre", pt: "Cor da Barra", ru: "Цвет шкалы" },
        type: "color",
        defaultValue: "#53FC18"
      }
    ]
  }
];
