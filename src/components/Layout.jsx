import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import Header from "./Header";
import Footer from "./Footer";
// dentro del JSX:

export default function Layout() {
  
  return (
    <div className="page-wrap">
      <ScrollToTop />
      <Header />
      {/* 🔽 Esto es CLAVE para que se rendericen las páginas hijas */}
      <main className="catalogo">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
