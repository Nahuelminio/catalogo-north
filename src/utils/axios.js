// src/utils/axiosInstance.js
import axios from "axios";

// 1) Si tenés backend en otro puerto/domino, setealo con env:
//    REACT_APP_API_URL=http://localhost:3001
const baseURL = process.env.REACT_APP_API_URL || "/";

const instance = axios.create({
  baseURL, // p.ej. http://localhost:3001
  headers: { Accept: "application/json" },
  timeout: 15000, // 15s
});

// (Opcional) Interceptor de respuesta para normalizar errores
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    // Podés loguear o mapear mensajes
    return Promise.reject(err);
  }
);

export default instance;
