import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Catalogo.css";
import ToolbarChips from "../components/ToolbarChips";
import ModelCardPedido from "../components/ModelCardPedido";
import SkeletonCard from "../components/SkeletonCard";
import SearchBar from "../components/SearchBar";
import ProgressBar from "../components/ProgressBar";
import CarritoCentral from "../components/CarritoCentral";
import useProductos from "../hooks/useProductos";
import useCarritoCentral from "../hooks/useCarritoCentral";

const SUCURSAL_CENTRAL = 7;
const SKELETON_COUNT   = 4;

export default function CatalogoCentral() {
  useEffect(() => {
    document.title = "The North Shop — Central · Pedidos";
  }, []);

  const { grupos, loading, errorMsg } = useProductos(SUCURSAL_CENTRAL);
  const { items, agregar, cambiar, quitar, vaciar, cantidadDe, totalItems } =
    useCarritoCentral();

  const [query,          setQuery]          = useState("");
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const handleAgregar = (modelo, gusto, delta) => {
    if (delta === -1) {
      // desde el botón "−" en la card
      const qty = cantidadDe(modelo, gusto);
      if (qty > 0) {
        const id = `${modelo}||${gusto}`;
        cambiar(id, -1);
      }
    } else {
      agregar(modelo, gusto);
    }
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return grupos;
    const q = query.toLowerCase();
    return grupos.filter(
      (g) =>
        g.modelo.toLowerCase().includes(q) ||
        g.gustos?.some((gust) => gust.gusto.toLowerCase().includes(q))
    );
  }, [grupos, query]);

  return (
    <main className="catalogo">
      <ProgressBar loading={loading} />

      <div className="container">
        {/* Header Central */}
        <div style={{ marginBottom: 24 }}>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: 20, padding: "4px 14px",
              marginBottom: 10,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%",
              background: "#22c55e", display: "inline-block",
              boxShadow: "0 0 6px #22c55e" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "3px", textTransform: "uppercase", color: "#22c55e" }}>
              Central
            </span>
          </motion.div>

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
            Seleccioná los gustos que querés y envianos el pedido por WhatsApp.
          </motion.p>
        </div>

        {/* Buscador */}
        <SearchBar value={query} onChange={setQuery} />

        {/* Marcas / chips */}
        <ToolbarChips grupos={grupos} query={query} onChipClick={setQuery} />

        {/* Estados */}
        {errorMsg && (
          <p style={{ color: "var(--mut)", textAlign: "center", marginTop: 40 }}>
            {errorMsg}
          </p>
        )}

        {/* Grilla */}
        <div className="card-grid">
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : filtered.map((grupo, i) => (
                <ModelCardPedido
                  key={grupo.modelo}
                  grupo={grupo}
                  cantidadDe={cantidadDe}
                  onAgregar={handleAgregar}
                  index={i}
                />
              ))}
        </div>

        {!loading && filtered.length === 0 && !errorMsg && (
          <p style={{ textAlign: "center", color: "var(--mut)", marginTop: 60 }}>
            Sin resultados para «{query}».
          </p>
        )}
      </div>

      {/* Botón flotante carrito */}
      <motion.button
        onClick={() => setCarritoAbierto(true)}
        aria-label={`Ver pedido (${totalItems} items)`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        style={{
          position: "fixed", bottom: "calc(28px + var(--safe-bottom, 0px))",
          right: 24, zIndex: 100,
          width: 58, height: 58, borderRadius: "50%",
          background: totalItems > 0 ? "#22c55e" : "#1a1a1c",
          border: totalItems > 0 ? "none" : "1px solid rgba(255,255,255,0.12)",
          color: totalItems > 0 ? "#000" : "#888",
          fontSize: "1.5rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          boxShadow: totalItems > 0
            ? "0 4px 20px rgba(34,197,94,0.45)"
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
                background: "#000", color: "#22c55e",
                fontSize: "0.68rem", fontWeight: 900,
                width: 20, height: 20, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #22c55e",
              }}
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Drawer del carrito */}
      <AnimatePresence>
        {carritoAbierto && (
          <CarritoCentral
            items={items}
            totalItems={totalItems}
            onCambiar={cambiar}
            onQuitar={quitar}
            onVaciar={vaciar}
            onCerrar={() => setCarritoAbierto(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
