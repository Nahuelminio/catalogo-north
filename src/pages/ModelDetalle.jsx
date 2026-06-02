import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { api, buildWaUrl } from "../api/client";
import { SUCURSAL_WA_LINKS } from "../config";
import ModelImage from "../components/ModelImage";
import {
  MODEL_DESCRIPTIONS,
  MODEL_ALIASES,
  normKey,
  getModelSpecs,
  specChips,
} from "../data/modelDescriptions";
import "../css/Catalogo.css";
import "../css/ModelDetail.css";

const getCanonical = (name = "") =>
  MODEL_ALIASES[normKey(name)] || normKey(name);

const fromSlug = (slug = "") => slug.replace(/-/g, " ");

export default function ModelDetalle() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passed = location.state || {};
  const canonical = passed.canonical || getCanonical(fromSlug(slug));
  const modelo = passed.modelo || canonical;

  const [sucursalId] = useState(
    passed.sucursalId || localStorage.getItem("sucursalId") || ""
  );
  const [sucursalName, setSucursalName] = useState(passed.sucursalName || "");
  const [sucursalPhone, setSucursalPhone] = useState(
    passed.sucursalPhone ? String(passed.sucursalPhone).replace(/[^\d]/g, "") : ""
  );
  const [gustos, setGustos] = useState(passed.gustos || []);
  const [puffs, setPuffs] = useState(passed.puffs || null);
  const [ml, setMl] = useState(passed.ml || null);
  const [loading, setLoading] = useState(false);

  // Actualizar title de la página
  useEffect(() => {
    document.title = `${modelo} — The North Shop`;
    return () => { document.title = "The North Shop — Catálogo de pods"; };
  }, [modelo]);

  // Si no vino info por state, la buscamos en la API
  useEffect(() => {
    if (gustos.length && (puffs || ml)) return;
    if (!sucursalId) return;
    setLoading(true);
    api
      .get("/public/productos", {
        params: { sucursal_id: sucursalId, inStock: 1 },
      })
      .then((r) => {
        const arr = Array.isArray(r.data) ? r.data : [];
        const items = arr.filter((p) => {
          const parts = String(p?.nombre || "").split(" - ");
          const mdl = parts[0]?.trim() ?? "";
          return getCanonical(mdl) === canonical;
        });

        const sabores = items.map((p) => {
          const parts = String(p.nombre).split(" - ");
          return { id: p.id, gusto: parts[1]?.trim() || "Sin gusto" };
        });

        const detectPuffs = () => {
          for (const it of items) {
            const m = String(it.nombre).match(/\b(\d{2,3})\s?k\b|(\d{4,6})\s*puffs\b/i);
            if (m) return m[1] ? parseInt(m[1], 10) * 1000 : parseInt(m[2], 10);
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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [canonical, sucursalId, gustos.length, puffs, ml]);

  // Buscar nombre y teléfono de sucursal si faltan
  useEffect(() => {
    // Si la sucursal tiene un link directo en el mapa, no necesitamos el teléfono
    if (SUCURSAL_WA_LINKS[String(sucursalId)]) return;
    if ((sucursalName && sucursalPhone) || !sucursalId) return;
    api.get("/public/sucursales").then((r) => {
      const list = Array.isArray(r.data) ? r.data : [];
      const s = list.find((x) => String(x.id) === String(sucursalId));
      if (s) {
        if (!sucursalName) setSucursalName(s.apodo || s.nombre || "");
        if (!sucursalPhone && s.telefono)
          setSucursalPhone(String(s.telefono).replace(/[^\d]/g, ""));
      }
    }).catch(() => {});
  }, [sucursalId, sucursalName, sucursalPhone]);

  const desc = MODEL_DESCRIPTIONS[canonical] || null;
  const specs = getModelSpecs(canonical);
  const chips = specChips(specs);

  const handleShare = () => {
    const text = puffs
      ? `${modelo} · ${puffs.toLocaleString("es-AR")} puffs`
      : modelo;
    if (navigator.share) {
      navigator.share({ title: `${modelo} — The North Shop`, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.38, ease: "easeOut", delay },
  });

  return (
    <main className="catalogo">
      <div className="container">

        {/* Topbar */}
        <div className="detail-topbar">
          <button className="chip back-btn" onClick={() => navigate(-1)}>← Volver</button>
          <button className="chip share-btn" onClick={handleShare} aria-label="Compartir modelo">
            <Share2 size={14} />
            <span>Compartir</span>
          </button>
        </div>

        {/* Hero card: imagen + info */}
        <motion.div className="detail-card" {...fadeUp(0)}>

          {/* Imagen */}
          <motion.div
            className="detail-image-wrap"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="detail-img-box">
              <ModelImage modelo={modelo} />
            </div>
          </motion.div>

          {/* Info */}
          <div className="detail-info">
            <motion.h1 className="detail-model-name" {...fadeUp(0.08)}>
              {modelo}
            </motion.h1>

            <motion.div className="detail-spec-row" {...fadeUp(0.14)}>
              {puffs && (
                <span className="detail-spec-pill">
                  {puffs.toLocaleString("es-AR")} puffs
                </span>
              )}
              {ml && (
                <span className="detail-spec-pill">{ml} ml</span>
              )}
              {sucursalName && (
                <span className="detail-sucursal-pill">{sucursalName}</span>
              )}
            </motion.div>

            {chips.length > 0 && (
              <motion.div className="detail-chips" {...fadeUp(0.2)}>
                {chips.map((c) => (
                  <span className="badge" key={c}>{c}</span>
                ))}
              </motion.div>
            )}

            {desc && (
              <motion.p className="detail-desc" {...fadeUp(0.24)}>
                {desc}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Sección gustos */}
        <motion.div className="detail-flavors-section" {...fadeUp(0.18)}>
          <p className="detail-flavors-header">
            Gustos disponibles
            {gustos.length > 0 && (
              <span className="detail-flavor-count">{gustos.length}</span>
            )}
          </p>

          {loading ? (
            <div className="sk" style={{ height: 44 }} />
          ) : gustos.length ? (
            <ul className="flavor-list">
              {gustos.map((g, i) => (
                <motion.li
                  className="flavor-item"
                  key={g.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.22 + i * 0.04 }}
                >
                  <a
                    className="detail-flavor-link"
                    href={buildWaUrl({ modelo, gusto: g.gusto, puffs, sucursal: sucursalName, sucursalId, phone: sucursalPhone })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* WhatsApp icon SVG */}
                    <svg className="detail-wa-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {g.gusto}
                  </a>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="sub" style={{ margin: 0 }}>Sin datos de sabores para esta sucursal.</p>
          )}
        </motion.div>

      </div>
    </main>
  );
}

ModelDetalle.propTypes = {
  // sin props propias — todo viene de useParams y location.state
};
