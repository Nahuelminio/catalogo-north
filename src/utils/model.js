// src/utils/model.js
import { MODEL_DESCRIPTIONS } from "../data/modelDescriptions";

export const normKey = (s = "") => s.toLowerCase().replace(/\s+/g, " ").trim();

export const MODEL_ALIASES = {
  "elfbar king": "elfbar ice king 40000",
  "Ignite V80 New Edition": "Ignite v80",
  "Ignite V80 New Edition Blue": "Ignite v80",
  "ice king 40000": "elfbar ice king 40000",
  mt35000: "lost mary mt35000",
  "mt35000 turbo": "lost mary mt35000 turbo",
};

export const getCanonical = (name = "") =>
  MODEL_ALIASES[normKey(name)] || normKey(name);

export const toSlug = (s = "") =>
  normKey(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function getModelDesc(name = "") {
  const canonical = getCanonical(name);
  return MODEL_DESCRIPTIONS?.[canonical] || null;
}

export function splitModeloGusto(nombre = "") {
  const parts = String(nombre)
    .split(" - ")
    .map((x) => x.trim())
    .filter(Boolean);
  if (parts.length <= 1) return { modelo: parts[0] || "", gusto: "" };
  return { modelo: parts[0], gusto: parts[parts.length - 1] };
}

export function extractPuffs(str = "") {
  const s = String(str).toLowerCase();
  const mK = s.match(/(\d{2,3})\s*k\b/);
  if (mK) return parseInt(mK[1], 10) * 1000;
  const mP = s.match(/(\d{1,3}(?:[.\s]\d{3})+|\d{4,6})\s*puffs?\b/);
  if (mP) return parseInt(mP[1].replace(/[^\d]/g, ""), 10);
  const mN = s.match(/\b(\d{4,6})\b/);
  if (mN) return parseInt(mN[1], 10);
  return null;
}

export function extractMl(str = "") {
  const s = String(str).toLowerCase();
  const m = s.match(/(\d{1,3})\s*m[l]\b/);
  return m ? parseInt(m[1], 10) : null;
}

export const isAccesorioModelo = (modelo = "") =>
  /bateri(a|á)|battery|cargador|charger|mod\b|box\s*mod|dispositivo|kit\b|accesori/i.test(
    modelo,
  );
