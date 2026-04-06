// normalizador y alias (mismos que usamos en las descripciones)
export const normKey = (s = "") => s.toLowerCase().replace(/\s+/g, " ").trim();

export const MODEL_ALIASES = {
  "elfbar king": "elfbar ice king 40000",
  "ice king 40000": "elfbar ice king 40000",
  mt35000: "lost mary mt35000",
  "mt35000 turbo": "lost mary mt35000 turbo",
  "Ignite V80 New Edition": "Ignite v80",
  "Ignite V80 New Edition Blue": "Ignite v80",
};
// ✅ Agregá este bloque en ./data/modelDescriptions.js
// (claves en minúsculas y normalizadas)

export const MODEL_DESCRIPTIONS = {
  // ==== ELFBAR ====
  "elfbar bc10000":
    "Listo para usar, práctico y de excelente rendimiento. Golpe firme y sabor constante en cada calada.",
  "elfbar bc15000":
    "Compacto y duradero, con sabor parejo hasta el final. Recargable por USB-C y pensado para uso diario.",
  "elfbar ice king":
    "Autonomía superior con control de frescura en 5 niveles. Ideal para quienes buscan una experiencia personalizada.",
  "elfbar ice king 40000":
    "Máxima duración y ajuste total: frescura, dulzura o acidez a tu gusto. Experiencia premium en cada puff.",
  "elfbar sour king":
    "Autonomía superior con control de acido en 5 niveles. Ideal para quienes buscan una experiencia personalizada.",
  "elfbar te30k":
    "Doble resistencia y flujo de aire regulable. Pantalla simple, carga rápida USB-C y desempeño confiable.",

  // ==== LOST MARY ====
  "lost mary mo":
    "Diseño elegante y uso sin esfuerzo. Sabor equilibrado y rendimiento constante hasta el último puff.",
  "lost mary mo20000 pro":
    "Versión avanzada con acabado premium, mayor autonomía y sabor estable. Ideal para sesiones prolongadas.",
  "lost mary mt":
    "Potencia y autonomía en un cuerpo moderno. Sabor intenso y estable incluso en uso continuo.",
  "lost mary mt35000":
    "Gran autonomía y potencia mejorada. Sabor definido y equilibrado en un formato sofisticado.",
  "lost mary mixer":
    "Combinaciones únicas de sabores frutales y refrescantes. Flujo suave y golpe equilibrado.",
  "lost mary mixer 30000":
    "Mezcla intensa de sabores y alto rendimiento. Duradero, recargable y con vapor denso y parejo.",

  // ==== IGNITE ====
  "Ignite V80 New Edition":
  "Versión mejorada con diseño ergonómico y sabor optimizado. Ideal para uso diario con comodidad.",
  "Ignite V80 New Edition Blue":
  "Versión mejorada con diseño ergonómico y sabor optimizado. Ideal para uso diario con comodidad.",
  "ignite v150":
    "Diseño compacto para todo el día. Sabor limpio, vapor suave y excelente portabilidad.",
  "ignite v150 pro":
    "Más potencia y densidad de vapor sin perder comodidad. Ideal para quienes buscan mayor intensidad.",
  "ignite v250":
    "Gran autonomía y perfil de sabor profundo. Perfecto para sesiones largas con vapor abundante.",
  "ignite v400 ice":
    "Duración extendida con perfil frutal y frescura intensa. Una experiencia equilibrada y potente.",
  "ignite v155 ultra":
    "Diseño premium y discreto. Sabor limpio, vapor suave y excelente portabilidad.",

  // ==== GEEKBAR ====
  "geekbar x 25000":
    "Alta capacidad y sabor constante de principio a fin. Vapor denso, carga rápida y diseño moderno.",

  // ==== LOST ANGEL ====
  "lost angel":
    "Estructura sólida y sabor persistente. Ideal para quienes valoran duración y golpe definido.",
  "lost angel pro max 20000":
    "Versión avanzada con mayor autonomía y sabor uniforme. Experiencia intensa y estable en cada uso.",

  // ==== OTROS / ACCESORIOS ====
  "sex addict":
    "Edición exclusiva con perfil audaz e intensidad superior. Pensado para quienes buscan algo diferente.",
  "elfbar trio":
    "Tres modos en un solo dispositivo: Ice, Sour y Sweet. Ajuste de frescura y hasta 40.000 caladas de placer.",
  "oxbar cartucho":
    "Cartucho de repuesto con excelente rendimiento y sabor puro. Compatible con batería Oxbar.",
  "oxbar bateria":
    "Batería compacta de 1100 mAh con carga rápida. Potente y confiable para acompañar tus sesiones.",
};



