import React from "react";
import "../css/ModelImage.css";

/* Mapeo manual (si algún modelo no coincide con el slug) */
const MODEL_IMAGES = {
  "EBCREATE BC PRO - 40.000 puffs": "/img/modelos/ebcreate-bc-pro.webp",
};

function slugifyModel(name = "") {
  return String(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* El servidor manda las fotos con caché de 7 días y el nombre del archivo no
   cambia al reemplazarlas, así que quien ya entró seguía viendo las viejas.
   Subir este número fuerza a que las pidan de nuevo. */
const VERSION_FOTOS = "2";

function getModelImage(modelo) {
  const base = MODEL_IMAGES[modelo] || `/img/modelos/${slugifyModel(modelo)}.webp`;
  return `${base}?v=${VERSION_FOTOS}`;
}

export default function ModelImage({ modelo }) {
  const handleError = (e) => {
    const triedJpg = e.currentTarget.dataset.triedJpg === "1";
    if (!triedJpg) {
      e.currentTarget.dataset.triedJpg = "1";
      e.currentTarget.src = getModelImage(modelo).replace(".webp", ".jpg");
    } else {
      e.currentTarget.src =
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>
             <rect width='100%' height='100%' fill='#111'/>
             <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                   fill='#bbb' font-family='sans-serif' font-size='22'>${modelo}</text>
           </svg>`
        );
    }
  };

  return (
    <div className="model-media">
      <img
        src={getModelImage(modelo)}
        alt={modelo}
        loading="lazy"
        onError={handleError}
      />
    </div>
  );
}
