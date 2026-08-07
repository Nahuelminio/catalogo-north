import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  // Sin slug en la URL es el link fijo del QR: resuelve solo cuál es el evento
  // de hoy, así no hay que imprimir un QR nuevo por fiesta.
  const { slug } = useParams();
  const [datos, setDatos] = useState(null);
  const [opciones, setOpciones] = useState(null);   // varias fiestas el mismo día
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    let vivo = true;

    const traer = async (s) => {
      const r = await api.get(`/public/evento/${s}`, { signal: ctrl.signal });
      if (vivo) setDatos(r.data);
    };

    (async () => {
      try {
        if (slug) {
          await traer(slug);
        } else {
          const r = await api.get("/public/eventos-hoy", { signal: ctrl.signal });
          const hoy = Array.isArray(r.data) ? r.data : [];
          if (hoy.length === 1) await traer(hoy[0].slug);
          else if (vivo) setOpciones(hoy);
        }
      } catch (e) {
        if (e.code === "ERR_CANCELED" || e.name === "CanceledError") return;
        if (vivo) setError(e.message || "No se pudo cargar el catálogo");
      } finally {
        if (vivo) setCargando(false);
      }
    })();

    return () => { vivo = false; ctrl.abort(); };
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
          {/* Los logos de la fiesta van junto al nuestro, como en la hoja
              impresa que se deja en la mesa. */}
          {/* Arriba manda la fiesta; el nuestro va al pie, como en la hoja
              impresa. Sin logos de fiesta el nuestro encabeza. */}
          {datos?.logos?.length > 0 ? (
            <div className="ev-presentan">
              {datos.logos.length > 1 && (
                <p className="ev-kicker">Presentan</p>
              )}
              <div className="ev-logos-fiesta">
                {datos.logos.map((src, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="ev-sep" />}
                    <img className="ev-logo-fiesta" src={src} alt="" />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <img className="ev-logo-north" src="/img/logo/logoNorth.png" alt="The North Shop" />
          )}
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

        {!cargando && !error && opciones?.length === 0 && (
          <div className="ev-vacio">
            <p className="ev-vacio-titulo">Hoy no hay ninguna fiesta activa</p>
            <p className="ev-vacio-texto">
              Este código muestra el catálogo cuando estamos en un evento.
            </p>
            <Link className="ev-vacio-link" to="/">Ver el catálogo de siempre →</Link>
          </div>
        )}

        {!cargando && !error && opciones?.length > 1 && (
          <div className="ev-elegir">
            <p className="ev-vacio-texto">¿En cuál estás?</p>
            {opciones.map((o) => (
              <Link key={o.slug} to={`/evento/${o.slug}`} className="ev-opcion">
                <span>{o.nombre}</span>
                {o.lugar && <small>{o.lugar}</small>}
              </Link>
            ))}
          </div>
        )}

        {/* Solo cuando ya hay un evento resuelto: sin eso el mensaje aparecía
            debajo del selector de fiestas. */}
        {!cargando && !error && datos && modelos.length === 0 && (
          <p className="ev-msg">No hay productos cargados en este catálogo.</p>
        )}

        {modelos.length > 0 && (
          <section className={`ev-grid${modelos.length <= 2 ? " ev-pocos" : ""}`}>
            {modelos.map((m) => (
              <article className="ev-card" key={m.modelo}>
                <div className="ev-media">
                  <div className="ev-foto">
                    <ModelImage modelo={m.modelo} />
                  </div>
                  {/* Sobre la foto: no le roba lugar al texto */}
                  {m.puffs > 0 && (
                    <span className="ev-puffs">
                      {m.puffs.toLocaleString("es-AR")} puffs
                    </span>
                  )}
                </div>

                <div className="ev-datos">
                  <h2 className="ev-modelo">{m.modelo}</h2>
                  <p className="ev-precio">{precioTexto(m)}</p>
                  {m.gustos.length > 0 && (
                    <div className="ev-gustos">
                      {m.gustos.map((g) => (
                        <span className="ev-gusto" key={g}>{g}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Aviso del evento: sirve sobre todo cuando hay más de una barra */}
        {!cargando && !error && datos?.nota && (
          <p className="ev-nota">{datos.nota}</p>
        )}

        {(datos || cargando) && (
        <footer className="ev-pie">
          {datos?.logos?.length > 0 && (
            <img className="ev-logo-pie" src="/img/logo/logoNorth.png" alt="The North Shop" />
          )}
          <p className="ev-legal">
            Productos para mayores de 21 años. Pueden contener nicotina.
          </p>
        </footer>
        )}
      </div>
    </main>
  );
}
