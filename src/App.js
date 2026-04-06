import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Catalogo from "./pages/Catalogo";
import Ayuda from "./pages/Ayuda";

import Contacto from "./pages/Contacto";
import CatalogoBrook from "./pages/CatalogoBrook";
import LayoutSinHeader from "./components/LayoutSinHeader";
import Linktree from "./components/Linktree/Linktree";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Catalogo />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/Cuidar tu Pod" element={<Contacto />} />
        <Route path="/linktree" element={<Linktree />} />

        <Route path="*" element={<Catalogo />} />
        <Route path="*" element={<Catalogo />} />
      </Route>
      <Route element={<LayoutSinHeader />}>
        <Route path="/CatalogoBrook" element={<CatalogoBrook />} />
      </Route>
    </Routes>
  );
}
