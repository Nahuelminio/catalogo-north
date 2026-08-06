import { useEffect, useState } from "react";
import { api } from "../api/client";

/**
 * Carta de shishas del bar. Precios y sabores salen del sistema de stock, así
 * que se actualizan solos cuando el admin los cambia.
 */
export default function useShishas() {
  const [carta, setCarta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();

    api
      .get("/public/shishas", { signal: ctrl.signal })
      .then((r) => setCarta(r.data))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED" && err.name !== "CanceledError")
          setErrorMsg(err.message || "No se pudo cargar la carta.");
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, []);

  return { carta, loading, errorMsg };
}
