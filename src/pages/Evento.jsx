import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/Evento.css";
import { api } from "../api/client";
import ModelImage from "../components/ModelImage";
import Loader from "../components/Loader";
import { splitModeloGusto, extractPuffs } from "../utils/model";

const fmt = (n) => `$${Number(n).toLocaleString("es-AR")}`;

/**
 * Catálogo de una fiesta. Reemplaza la hoja impresa: se arma solo con lo que
 * se dejó en el evento y los precios que se cargaron en el sistema.
 */
export default function Evento() {
  const { slug } = useParams();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    api
      .get(`/public/evento/${slug}`, { signal: ctrl.signal })
      .then((r) => setDatos(r.data))
      .catch((e) => {
        if (e.code === "ERR_CANCELED" || e.name === "CanceledError") return;
        setError(e.message || "No se pudo cargar el catálogo");
      })
      .finally(() => setCargando(false));
    return () => ctrl.abort();
  }, [slug]);

  useEffect(() => {
    if (datos?.nombre) document.title = `${datos.nombre} — The North Shop`;
  }, [datos]);

  // Un modelo puede venir con varios sabores y distinto precio: se agrupa por
  // modelo y se listan los sabores adentro, como en el catálogo de sucursales.
  const modelos = [];
  (datos?.items || []).forEach((it) => {
    const { modelo, gusto } = splitModeloGusto(it.nombre);
    let m = modelos.find((x) => x.modelo === modelo);
    if (!m) {
      m = { modelo, puffs: extractPuffs(it.nombre), precios: [], gustos: [] };
      modelos.push(m);
    }
    m.precios.push(Number(it.precio));
    if (gusto) m.gustos.push(gusto);
  });

  const precioTexto = (m) => {
    const min = Math.min(...m.precios);
    const max = Math.max(...m.precios);
    return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
  };

  return (
    <main className="evento">
      <div className="ev-container">
        <header className="ev-header">
          <img src="/img/logo/logoNorth.png" alt="The North Shop" />
          <h1>Catálogo de vapers</h1>
          {datos && (
            <p className="ev-sub">
              {datos.nombre}
              {datos.lugar && ` · ${datos.lugar}`}
            </p>
          )}
        </header>

        {cargando && (
          <div className="ev-msg" role="status" aria-busy="true">
            <Loader />
          </div>
        )}

        {!cargando && error && <p className="ev-msg">{error}</p>}

        {!cargando && !error && modelos.length === 0 && (
          <p className="ev-msg">No hay productos cargados en este catálogo.</p>
        )}

        {modelos.length > 0 && (
          <section className="ev-grid">
            {modelos.map((m) => (
              <article className="ev-card" key={m.modelo}>
                <div className="ev-foto">
                  <ModelImage modelo={m.modelo} />
                </div>
                <h2 className="ev-modelo">{m.modelo}</h2>
                {m.puffs > 0 && (
                  <p className="ev-puffs">{m.puffs.toLocaleString("es-AR")} puffs</p>
                )}
                <p className="ev-precio">{precioTexto(m)}</p>
                {m.gustos.length > 0 && (
                  <p className="ev-gustos">{m.gustos.join(" · ")}</p>
                )}
              </article>
            ))}
          </section>
        )}

        <footer className="ev-pie">
          <p className="ev-legal">
            Productos para mayores de 21 años. Pueden contener nicotina.
          </p>
        </footer>
      </div>
    </main>
  );
}
