import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/utils/favorites";

export default function FavoriteHeart({ carId, size = 22 }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(carId));
    const onChange = () => setFav(isFavorite(carId));
    window.addEventListener("autotrust:favorites:changed", onChange);
    return () => window.removeEventListener("autotrust:favorites:changed", onChange);
  }, [carId]);

  const handleClick = (e) => {
    e.stopPropagation();
    toggleFavorite(carId);
    setFav(isFavorite(carId));
  };

  return (
    <button
      onClick={handleClick}
      aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
      title={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`p-2 rounded-full transition hover:scale-110 ${
        fav ? "text-rose-500" : "text-slate-400"
      }`}
    >
      <Heart size={size} fill={fav ? "currentColor" : "none"} />
    </button>
  );
}
