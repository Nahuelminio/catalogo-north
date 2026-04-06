// src/api/client.js
import axios from "axios";

/* API base desde .env (Vite o CRA) */
export const API_BASE = (() => {
  const vite = typeof import.meta !== "undefined" && import.meta.env;
  const url =
    (vite && (vite.VITE_API_URL || vite.VITE_BACKEND_URL)) ||
    process.env.REACT_APP_API_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    "http://localhost:3000";
  return String(url).replace(/\/+$/, "");
})();

export const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

/* WhatsApp */
const WA_PHONE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_WA_PHONE) ||
  process.env.REACT_APP_WA_PHONE ||
  "3764202408";

const WA_PHONE_CLEAN = String(WA_PHONE).replace(/[^\d]/g, "");

export function buildWaUrl({ modelo, gusto, puffs, sucursal }) {
  const text =
    `Hola North, me gustaría pedirte un ${modelo}${
      gusto ? " - " + gusto : ""
    }` +
    (puffs ? ` de ${puffs.toLocaleString("es-AR")} puffs` : "") +
    (sucursal ? `. Sucursal: ${sucursal}` : "") +
    ".";
  return `https://wa.me/${WA_PHONE_CLEAN}?text=${encodeURIComponent(text)}`;
}
