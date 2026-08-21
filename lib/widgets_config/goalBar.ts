import { WidgetDef } from './types';

export const goalBarWidget: WidgetDef = {
  id: "goal-bar",
  name: { tr: "Özel Hedef Çubuğu", en: "Custom Goal Bar", de: "Benutzerdefinierter Ziel-Balken", es: "Barra de Objetivos Personalizada", fr: "Barre d'Objectifs Personnalisée", pt: "Barra de Metas Personalizada", ru: "Настраиваемая шкала целей" },
  description: { tr: "Abone, bağış veya özel yayın hedefleri için ayarlanabilir ilerleme çubuğu.", en: "Customizable progress bar for subscriber, donation, or milestone goals.", de: "Fortschrittsbalken für Ziele.", es: "Barra de metas.", fr: "Barre d'objectifs.", pt: "Barra de metas.", ru: "Шкала целей." },
  category: "Engage",
  fields: [
    { name: "channel", label: { tr: "Kick Kanal Adı", en: "Kick Channel Name", de: "Kanalname", es: "Nombre del canal", fr: "Nom de la chaîne", pt: "Nome do Canal", ru: "Имя канала" }, type: "text", defaultValue: "itsfatih" },
    { name: "title", label: { tr: "Hedef Başlığı", en: "Goal Title", de: "Zieltitel", es: "Título", fr: "Titre", pt: "Título", ru: "Текст" }, type: "text", defaultValue: "HEDEF" },
    { name: "current", label: { tr: "Mevcut Sayı", en: "Current Count", de: "Aktueller Wert", es: "Cantidad actual", fr: "Nombre actuel", pt: "Valor Atual", ru: "Текущее значение" }, type: "text", defaultValue: "0" },
    { name: "target", label: { tr: "Hedef Sayı", en: "Target Goal", de: "Zielwert", es: "Objetivo", fr: "Objectif cible", pt: "Meta", ru: "Целевое значение" }, type: "text", defaultValue: "100" },
    { name: "color", label: { tr: "Çubuk Rengi", en: "Bar Color", de: "Balkenfarbe", es: "Color", fr: "Couleur", pt: "Cor", ru: "Цвет" }, type: "color", defaultValue: "#38bdf8" }
  ]
};
