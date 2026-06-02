import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Catalogo.css";
import "../css/CatalogoCentral.css";
import ModelCardPedido from "../components/ModelCardPedido";
import SkeletonCard from "../components/SkeletonCard";
import SearchBar from "../components/SearchBar";
import ProgressBar from "../components/ProgressBar";
import CarritoCentral from "../components/CarritoCentral";
import Toast from "../components/Toast";
import useProductos from "../hooks/useProductos";
import useCarritoCentral from "../hooks/useCarritoCentral";
import { getBrand } from "../utils/brand";

const SUCURSAL_CENTRAL = 7;
const SKELETON_COUNT   = 4;

// Variants reutilizables
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.38, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.06 },
  }),
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

export default function CatalogoCentral() {
  useEffect(() => {
    document.title = "The North Shop — Central · Pedidos";
  }, []);

  const { grupos, loading, errorMsg } = useProductos(SUCURSAL_CENTRAL);
  const { items, agregar, cambiar, quitar, vaciar, cantidadDe, totalItems, totalPesos } =
    useCarritoCentral();

  const [query,          setQuery]          = useState("");
  const [marcaActiva,    setMarcaActiva]    = useState("Todas");
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [toastOpen,      setToastOpen]      = useState(false);
  const [toastMsg,       setToastMsg]       = useState("");

  const [itemsAlEntrar]  = useState(totalItems);
  const [avisoGuardado, setAvisoGuardado] = useState(() => totalItems > 0);
  useEffect(() => {
    if (!avisoGuardado) return;
    const t = setTimeout(() => setAvisoGuardado(false), 5000);
    return () => clearTimeout(t);
  }, [avisoGuardado]);

  const marcas = useMemo(() => {
    const set = new Set(grupos.map((g) => getBrand(g.modelo)));
    return ["Todas", ...Array.from(set).sort()];
  }, [grupos]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return grupos.filter((g) => {
      const okMarca = marcaActiva === "Todas" || getBrand(g.modelo) === marcaActiva;
      const okQuery = !q ||
        g.modelo.toLowerCase().includes(q) ||
        g.gustos?.some((gust) => gust.gusto.toLowerCase().includes(q));
      return okMarca && okQuery;
    });
  }, [grupos, query, marcaActiva]);

  const handleAgregar = (modelo, gusto, precio) => {
    agregar(modelo, gusto, precio);
    setToastMsg(`${gusto} agregado`);
    setToastOpen(true);
  };

  const handleReducir = (modelo, gusto) => {
    cambiar(`${modelo}||${gusto}`, -1);
  };

  const modelosEnCarrito = useMemo(
    () => new Set(items.map((i) => i.modelo)),
    [items]
  );

  return (
    <main className="catalogo">
      <ProgressBar loading={loading} />

      <div className="container">

        {/* ── Hero ───────────────────────────────────── */}
        <div className="central-hero">
          <motion.div
            className="central-eyebrow"
            variants={fadeIn} initial="hidden" animate="visible" custom={0}
          >
            <span className="central-eyebrow-dot" />
            North Shop · Central
          </motion.div>

          <motion.h1
            className="page-title"
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{ marginBottom: 8 }}
          >
            Armá tu pedido
          </motion.h1>

          <motion.p
            className="page-sub"
            variants={fadeIn} initial="hidden" animate="visible" custom={2}
          >
            Elegí los gustos y envianos el pedido por WhatsApp — confirmamos disponibilidad.
          </motion.p>
        </div>

        {/* ── Aviso pedido guardado ───────────────────── */}
        <AnimatePresence>
          {avisoGuardado && (
            <motion.div
              className="central-aviso"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <span style={{ color: "#ddd", fontSize: "0.88rem" }}>
                🛒 Tenés un pedido guardado con{" "}
                <strong>{itemsAlEntrar}</strong> item{itemsAlEntrar !== 1 ? "s" : ""}
              </span>
              <button
                className="central-aviso-btn"
                onClick={() => { setCarritoAbierto(true); setAvisoGuardado(false); }}
              >
                Ver pedido
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Buscador ──────────────────────────────── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
        >
          <SearchBar value={query} onChange={(v) => { setQuery(v); setMarcaActiva("Todas"); }} />
        </motion.div>

        {/* ── Chips de marca ────────────────────────── */}
        <AnimatePresence>
          {!loading && marcas.length > 2 && (
            <motion.nav
              className="central-toolbar"
              aria-label="Filtrar por marca"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              {marcas.map((marca, i) => (
                <motion.button
                  key={marca}
                  className={`chip ${marcaActiva === marca ? "is-active" : ""}`}
                  onClick={() => setMarcaActiva(marca)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: 0.15 + i * 0.04 }}
                  whileTap={{ scale: 0.93 }}
                >
                  {marca}
                </motion.button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        {/* ── Error ─────────────────────────────────── */}
        {errorMsg && (
          <p style={{ color: "var(--mut)", textAlign: "center", marginTop: 40 }}>
            {errorMsg}
          </p>
        )}

        {/* ── Grilla ────────────────────────────────── */}
        <div className="card-grid">
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((grupo, i) => (
                <ModelCardPedido
                  key={grupo.modelo}
                  grupo={grupo}
                  cantidadDe={cantidadDe}
                  onAgregar={handleAgregar}
                  onReducir={handleReducir}
                  enCarrito={modelosEnCarrito.has(grupo.modelo)}
                  index={i}
                />
              ))}
        </div>

        {/* ── Sin resultados ────────────────────────── */}
        <AnimatePresence>
          {!loading && filtered.length === 0 && !errorMsg && (
            <motion.div
              className="central-empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="central-empty-icon">🔍</p>
              <p className="central-empty-text">
                Sin resultados para «{query || marcaActiva}».
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── FAB carrito ──────────────────────────────── */}
      <motion.button
        className="central-fab"
        onClick={() => { setCarritoAbierto(true); setAvisoGuardado(false); }}
        aria-label={`Ver pedido${totalItems > 0 ? ` — ${totalItems} items` : ""}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.6 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          background: totalItems > 0 ? "var(--accent, #ef4444)" : "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: totalItems > 0
            ? "0 4px 28px rgba(239,68,68,0.5)"
            : "0 4px 16px rgba(0,0,0,0.35)",
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Anillo pulsante */}
        {totalItems > 0 && <span className="central-fab-ring" />}

        🛒

        {/* Badge */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              key="badge"
              className="central-fab-badge"
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Drawer del carrito ──────────────────────── */}
      <AnimatePresence>
        {carritoAbierto && (
          <CarritoCentral
            items={items}
            totalItems={totalItems}
            totalPesos={totalPesos}
            onCambiar={cambiar}
            onQuitar={quitar}
            onVaciar={vaciar}
            onCerrar={() => setCarritoAbierto(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ───────────────────────────────────── */}
      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={`✓  ${toastMsg}`}
        type="success"
        ms={2000}
      />
    </main>
  );
}
