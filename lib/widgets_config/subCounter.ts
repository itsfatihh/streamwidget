import { WidgetDef } from './types';

export const subCounterWidget: WidgetDef = {
  id: "sub-counter",
  name: { tr: "Canlı Abone Sayacı", en: "Live Sub Counter", de: "Live-Abonnentenzähler", es: "Contador de Suscriptores", fr: "Compteur d'Abonnés en Direct", pt: "Contador de Inscritos", ru: "Счетчик подписчиков" },
  description: { tr: "Kick kanalınızdaki anlık toplam aktif abone sayısını şık bir sayaçla gösterir.", en: "Displays your real-time total active Kick subscribers count.", de: "Kick-Abonnentenzähler.", es: "Contador de suscriptores.", fr: "Compteur d'abonnés.", pt: "Contador de inscritos.", ru: "Счетчик подписчиков." },
  category: "Engage",
  fields: [
    { name: "channel", label: { tr: "Kick Kanal Adı", en: "Kick Channel Name", de: "Kanalname", es: "Nombre del canal", fr: "Nom de la chaîne", pt: "Nome do Canal", ru: "Имя канала" }, type: "text", defaultValue: "itsfatih" },
    { name: "style", label: { tr: "Görünüm Stili", en: "Display Style", de: "Stil", es: "Estilo", fr: "Style", pt: "Estilo", ru: "Стиль" }, type: "select", defaultValue: "badge", options: [{ label: { tr: "Rozet Kapsülü", en: "Badge Capsule", de: "Kapsel", es: "Cápsula", fr: "Capsule", pt: "Cápsula", ru: "Капсула" }, value: "badge" }, { label: { tr: "Büyük Sayaç", en: "Big Digits", de: "Groß", es: "Grandes", fr: "Grands", pt: "Grandes", ru: "Крупные" }, value: "big" }] },
    { name: "color", label: { tr: "Vurgu Rengi", en: "Accent Color", de: "Farbe", es: "Color", fr: "Couleur", pt: "Cor", ru: "Цвет" }, type: "color", defaultValue: "#a855f7" }
  ]
};
