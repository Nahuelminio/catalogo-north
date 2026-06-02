import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { extractMl, extractPuffs, splitModeloGusto } from "../utils/model";

export default function useProductos(sucursalId) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sucursalId) return;
    setErrorMsg("");
    setProductos([]);
    setLoading(true);

    api
      .get("/public/productos", {
        params: { sucursal_id: sucursalId, inStock: 1 },
      })
      .then((r) => setProductos(Array.isArray(r.data) ? r.data : []))
      .catch((err) =>
        setErrorMsg(err.message || "No se pudo cargar el catálogo.")
      )
      .finally(() => setLoading(false));
  }, [sucursalId]);

  const grupos = useMemo(() => {
    const map = new Map();
    for (const p of productos) {
      const { modelo, gusto } = splitModeloGusto(p.nombre);
      const key = (modelo || "").toLowerCase().trim();
      const puffs = extractPuffs(p.nombre);
      const ml = extractMl(p.nombre);

      if (!map.has(key))
        map.set(key, { modelo, puffs: puffs || null, ml: ml || null, gustos: [] });

      const g = map.get(key);
      if (!g.puffs && puffs) g.puffs = puffs;
      if (!g.ml && ml) g.ml = ml;
      g.gustos.push({ id: p.id, gusto: gusto || "Sin gusto", precio: p.precio ?? null, stock: p.stock ?? 0 });
    }

    return [...map.values()]
      .map((g) => ({
        ...g,
        gustos: g.gustos.sort((a, b) => a.gusto.localeCompare(b.gusto)),
      }))
      .sort((a, b) => a.modelo.localeCompare(b.modelo));
  }, [productos]);

  return { grupos, loading, errorMsg };
}
