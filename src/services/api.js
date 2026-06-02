import { api } from "../api/client";

export async function fetchProductos() {
  const { data } = await api.get("/api/productos");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.rows)) return data.rows;
  return [];
}
