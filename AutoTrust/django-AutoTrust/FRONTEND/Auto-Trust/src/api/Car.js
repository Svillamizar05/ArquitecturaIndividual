// src/api/Car.js
import axios from "axios";

// gracias al proxy de Vite, no hace falta poner http://127.0.0.1:8000
const CarsApi = axios.create({
  baseURL: "/api/Car",
});

// Obtener lista de carros
export const getCars = () => CarsApi.get("/");

// Crear carro con imagen (FormData)
export const createCar = (formData) =>
  CarsApi.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
