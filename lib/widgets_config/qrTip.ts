import { WidgetDef } from './types';

export const qrTipWidget: WidgetDef = {
  id: "qr-tip",
  name: { tr: "QR Bağış & Destek", en: "QR Tip & Donate", de: "QR-Trinkgeld & Spende", es: "QR de Propinas y Donaciones", fr: "QR Dons & Pourboires", pt: "QR de Gorjetas e Doações", ru: "QR Донаты и Поддержка" },
  description: { tr: "BBN, ByNoGame veya Kripto bağış linkinizi dinamik QR kod olarak ekranda gösterir.", en: "Displays dynamic QR code for tip links on stream.", de: "QR-Code für Spenden.", es: "QR para donaciones.", fr: "QR pour dons.", pt: "QR para doações.", ru: "QR для донатов." },
  category: "Engage",
  fields: [
    { name: "url", label: { tr: "Bağış / Destek Linki", en: "Tip / Donation URL", de: "Link", es: "Enlace", fr: "Lien", pt: "Link", ru: "Ссылка" }, type: "text", defaultValue: "https://streamwidget.live" },
    { name: "title", label: { tr: "Başlık Metni", en: "Title Text", de: "Titel", es: "Título", fr: "Titre", pt: "Título", ru: "Заголовок" }, type: "text", defaultValue: "BAĞIŞ YAP" },
    { name: "color", label: { tr: "QR Vurgu Rengi", en: "QR Accent Color", de: "Farbe", es: "Color", fr: "Couleur", pt: "Cor", ru: "Цвет" }, type: "color", defaultValue: "#22c55e" }
  ]
};
