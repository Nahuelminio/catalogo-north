import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/AvisoEventos.css";
import { api } from "../api/client";

/**
 * Aviso en el catálogo principal los días que estamos en una fiesta.
 * Si no hay evento hoy no renderiza nada, así que no ocupa lugar.
 */
export default function AvisoEventos() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const ctrl = new AbortController();
    api
      .get("/public/eventos-hoy", { signal: ctrl.signal })
      .then((r) => setEventos(Array.isArray(r.data) ? r.data : []))
      .catch(() => {
        /* El aviso es accesorio: si falla, el catálogo sigue igual */
      });
    return () => ctrl.abort();
  }, []);

  if (eventos.length === 0) return null;

  return (
    <div className="aviso-eventos">
      {eventos.map((ev) => (
        <Link key={ev.slug} to={`/evento/${ev.slug}`} className="aviso-ev">
          <span className="aviso-ev-punto" aria-hidden="true" />
          <div className="aviso-ev-texto">
            <p className="aviso-ev-kicker">Hoy estamos acá</p>
            <p className="aviso-ev-nombre">
              {ev.nombre}
              {ev.lugar && <span className="aviso-ev-lugar"> · {ev.lugar}</span>}
            </p>
          </div>
          <span className="aviso-ev-cta">Ver catálogo →</span>
        </Link>
      ))}
    </div>
  );
}
