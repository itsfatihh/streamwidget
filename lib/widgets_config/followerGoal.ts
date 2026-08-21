import { WidgetDef } from './types';

export const followerGoalWidget: WidgetDef = {
  id: "follower-goal",
  name: { tr: "Takipçi Hedefi", en: "Follower Goal", de: "Follower-Ziel", es: "Objetivo de Seguidores", fr: "Objectif de Followers", pt: "Meta de Seguidores", ru: "Цель по фолловерам" },
  description: { tr: "Kick takipçi sayısını otomatik çeken ve yeni takip geldikçe canlı ilerleyen çubuk.", en: "Automatically fetches Kick follower count and smoothly progresses with live follows.", de: "Ruft Kick-Follower ab.", es: "Barra de seguidores en vivo.", fr: "Progression des followers.", pt: "Seguidores ao vivo.", ru: "Шкала подписчиков." },
  category: "Engage",
  fields: [
    { name: "channel", label: { tr: "Kanal Adı", en: "Kick Channel Name", de: "Kanalname", es: "Nombre del canal", fr: "Nom de la chaîne", pt: "Nome do Canal", ru: "Имя канала" }, type: "text", defaultValue: "itsfatih" },
    { name: "title", label: { tr: "Hedef Başlığı (Sol Yazı)", en: "Goal Title", de: "Zieltitel", es: "Título del objetivo", fr: "Titre de l'objectif", pt: "Título da Meta", ru: "Текст цели" }, type: "text", defaultValue: "TAKİPÇİ HEDEFİ" },
    { name: "target", label: { tr: "Hedef Sayısı", en: "Target Goal", de: "Zielwert", es: "Objetivo", fr: "Objectif cible", pt: "Meta", ru: "Целевое значение" }, type: "text", defaultValue: "3000" },
    { name: "color", label: { tr: "Bar Rengi", en: "Bar Color", de: "Balkenfarbe", es: "Color", fr: "Couleur", pt: "Cor", ru: "Цвет" }, type: "color", defaultValue: "#53FC18" }
  ]
};
