// src/config.js — única fuente de verdad para variables de entorno y constantes globales

export const API_BASE = (
  process.env.REACT_APP_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

// Número central (fallback). Formato: solo dígitos con código de país.
export const WA_PHONE = (
  process.env.REACT_APP_WA_PHONE || "5493764202408"
).replace(/[^\d]/g, "");

// Links de WhatsApp por sucursal — número directo con mensaje pre-llenado.
// Formato: wa.me/NÚMERO (solo dígitos, con código de país).
export const SUCURSAL_WA_LINKS = {
  "1":  "https://wa.me/5493764939556",  // Itaembe Guazú
  "2":  "https://wa.me/5493764185019",  // Santo Tomé
  "3":  "https://wa.me/5493764757290",  // Casa Martín
  "4":  "https://wa.me/5493764830712",  // Villa Cabello
  "5":  "https://wa.me/5493764170673",  // Santa Ana
  "6":  "https://wa.me/5493764298148",  // Brickell
  "7":  "https://wa.me/5493764202408",  // Central
  "8":  "https://wa.me/5493764202408",  // Brooklyn Barra Patio
  "9":  "https://wa.me/5493764202408",  // Brooklyn Barra Pista
  "10": "https://wa.me/5493764507998",  // Maluh
  "11": "https://wa.me/5493764357807",  // Garupa
};

// IDs de sucursales Brooklyn (usados en CatalogoBrook)
export const IDS_BROOKLYN = [8, 9];
export const DEFAULT_BROOKLYN_ID = 8;
