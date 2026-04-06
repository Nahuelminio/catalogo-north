import axios from "../utils/axiosInstance";

// GET productos
export async function fetchProductos() {
  const { data } = await axios.get("/api/productos");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.rows)) return data.rows;
  return [];
}
