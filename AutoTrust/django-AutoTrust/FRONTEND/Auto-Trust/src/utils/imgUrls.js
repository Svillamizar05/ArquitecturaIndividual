// src/utils/imgUrl.js
export function mediaUrl(image) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  // normaliza "cars/xxx.jpg" o "media/cars/xxx.jpg" a "/media/cars/xxx.jpg"
  const path = image.startsWith("/media")
    ? image
    : `/media/${image.replace(/^\/?media\/?/, "")}`;
  return path; // con tu proxy de Vite, esto funciona directo
}
