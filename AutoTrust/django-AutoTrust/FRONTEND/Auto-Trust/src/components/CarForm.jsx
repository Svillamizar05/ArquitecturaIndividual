// src/components/CarForm.jsx
import { useState, useEffect, useRef } from "react";
import { createCar } from "../api/Car";
import { useNavigate } from "react-router-dom";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export default function CarForm() {
  const [car, setCar] = useState({
    model: "",
    year: "",
    price: "",
    comments: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Limpia la URL de preview al desmontar o cambiar
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const resetForm = () => {
    setCar({ model: "", year: "", price: "", comments: "", image: null });
    setPreview(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateImage = (file) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Formato no permitido. Usa JPG, PNG o WEBP.");
    }
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_SIZE_MB) {
      throw new Error(`La imagen supera ${MAX_SIZE_MB} MB.`);
    }
  };

  const handleFileChange = (e) => {
    setErrorMsg("");
    const file = e.target.files?.[0];
    if (!file) {
      setCar((c) => ({ ...c, image: null }));
      setPreview(null);
      return;
    }
    try {
      validateImage(file);
      setCar((c) => ({ ...c, image: file }));
      const url = URL.createObjectURL(file);
      setPreview(url);
    } catch (err) {
      setErrorMsg(err.message || "Archivo inválido.");
      setCar((c) => ({ ...c, image: null }));
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setCar((c) => ({ ...c, image: null }));
    setPreview(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    // DRF puede parsear strings para Integer/Decimal
    const fd = new FormData();
    fd.append("model", car.model.trim());
    fd.append("year", String(car.year).trim());
    fd.append("price", String(car.price).trim());
    fd.append("comments", car.comments ?? "");
    if (car.image) fd.append("image", car.image);

    try {
      await createCar(fd); // usa /api proxy + multipart en api/Car.js
      resetForm();
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : err?.message || "Error al crear el vehículo.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        {/* Modelo */}
        <div>
          <label className="block text-sm font-bold text-gray-700">Modelo:</label>
          <input
            type="text"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Año */}
        <div>
          <label className="block text-sm font-bold text-gray-700">Año:</label>
          <input
            type="number"
            min="1900"
            max="2100"
            value={car.year}
            onChange={(e) => setCar({ ...car, year: e.target.value })}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-bold text-gray-700">Precio:</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={car.price}
            onChange={(e) => setCar({ ...car, price: e.target.value })}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Comentarios */}
        <div>
          <label className="block text-sm font-bold text-gray-700">Comentarios:</label>
          <input
            type="text"
            value={car.comments}
            onChange={(e) => setCar({ ...car, comments: e.target.value })}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-bold text-gray-700">Imagen:</label>
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />

          {/* Info pequeña de formatos */}
          <p className="text-xs text-gray-500 mt-1">
            Formatos permitidos: JPG, PNG, WEBP. Tamaño máximo: {MAX_SIZE_MB} MB.
          </p>

          {preview && (
            <div className="mt-2">
              <img src={preview} alt="Vista previa" className="max-h-40 rounded border" />
              <button
                type="button"
                onClick={removeImage}
                className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded"
              >
                Quitar imagen
              </button>
            </div>
          )}
        </div>

        {/* Errores */}
        {errorMsg && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded">
            {errorMsg}
          </div>
        )}

        {/* Acciones */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={`${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            } bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
          >
            {submitting ? "Subiendo..." : "Poner a la venta"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="ml-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
