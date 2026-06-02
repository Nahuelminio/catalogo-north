import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { SUCURSAL_WA_LINKS } from "../config";

export default function useSucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [sucursalId, setSucursalIdState] = useState(
    localStorage.getItem("sucursalId") || ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/public/sucursales")
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : [];
        setSucursales(list);

        const saved = localStorage.getItem("sucursalId");
        const hasSaved = list.some((x) => String(x.id) === String(saved));
        const initialId = hasSaved
          ? String(saved)
          : list[0]
          ? String(list[0].id)
          : "";

        if (initialId && initialId !== sucursalId) {
          setSucursalIdState(initialId);
          localStorage.setItem("sucursalId", initialId);
        }
        if (!list.length) setError("No hay sucursales disponibles.");
      })
      .catch((err) =>
        setError(err.message || "No se pudieron cargar las sucursales.")
      );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sucursalName = useMemo(() => {
    const s = sucursales.find((x) => String(x.id) === String(sucursalId));
    if (!s) return "";
    return s.apodo || s.nombre || s.nombre_real || "";
  }, [sucursales, sucursalId]);

  const sucursalPhone = useMemo(() => {
    const s = sucursales.find((x) => String(x.id) === String(sucursalId));
    // Solo usamos el teléfono si la sucursal no tiene un link directo en el mapa
    const hasLink = Boolean(SUCURSAL_WA_LINKS[String(sucursalId)]);
    if (hasLink) return ""; // buildWaUrl usará el link del mapa
    if (s?.telefono) return String(s.telefono).replace(/[^\d]/g, "");
    return "";
  }, [sucursales, sucursalId]);

  const select = (id) => {
    setSucursalIdState(String(id));
    localStorage.setItem("sucursalId", String(id));
  };

  return { sucursales, sucursalId, setSucursalId: select, sucursalName, sucursalPhone, error };
}
