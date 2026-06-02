import { motion, AnimatePresence } from "framer-motion";

const WA_CENTRAL = "5493764202408";

export default function CarritoCentral({ items, totalItems, onCambiar, onQuitar, onVaciar, onCerrar }) {
  const enviar = () => {
    if (!items.length) return;

    const lineas = items
      .map((i) => {
        const nombre = `${i.modelo} - ${i.gusto}`;
        return i.qty > 1 ? `• ${nombre} x${i.qty}` : `• ${nombre}`;
      })
      .join("\n");

    const msg =
      `Hola! Quiero hacer el siguiente pedido:\n\n${lineas}\n\n¿Pueden confirmar disponibilidad? 🙏`;

    window.open(
      `https://wa.me/${WA_CENTRAL}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="carrito-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCerrar}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 200,
        }}
      />

      {/* Drawer */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
        style={{
          position: "fixed", top: 0, right: 0,
          width: "min(380px, 100vw)", height: "100dvh",
          background: "#111113",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          zIndex: 201,
          display: "flex", flexDirection: "column",
          boxShadow: "-6px 0 40px rgba(0,0,0,0.55)",
        }}
      >
        {/* Header drawer */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 20px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}>
          <div>
            <p style={{ margin: 0, fontSize: "0.65rem", letterSpacing: "4px",
              textTransform: "uppercase", color: "#22c55e", fontWeight: 700 }}>
              NORTH SHOP
            </p>
            <h2 style={{ margin: "2px 0 0", fontWeight: 800, fontSize: "1.1rem", color: "#eee" }}>
              Tu pedido
              {totalItems > 0 && (
                <span style={{
                  marginLeft: 10, background: "#22c55e", color: "#000",
                  fontSize: "0.7rem", fontWeight: 800,
                  borderRadius: 20, padding: "2px 9px",
                  verticalAlign: "middle",
                }}>
                  {totalItems}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            style={{
              background: "rgba(255,255,255,0.07)", border: "none",
              color: "#aaa", borderRadius: 10, width: 36, height: 36,
              fontSize: "1.1rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 60 }}>
              <p style={{ fontSize: "2rem", marginBottom: 10 }}>🛒</p>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                Todavía no agregaste nada.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 10 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, padding: "12px 14px",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem",
                        color: "#eee", lineHeight: 1.3 }}>
                        {item.modelo}
                      </p>
                      <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "#22c55e", fontWeight: 600 }}>
                        {item.gusto}
                      </p>
                    </div>
                    <button
                      onClick={() => onQuitar(item.id)}
                      style={{
                        background: "none", border: "none", color: "#555",
                        cursor: "pointer", fontSize: "1rem", padding: "0 4px",
                        flexShrink: 0, lineHeight: 1,
                      }}
                      aria-label="Quitar"
                    >✕</button>
                  </div>

                  {/* Cantidad */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 0,
                      background: "rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden",
                    }}>
                      <button
                        onClick={() => onCambiar(item.id, -1)}
                        style={{
                          background: "none", border: "none", color: "#eee",
                          width: 34, height: 34, fontSize: "1.1rem", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >−</button>
                      <span style={{ color: "#eee", fontWeight: 700, fontSize: "0.95rem",
                        minWidth: 28, textAlign: "center" }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onCambiar(item.id, +1)}
                        style={{
                          background: "none", border: "none", color: "#eee",
                          width: 34, height: 34, fontSize: "1.1rem", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >+</button>
                    </div>
                    <span style={{ color: "#555", fontSize: "0.75rem" }}>
                      {item.qty > 1 ? `${item.qty} unidades` : "1 unidad"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 20px calc(16px + var(--safe-bottom, 0px))",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          <button
            onClick={enviar}
            disabled={items.length === 0}
            style={{
              background: items.length === 0 ? "#1a2a1a" : "#22c55e",
              color: items.length === 0 ? "#444" : "#000",
              border: "none", borderRadius: 12,
              padding: "14px 20px", fontWeight: 800,
              fontSize: "0.95rem", cursor: items.length === 0 ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "background 0.2s",
              letterSpacing: "0.3px",
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "currentColor" }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar pedido por WhatsApp
          </button>

          {items.length > 0 && (
            <button
              onClick={onVaciar}
              style={{
                background: "none", border: "1px solid rgba(255,255,255,0.1)",
                color: "#666", borderRadius: 12, padding: "10px",
                fontSize: "0.82rem", cursor: "pointer",
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
