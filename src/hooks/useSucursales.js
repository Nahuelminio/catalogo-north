// src/hooks/useSucursales.js
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

export default function useSucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [sucursalId, setSucursalId] = useState(
    localStorage.getItem("sucursalId") || ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
  api
    .get("/public/sucursales")
    .then((r) => {
      console.log("Sucursales recibidas:", r.data); // 👈 agregá esto
      const list = Array.isArray(r.data) ? r.data : [];
      setSucursales(list);


        // restaurar selección previa si todavía existe
        const saved = localStorage.getItem("sucursalId");
        const hasSaved = list.some((x) => String(x.id) === String(saved));
        const initialId = hasSaved
          ? String(saved)
          : list[0]
          ? String(list[0].id)
          : "";
        if (initialId && initialId !== sucursalId) {
          setSucursalId(initialId);
          localStorage.setItem("sucursalId", initialId);
        }
        if (!list.length) setError("No hay sucursales disponibles.");
      })
      .catch(() => setError("No se pudieron cargar las sucursales."));
  }, []); // solo 1 vez al montar

  // 🟢 Ahora prioriza el alias (apodo) si existe
  const sucursalName = useMemo(() => {
    const s = sucursales.find((x) => String(x.id) === String(sucursalId));
    if (!s) return "";
    return s.apodo || s.nombre || s.nombre_real || "";
  }, [sucursales, sucursalId]);

  const select = (id) => {
    setSucursalId(String(id));
    localStorage.setItem("sucursalId", String(id));
  };

  return { sucursales, sucursalId, setSucursalId: select, sucursalName, error };
}
