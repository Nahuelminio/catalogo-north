import { motion, AnimatePresence } from "framer-motion";

const WA_CENTRAL = "5493764202408";

const fmtPesos = (n) =>
  n > 0 ? `$ ${Number(n).toLocaleString("es-AR")}` : null;

const itemVariants = {
  hidden:  { opacity: 0, x: 20 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.28, ease: "easeOut", delay: i * 0.05 },
  }),
  exit: { opacity: 0, x: 20, transition: { duration: 0.18 } },
};

export default function CarritoCentral({ items, totalItems, totalPesos, onCambiar, onQuitar, onVaciar, onCerrar }) {
  const enviar = () => {
    if (!items.length) return;

    const lineas = items.map((i) => {
      const nombre = `${i.modelo} - ${i.gusto}`;
      const qty    = i.qty > 1 ? ` x${i.qty}` : "";
      const precio = i.precio ? ` — ${fmtPesos(i.precio * i.qty)}` : "";
      return `• ${nombre}${qty}${precio}`;
    }).join("\n");

    const totalLinea = totalPesos > 0 ? `\n\n*Total: ${fmtPesos(totalPesos)}*` : "";
    const msg = `Hola! Quiero hacer el siguiente pedido:\n\n${lineas}${totalLinea}\n\n¿Pueden confirmar disponibilidad? 🙏`;
    window.open(`https://wa.me/${WA_CENTRAL}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onCerrar}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 200 }}
      />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
        drag="x"
        dragConstraints={{ left: 0, right: 300 }}
        dragElastic={{ left: 0, right: 0.2 }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 80 || info.velocity.x > 400) onCerrar();
        }}
        style={{
          position: "fixed", top: 0, right: 0,
          width: "min(400px, 100vw)", height: "100dvh",
          background: "var(--bg, #0a0a0b)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          zIndex: 201, display: "flex", flexDirection: "column",
          boxShadow: "-8px 0 48px rgba(0,0,0,0.6)",
          touchAction: "pan-y",
        }}
      >
        {/* Asa swipe — solo visible en mobile */}
        <div style={{
          position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
          width: 36, height: 4, borderRadius: 2,
          background: "rgba(255,255,255,0.15)",
        }} />

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "24px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "1.15rem", color: "#eee" }}>
              Tu pedido
            </h2>
            {totalItems > 0 && (
              <span style={{
                background: "var(--accent, #ef4444)", color: "#fff",
                fontSize: "0.7rem", fontWeight: 800,
                borderRadius: 20, padding: "2px 9px", lineHeight: 1.6,
              }}>
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#888", borderRadius: 10, width: 36, height: 36,
              fontSize: "1rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 80 }}>
              <p style={{ fontSize: "2.2rem", marginBottom: 10 }}>🛒</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
                Todavía no agregaste nada.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0, transition: { duration: 0.2 } }}
                  layout
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, padding: "12px 14px", overflow: "hidden",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem", color: "#eee", lineHeight: 1.3 }}>
                        {item.modelo}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                        {item.gusto}
                      </p>
                      {item.precio != null && item.precio > 0 && (
                        <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
                          {fmtPesos(item.precio * item.qty)}
                          {item.qty > 1 && (
                            <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400, marginLeft: 4 }}>
                              ({fmtPesos(item.precio)} c/u)
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onQuitar(item.id)}
                      aria-label="Quitar"
                      style={{
                        background: "none", border: "none", color: "rgba(255,255,255,0.2)",
                        cursor: "pointer", fontSize: "1rem", padding: "0 4px", lineHeight: 1, flexShrink: 0,
                      }}
                    >✕</button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                    <div style={{
                      display: "flex", alignItems: "center",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 8, overflow: "hidden",
                      background: "rgba(255,255,255,0.04)",
                    }}>
                      <button
                        onClick={() => onCambiar(item.id, -1)}
                        style={{
                          background: "none", border: "none", color: "#eee",
                          width: 34, height: 32, fontSize: "1rem",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >−</button>
                      <span style={{ color: "#eee", fontWeight: 700, fontSize: "0.9rem", minWidth: 24, textAlign: "center" }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onCambiar(item.id, +1)}
                        style={{
                          background: "none", border: "none", color: "#eee",
                          width: 34, height: 32, fontSize: "1rem",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >+</button>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
                      {item.qty === 1 ? "1 unidad" : `${item.qty} unidades`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 16px calc(16px + var(--safe-bottom, 0px))",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0, display: "flex", flexDirection: "column", gap: 8,
        }}>
          {/* Total */}
          <AnimatePresence>
            {totalPesos > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, marginBottom: 2,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontWeight: 600 }}>
                  Total estimado
                </span>
                <motion.span
                  key={totalPesos}
                  initial={{ scale: 1.15, color: "#fff" }}
                  animate={{ scale: 1,    color: "#eee" }}
                  transition={{ duration: 0.25 }}
                  style={{ fontWeight: 800, fontSize: "1.05rem" }}
                >
                  {fmtPesos(totalPesos)}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={enviar}
            disabled={items.length === 0}
            style={{
              background: items.length === 0 ? "rgba(255,255,255,0.05)" : "var(--accent, #ef4444)",
              color: items.length === 0 ? "rgba(255,255,255,0.2)" : "#fff",
              border: "none", borderRadius: 12, padding: "14px 20px",
              fontWeight: 800, fontSize: "0.95rem",
              cursor: items.length === 0 ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "background 0.2s", letterSpacing: "0.2px",
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "currentColor", flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar pedido por WhatsApp
          </button>

          {items.length > 0 && (
            <button
              onClick={onVaciar}
              style={{
                background: "none", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.3)", borderRadius: 12,
                padding: "9px", fontSize: "0.82rem", cursor: "pointer",
              }}
            >
              Vaciar pedido
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}
