import React, { useEffect, useState } from "react";
import "../css/Shishas.css";
import useShishas from "../hooks/useShishas";
import Loader from "../components/Loader";

const fmt = (n) => `$${Number(n).toLocaleString("es-AR")}`;

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
          <img src="/img/logo/logoNorth.png" alt="The North Shop" />
        </div>

        <h1 className="sh-title">Shishas Árabes</h1>

        {loading && (
          <div className="sh-msg" role="status" aria-busy="true">
            <Loader />
          </div>
        )}

        {!loading && errorMsg && <p className="sh-msg">{errorMsg}</p>}

        {!loading && !errorMsg && carta && (
          <>
            <section className="sh-precios">
              <h2 className="sh-seccion">Experiencia Shisha</h2>

              <div className="sh-precio-row">
                <span className="sh-label">Armado inicial (shisha completa)</span>
                <span className="sh-dots" />
                <span className="sh-monto">{fmt(carta.precios.armado)}</span>
              </div>

              <div className="sh-precio-row">
                <span className="sh-label">Recarga de sabor</span>
                <span className="sh-dots" />
                <span className="sh-monto">{fmt(carta.precios.recarga)}</span>
              </div>
            </section>

            {carta.lineas.map((g) => (
              <section className="sh-linea" key={g.linea}>
                <h2 className="sh-seccion">Sabores disponibles — {g.linea}</h2>

                {g.sabores.map((s) => (
                  <article className="sh-sabor" key={s.nombre}>
                    <h3 className="sh-sabor-nombre">
                      {s.nombre}
                      {s.resumen && <span className="sh-resumen">: {s.resumen}</span>}
                    </h3>
                    {s.descripcion && <p className="sh-sabor-desc">{s.descripcion}</p>}
                  </article>
                ))}
              </section>
            ))}

            <p className="sh-nota">
              Consultá en la barra por la disponibilidad del día
            </p>
          </>
        )}
      </div>
    </main>
  );
}
