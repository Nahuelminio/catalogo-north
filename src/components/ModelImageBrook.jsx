import React, { useState } from "react";
import "../css/ModelImage.css";

/* Mapeo manual opcional (si algún modelo no coincide con el slug) */
const MODEL_IMAGES = {
  // "Elfbar V150 PRO": "/img/imgBrook/elfbar-v150-pro.png",
};

function slugifyModel(name = "") {
  return String(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getModelImage(modelo) {
  if (MODEL_IMAGES[modelo]) return MODEL_IMAGES[modelo];
  const slug = slugifyModel(modelo);
  return `/img/imgBrook/${slug}.png`;
}

export default function ModelImageBrook({ modelo }) {
  const [loaded, setLoaded] = useState(false);

  const handleError = (e) => {
    // fallback a .jpg
    const triedJpg = e.currentTarget.dataset.triedJpg === "1";
    if (!triedJpg) {
      e.currentTarget.dataset.triedJpg = "1";
      e.currentTarget.src = getModelImage(modelo).replace(".png", ".jpg");
      return;
    }

    // fallback definitivo SVG invisible pero válido
    e.currentTarget.src =
      "data:image/svg+xml;utf8," +
      encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg"/>');
  };

  return (
    <img
      src={getModelImage(modelo)}
      alt={modelo}
      loading="lazy"
      onError={handleError}
      onLoad={() => setLoaded(true)}
      className={`img-brook ${loaded ? "img-loaded" : "img-loading"}`}
    />
  );
}
