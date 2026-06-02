import React from "react";
import { motion } from "framer-motion";
import ModelImage from "./ModelImage";
import { getCanonical, getModelDesc, isAccesorioModelo } from "../utils/model";

function ModelCardPedido({ grupo, cantidadDe, onAgregar, onReducir, enCarrito, index = 0 }) {
  const { modelo, puffs, ml, gustos } = grupo;

  const badgeText = puffs
    ? `${puffs.toLocaleString("es-AR")} puffs`
    : ml ? "LÍQUIDOS"
    : isAccesorioModelo(modelo) ? "ACCESORIO"
    : null;

  const cardMods =
    badgeText === "LÍQUIDOS" ? " is-liquid"
    : badgeText === "ACCESORIO" ? " is-acc"
    : "";

  const badgeClass =
    badgeText === "LÍQUIDOS" ? "badge badge-red"
    : badgeText === "ACCESORIO" ? "badge badge-muted"
    : "badge";

  const desc   = getModelDesc(getCanonical(modelo));
  const precio = gustos.find((g) => g.precio != null && g.precio > 0)?.precio ?? null;

  return (
    <motion.article
      className={`group-card${cardMods}`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1], delay: Math.min(index * 0.07, 0.42) }}
      style={enCarrito ? {
        borderColor: "rgba(239,68,68,0.45)",
        boxShadow: "0 0 0 1px rgba(239,68,68,0.2) inset, 0 0 20px rgba(239,68,68,0.08)",
      } : undefined}
    >
      {/* Badge "en tu pedido" */}
      {enCarrito && (
        <span style={{
          position: "absolute", top: 10, right: 10,
          background: "var(--accent, #ef4444)", color: "#fff",
          fontSize: "10px", fontWeight: 800,
          borderRadius: 20, padding: "3px 9px",
          letterSpacing: "0.5px", textTransform: "uppercase",
          zIndex: 1,
        }}>
          En tu pedido
        </span>
      )}

      <ModelImage modelo={modelo} loading="lazy" decoding="async" />

      <header className="model-head">
        <h2 className="model-title">{modelo}</h2>
        {badgeText && <span className={badgeClass}>{badgeText}</span>}
        <span style={{
          marginLeft: "auto", fontSize: precio ? "1rem" : "0.78rem",
          fontWeight: precio ? 800 : 400,
          color: precio ? "var(--ink)" : "var(--mut)",
          letterSpacing: precio ? "-0.3px" : "0",
          flexShrink: 0,
        }}>
          {precio ? `$ ${Number(precio).toLocaleString("es-AR")}` : "Consultar precio"}
        </span>
      </header>

      {desc && <div className="model-desc"><p>{desc}</p></div>}

      <div className="flavors-block">
        <p className="flavors-title">Gustos disponibles</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          {gustos.map((g) => {
            const qty      = cantidadDe(modelo, g.gusto);
            const stock    = g.stock ?? 0;
            const maxed    = qty >= stock;
            const sinStock = stock === 0;

            return (
              <li key={g.id}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: "13px",
                      color: sinStock ? "rgba(255,255,255,0.25)" : "var(--ink)",
                      display: "block",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      textDecoration: sinStock ? "line-through" : "none",
                    }}>
                      {g.gusto}
                    </span>
                    {!sinStock && stock <= 3 && (
                      <span style={{ fontSize: "10px", color: "rgba(239,68,68,0.8)", fontWeight: 600 }}>
                        Últimas {stock} unidades
                      </span>
                    )}
                  </div>

                  {sinStock ? (
                    <span style={{
                      fontSize: "11px", color: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 10, padding: "0 10px", minHeight: 36,
                      display: "inline-flex", alignItems: "center",
                    }}>
                      Sin stock
                    </span>
                  ) : qty === 0 ? (
                    <button
                      onClick={() => onAgregar(modelo, g.gusto, g.precio)}
                      style={{
                        cursor: "pointer", border: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.03)",
                        color: "var(--ink)", borderRadius: 10,
                        fontSize: "12px", fontWeight: 600,
                        padding: "0 12px", minHeight: 36,
                        display: "inline-flex", alignItems: "center", gap: 5,
                        flexShrink: 0, transition: "border-color 0.18s, background 0.18s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.background  = "rgba(239,68,68,0.09)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                        e.currentTarget.style.background  = "rgba(255,255,255,0.03)";
                      }}
                    >
                      <span style={{ fontSize: "14px", lineHeight: 1 }}>+</span> Agregar
                    </button>
                  ) : (
                    <div style={{
                      display: "flex", alignItems: "center",
                      border: "1px solid var(--accent)",
                      borderRadius: 10, overflow: "hidden",
                      background: "rgba(239,68,68,0.08)",
                      flexShrink: 0,
                    }}>
                      <button
                        onClick={() => onReducir(modelo, g.gusto)}
                        style={{
                          background: "none", border: "none", color: "var(--ink)",
                          width: 32, height: 36, fontSize: "1.1rem",
                          cursor: "pointer", display: "flex",
                          alignItems: "center", justifyContent: "center",
                        }}
                      >−</button>
                      <span style={{
                        color: "var(--ink)", fontWeight: 800, fontSize: "0.88rem",
                        minWidth: 22, textAlign: "center",
                      }}>
                        {qty}
                      </span>
                      <button
                        onClick={() => !maxed && onAgregar(modelo, g.gusto, g.precio)}
                        disabled={maxed}
                        style={{
                          background: "none", border: "none",
                          color: maxed ? "rgba(255,255,255,0.2)" : "var(--ink)",
                          width: 32, height: 36, fontSize: "1.1rem",
                          cursor: maxed ? "default" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
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
