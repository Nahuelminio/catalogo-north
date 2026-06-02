import React from "react";
import PropTypes from "prop-types";
import ModelImageBrook from "./ModelImageBrook";
import { isAccesorioModelo } from "../utils/model";
import "../css/MenuBrook.css";

// 🏷️ Mapa de precios por modelo (slug)
const PRECIOS_MODELOS = {
  "elfbar-bc15000": "18.000",
  "elfbar-ice-king": "23.000",
  "lost-mary-mo": "20.000",
  "lost-mary-mt": "23.000",
  "lost-angel": "19.000",
  "ignite-v150-pro": "21.000",
  "ignite-v250": "23.000",
  // agregar más si querés
};

ModelBrook.propTypes = {
  grupo: PropTypes.shape({
    modelo: PropTypes.string.isRequired,
    puffs: PropTypes.number,
    ml: PropTypes.number,
    gustos: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.any, gusto: PropTypes.string })
    ),
  }).isRequired,
  sucursalName: PropTypes.string,
  sucursalId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  index: PropTypes.number,
};

export default function ModelBrook({ grupo, sucursalName, sucursalId, index }) {
  const { modelo, puffs, ml, gustos } = grupo;

  // badge
  const badgeText = puffs
    ? `${puffs.toLocaleString("es-AR")} puffs`
    : ml
    ? "LÍQUIDOS"
    : isAccesorioModelo(modelo)
    ? "ACCESORIO"
    : null;

  // dirección alternada
  const isImageRight = index % 2 === 0;

  // generar slug para precio
  const slug = modelo.toLowerCase().replace(/\s+/g, "-");
  const precio = PRECIOS_MODELOS[slug] || null;

  return (
    <section className="section-brook">
      <h2 className="model-menu-title">
        {modelo} {badgeText ? `- ${badgeText}` : ""}
      </h2>

      <article className={`model-menu-card ${isImageRight ? "reverse" : ""}`}>
        {/* 🖼️ Imagen del modelo */}
        <div className="model-menu-img">
          <ModelImageBrook modelo={modelo} loading="lazy" decoding="async" />
        </div>

        {/* 🧃 Gustos */}
        <div className="model-menu-info">
          {gustos?.length > 0 && (
            <div className="model-menu-gustos">
              {gustos.map((g) => {
                return (
                  <p key={g.id}>
                    {g.gusto} –{" "}
                    {precio
                      ? `$${precio.toLocaleString("es-AR")}`
                      : "Consultar"}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
