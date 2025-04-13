// utils/favoriteUtils.js
export const getFavorites = () => {
  const data = localStorage.getItem("favorites");
  return data ? JSON.parse(data) : [];
};

export const saveFavorites = (favorites) => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

export const isFavorited = (podcastId) => {
  const favorites = getFavorites();
  return favorites.includes(podcastId);
};

export const toggleFavorite = (podcastId) => {
  const favorites = getFavorites();
  const isAlreadyFav = favorites.includes(podcastId);
  const updatedFavorites = isAlreadyFav
    ? favorites.filter((id) => id !== podcastId)
    : [...favorites, podcastId];

  saveFavorites(updatedFavorites);
  return updatedFavorites;
};
