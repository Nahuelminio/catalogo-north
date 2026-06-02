import React, { useEffect, useMemo, useState, useTransition } from "react";
import PropTypes from "prop-types";
import "../css/MenuBrook.css";
import ToolbarChipsBrook from "../components/ToolbarChipsBrook";
import ModelBrook from "../components/ModelBrook";
import useSucursales from "../hooks/useSucursales";
import useProductos from "../hooks/useProductos";
import Loader from "../components/Loader";
import FooterBrook from "../components/FooterBrook";
import { IDS_BROOKLYN, DEFAULT_BROOKLYN_ID } from "../config";

export default function CatalogoBrook({ idsBrooklyn = IDS_BROOKLYN, defaultId = DEFAULT_BROOKLYN_ID }) {
  const {
    sucursales,
    sucursalId,
    setSucursalId,
    sucursalName,
    error: sucError,
  } = useSucursales();

  const [isPending, startTransition] = useTransition();
  const [visibleGrupos, setVisibleGrupos] = useState([]);

  const brooklynSucursales = useMemo(
    () => sucursales.filter((s) => idsBrooklyn.includes(Number(s.id))),
    [sucursales, idsBrooklyn]
  );

  // Seteo inicial de sucursal brooklyn
  useEffect(() => {
    if (sucursalId && idsBrooklyn.includes(Number(sucursalId))) return;

    const saved = localStorage.getItem("sucursalId");
    const savedNum = saved ? Number(saved) : null;
    const valid = savedNum && idsBrooklyn.includes(savedNum);

    const toUse = valid
      ? savedNum
      : brooklynSucursales[0]
      ? Number(brooklynSucursales[0].id)
      : defaultId;

    setSucursalId(toUse);
  }, [brooklynSucursales, idsBrooklyn, defaultId, sucursalId, setSucursalId]);

  const { grupos, loading, errorMsg } = useProductos(
    sucursalId && idsBrooklyn.includes(Number(sucursalId)) ? sucursalId : null
  );

  // Actualizar lista visible con useTransition (sin setTimeout)
  useEffect(() => {
    if (loading) {
      setVisibleGrupos([]);
      return;
    }
    startTransition(() => {
      setVisibleGrupos(Array.isArray(grupos) ? grupos : []);
    });
  }, [loading, grupos]);

  const handleSelect = (id) => {
    setVisibleGrupos([]);
    setSucursalId(id);
  };

  const isLoadingUI = loading || isPending || !sucursalId;

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

        {isLoadingUI ? (
          <div
            className="brook-loader-overlay"
            role="status"
            aria-busy="true"
            aria-live="polite"
          >
            <Loader variant="brook" />
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

CatalogoBrook.propTypes = {
  idsBrooklyn: PropTypes.arrayOf(PropTypes.number),
  defaultId: PropTypes.number,
};
