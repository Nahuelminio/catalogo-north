import { useParams } from "react-router-dom";
import Catalogo from "./Catalogo";

/**
 * /punto/:slug — el link del QR que se deja en cada punto de venta.
 * Muestra solo el stock de esa sucursal. Acepta el slug del nombre
 * ("weekend-bebidas") o el id ("16").
 */
export default function CatalogoPunto() {
  const { slug } = useParams();
  // key: si cambia el punto sin recargar, el catálogo arranca de cero
  return <Catalogo key={slug} fija={slug} />;
}
