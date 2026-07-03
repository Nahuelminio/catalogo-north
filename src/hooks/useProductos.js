import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { extractMl, extractPuffs, splitModeloGusto } from "../utils/model";

export default function useProductos(sucursalId) {
  const [productos, setProductos] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [errorMsg,  setErrorMsg]  = useState("");

  const fetchData = (sucursalId, signal, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    return api
      .get("/public/productos", {
        params: { sucursal_id: sucursalId, inStock: 1 },
        signal,
      })
      .then((r) => setProductos(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED" && err.name !== "CanceledError")
          setErrorMsg(err.message || "No se pudo cargar el catálogo.");
      })
      .finally(() => { if (!isRefresh) setLoading(false); });
  };

  useEffect(() => {
    if (!sucursalId) return;

    const controller = new AbortController();
    setErrorMsg("");
    setProductos([]);
    fetchData(sucursalId, controller.signal);

    // Auto-refresh silencioso cada 3 minutos
    const interval = setInterval(() => {
      const ctrl = new AbortController();
      fetchData(sucursalId, ctrl.signal, true);
    }, 3 * 60 * 1000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [sucursalId]); // eslint-disable-line react-hooks/exhaustive-deps

  const grupos = useMemo(() => {
    const map = new Map();
    for (const p of productos) {
      const { modelo, gusto } = splitModeloGusto(p.nombre);
      const key   = (modelo || "").toLowerCase().trim();
      const puffs = extractPuffs(p.nombre);
      const ml    = extractMl(p.nombre);

      if (!map.has(key))
        map.set(key, { modelo, puffs: puffs || null, ml: ml || null, gustos: [] });

      const g = map.get(key);
      if (!g.puffs && puffs) g.puffs = puffs;
      if (!g.ml    && ml)    g.ml    = ml;
      g.gustos.push({
        id:     p.id,
        gusto:  gusto || "Sin gusto",
        precio: p.precio ?? null,
        stock:  p.stock  ?? 0,
      });
    }

    return [...map.values()]
      .map((g) => ({ ...g, gustos: g.gustos.sort((a, b) => a.gusto.localeCompare(b.gusto)) }))
      .sort((a, b) => a.modelo.localeCompare(b.modelo));
  }, [productos]);

  return { grupos, loading, errorMsg };
}
