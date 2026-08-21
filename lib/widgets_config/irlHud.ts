import { WidgetDef } from './types';

export const irlHudWidget: WidgetDef = {
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
};
