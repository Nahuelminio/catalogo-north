import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { SUCURSAL_WA_LINKS } from "../config";

/** Slug de una sucursal para el link fijo: "Weekend Bebidas" → "weekend-bebidas". */
export const slugSucursal = (s = "") =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * @param {string} [fija] Slug o id de una sucursal. Si viene, el catálogo queda
 *   clavado en esa (el link del QR de cada punto) y no se ofrece cambiarla.
 */
export default function useSucursales(fija) {
  const [sucursales, setSucursales] = useState([]);
  // Con sucursal fija no se arranca de la guardada: mostraría por un instante
  // el stock de otro punto mientras carga la lista.
  const [sucursalId, setSucursalIdState] = useState(
    fija ? "" : localStorage.getItem("sucursalId") || ""
  );
  const [noEncontrada, setNoEncontrada] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/public/sucursales")
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : [];
        setSucursales(list);

        if (fija) {
          const buscada = slugSucursal(fija);
          const s = list.find(
            (x) =>
              String(x.id) === String(fija) ||
              [x.nombre_real, x.apodo, x.nombre].some(
                (n) => n && slugSucursal(n) === buscada
              )
          );
          if (s) {
            setSucursalIdState(String(s.id));
            // Se guarda para que el detalle del modelo, si lo recargan, siga
            // mostrando el stock de este punto
            localStorage.setItem("sucursalId", String(s.id));
          } else {
            setNoEncontrada(true);
          }
          return;
        }

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
  }, [fija]); // eslint-disable-line react-hooks/exhaustive-deps

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

  return { sucursales, sucursalId, setSucursalId: select, sucursalName, sucursalPhone, noEncontrada, error };
}
