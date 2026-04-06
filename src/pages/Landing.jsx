import React from "react";
import { Link } from "react-router-dom";
import "../css/Landing.css";

export default function Landing() {
  return (
    <main className="landing">
      {/* Hero principal */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Descubrí lo último en <span>The North Shop</span>
          </h1>
          <p>
            Unite a <strong>North Community</strong> y accedé a sorteos,
            lanzamientos y beneficios exclusivos.
          </p>
          <div className="cta-buttons">
            <Link to="/catalogo" className="btn">
              Ver Catálogo
            </Link>
            <a
              href="https://chat.whatsapp.com/H6sxNk2sCX62u35J7etbnC"
              className="btn btn-outline"
            >
              Unirme a la comunidad
            </a>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section class="benefits">
        <div class="wrap">
          <h2 class="benefits__title">
            Ventajas de ser parte de <span>North Community</span>
          </h2>
          <p class="benefits__subtitle">
            Recibí lanzamientos primero, sorteos reales y descuentos solo para
            miembros.
          </p>
          <div class="benefits__grid">
            <article class="benefit">
              <div class="benefit__icon" aria-hidden="true"></div>
              <h3 class="benefit__h">Sorteos exclusivos</h3>
              <p class="benefit__p">
                Productos edición limitada y premios mensuales solo para la
                comunidad.
              </p>
            </article>

            <article class="benefit">
              <div class="benefit__icon" aria-hidden="true"></div>
              <h3 class="benefit__h">Lanzamientos antes que nadie</h3>
              <p class="benefit__p">
                Enterate primero y reservá tu modelo cuando llega el stock.
              </p>
            </article>

            <article class="benefit">
              <div class="benefit__icon" aria-hidden="true"></div>
              <h3 class="benefit__h">Descuentos para miembros</h3>
              <p class="benefit__p">
                Cupones y precios especiales en campañas y temporadas.
              </p>
            </article>

            <article class="benefit">
              <div class="benefit__icon" aria-hidden="true"></div>
              <h3 class="benefit__h">Consejos & cuidados</h3>
              <p class="benefit__p">
                Tips útiles para que tu experiencia dure más y rinda mejor.
              </p>
            </article>
          </div>

          <a href="#form" class="btn btn-primary btn-wide">
            Quiero unirme a la comunidad
          </a>
        </div>
      </section>
    </main>
  );
}
