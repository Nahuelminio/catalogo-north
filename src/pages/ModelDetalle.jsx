import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ModelImage from "./components/ModelImage";
import {
  MODEL_DESCRIPTIONS,
  MODEL_ALIASES,
  normKey,
  getModelSpecs,
  specChips,
} from "./data/modelDescriptions";
import "./css/Catalogo.css"; // reutilizamos estilos base

/* API base desde env */
const API_BASE = (() => {
  const vite = typeof import.meta !== "undefined" && import.meta.env;
  const url =
    (vite && (vite.VITE_API_URL || vite.VITE_BACKEND_URL)) ||
    process.env.REACT_APP_API_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    "http://localhost:3000";
  return String(url).replace(/\/+$/, "");
})();
const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

const getCanonical = (name = "") =>
  MODEL_ALIASES[normKey(name)] || normKey(name);
const fromSlug = (slug = "") => slug.replace(/-/g, " ");

export default function ModelDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // datos que pueden venir por state desde el catálogo
  const passed = location.state || {};
  const canonical = passed.canonical || getCanonical(fromSlug(slug));
  const modelo = passed.modelo || canonical;

  const [sucursalId, setSucursalId] = useState(
    passed.sucursalId || localStorage.getItem("sucursalId") || ""
  );
  const [sucursalName, setSucursalName] = useState(passed.sucursalName || "");
  const [gustos, setGustos] = useState(passed.gustos || []);
  const [puffs, setPuffs] = useState(passed.puffs || null);
  const [ml, setMl] = useState(passed.ml || null);
  const [loading, setLoading] = useState(false);

  // si no vino info, la buscamos por sucursal guardada
  useEffect(() => {
    if (gustos.length && (puffs || ml)) return; // ya tenemos datos
    if (!sucursalId) return;
    setLoading(true);
    api
      .get("/public/productos", {
        params: { sucursal_id: sucursalId, inStock: 1 },
      })
      .then((r) => {
        const arr = Array.isArray(r.data) ? r.data : [];
        // filtrar por modelo canónico
        const items = arr.filter((p) => {
          const name = String(p?.nombre || "");
          const parts = name.split(" - ");
          const mdl = parts[0] ? parts[0].trim() : name.trim();
          return getCanonical(mdl) === canonical;
        });
        const sabores = items.map((p) => {
          const parts = String(p.nombre).split(" - ");
          return { id: p.id, gusto: parts[1] ? parts[1].trim() : "Sin gusto" };
        });
        // tratar de detectar puffs/ml de alguno
        const detectPuffs = () => {
          for (const it of items) {
            const m = String(it.nombre).match(
              /\b(\d{2,3})\s?k\b|(\d{4,6})\s*puffs\b/i
            );
            if (m) {
              const k = m[1] ? parseInt(m[1], 10) * 1000 : parseInt(m[2], 10);
              return k || null;
            }
          }
          return null;
        };
        const detectMl = () => {
          for (const it of items) {
            const m = String(it.nombre).match(/(\d{1,3})\s*ml\b/i);
            if (m) return parseInt(m[1], 10);
          }
          return null;
        };
        setGustos(sabores.sort((a, b) => a.gusto.localeCompare(b.gusto)));
        setPuffs((prev) => prev || detectPuffs());
        setMl((prev) => prev || detectMl());
      })
      .finally(() => setLoading(false));
  }, [canonical, sucursalId, gustos.length, puffs, ml]);

  // traer nombre de sucursal si falta
  useEffect(() => {
    if (sucursalName || !sucursalId) return;
    api.get("/public/sucursales").then((r) => {
      const list = Array.isArray(r.data) ? r.data : [];
      const s = list.find((x) => String(x.id) === String(sucursalId));
      if (s) setSucursalName(s.nombre);
    });
  }, [sucursalId, sucursalName]);

  const desc = MODEL_DESCRIPTIONS[canonical] || null;
  const specs = getModelSpecs(canonical);
  const chips = specChips(specs);

  return (
    <main className="catalogo">
      <div className="container">
        <button className="chip" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="page-title" style={{ marginTop: 10 }}>
          {modelo}
        </h1>
        <p className="page-sub">
          {puffs
            ? `${puffs.toLocaleString("es-AR")} puffs`
            : ml
            ? `${ml} ml`
            : "Modelo"}
          {sucursalName ? ` · ${sucursalName}` : ""}
        </p>

        <section className="detail">
          <div className="detail-hero">
            <div className="detail-media">
              <ModelImage modelo={modelo} />
            </div>
            <div className="detail-info">
              {desc && <p className="detail-desc">{desc}</p>}
              {chips.length > 0 && (
                <div className="detail-chips">
                  {chips.map((c) => (
                    <span className="badge" key={c}>
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flavors-block" style={{ marginTop: 16 }}>
            <p className="flavors-title">Gustos disponibles</p>
            {loading ? (
              <div className="sk" />
            ) : gustos.length ? (
              <ul className="flavor-list">
                {gustos.map((g) => (
                  <li className="flavor-item" key={g.id}>
                    <a
                      className="flavor-link"
                      href={`https://wa.me/${
                        (typeof import.meta !== "undefined" &&
                          import.meta.env &&
                          import.meta.env.VITE_WA_PHONE) ||
                        process.env.REACT_APP_WA_PHONE ||
                        "3764202408"
                      }?text=${encodeURIComponent(
                        `Hola North, me gustaría pedirte un ${modelo} - ${
                          g.gusto
                        }${
                          puffs
                            ? ` de ${puffs.toLocaleString("es-AR")} puffs`
                            : ""
                        }${sucursalName ? `. Sucursal: ${sucursalName}` : ""}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {g.gusto}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="sub">Sin datos de sabores para esta sucursal.</p>
            )}
          </div>

          {/* Galería (dejá tus imágenes reales si querés) */}
          <div className="detail-gallery">
            {/* Placeholder para cuando agregues tus fotos adicionales */}
            <div className="sub">Pronto más fotos de este modelo.</div>
          </div>
        </section>
      </div>
    </main>
  );
}
