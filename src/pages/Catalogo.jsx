import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Catalogo.css";
import "../css/Shishas.css";
import ToolbarChips from "../components/ToolbarChips";
import ModelCard from "../components/ModelCard";
import SkeletonCard from "../components/SkeletonCard";
import SearchBar from "../components/SearchBar";
import AvisoEventos from "../components/AvisoEventos";
import ProgressBar from "../components/ProgressBar";
import useSucursales from "../hooks/useSucursales";
import useProductos from "../hooks/useProductos";

const SKELETON_COUNT = 4;
const fadeUp = { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } };
const fade   = { initial: { opacity: 0 }, animate: { opacity: 1 } };

/**
 * @param {string} [fija] Slug o id de sucursal. Viene de /punto/:slug, el link
 *   del QR de cada punto: muestra solo ese stock y no deja cambiar de sucursal.
 */
export default function Catalogo({ fija }) {
  const {
    sucursales,
    sucursalId,
    setSucursalId,
    sucursalName,
    sucursalPhone,
    noEncontrada,
    error: sucError,
  } = useSucursales(fija);

  useEffect(() => {
    document.title =
      fija && sucursalName
        ? `${sucursalName} — The North Shop`
        : "The North Shop — Catálogo de pods";
  }, [fija, sucursalName]);
  const { grupos, loading, errorMsg } = useProductos(sucursalId);

  const [query, setQuery] = useState("");

  // Reset query when branch changes
  useEffect(() => { setQuery(""); }, [sucursalId]);

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
        <motion.h1
          className="page-title"
          {...fadeUp}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {fija ? sucursalName || "Catálogo" : "Catálogo"}
        </motion.h1>
        <motion.p
          className="page-sub"
          {...fade}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {fija
            ? "Lo que hay disponible en este punto ahora."
            : "Elegí la sucursal para ver disponibilidad por modelo."}
        </motion.p>

        {/* En el link de un punto no se ofrece cambiar de sucursal ni se
            mandan a otros lados: el QR está pegado en ese local. */}
        {!fija && (
          <>
            {/* Los días que estamos en una fiesta, arriba de todo */}
            <AvisoEventos />

            <ToolbarChips
              sucursales={sucursales}
              sucursalId={sucursalId}
              onSelect={setSucursalId}
            />
          </>
        )}

        {noEncontrada && (
          <p className="msg">Este punto de venta no existe o ya no está activo.</p>
        )}

        {sucursalId && !loading && grupos.length > 0 && (
          <SearchBar value={query} onChange={setQuery} />
        )}

        {(sucError || errorMsg) && (
          <p className="msg">{sucError || errorMsg}</p>
        )}

        <AnimatePresence mode="wait">
          {!sucursalId && fija ? (
            // Todavía resolviendo el punto, o no existe (el aviso va arriba)
            noEncontrada ? null : <SkeletonCard key="resolviendo" />
          ) : !sucursalId && !loading ? (
            <motion.p
              key="hint"
              className="msg sub"
              {...fade}
              transition={{ duration: 0.25 }}
            >
              Elegí una sucursal para ver el catálogo.
            </motion.p>
          ) : loading ? (
            <motion.section
              key="skeletons"
              aria-busy="true"
              aria-live="polite"
              aria-label="Cargando catálogo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.section>
          ) : filtered.length === 0 && query ? (
            <motion.div
              key="no-results"
              className="no-results"
              {...fade}
              transition={{ duration: 0.25 }}
            >
              <span className="no-results-icon">🔍</span>
              <p>Sin resultados para <strong>"{query}"</strong></p>
            </motion.div>
          ) : grupos.length === 0 ? (
            <motion.div
              key="empty"
              className="no-results"
              {...fade}
              transition={{ duration: 0.25 }}
            >
              <span className="no-results-icon">📦</span>
              <p>Sin stock en esta sucursal por el momento.</p>
            </motion.div>
          ) : (
            <motion.section
              key={`cards-${sucursalId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {filtered.map((g, i) => (
                <ModelCard
                  key={`${g.modelo}-${g.puffs || g.ml || "na"}`}
                  grupo={g}
                  sucursalName={sucursalName}
                  sucursalId={sucursalId}
                  sucursalPhone={sucursalPhone}
                  index={i}
                />
              ))}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* La carta del bar vive en su propia página, para poder pegar el QR
          en las mesas; acá va el acceso desde el catálogo principal. */}
      {!fija && (
      <Link to="/shishas" className="sh-banner">
        <img src="/img/logo/logoFagu.png" alt="" aria-hidden="true" />
        <div>
          <p className="sh-banner-kicker">Fagu Drink Bar</p>
          <p className="sh-banner-title">Shishas Árabes</p>
          <p className="sh-banner-sub">
            Mirá la carta de sabores y los precios del armado y la recarga.
          </p>
        </div>
      </Link>
      )}
    </main>
  );
}
