export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer simple">
      <div className="simple-bottom">
        <div className="container simple-bottom-row">
          <small className="sub">
            © {year} North. Todos los derechos reservados.
          </small>
          <small className="sub hint">
            Algunos productos pueden contener nicotina. Mantener fuera del
            alcance de menores.
          </small>
        </div>
      </div>
    </footer>
  );
}
