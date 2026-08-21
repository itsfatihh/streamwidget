import { WidgetDef } from './types';

export const subGoalWidget: WidgetDef = {
  id: "sub-goal",
  name: { tr: "Abone Hedefi", en: "Subscriber Goal", de: "Abonnenten-Ziel", es: "Objetivo de Suscriptores", fr: "Objectif d'Abonnés", pt: "Meta de Inscritos", ru: "Цель по подписчикам" },
  description: { tr: "Kick aktif abone sayısını otomatik çeken ve yeni abonelik geldikçe canlı ilerleyen çubuk.", en: "Automatically fetches Kick subscriber count and progresses smoothly with live subs.", de: "Ruft Kick-Abonnenten ab.", es: "Barra de suscriptores en vivo.", fr: "Progression des abonnés.", pt: "Inscritos ao vivo.", ru: "Шкала подписчиков." },
  category: "Engage",
  fields: [
    { name: "channel", label: { tr: "Kick Kanal Adı", en: "Kick Channel Name", de: "Kanalname", es: "Nombre del canal", fr: "Nom de la chaîne", pt: "Nome do Canal", ru: "Имя канала" }, type: "text", defaultValue: "itsfatih" },
    { name: "title", label: { tr: "Hedef Başlığı (Sol Yazı)", en: "Goal Title", de: "Zieltitel", es: "Título del objetivo", fr: "Titre de l'objectif", pt: "Título da Meta", ru: "Текст цели" }, type: "text", defaultValue: "ABONE HEDEFİ" },
    { name: "target", label: { tr: "Hedef Abone Sayısı", en: "Target Goal", de: "Zielwert", es: "Objetivo", fr: "Objectif cible", pt: "Meta", ru: "Целевое значение" }, type: "text", defaultValue: "50" },
    { name: "color", label: { tr: "Bar Rengi", en: "Bar Color", de: "Balkenfarbe", es: "Color", fr: "Couleur", pt: "Cor", ru: "Цвет" }, type: "color", defaultValue: "#a855f7" }
  ]
};
