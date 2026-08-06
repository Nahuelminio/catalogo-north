import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Shishas.css";
import useShishas from "../hooks/useShishas";
import Loader from "../components/Loader";
import { SUCURSAL_WA_LINKS } from "../config";

// Las consultas de la carta las atiende Itaembe Guazú (sucursal 1), no el bar.
// El link sale del mismo mapa que usa el resto del catálogo.
const WA_CONSULTAS = SUCURSAL_WA_LINKS["1"];
const IG_NORTH = "https://www.instagram.com/thenorthshop.arg/";

const fmt = (n) => `$${Number(n).toLocaleString("es-AR")}`;

// El nombre guardado repite la marca ("Adalya Blue Melon") y el título de la
// sección ya la dice, así que en la lista se muestra sin ese prefijo.
const sinLinea = (nombre, linea) => {
  const marca = linea.split(" ")[0];
  return nombre.toLowerCase().startsWith(`${marca.toLowerCase()} `)
    ? nombre.slice(marca.length + 1)
    : nombre;
};

export default function Shishas() {
  const { carta, loading, errorMsg } = useShishas();
  // Todavía no está el logo de Fagu entre los assets: si no carga, queda el
  // nombre escrito en vez de una imagen rota.
  const [sinLogoFagu, setSinLogoFagu] = useState(false);

  useEffect(() => {
    document.title = "Fagu Drink Bar — Shishas árabes";
  }, []);

  return (
    <main className="shishas">
      <div className="sh-container">
        <div className="sh-logos">
          {sinLogoFagu ? (
            <span className="sh-wordmark">Fagu</span>
          ) : (
            <img
              src="/img/logo/logoFagu.png"
              alt="Fagu Drink Bar"
              onError={() => setSinLogoFagu(true)}
            />
          )}
          <span className="sh-sep" />
          <img
            className="sh-logo-north"
            src="/img/logo/logoNorth.png"
            alt="The North Shop"
          />
        </div>

        <h1 className="sh-title">Shishas Árabes</h1>
        <div className="sh-filete" aria-hidden="true">
          <span />
        </div>

        {loading && (
          <div className="sh-msg" role="status" aria-busy="true">
            <Loader />
          </div>
        )}

        {!loading && errorMsg && <p className="sh-msg">{errorMsg}</p>}

        {!loading && !errorMsg && carta && (
          <>
            <section className="sh-precios">
              <h2 className="sh-seccion">Experiencia shisha</h2>

              <div className="sh-precio-cards">
                <div className="sh-precio-card">
                  <span className="sh-label">Armado inicial</span>
                  <span className="sh-monto">{fmt(carta.precios.armado)}</span>
                  <span className="sh-aclara">Shisha completa</span>
                </div>

                <div className="sh-precio-card">
                  <span className="sh-label">Recarga</span>
                  <span className="sh-monto">{fmt(carta.precios.recarga)}</span>
                  <span className="sh-aclara">Cambio de sabor</span>
                </div>
              </div>
            </section>

            {carta.lineas.map((g) => (
              <section className="sh-linea-grupo" key={g.linea}>
                <h2 className="sh-seccion">{g.linea}</h2>

                {g.sabores.map((s) => (
                  <article className="sh-sabor" key={s.nombre}>
                    <div className="sh-sabor-head">
                      <h3 className="sh-sabor-nombre">
                        {sinLinea(s.nombre, g.linea)}
                      </h3>
                      {s.resumen && (
                        <span className="sh-sabor-resumen">{s.resumen}</span>
                      )}
                    </div>
                    {s.descripcion && (
                      <p className="sh-sabor-desc">{s.descripcion}</p>
                    )}
                  </article>
                ))}
              </section>
            ))}

            <p className="sh-nota">
              Consultá en la barra por la disponibilidad del día
            </p>

            {/* La carta se abre por QR en la mesa: sin esto queda sin salida,
                el cliente no tiene cómo escribir ni ver el resto. */}
            <footer className="sh-pie">
              <div className="sh-pie-acciones">
                <a
                  className="sh-btn sh-btn-primario"
                  href={WA_CONSULTAS}
                  target="_blank"
                  rel="noreferrer"
                >
                  Escribinos por WhatsApp
                </a>
                <a
                  className="sh-btn"
                  href={IG_NORTH}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </div>

              <Link className="sh-pie-link" to="/">
                Ver también el catálogo de vapes →
              </Link>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
