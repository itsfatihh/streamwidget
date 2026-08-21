import { WidgetDef } from './types';

export const chatOverlayWidget: WidgetDef = {
  id: "chat-overlay",
  name: { tr: "Canlı Sohbet Kutusu", en: "Live Chat Box", de: "Live-Chat-Overlay", es: "Caja de Chat en Vivo", fr: "Boîte de Chat en Direct", pt: "Caixa de Chat ao Vivo", ru: "Оверлей чата" },
  description: { tr: "Kick canlı sohbet mesajlarını şeffaf ve animasyonlu olarak yayına yansıtır.", en: "Transparent animated stream chat overlay for Kick broadcast.", de: "Transparenter Stream-Chat.", es: "Chat transparente.", fr: "Chat transparent.", pt: "Chat transparente.", ru: "Прозрачный чат." },
  category: "Chat",
  fields: [
    { name: "channel", label: { tr: "Kick Kanal Adı", en: "Kick Channel Name", de: "Kanalname", es: "Nombre del canal", fr: "Nom de la chaîne", pt: "Nome do Canal", ru: "Имя канала" }, type: "text", defaultValue: "itsfatih" },
    { name: "theme", label: { tr: "Sohbet Teması", en: "Chat Theme", de: "Design", es: "Tema", fr: "Thème", pt: "Tema", ru: "Тема" }, type: "select", defaultValue: "dark", options: [{ label: { tr: "Karanlık Şeffaf", en: "Dark Glass", de: "Glas", es: "Cristal", fr: "Verre", pt: "Vidro", ru: "Стекло" }, value: "dark" }, { label: { tr: "Neon Glow", en: "Neon Glow", de: "Neon", es: "Neón", fr: "Néon", pt: "Neon", ru: "Неон" }, value: "neon" }, { label: { tr: "Minimal Düz", en: "Minimal Flat", de: "Flach", es: "Plano", fr: "Plat", pt: "Plano", ru: "Минимал" }, value: "minimal" }] },
    { name: "fontSize", label: { tr: "Yazı Boyutu", en: "Font Size", de: "Größe", es: "Tamaño", fr: "Taille", pt: "Tamanho", ru: "Размер" }, type: "select", defaultValue: "medium", options: [{ label: { tr: "Küçük (13px)", en: "Small (13px)", de: "Klein", es: "Pequeño", fr: "Petit", pt: "Pequeno", ru: "Маленький" }, value: "small" }, { label: { tr: "Orta (15px)", en: "Medium (15px)", de: "Mittel", es: "Mediano", fr: "Moyen", pt: "Médio", ru: "Средний" }, value: "medium" }, { label: { tr: "Büyük (18px)", en: "Large (18px)", de: "Groß", es: "Grande", fr: "Grand", pt: "Grande", ru: "Большой" }, value: "large" }] }
  ]
};
