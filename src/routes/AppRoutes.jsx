import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import LayoutSinHeader from "../components/LayoutSinHeader";

const Catalogo     = lazy(() => import("../pages/Catalogo"));
const Ayuda        = lazy(() => import("../pages/Ayuda"));
const Contacto     = lazy(() => import("../pages/Contacto"));
const CatalogoBrook = lazy(() => import("../pages/CatalogoBrook"));
const ModelDetalle = lazy(() => import("../pages/ModelDetalle"));
const Linktree     = lazy(() => import("../components/Linktree/Linktree"));
const NotFound     = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"          element={<Catalogo />} />
          <Route path="/ayuda"     element={<Ayuda />} />
          <Route path="/contacto"  element={<Contacto />} />
          <Route path="/modelo/:slug" element={<ModelDetalle />} />
          <Route path="*"          element={<NotFound />} />
        </Route>

        <Route element={<LayoutSinHeader />}>
          <Route path="/CatalogoBrook" element={<CatalogoBrook />} />
          <Route path="/linktree"      element={<Linktree />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
