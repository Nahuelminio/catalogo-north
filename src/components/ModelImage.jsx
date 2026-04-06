import React from "react";
import "../css/ModelImage.css";

/* Mapeo manual (si algún modelo no coincide con el slug) */
const MODEL_IMAGES = {
  // "Elfbar V150 PRO": "/img/modelos/elfbar-v150-pro.webp",
};

function slugifyModel(name = "") {
  return String(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getModelImage(modelo) {
  if (MODEL_IMAGES[modelo]) return MODEL_IMAGES[modelo];
  const slug = slugifyModel(modelo);
  return `/img/modelos/${slug}.png`;
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