export const MODEL_SPECS = {
  // ==== ELFBAR ====
  "elfbar bc10000": {
    puffs: 10000,
    ml: null,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 620,
    nic_percent: 5,
  },
  "elfbar bc15000": {
    puffs: 15000,
    ml: null,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 650,
    nic_percent: 5,
  },
  "elfbar ice king 40000": {
    puffs: 40000,
    ml: 20,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 850,
    nic_percent: 5,
    freshness_levels: 5,
  },
  "elfbar te30k": {
    puffs: 30000,
    ml: 13,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 700,
    nic_percent: 5,
  },

  // ==== LOST MARY ====
  "lost mary mo20000": {
    puffs: 20000,
    ml: 18,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 800,
    nic_percent: 5,
  },
  "lost mary mo20000 pro": {
    puffs: 20000,
    ml: 18,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 800,
    nic_percent: 5,
  },
  "lost mary mt35000": {
    puffs: 35000,
    ml: null,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: null,
    nic_percent: null,
  },
  "lost mary mt35000 turbo": {
    puffs: 35000,
    ml: 18,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 1000,
    nic_percent: 5,
  },
  "lost mary mixer 30000": {
    puffs: 30000,
    ml: 19,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 800,
    nic_percent: 5,
  },

  // ==== IGNITE ====
  "ignite v150": {
    puffs: 15000,
    ml: 12,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 650,
    nic_percent: 5,
  },
  "ignite v150 pro": {
    puffs: 15000,
    ml: 12,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 650,
    nic_percent: 5,
  },
  "ignite v250": {
    puffs: 25000,
    ml: 16,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 650,
    nic_percent: 5,
  },

  // ==== GEEKBAR ====
  "geekbar x 25000": {
    puffs: 25000,
    ml: 18,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 820,
    nic_percent: 5,
  },

  // ==== LOST ANGEL ====
  "lost angel pro max 20000": {
    puffs: 20000,
    ml: 16,
    recargable: true,
    puerto: "USB-C",
    bateria_mAh: 650,
    nic_percent: 5,
  },
};

// helper para obtener specs con alias
export const getModelSpecs = (name = "") => {
  const k = normKey(name);
  const canonical = MODEL_ALIASES[k] || k;
  return MODEL_SPECS[canonical] || null;
};

// cómo transformar specs en chips legibles (tolerante a número/string)
export const specChips = (s) => {
  if (!s) return [];
  const chips = [];

  if (s.puffs) chips.push(`${Number(s.puffs).toLocaleString("es-AR")} puffs`);
  if (s.ml) chips.push(`${Number(s.ml)} ml`);

  if (s.bateria_mAh != null) {
    const bat =
      typeof s.bateria_mAh === "number"
        ? s.bateria_mAh
        : parseInt(String(s.bateria_mAh).replace(/[^\d]/g, ""), 10);
    if (!Number.isNaN(bat)) chips.push(`${bat} mAh`);
  }

  if (s.recargable) chips.push(s.puerto ? s.puerto : "Recargable");
  if (s.nic_percent) chips.push(`${Number(s.nic_percent)}% nic`);
  if (s.freshness_levels) chips.push(`Ice x${Number(s.freshness_levels)}`);
  if (s.flavors_count) chips.push(`${Number(s.flavors_count)} sabores`);
  return chips;
};

// (opcional) meta unificado: descripción + specs + chips
// import { MODEL_DESCRIPTIONS } from "./modelDescriptions";
export const getModelMeta = (name = "", descriptionsObj) => {
  const k = normKey(name);
  const canonical = MODEL_ALIASES[k] || k;
  const specs = MODEL_SPECS[canonical] || null;
  const desc =
    (descriptionsObj &&
      descriptionsObj[canonical]) /*|| MODEL_DESCRIPTIONS?.[canonical]*/ ||
    null;
  return { canonical, desc, specs, chips: specChips(specs) };
};
