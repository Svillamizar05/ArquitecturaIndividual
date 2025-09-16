
import { useState, useEffect, useMemo } from "react";
import { getCars } from "../api/Car";


const FAV_KEY = "at:favs";

const readFavs = () => {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const writeFavs = (arr) => localStorage.setItem(FAV_KEY, JSON.stringify(arr));
const getFavorites = () => readFavs();
const isFavorite = (id) => readFavs().includes(id);
const toggleFavorite = (id) => {
  const favs = readFavs();
  const i = favs.indexOf(id);
  if (i >= 0) favs.splice(i, 1);
  else favs.push(id);
  writeFavs(favs);
  window.dispatchEvent(new Event("autotrust:favorites:changed"));
  return favs;
};


// Helper para construir URL de imagen
const mediaUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  const path = image.startsWith("/media")
    ? image
    : `/media/${image.replace(/^\/?media\/?/, "")}`;
  return path;
};

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [favsVersion, setFavsVersion] = useState(0); // fuerza re-render al cambiar favoritos

  const LoadCars = async () => {
    try {
      const response = await getCars();
      setCars(response.data);
    } catch (error) {
      console.error("Error cargando carros:", error);
    }
  };

  useEffect(() => {
    LoadCars();
  }, []);

  useEffect(() => {
    const onChange = () => setFavsVersion((v) => v + 1);
    window.addEventListener("autotrust:favorites:changed", onChange);
    return () => window.removeEventListener("autotrust:favorites:changed", onChange);
  }, []);

  const filtered = useMemo(() => {
    if (!onlyFavs) return cars;
    const favIds = new Set(getFavorites());
    return cars.filter((c) => favIds.has(c.id));
  }, [cars, onlyFavs, favsVersion]);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-red-600">Carros disponibles</h1>

        <label className="inline-flex items-center gap-2 text-red-700 cursor-pointer select-none">
          <input
            type="checkbox"
            className="accent-red-600 w-4 h-4"
            checked={onlyFavs}
            onChange={(e) => setOnlyFavs(e.target.checked)}
          />
          Ver solo favoritos
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-6">
        {filtered.map((car) => {
          const img = mediaUrl(car.image);
          const fav = isFavorite(car.id);

          return (
            <div
              key={car.id}
              className="relative bg-gray-900 text-gray-200 rounded-xl shadow-lg overflow-hidden hover:scale-105 transform transition"
            >
              {/* Botón corazón arriba a la derecha */}
              <button
                onClick={() => toggleFavorite(car.id)}
                aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
                title={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
                className={`absolute top-2 right-2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition ${
                  fav ? "text-red-500" : "text-gray-300"
                }`}
              >
                {/* Corazón SVG (sin dependencias) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill={fav ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                </svg>
              </button>

              {/* Imagen */}
              {img ? (
                <img
                  src={img}
                  alt={`${car.model} ${car.year}`}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Sin imagen</span>
                </div>
              )}

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-white">
                    {car.model}
                  </h2>
                  {fav && (
                    <span className="bg-red-600/20 text-red-400 text-xs font-semibold px-2 py-0.5 rounded">
                      Favorito
                    </span>
                  )}
                </div>

                <p className="text-gray-400">Año: {car.year}</p>
                <p className="text-red-500 font-bold text-lg">${car.price}</p>
                <p className="text-gray-300 mt-1">{car.comments}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Creado: {new Date(car.created).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  Actualizado: {new Date(car.updated).toLocaleString()}
                </p>

                {/* Botones */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => toggleFavorite(car.id)}
                    className={`flex-1 font-bold py-2 px-4 rounded-lg shadow transition ${
                      fav
                        ? "bg-red-700 hover:bg-red-800 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    {fav ? "❤️ Quitar" : "🤍 Favorito"}
                  </button>

                  <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow">
                    💬 Chat
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-400 mt-6">
          {onlyFavs
            ? "No tienes carros en favoritos todavía."
            : "No hay carros para mostrar."}
        </p>
      )}
    </div>
  );
}
