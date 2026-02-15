import { getJson, setJson } from './storage.js';

const FAV_KEY = 'resqtap:favorites';
let favorites = [];

// Initialize immediately
(async () => {
    favorites = await getJson(FAV_KEY, []);
})();

export function getFavorites() {
    return favorites;
}

export function isFavorite(id) {
    return favorites.includes(id);
}

export function getFavoritesCount() {
    return favorites.length;
}

export function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    setJson(FAV_KEY, favorites);
    window.dispatchEvent(new CustomEvent('favorites-changed'));
    return favorites;
}

export function setFavorites(newFavs) {
    favorites = newFavs;
    setJson(FAV_KEY, favorites);
    window.dispatchEvent(new CustomEvent('favorites-changed'));
}