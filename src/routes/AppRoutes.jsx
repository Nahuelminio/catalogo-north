// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import LayoutSinHeader from "../components/LayoutSinHeader";

import Catalogo from "../pages/Catalogo";
import Ayuda from "../pages/Ayuda";
import Contacto from "../pages/Contacto";
import CatalogoBrook from "../pages/CatalogoBrook";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🧩 Rutas con Header/Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Catalogo />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/Cuidar tu pod" element={<Contacto />} />
        <Route path="/contacto" element={<Contacto />} />
      </Route>

      {/* 🌟 Ruta sin Header/Footer */}
      <Route element={<LayoutSinHeader />}>
        <Route path="/CatalogoBrook" element={<CatalogoBrook />} />
      </Route>
    </Routes>
  );
}
