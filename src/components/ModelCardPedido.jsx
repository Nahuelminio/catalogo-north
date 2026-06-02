import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      className={`group-card${cardMods}${enCarrito ? " card-en-carrito" : ""}`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1], delay: Math.min(index * 0.06, 0.42) }}
    >
      {/* Badge "En tu pedido" animado */}
      <AnimatePresence>
        {enCarrito && (
          <motion.span
            className="card-badge-pedido"
            initial={{ opacity: 0, scale: 0.6, y: -4 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{   opacity: 0, scale: 0.6,   y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            En tu pedido
          </motion.span>
        )}
      </AnimatePresence>

      <ModelImage modelo={modelo} loading="lazy" decoding="async" />

      <header className="model-head">
        <h2 className="model-title">{modelo}</h2>
        {badgeText && <span className={badgeClass}>{badgeText}</span>}
        <span style={{
          marginLeft: "auto",
          fontSize: precio ? "1rem" : "0.78rem",
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
          {gustos.map((g, gi) => {
            const qty      = cantidadDe(modelo, g.gusto);
            const stock    = g.stock ?? 0;
            const maxed    = qty >= stock;
            const sinStock = stock === 0;

            return (
              <motion.li
                key={g.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, delay: Math.min(index * 0.06, 0.42) + gi * 0.03 }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>

                  {/* Nombre + alerta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: "13px",
                      color: sinStock ? "rgba(255,255,255,0.22)" : "var(--ink)",
                      display: "block",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      textDecoration: sinStock ? "line-through" : "none",
                    }}>
                      {g.gusto}
                    </span>
                    {!sinStock && stock <= 3 && (
                      <span style={{ fontSize: "10px", color: "rgba(239,68,68,0.8)", fontWeight: 600 }}>
                        Últimas {stock}
                      </span>
                    )}
                  </div>

                  {/* Control */}
                  {sinStock ? (
                    <span style={{
                      fontSize: "11px", color: "rgba(255,255,255,0.18)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 10, padding: "0 10px", minHeight: 36,
                      display: "inline-flex", alignItems: "center",
                    }}>
                      Sin stock
                    </span>
                  ) : qty === 0 ? (
                    <motion.button
                      className="gusto-btn-agregar"
                      onClick={() => onAgregar(modelo, g.gusto, g.precio)}
                      whileTap={{ scale: 0.91 }}
                    >
                      <motion.span
                        style={{ fontSize: "14px", lineHeight: 1 }}
                        initial={false}
                        animate={{ rotate: 0 }}
                      >
                        +
                      </motion.span>
                      Agregar
                    </motion.button>
                  ) : (
                    <motion.div
                      className="gusto-counter"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1,    opacity: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    >
                      <button
                        className="gusto-counter-btn"
                        onClick={() => onReducir(modelo, g.gusto)}
                      >−</button>
                      <motion.span
                        className="gusto-counter-val"
                        key={qty}
                        initial={{ scale: 1.4, opacity: 0.5 }}
                        animate={{ scale: 1,   opacity: 1   }}
                        transition={{ duration: 0.18 }}
                      >
                        {qty}
                      </motion.span>
                      <button
                        className="gusto-counter-btn"
                        onClick={() => !maxed && onAgregar(modelo, g.gusto, g.precio)}
                        disabled={maxed}
                      >+</button>
                    </motion.div>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.article>
  );
}

export default React.memo(ModelCardPedido);
