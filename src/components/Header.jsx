import { NavLink } from "react-router-dom";
import "../css/Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand">
          <img className="logo-full" src="/logo.png" alt="The North Shop" />
          <img className="logo-icon" src="/logo2.png" alt="The North Shop" />
        </NavLink>

        <nav className="header-nav" aria-label="Navegación principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "header-link" + (isActive ? " header-link--active" : "")
            }
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/ayuda"
            className={({ isActive }) =>
              "header-link" + (isActive ? " header-link--active" : "")
            }
          >
            Consejos y cuidados
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
