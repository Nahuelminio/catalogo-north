import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from "../api/client";

const WA_CENTRAL = "5493764202408";
const CLIENTE_KEY = "north_cliente_central";
const ULTIMO_PEDIDO_KEY = "north_ultimo_pedido_central";

const fmtPesos = (n) =>
  n > 0 ? `$ ${Number(n).toLocaleString("es-AR")}` : null;

const itemVariants = {
  hidden:  { opacity: 0, x: 20 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.28, ease: "easeOut", delay: i * 0.05 },
  }),
};

const ESTADO_INFO = {
  pendiente:  { label: "Pendiente de confirmación", color: "#f59e0b", icon: "⏳" },
  confirmado: { label: "¡Confirmado!",              color: "#10b981", icon: "✅" },
  cancelado:  { label: "Cancelado",                 color: "#ef4444", icon: "✕" },
};

/** Genera URL de imagen del modelo (misma lógica que ModelImage) */
function getModelImg(modelo = "") {
  const slug = modelo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `/img/modelos/${slug}.png`;
}

export default function CarritoCentral({ items, totalItems, totalPesos, onCambiar, onQuitar, onVaciar, onCerrar }) {
  const [paso,     setPaso]     = useState("lista");   // "lista" | "confirmar" | "enviado"
  const [enviando, setEnviando] = useState(false);

  // Datos del comprador con memoria en localStorage
  const [cliente, setCliente] = useState(() => {
    const base = { nombre: "", telefono: "", metodoPago: "", envio: false, direccion: "", referencia: "" };
    try {
      const s = localStorage.getItem(CLIENTE_KEY);
      return s ? { ...base, ...JSON.parse(s) } : base;
    } catch { return base; }
  });
  useEffect(() => {
    try { localStorage.setItem(CLIENTE_KEY, JSON.stringify(cliente)); } catch { /* ignore */ }
  }, [cliente]);

  // Ubicación GPS (efímera, no se persiste)
  const [ubicacionUrl, setUbicacionUrl] = useState("");
  const [geoLoading,   setGeoLoading]   = useState(false);
  const [geoError,     setGeoError]     = useState("");

  const necesitaEnvio = cliente.envio === true;

  const compartirUbicacion = () => {
    setGeoError("");
    if (!navigator.geolocation) {
      setGeoError("Tu teléfono no permite compartir ubicación.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUbicacionUrl(`https://maps.google.com/?q=${latitude},${longitude}`);
        setGeoLoading(false);
      },
      () => {
        setGeoError("No pudimos obtener tu ubicación. Revisá los permisos.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Pedido enviado (para pantalla de éxito + seguimiento)
  const [pedidoEnviado, setPedidoEnviado] = useState(null); // { id, estado, fecha_creacion }
  const [consultando,   setConsultando]   = useState(false);

  const volver = () => setPaso("lista");

  const construirLineas = () =>
    items.map((i) => {
      const cant   = i.qty > 1 ? `${i.qty}× ` : "";
      const precio = i.precio ? ` — ${fmtPesos(i.precio * i.qty)}` : "";
      return `• ${cant}${i.modelo} - ${i.gusto}${precio}`;
    }).join("\n");

  const confirmarEnvio = async () => {
    if (!items.length || enviando) return;
    setEnviando(true);

    let pedidoId = null;

    const metodoPago = cliente.metodoPago || null;
    const envio      = cliente.envio === true;
    const direccion  = envio ? (cliente.direccion?.trim()  || null) : null;
    const referencia = envio ? (cliente.referencia?.trim() || null) : null;
    const ubic       = envio ? (ubicacionUrl || null) : null;

    // 1. Guardar en backend
    try {
      const res = await fetch(`${API_BASE}/pedidos-central`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            gusto_id: i.gusto_id,
            modelo:   i.modelo,
            gusto:    i.gusto,
            qty:      i.qty,
            precio:   i.precio ?? 0,
          })),
          total:         totalPesos,
          nombre:        cliente.nombre?.trim() || null,
          telefono:      cliente.telefono?.trim() || null,
          metodo_pago:   metodoPago,
          envio,
          direccion,
          referencia,
          ubicacion_url: ubic,
        }),
      });
      const data = await res.json();
      if (data.id) pedidoId = data.id;
    } catch { /* no bloqueamos */ }

    // 2. Armar mensaje (sin emojis — más limpio y compatible)
    const lineas     = construirLineas();
    const saludo     = cliente.nombre?.trim() ? `Hola! Soy ${cliente.nombre.trim()}.` : "Hola!";
    const totalLinea = totalPesos > 0 ? `\n\n*Total: ${fmtPesos(totalPesos)}*` : "";
    const pagoLinea  = metodoPago
      ? `\n\nForma de pago: ${metodoPago === "transferencia" ? "Transferencia" : "Efectivo"}`
      : "";
    const envioLinea = envio
      ? `\nEnvío: SÍ` +
        (direccion  ? `\nDirección: ${direccion}` : "") +
        (referencia ? `\nReferencia: ${referencia}` : "") +
        (ubic       ? `\nUbicación: ${ubic}` : "") +
        `\n(quedo a la espera del costo del envío)`
      : `\nEnvío: no, retiro / coordino por acá`;
    const pedidoRef  = pedidoId ? `\n\nN° de pedido: ${pedidoId}` : "";
    const msg = `${saludo} Quiero hacer el siguiente pedido:\n\n${lineas}${totalLinea}${pagoLinea}${envioLinea}${pedidoRef}\n\n¿Me confirman disponibilidad? ¡Gracias!`;

    window.open(
      `https://wa.me/${WA_CENTRAL}?text=${encodeURIComponent(msg)}`,
      "_blank", "noopener,noreferrer"
    );

    // 3. Guardar referencia y pasar a pantalla de éxito
    if (pedidoId) {
      const ref = { id: pedidoId, estado: "pendiente", fecha: Date.now() };
      try { localStorage.setItem(ULTIMO_PEDIDO_KEY, JSON.stringify(ref)); } catch { /* ignore */ }
      setPedidoEnviado({ id: pedidoId, estado: "pendiente" });
    }

    setEnviando(false);
    onVaciar();           // limpiar carrito después de enviar
    setPaso("enviado");   // mostrar confirmación (no cerramos)
  };

  const consultarEstado = async () => {
    if (!pedidoEnviado?.id || consultando) return;
    setConsultando(true);
    try {
      const res  = await fetch(`${API_BASE}/pedidos-central/${pedidoEnviado.id}/estado`);
      const data = await res.json();
      if (data.estado) setPedidoEnviado((p) => ({ ...p, estado: data.estado }));
    } catch { /* ignore */ }
    setConsultando(false);
  };

  const copiarPedido = () => {
    const lineas     = construirLineas();
    const totalLinea = totalPesos > 0 ? `\nTotal: ${fmtPesos(totalPesos)}` : "";
    navigator.clipboard?.writeText(`Pedido Central:\n\n${lineas}${totalLinea}`)
      .catch(() => {});
  };

  const puedeEnviar = items.length > 0;

  // ── Drawer base ─────────────────────────────────────────────────────────────
  const onOverlay = paso === "lista" ? onCerrar : paso === "confirmar" ? volver : onCerrar;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onOverlay}
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
        onDragEnd={(_, info) => { if (info.offset.x > 80 || info.velocity.x > 400) onCerrar(); }}
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
        {/* Asa swipe */}
        <div style={{
          position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
          width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)",
        }} />

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "24px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {paso === "confirmar" && (
              <button onClick={volver} style={{
                background: "none", border: "none", color: "var(--mut)",
                fontSize: "1.1rem", cursor: "pointer", padding: "0 4px",
              }}>←</button>
            )}
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem", color: "#eee" }}>
              {paso === "confirmar" ? "Confirmar pedido"
                : paso === "enviado" ? "Pedido enviado"
                : "Tu pedido"}
            </h2>
            {paso === "lista" && totalItems > 0 && (
              <span style={{
                background: "var(--accent, #ef4444)", color: "#fff",
                fontSize: "0.7rem", fontWeight: 800,
                borderRadius: 20, padding: "2px 9px", lineHeight: 1.6,
              }}>{totalItems}</span>
            )}
          </div>
          <button onClick={onCerrar} style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#888", borderRadius: 10, width: 36, height: 36,
            fontSize: "1rem", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* ── Vista: LISTA ────────────────────────────────────────────────── */}
        {paso === "lista" && (
          <>
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
                        borderRadius: 12, padding: "12px 14px",
                        overflow: "hidden", marginBottom: 8,
                      }}
                    >
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        {/* Imagen miniatura */}
                        <img
                          src={getModelImg(item.modelo)}
                          alt={item.modelo}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                          style={{
                            width: 44, height: 44, objectFit: "contain",
                            borderRadius: 8, background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#eee", lineHeight: 1.3,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.modelo}
                          </p>
                          <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>
                            {item.gusto}
                          </p>
                          {item.precio != null && item.precio > 0 && (
                            <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
                              {fmtPesos(item.precio * item.qty)}
                              {item.qty > 1 && (
                                <span style={{ color: "rgba(255,255,255,0.22)", fontWeight: 400, marginLeft: 4 }}>
                                  ({fmtPesos(item.precio)} c/u)
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                        <button onClick={() => onQuitar(item.id)} style={{
                          background: "none", border: "none", color: "rgba(255,255,255,0.2)",
                          cursor: "pointer", fontSize: "1rem", padding: "0 2px", lineHeight: 1, flexShrink: 0,
                        }}>✕</button>
                      </div>

                      {/* Contador */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                        <div style={{
                          display: "flex", alignItems: "center",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 8, overflow: "hidden",
                          background: "rgba(255,255,255,0.04)",
                        }}>
                          <button onClick={() => onCambiar(item.id, -1)} style={{
                            background: "none", border: "none", color: "#eee",
                            width: 34, height: 32, fontSize: "1rem",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          }}>−</button>
                          <motion.span
                            key={item.qty}
                            initial={{ scale: 1.35, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ color: "#eee", fontWeight: 700, fontSize: "0.9rem", minWidth: 24, textAlign: "center" }}
                          >{item.qty}</motion.span>
                          <button onClick={() => onCambiar(item.id, +1)} style={{
                            background: "none", border: "none", color: "#eee",
                            width: 34, height: 32, fontSize: "1rem",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          }}>+</button>
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

            {/* Footer lista */}
            <div style={{
              padding: "14px 16px calc(16px + var(--safe-bottom, 0px))",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0, display: "flex", flexDirection: "column", gap: 8,
            }}>
              <AnimatePresence>
                {totalPesos > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.22 }}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10, marginBottom: 2,
                    }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontWeight: 600 }}>Total estimado</span>
                    <motion.span
                      key={totalPesos}
                      initial={{ scale: 1.15 }} animate={{ scale: 1 }}
                      style={{ color: "#eee", fontWeight: 800, fontSize: "1.05rem" }}
                    >{fmtPesos(totalPesos)}</motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => puedeEnviar && setPaso("confirmar")}
                disabled={!puedeEnviar}
                style={{
                  background: !puedeEnviar ? "rgba(255,255,255,0.05)" : "var(--accent, #ef4444)",
                  color: !puedeEnviar ? "rgba(255,255,255,0.2)" : "#fff",
                  border: "none", borderRadius: 12, padding: "14px 20px",
                  fontWeight: 800, fontSize: "0.95rem",
                  cursor: !puedeEnviar ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  letterSpacing: "0.2px",
                }}
              >
                Revisar y enviar →
              </button>

              {items.length > 0 && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={copiarPedido} style={{
                    flex: 1, background: "none",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.35)", borderRadius: 12,
                    padding: "9px", fontSize: "0.82rem", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    📋 Copiar lista
                  </button>
                  <button onClick={onVaciar} style={{
                    flex: 1, background: "none",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.25)", borderRadius: 12,
                    padding: "9px", fontSize: "0.82rem", cursor: "pointer",
                  }}>
                    Vaciar
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Vista: CONFIRMAR ─────────────────────────────────────────────── */}
        {paso === "confirmar" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              <p style={{ color: "var(--mut)", fontSize: "0.82rem", marginBottom: 16 }}>
                Dejanos tus datos y revisá el pedido antes de enviarlo.
              </p>

              {/* Datos del comprador */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Tu nombre o local
                  </label>
                  <input
                    type="text"
                    value={cliente.nombre}
                    onChange={(e) => setCliente((c) => ({ ...c, nombre: e.target.value }))}
                    placeholder="Ej: Kiosco San Martín"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    WhatsApp <span style={{ textTransform: "none", fontWeight: 400 }}>(opcional)</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={cliente.telefono}
                    onChange={(e) => setCliente((c) => ({ ...c, telefono: e.target.value }))}
                    placeholder="Ej: 3764 20-2408"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Forma de pago */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Forma de pago</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { val: "efectivo",      txt: "💵 Efectivo" },
                    { val: "transferencia", txt: "🏦 Transferencia" },
                  ].map((op) => {
                    const activo = cliente.metodoPago === op.val;
                    return (
                      <button
                        key={op.val}
                        onClick={() => setCliente((c) => ({ ...c, metodoPago: op.val }))}
                        style={{
                          flex: 1,
                          background: activo ? "var(--accent, #ef4444)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${activo ? "var(--accent, #ef4444)" : "rgba(255,255,255,0.12)"}`,
                          color: activo ? "#fff" : "rgba(255,255,255,0.55)",
                          borderRadius: 10, padding: "11px 8px",
                          fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {op.txt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ¿Necesitás envío? */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>¿Necesitás envío?</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { val: false, txt: "🏬 Sin envío" },
                    { val: true,  txt: "🚚 Con envío" },
                  ].map((op) => {
                    const activo = cliente.envio === op.val;
                    return (
                      <button
                        key={String(op.val)}
                        onClick={() => setCliente((c) => ({ ...c, envio: op.val }))}
                        style={{
                          flex: 1,
                          background: activo ? "var(--accent, #ef4444)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${activo ? "var(--accent, #ef4444)" : "rgba(255,255,255,0.12)"}`,
                          color: activo ? "#fff" : "rgba(255,255,255,0.55)",
                          borderRadius: 10, padding: "11px 8px",
                          fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {op.txt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sección de envío */}
              <AnimatePresence initial={false}>
                {necesitaEnvio && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden", marginBottom: 14 }}
                  >
                    <div style={{
                      background: "rgba(56,189,248,0.06)",
                      border: "1px solid rgba(56,189,248,0.25)",
                      borderRadius: 12, padding: "14px",
                    }}>
                      <p style={{ margin: "0 0 12px", fontSize: "0.82rem", color: "#7dd3fc", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                        🚚 Datos de envío
                        <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: "0.72rem" }}>
                          (el costo te lo confirmamos)
                        </span>
                      </p>

                      {/* Botón compartir ubicación */}
                      <button
                        onClick={compartirUbicacion}
                        disabled={geoLoading}
                        style={{
                          width: "100%", marginBottom: 10,
                          background: ubicacionUrl ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
                          border: `1px solid ${ubicacionUrl ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.14)"}`,
                          color: ubicacionUrl ? "#34d399" : "#eee",
                          borderRadius: 10, padding: "12px",
                          fontSize: "0.86rem", fontWeight: 700, cursor: geoLoading ? "default" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}
                      >
                        {geoLoading ? "Obteniendo ubicación…"
                          : ubicacionUrl ? "✓ Ubicación compartida"
                          : "📍 Compartir mi ubicación"}
                      </button>
                      {geoError && (
                        <p style={{ margin: "0 0 10px", fontSize: "0.75rem", color: "#f87171" }}>{geoError}</p>
                      )}

                      {/* Dirección */}
                      <input
                        type="text"
                        value={cliente.direccion}
                        onChange={(e) => setCliente((c) => ({ ...c, direccion: e.target.value }))}
                        placeholder="Calle y número"
                        style={{ ...inputStyle, marginBottom: 8 }}
                      />
                      <input
                        type="text"
                        value={cliente.referencia}
                        onChange={(e) => setCliente((c) => ({ ...c, referencia: e.target.value }))}
                        placeholder="Barrio / referencia (ej: casa portón negro)"
                        style={inputStyle}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Resumen compacto */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, overflow: "hidden", marginBottom: 16,
              }}>
                {items.map((item, i) => (
                  <div key={item.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px",
                    borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}>
                    <img
                      src={getModelImg(item.modelo)}
                      alt={item.modelo}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                      style={{
                        width: 36, height: 36, objectFit: "contain",
                        borderRadius: 6, background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "#ddd",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.modelo}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
                        {item.gusto}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#eee" }}>
                        ×{item.qty}
                      </p>
                      {item.precio > 0 && (
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                          {fmtPesos(item.precio * item.qty)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              {totalPesos > 0 && (
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Total estimado</span>
                  <span style={{ color: "#eee", fontWeight: 800, fontSize: "1.05rem" }}>
                    {fmtPesos(totalPesos)}
                  </span>
                </div>
              )}
            </div>

            {/* Footer confirmar */}
            <div style={{
              padding: "14px 16px calc(16px + var(--safe-bottom, 0px))",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0, display: "flex", flexDirection: "column", gap: 8,
            }}>
              {(() => {
                const faltaPago  = !cliente.metodoPago;
                const faltaDir   = necesitaEnvio && !cliente.direccion?.trim() && !ubicacionUrl;
                const bloqueado  = faltaPago || faltaDir;
                const aviso = faltaPago ? "Elegí la forma de pago para continuar"
                            : faltaDir  ? "Cargá tu dirección o compartí tu ubicación"
                            : null;
                return (
                  <>
                    {aviso && (
                      <p style={{ margin: "0 0 4px", fontSize: "0.76rem", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
                        {aviso}
                      </p>
                    )}
                    <button
                      onClick={confirmarEnvio}
                      disabled={enviando || bloqueado}
                      style={{
                        background: bloqueado ? "rgba(255,255,255,0.05)" : "var(--accent, #ef4444)",
                        color: bloqueado ? "rgba(255,255,255,0.25)" : "#fff",
                        border: "none", borderRadius: 12, padding: "14px 20px",
                        fontWeight: 800, fontSize: "0.95rem",
                        cursor: (enviando || bloqueado) ? "default" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        opacity: enviando ? 0.75 : 1,
                      }}
                    >
                <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "currentColor", flexShrink: 0 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {enviando ? "Enviando…" : "Confirmar y enviar por WhatsApp"}
                    </button>
                  </>
                );
              })()}
              <button onClick={volver} style={{
                background: "none", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.3)", borderRadius: 12,
                padding: "9px", fontSize: "0.82rem", cursor: "pointer",
              }}>
                ← Volver a editar
              </button>
            </div>
          </>
        )}

        {/* ── Vista: ENVIADO ───────────────────────────────────────────────── */}
        {paso === "enviado" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column" }}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem", margin: "20px auto 18px",
              }}
            >
              ✓
            </motion.div>

            <h3 style={{ textAlign: "center", color: "#eee", fontWeight: 800, fontSize: "1.15rem", margin: "0 0 6px" }}>
              ¡Pedido enviado!
            </h3>
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: "0.86rem", margin: "0 0 20px" }}>
              Te abrimos WhatsApp para terminar de coordinar.
              {pedidoEnviado?.id && <> Guardá tu número de pedido.</>}
            </p>

            {pedidoEnviado?.id && (
              <>
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14, padding: "18px", textAlign: "center", marginBottom: 14,
                }}>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                    Número de pedido
                  </p>
                  <p style={{ margin: "4px 0 0", color: "#fff", fontWeight: 800, fontSize: "1.8rem" }}>
                    #{pedidoEnviado.id}
                  </p>
                </div>

                {/* Estado / seguimiento */}
                {(() => {
                  const info = ESTADO_INFO[pedidoEnviado.estado] || ESTADO_INFO.pendiente;
                  return (
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: 10, padding: "12px 14px", marginBottom: 14,
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${info.color}33`, borderRadius: 12,
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, color: info.color, fontWeight: 700, fontSize: "0.86rem" }}>
                        <span>{info.icon}</span> {info.label}
                      </span>
                      <button
                        onClick={consultarEstado}
                        disabled={consultando}
                        style={{
                          background: "none", border: "1px solid rgba(255,255,255,0.12)",
                          color: "rgba(255,255,255,0.5)", borderRadius: 8,
                          padding: "5px 10px", fontSize: "0.75rem", cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {consultando ? "…" : "↻ Actualizar"}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8, paddingTop: 16 }}>
              <button
                onClick={() => { setPaso("lista"); setPedidoEnviado(null); onCerrar(); }}
                style={{
                  background: "var(--accent, #ef4444)", color: "#fff",
                  border: "none", borderRadius: 12, padding: "14px 20px",
                  fontWeight: 800, fontSize: "0.95rem", cursor: "pointer",
                }}
              >
                Listo
              </button>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  color: "#eee",
  padding: "11px 13px",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: "0.72rem",
  color: "rgba(255,255,255,0.4)",
  fontWeight: 600,
  marginBottom: 7,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};
