// src/api/client.js — única instancia de Axios para toda la app
import axios from "axios";
import { API_BASE, WA_PHONE, SUCURSAL_WA_LINKS } from "../config";

export { API_BASE };

export const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Error de conexión con el servidor.";
    return Promise.reject(new Error(message));
  }
);

export function buildWaUrl({ modelo, gusto, puffs, sucursal, sucursalId, phone }) {
  const especificacion = [
    modelo,
    gusto,
    puffs ? `${puffs.toLocaleString("es-AR")} puffs` : null,
  ]
    .filter(Boolean)
    .join(" - ");

  const text =
    `Hola! Vi el catálogo online y quiero consultar por el ${especificacion}.` +
    (sucursal ? ` ¿Tienen stock en ${sucursal}?` : " ¿Tienen stock disponible?");

  // 1. Buscar link en el mapa de sucursales
  const mapped = sucursalId != null ? SUCURSAL_WA_LINKS[String(sucursalId)] : null;

  if (mapped) {
    // Si es un wa.me directo podemos agregar el mensaje pre-llenado
    const directMatch = mapped.match(/wa\.me\/(\d+)/);
    if (directMatch) {
      return `https://wa.me/${directMatch[1]}?text=${encodeURIComponent(text)}`;
    }
    // Link corto (wa.link / walink.co / bit.ly) — abre el chat sin mensaje
    return mapped;
  }

  // 2. Fallback: número de teléfono (del hook o del mapa de phones)
  const waPhone = phone ? String(phone).replace(/[^\d]/g, "") : WA_PHONE;
  return `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
}
