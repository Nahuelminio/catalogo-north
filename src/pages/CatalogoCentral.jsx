import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Catalogo.css";
import ModelCardPedido from "../components/ModelCardPedido";
import SkeletonCard from "../components/SkeletonCard";
import SearchBar from "../components/SearchBar";
import ProgressBar from "../components/ProgressBar";
import CarritoCentral from "../components/CarritoCentral";
import Toast from "../components/Toast";
import useProductos from "../hooks/useProductos";
import useCarritoCentral from "../hooks/useCarritoCentral";

const SUCURSAL_CENTRAL = 7;
const SKELETON_COUNT   = 4;

/** Extrae la marca del nombre del modelo */
function extractBrand(modelo = "") {
  const MULTI = ["Lost Mary", "Elf Bar"];
  for (const b of MULTI) {
    if (modelo.toLowerCase().startsWith(b.toLowerCase())) return b;
  }
  return modelo.split(/\s+/)[0] || modelo;
}

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

  // Toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg,  setToastMsg]  = useState("");

  // Aviso pedido guardado — mostrar una sola vez al entrar si hay items
  const [avisoGuardado, setAvisoGuardado] = useState(() => totalItems > 0);
  useEffect(() => {
    if (!avisoGuardado) return;
    const t = setTimeout(() => setAvisoGuardado(false), 5000);
    return () => clearTimeout(t);
  }, [avisoGuardado]);

  // Marcas únicas extraídas de los grupos
  const marcas = useMemo(() => {
    const set = new Set(grupos.map((g) => extractBrand(g.modelo)));
    return ["Todas", ...Array.from(set).sort()];
  }, [grupos]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return grupos.filter((g) => {
      const okMarca = marcaActiva === "Todas" || extractBrand(g.modelo) === marcaActiva;
      const okQuery = !q ||
        g.modelo.toLowerCase().includes(q) ||
        g.gustos?.some((gust) => gust.gusto.toLowerCase().includes(q));
      return okMarca && okQuery;
    });
  }, [grupos, query, marcaActiva]);

  const handleAgregar = (modelo, gusto, precio) => {
    agregar(modelo, gusto, precio);
    setToastMsg(`${gusto} agregado al pedido`);
    setToastOpen(true);
  };

  const handleReducir = (modelo, gusto) => {
    const id = `${modelo}||${gusto}`;
    cambiar(id, -1);
  };

  // Chequear si un grupo tiene items en el carrito
  const grupoEnCarrito = (grupo) =>
    grupo.gustos.some((g) => cantidadDe(grupo.modelo, g.gusto) > 0);

  return (
    <main className="catalogo">
      <ProgressBar loading={loading} />

      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <motion.p
            className="page-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginBottom: 4 }}
          >
            Central · Pedidos online
          </motion.p>
          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Armá tu pedido
          </motion.h1>
          <motion.p
            className="page-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Agregá los gustos que querés al carrito y envianos el pedido por WhatsApp.
          </motion.p>
        </div>

        {/* Aviso pedido guardado */}
        <AnimatePresence>
          {avisoGuardado && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 12, padding: "12px 16px", marginBottom: 20,
                gap: 12,
              }}
            >
              <span style={{ color: "#eee", fontSize: "0.88rem" }}>
                🛒 Tenés un pedido guardado con <strong>{totalItems}</strong> item{totalItems !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => { setCarritoAbierto(true); setAvisoGuardado(false); }}
                style={{
                  background: "var(--accent, #ef4444)", border: "none",
                  color: "#fff", borderRadius: 8, padding: "6px 14px",
                  fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", flexShrink: 0,
                }}
              >
                Ver pedido
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buscador */}
        <SearchBar value={query} onChange={(v) => { setQuery(v); setMarcaActiva("Todas"); }} />

        {/* Filtro marcas */}
        {!loading && marcas.length > 2 && (
          <nav className="toolbar" style={{ marginBottom: 20 }} aria-label="Filtrar por marca">
            {marcas.map((marca) => (
              <button
                key={marca}
                className={`chip ${marcaActiva === marca ? "is-active" : ""}`}
                onClick={() => setMarcaActiva(marca)}
              >
                {marca}
              </button>
            ))}
          </nav>
        )}

        {errorMsg && (
          <p style={{ color: "var(--mut)", textAlign: "center", marginTop: 40 }}>{errorMsg}</p>
        )}

        {/* Grilla */}
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
                  enCarrito={grupoEnCarrito(grupo)}
                  index={i}
                />
              ))}
        </div>

        {!loading && filtered.length === 0 && !errorMsg && (
          <p style={{ textAlign: "center", color: "var(--mut)", marginTop: 60 }}>
            Sin resultados para «{query || marcaActiva}».
          </p>
        )}
      </div>

      {/* FAB carrito */}
      <motion.button
        onClick={() => { setCarritoAbierto(true); setAvisoGuardado(false); }}
        aria-label={`Ver pedido (${totalItems} items)`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        animate={totalItems > 0 ? { scale: [1, 1.12, 1] } : {}}
        transition={totalItems > 0 ? { duration: 0.4, delay: 0.2 } : {}}
        style={{
          position: "fixed", bottom: "calc(28px + var(--safe-bottom, 0px))",
          right: 24, zIndex: 100,
          width: 58, height: 58, borderRadius: "50%",
          background: totalItems > 0 ? "var(--accent, #ef4444)" : "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", fontSize: "1.4rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          boxShadow: totalItems > 0
            ? "0 4px 22px rgba(239,68,68,0.45)"
            : "0 4px 16px rgba(0,0,0,0.3)",
          transition: "background 0.25s, box-shadow 0.25s",
        }}
      >
        🛒
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: "absolute", top: -4, right: -4,
                background: "#fff", color: "var(--accent, #ef4444)",
                fontSize: "0.68rem", fontWeight: 900,
                width: 20, height: 20, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Carrito drawer */}
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

      {/* Toast */}
      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMsg}
        type="success"
        ms={2200}
      />
    </main>
  );
}
