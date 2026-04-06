import React, { useEffect, useMemo, useState } from "react";
import "../css/MenuBrook.css";
import ToolbarChipsBrook from "../components/ToolbarChipsBrook";
import ModelBrook from "../components/ModelBrook";
import useSucursales from "../hooks/useSucursales";
import useProductos from "../hooks/useProductos";
import LoaderBrook from "../components/LoaderBrook";
import FooterBrook from "../components/FooterBrook";

const IDS_BROOKLYN = [8, 9];
const DEFAULT_BROOKLYN_ID = 8; // Brooklyn · Barra Patio

export default function CatalogoBrook() {
  const {
    sucursales,
    sucursalId,
    setSucursalId,
    sucursalName,
    error: sucError,
  } = useSucursales();

  // listado visible de modelos
  const [visibleGrupos, setVisibleGrupos] = useState([]);

  // controla el primer render de cada sucursal
  const [booting, setBooting] = useState(true);

  // Filtramos solo las sucursales Brooklyn
  const brooklynSucursales = useMemo(
    () => sucursales.filter((s) => IDS_BROOKLYN.includes(Number(s.id))),
    [sucursales]
  );

  // Seteo inicial con persistencia
  useEffect(() => {
    if (!sucursalId) {
      const saved = localStorage.getItem("sucursalId");
      const initial = saved ? Number(saved) : DEFAULT_BROOKLYN_ID;
      const valid = IDS_BROOKLYN.includes(initial);

      const toUse = valid
        ? initial
        : brooklynSucursales.length
        ? Number(brooklynSucursales[0].id)
        : DEFAULT_BROOKLYN_ID;

      setSucursalId(toUse);
      localStorage.setItem("sucursalId", String(toUse));
    }
  }, [sucursalId, setSucursalId, brooklynSucursales]);

  // No pedimos productos sin sucursal válida
  const { grupos, loading, errorMsg } = useProductos(sucursalId || null);

  // Sincronizar el render
  useEffect(() => {
    if (loading) {
      setVisibleGrupos([]); // limpia visual
    } else {
      // 🔥 Delay suave: asegura que el loader SIEMPRE aparezca
      setTimeout(() => {
        setVisibleGrupos(Array.isArray(grupos) ? grupos : []);
        if (sucursalId) setBooting(false);
      }, 220); // 220ms es perfecto
    }
  }, [loading, grupos, sucursalId]);

  const handleSelect = (id) => {
    setBooting(true);
    setVisibleGrupos([]); // limpia antes del cambio
    setSucursalId(id);
    localStorage.setItem("sucursalId", String(id));
  };

  // Estado global de carga
  const isLoadingUI = !sucursalId || booting || loading;

  return (
    <main className={`catalogo ${isLoadingUI ? "brook-lock" : ""}`}>
      <div className="container">
        <h1 className="page-title-brook">CATÁLOGO</h1>
        <h2 className="page-subtitle-brook">PODS DESCARTABLES</h2>

        <p className="msgBrook">
          Elegí la barra para ver la disponibilidad por modelo.
        </p>

        <ToolbarChipsBrook
          sucursales={brooklynSucursales}
          sucursalId={sucursalId}
          onSelect={handleSelect}
        />

        {(sucError || errorMsg) && (
          <p className="msg">{sucError || errorMsg}</p>
        )}

        {/* LOADER PREMIUM */}
        {isLoadingUI ? (
          <div
            className="brook-loader-overlay"
            role="status"
            aria-busy="true"
            aria-live="polite"
          >
            <LoaderBrook />
          </div>
        ) : visibleGrupos.length > 0 ? (
          <section key={`list-${sucursalId}`} className="brook-list">
            {visibleGrupos.map((g, index) => (
              <ModelBrook
                key={`${g.modelo}-${g.puffs || g.ml || index}`}
                grupo={g}
                sucursalName={sucursalName}
                sucursalId={sucursalId}
                index={index}
              />
            ))}
          </section>
        ) : (
          <p className="msg sub p-nohay">
            No hay productos en stock en esta barra.
          </p>
        )}
      </div>

      <FooterBrook
        img1="/img/logo/logoNorth.png"
        img2="/img/logo/logoBrook.png"
        alt1="Logo North"
        alt2="Logo Brook"
      />
    </main>
  );
}
