// Guarda favoritos por ID de carro en localStorage bajo la clave 'at:favs'
const KEY = "at:favs";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function getFavorites() {
  return read();
}

export function isFavorite(id) {
  const favs = read();
  return favs.includes(id);
}

export function toggleFavorite(id) {
  const favs = read();
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.push(id);
  }
  write(favs);
  // Dispara un evento para que otros componentes reaccionen
  window.dispatchEvent(new Event("autotrust:favorites:changed"));
  return favs;
}
