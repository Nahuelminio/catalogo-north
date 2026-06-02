import React, { useEffect, useState } from "react";
import Toast from "../components/Toast";
import { api } from "../api/client";
import { API_BASE } from "../config";

const N8N_WEBHOOK = process.env.REACT_APP_N8N_LEADS_WEBHOOK || "";

export default function Contacto() {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [ok, setOk] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });
  const showToast = (msg, type = "success") =>
    setToast({ open: true, msg, type });

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    sucursal: "",
    nota: "",
    acepta: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = "North Community — The North Shop";
    return () => { document.title = "The North Shop — Catálogo de pods"; };
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/public/sucursales`)
      .then((r) => r.json())
      .then((data) => setSucursales(Array.isArray(data) ? data : []))
      .catch(() => setSucursales([]));
  }, []);

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresá tu nombre";
    const tel = String(form.telefono || "").replace(/[^\d+]/g, "");
    if (tel.length < 8) e.telefono = "Ingresá un WhatsApp válido";
    if (!form.acepta) e.acepta = "Necesitamos tu consentimiento para sumarte";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setServerMsg("");
    setOk(false);
    if (!validate()) return;

    setLoading(true);
    try {
      // 1) guardar en tu backend
      await api.post("/public/clientes", {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        sucursal: form.sucursal || "",
        nota: form.nota?.trim() || "",
        acepta: form.acepta ? 1 : 0,
        source: "web",
      });

      // 2) opcional → n8n
      if (N8N_WEBHOOK) {
        fetch(N8N_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, source: "web" }),
        }).catch(() => {});
      }

      // 3) confirmación
      setOk(true);
      const msg =
        "¡Listo! Te sumamos a North Community. En breve te llega el link del grupo.";
      setServerMsg(msg);
      showToast(msg, "success");

      // UX mobile: subir al top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // reset suave
      setForm({
        nombre: "",
        telefono: "",
        sucursal: "",
        nota: "",
        acepta: false,
      });
      setErrors({});
    } catch (err) {
      const msg = "No pudimos enviar ahora. Probá nuevamente en unos minutos.";
      setServerMsg(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="community">
      <div className="container">
        <h1 className="page-title">North Community</h1>
        <p className="page-sub">
          Ofertas, sorteos y lo más nuevo. Unite a nuestra comunidad exclusiva.
        </p>

        {/* Banners (seguí usándolos si querés en desktop) */}
        {ok && (
          <div
            className="alert success"
            role="status"
            style={{ marginBottom: 16 }}
          >
            {serverMsg}
          </div>
        )}
        {!ok && serverMsg && (
          <div className="alert warn" role="alert" style={{ marginBottom: 16 }}>
            {serverMsg}
          </div>
        )}

        <section className="community-card">
          <h2 className="community-title">Sumarme a la comunidad</h2>
          <p className="community-text">
            Completá este formulario y nos encargamos de agregarte al grupo.
          </p>

          <form className="community-form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                placeholder="Cómo te llamás"
                value={form.nombre}
                onChange={onChange}
                aria-invalid={!!errors.nombre}
              />
              {errors.nombre && <p className="field-err">{errors.nombre}</p>}
            </div>

            <div className="field">
              <label>WhatsApp *</label>
              <input
                type="tel"
                name="telefono"
                placeholder="+54 9 376 123 4567"
                value={form.telefono}
                onChange={onChange}
                aria-invalid={!!errors.telefono}
              />
              {errors.telefono && (
                <p className="field-err">{errors.telefono}</p>
              )}
            </div>

            <div className="field">
              <label>Sucursal</label>
              <select name="sucursal" value={form.sucursal} onChange={onChange}>
                <option value="">Seleccioná (opcional)</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.nombre}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Nota (opcional)</label>
              <textarea
                name="nota"
                rows={3}
                placeholder="Ej.: prefiero sabores frutales"
                value={form.nota}
                onChange={onChange}
              />
            </div>

            <div className="field checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acepta"
                  checked={form.acepta}
                  onChange={onChange}
                />
                <span>
                  Acepto recibir beneficios exclusivos y novedades de{" "}
                  <b>North Community</b>.
                </span>
              </label>
              {errors.acepta && <p className="field-err">{errors.acepta}</p>}
              <p className="hint sub">
                Enviamos pocos mensajes y siempre podés salirte del grupo.
              </p>
            </div>

            <div className="actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading
                  ? "Enviando..."
                  : "Quiero ser parte de North Community"}
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Toast flotante (mobile + desktop) */}
      <Toast
        open={toast.open}
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </main>
  );
}
