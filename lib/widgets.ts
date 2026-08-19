export interface WidgetField {
  name: string;
  label: string;
  type: "text" | "select" | "color" | "boolean";
  placeholder?: string;
  defaultValue?: string | boolean;
  options?: { label: string; value: string }[];
}

export interface WidgetMeta {
  id: string;
  name: string;
  description: string;
  category: "IRL" | "Kick" | "Twitch" | "General";
  requiresChannel?: boolean;
  fields: WidgetField[];
}

export const WIDGETS_LIST: WidgetMeta[] = [
  {
    id: "irl-hud",
    name: "IRL Stream HUD",
    description: "Canlı saat, konum ve LIVE rozeti içeren saydam overlay.",
    category: "IRL",
    requiresChannel: false,
    fields: [
      { name: "theme", label: "Tema", type: "select", defaultValue: "dark", options: [{ label: "Karanlık", value: "dark" }, { label: "Neon", value: "neon" }] }
    ]
  },
  {
    id: "kick-viewers",
    name: "Kick İzleyici Sayacı",
    description: "Kick kanalının anlık canlı izleyici sayısını gösteren rozet.",
    category: "Kick",
    requiresChannel: true,
    fields: [
      { name: "channel", label: "Kick Kullanıcı Adı", type: "text", placeholder: "Kanal adı (örn: itsfatih)" }
    ]
  },
  {
    id: "clock",
    name: "Minimal Dijital Saat",
    description: "Sade, her yayına uyumlu saydam saat.",
    category: "General",
    requiresChannel: false,
    fields: [
      { name: "format", label: "Format", type: "select", defaultValue: "24", options: [{ label: "24 Saat", value: "24" }, { label: "12 Saat", value: "12" }] }
    ]
  }
];