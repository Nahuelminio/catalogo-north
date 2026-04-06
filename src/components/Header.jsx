import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header
      className="site-header"
      style={{
        padding: "12px 0",
      }}
    >
      <div
        className="container nav-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          className="brand"
          style={{
            fontWeight: 800,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <img className="img-2" src="/logo.png" alt="" />
          <img className="img-3" src="/logo2.png" alt="" />
        </Link>
        <nav className="nav" style={{ display: "flex", gap: 12 }}>
          <Link
            className="a-header"
            to="/catalogo"
            style={{ color: "inherit" }}
          >
            Catálogo
          </Link>
          <Link className="a-header" to="/ayuda" style={{ color: "inherit" }}>
            Consejos y cuidados
          </Link>
         
        </nav>
      </div>
    </header>
  );
}
