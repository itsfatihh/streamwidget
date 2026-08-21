import { WidgetDef } from './types';

export const nowPlayingWidget: WidgetDef = {
  id: "now-playing",
  name: { tr: "Şu An Çalıyor", en: "Now Playing Widget", de: "Aktueller Musiktitel", es: "Reproduciendo Ahora", fr: "En Cours de Lecture", pt: "Tocando Agora", ru: "Сейчас играет" },
  description: { tr: "Spotify veya YouTube üzerinden çalan şarkıyı albüm kapağıyla ekrana basar.", en: "Displays currently playing track with album cover art.", de: "Aktueller Titel mit Cover.", es: "Pista actual.", fr: "Piste actuelle.", pt: "Música atual.", ru: "Текущий трек." },
  category: "Media",
  fields: [
    { name: "source", label: { tr: "Müzik Servisi", en: "Music Source", de: "Quelle", es: "Fuente", fr: "Source", pt: "Fonte", ru: "Сервис" }, type: "select", defaultValue: "spotify", options: [{ label: { tr: "Spotify", en: "Spotify", de: "Spotify", es: "Spotify", fr: "Spotify", pt: "Spotify", ru: "Spotify" }, value: "spotify" }, { label: { tr: "YouTube Music", en: "YouTube Music", de: "YouTube", es: "YouTube", fr: "YouTube", pt: "YouTube", ru: "YouTube" }, value: "youtube" }] },
    { name: "theme", label: { tr: "Kart Stili", en: "Card Style", de: "Stil", es: "Estilo", fr: "Style", pt: "Estilo", ru: "Стиль" }, type: "select", defaultValue: "compact", options: [{ label: { tr: "Kompakt Kapsül", en: "Compact Capsule", de: "Kompakt", es: "Compacto", fr: "Compact", pt: "Compacto", ru: "Компакт" }, value: "compact" }, { label: { tr: "Vinil Plak Dönen", en: "Spinning Vinyl", de: "Vinyl", es: "Vinilo", fr: "Vinyle", pt: "Vinil", ru: "Винил" }, value: "vinyl" }] }
  ]
};
