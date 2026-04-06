// src/layouts/LayoutSinHeader.jsx
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

export default function LayoutSinHeader() {
  return (
    <div className="full-page">
      <Outlet />
      <Footer />
    </div>
  );
}
