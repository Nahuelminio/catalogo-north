// src/pages/Catalogo.jsx
import React from "react";
import "../css/Catalogo.css";
import ToolbarChips from "../components/ToolbarChips";
import ModelCard from "../components/ModelCard";
import useSucursales from "../hooks/useSucursales";
import useProductos from "../hooks/useProductos";
import Loader from "../components/Loader"; // ⬅️ importa tu spinner

export default function CatalogoEditorial() {
  const {
    sucursales,
    sucursalId,
    setSucursalId,
    sucursalName,
    error: sucError,
  } = useSucursales();
  const { grupos, loading, errorMsg } = useProductos(sucursalId);

  return (
    <main className="catalogo">
      <div className="container">
        <h1 className="page-title">Catálogo</h1>
        <p className="page-sub">
          Elegí la sucursal para ver disponibilidad por modelo.
        </p>

        <ToolbarChips
          sucursales={sucursales}
          sucursalId={sucursalId}
          onSelect={setSucursalId}
        />

        {(sucError || errorMsg) && (
          <p className="msg">{sucError || errorMsg}</p>
        )}

        {!sucursalId && !loading ? (
          <p className="msg sub">Elegí una sucursal para ver el catálogo.</p>
        ) : loading ? (
          // ⬇️ reemplaza los skeletons por el loader centrado
          <section
            className="loading-center"
            role="status"
            aria-busy="true"
            aria-live="polite"
          >
            <Loader />
          </section>
        ) : grupos.length === 0 ? (
          <p className="msg sub p-nohay">No hay productos en stock en esta sucursal.</p>
        ) : (
          <section>
            {grupos.map((g) => (
              <ModelCard
                key={`${g.modelo}-${g.puffs || g.ml || "na"}`}
                grupo={g}
                sucursalName={sucursalName}
                sucursalId={sucursalId}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
