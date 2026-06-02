import React from "react";
import { motion } from "framer-motion";
import ModelImage from "./ModelImage";
import { getCanonical, getModelDesc, isAccesorioModelo } from "../utils/model";

function ModelCardPedido({ grupo, cantidadDe, onAgregar, index = 0 }) {
  const { modelo, puffs, ml, gustos } = grupo;

  const badgeText = puffs
    ? `${puffs.toLocaleString("es-AR")} puffs`
    : ml
    ? "LÍQUIDOS"
    : isAccesorioModelo(modelo)
    ? "ACCESORIO"
    : null;

  const cardMods =
    badgeText === "LÍQUIDOS" ? " is-liquid"
    : badgeText === "ACCESORIO" ? " is-acc"
    : "";

  const badgeClass =
    badgeText === "LÍQUIDOS" ? "badge badge-red"
    : badgeText === "ACCESORIO" ? "badge badge-muted"
    : "badge";

  const desc = getModelDesc(getCanonical(modelo));

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
    >
      <ModelImage modelo={modelo} loading="lazy" decoding="async" />

      <header className="model-head">
        <h2 className="model-title">{modelo}</h2>
        {badgeText && <span className={badgeClass}>{badgeText}</span>}
      </header>

      {desc && (
        <div className="model-desc">
          <p>{desc}</p>
        </div>
      )}

      <div className="flavors-block">
        <p className="flavors-title">Gustos disponibles</p>
        <ul className="flavor-list" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {gustos.map((g) => {
            const qty = cantidadDe(modelo, g.gusto);
            return (
              <li key={g.id} style={{ listStyle: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", gap: 8,
                }}>
                  <span style={{
                    fontSize: "0.85rem", color: "#ccc",
                    flex: 1, minWidth: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {g.gusto}
                  </span>

                  {qty === 0 ? (
                    <button
                      onClick={() => onAgregar(modelo, g.gusto)}
                      style={{
                        background: "rgba(34,197,94,0.12)",
                        border: "1px solid rgba(34,197,94,0.35)",
                        color: "#22c55e",
                        borderRadius: 8, padding: "5px 14px",
                        fontSize: "0.8rem", fontWeight: 700,
                        cursor: "pointer", flexShrink: 0,
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(34,197,94,0.22)";
                        e.currentTarget.style.borderColor = "#22c55e";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(34,197,94,0.12)";
                        e.currentTarget.style.borderColor = "rgba(34,197,94,0.35)";
                      }}
                    >
                      + Agregar
                    </button>
                  ) : (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 0,
                      background: "rgba(34,197,94,0.15)",
                      border: "1px solid rgba(34,197,94,0.4)",
                      borderRadius: 8, overflow: "hidden",
                      flexShrink: 0,
                    }}>
                      <button
                        onClick={() => onAgregar(modelo, g.gusto, -1)}
                        style={{
                          background: "none", border: "none", color: "#22c55e",
                          width: 30, height: 30, fontSize: "1rem",
                          cursor: "pointer", display: "flex",
                          alignItems: "center", justifyContent: "center",
                        }}
                      >−</button>
                      <span style={{
                        color: "#22c55e", fontWeight: 800, fontSize: "0.88rem",
                        minWidth: 20, textAlign: "center",
                      }}>
                        {qty}
                      </span>
                      <button
                        onClick={() => onAgregar(modelo, g.gusto, +1)}
                        style={{
                          background: "none", border: "none", color: "#22c55e",
                          width: 30, height: 30, fontSize: "1rem",
                          cursor: "pointer", display: "flex",
                          alignItems: "center", justifyContent: "center",
                        }}
                      >+</button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.article>
  );
}

export default React.memo(ModelCardPedido);
