import { WidgetDef } from './types';

export const nowPlayingWidget: WidgetDef = {
  id: "now-playing",
  name: {
    tr: "Şu An Çalıyor",
    en: "Now Playing Widget",
    de: "Aktueller Musiktitel",
    es: "Reproduciendo Ahora",
    fr: "En Cours de Lecture",
    pt: "Tocando Agora",
    ru: "Сейчас играет"
  },
  description: {
    tr: "Spotify hesabınızda çalan şarkıyı albüm kapağı, sanatçı ve canlı süre barıyla ekrana yansıtır.",
    en: "Displays live Spotify track with cover art, artists and duration bar.",
    de: "Zeigt den aktuell auf Spotify gespielten Titel mit Albumcover.",
    es: "Muestra la pista de Spotify en vivo con carátula.",
    fr: "Affiche le titre Spotify en cours de lecture avec la pochette.",
    pt: "Mostra a música do Spotify ao vivo com capa do álbum.",
    ru: "Отображает текущий трек Spotify с обложкой."
  },
  category: "Media",
  fields: [
    {
      name: "refresh_token",
      label: { tr: "Spotify Oturum Anahtarı (Token)", en: "Spotify Refresh Token", de: "Spotify-Token", es: "Token de Spotify", fr: "Jeton Spotify", pt: "Token do Spotify", ru: "Токен Spotify" },
      type: "text",
      defaultValue: ""
    },
    {
      name: "theme",
      label: { tr: "Tasarım Stili", en: "Design Style", de: "Design-Stil", es: "Estilo", fr: "Style", pt: "Estilo", ru: "Стиль" },
      type: "select",
      defaultValue: "compact",
      options: [
        { label: { tr: "Kompakt Kart", en: "Compact Card", de: "Kompakte Karte", es: "Tarjeta Compacta", fr: "Carte Compacte", pt: "Cartão Compacto", ru: "Компактная карта" }, value: "compact" },
        { label: { tr: "Dönen Vinil Plak", en: "Spinning Vinyl", de: "Drehendes Vinyl", es: "Vinilo Giratorio", fr: "Vinyle Rotatif", pt: "Vinil Giratório", ru: "Вращающийся винил" }, value: "vinyl" }
      ]
    }
  ]
};
