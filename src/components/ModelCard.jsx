import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ModelImage from "./ModelImage";
import { buildWaUrl } from "../api/client";
import {
  getCanonical,
  getModelDesc,
  isAccesorioModelo,
  toSlug,
} from "../utils/model";

ModelCard.propTypes = {
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
  sucursalPhone: PropTypes.string,
  index: PropTypes.number,
};

function ModelCard({ grupo, sucursalName, sucursalId, sucursalPhone, index = 0 }) {
  const { modelo, puffs, ml, gustos } = grupo;

  const badgeText = puffs
    ? `${puffs.toLocaleString("es-AR")} puffs`
    : ml
    ? "LÍQUIDOS"
    : isAccesorioModelo(modelo)
    ? "ACCESORIO"
    : null;

  const cardMods =
    badgeText === "LÍQUIDOS"
      ? " is-liquid"
      : badgeText === "ACCESORIO"
      ? " is-acc"
      : "";

  const badgeClass =
    badgeText === "LÍQUIDOS"
      ? "badge badge-red"
      : badgeText === "ACCESORIO"
      ? "badge badge-muted"
      : "badge";

  const canonical = getCanonical(modelo);
  const desc = getModelDesc(modelo);
  const slug = toSlug(canonical);

  return (
    <motion.article
      className={`group-card${cardMods}`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.38,
        ease: [0.25, 0.1, 0.25, 1],
        delay: Math.min(index * 0.07, 0.42),
      }}
      whileHover={{ y: -5, transition: { duration: 0.18, ease: "easeOut" } }}
      whileTap={{ scale: 0.99, transition: { duration: 0.08 } }}
    >
      <ModelImage modelo={modelo} loading="lazy" decoding="async" />

      <header className="model-head">
        <h2 className="model-title" title={modelo}>
          <Link
            to={`/modelo/${slug}`}
            state={{
              modelo,
              canonical,
              puffs,
              ml,
              gustos,
              sucursalId,
              sucursalName,
              sucursalPhone,
            }}
            className="plain-link"
          >
            {modelo}
          </Link>
        </h2>
        {badgeText && <span className={badgeClass}>{badgeText}</span>}
      </header>

      {desc && (
        <div className="model-desc">
          <p>{desc}</p>
        </div>
      )}

      <div className="flavors-block">
        <p className="flavors-title">Gustos disponibles</p>
        <ul className="flavor-list">
          {gustos.map((g) => {
            const href = buildWaUrl({
              modelo,
              gusto: g.gusto,
              puffs,
              sucursal: sucursalName,
              sucursalId,
              phone: sucursalPhone,
            });
            return (
              <li className="flavor-item" key={g.id}>
                <a
                  className="flavor-link"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {g.gusto}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.article>
  );
}

export default React.memo(ModelCard);
