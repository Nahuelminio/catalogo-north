import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import "../css/Shishas.css";
import useShishas from "../hooks/useShishas";
import Loader from "../components/Loader";
import { SUCURSAL_WA_LINKS } from "../config";

// Las consultas de la carta las atiende Itaembe Guazú (sucursal 1), no el bar.
// El link sale del mismo mapa que usa el resto del catálogo.
const WA_CONSULTAS = SUCURSAL_WA_LINKS["1"];
const IG_NORTH = "https://www.instagram.com/thenorthshop.arg/";

const IconoWhatsApp = () => (
  <svg viewBox="0 0 24 24" className="sh-btn-icono" aria-hidden="true" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Las cajas de los Comics se eligen por el dibujo, así que la foto suma más
// que la descripción. Mapa por ahora; si crece conviene una columna en la base.
const PACKS = {
  "Adalya Mario Brothers": "/img/shishas/pack-mario-brothers.webp",
  "Adalya Homero": "/img/shishas/pack-homero.webp",
  "Adalya Majin Boo": "/img/shishas/pack-majin-boo.webp",
};

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

                {g.sabores.some((s) => PACKS[s.nombre]) && (
                  <div className="sh-packs">
                    {g.sabores
                      .filter((s) => PACKS[s.nombre])
                      .map((s) => (
                        <img
                          key={s.nombre}
                          src={PACKS[s.nombre]}
                          alt={s.nombre}
                          loading="lazy"
                        />
                      ))}
                  </div>
                )}
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
                  <IconoWhatsApp />
                  <span>WhatsApp</span>
                </a>
                <a
                  className="sh-btn"
                  href={IG_NORTH}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Instagram size={17} strokeWidth={1.7} aria-hidden="true" />
                  <span>Instagram</span>
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
