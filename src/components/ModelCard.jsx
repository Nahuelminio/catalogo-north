// src/components/ModelCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import ModelImage from "./ModelImage";
import { buildWaUrl } from "../api/client";
import {
  getCanonical,
  getModelDesc,
  isAccesorioModelo,
  toSlug,
} from "../utils/model";

export default function ModelCard({ grupo, sucursalName, sucursalId }) {
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
    <article
      className={`group-card${cardMods}`}
      key={`${modelo}-${puffs || ml || "na"}`}
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
    </article>
  );
}
