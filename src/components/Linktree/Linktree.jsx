import React, { useState } from "react";
import { motion } from "framer-motion";
import LinkButton from "./LinkButton";
import "./linktree.css";
import FormasPagoModal from "./FormasPagoModal";

// Íconos Lucide
import { Instagram, Phone, Globe, CreditCard, Store } from "lucide-react";

export default function Linktree() {
  const [openPago, setOpenPago] = useState(false);

  const redes = [
    {
      icon: Phone,
      label: "WhatsApp Principal",
      url: "https://walink.co/cca18a",
    },
    {
      icon: Instagram,
      label: "Instagram",
      url: "https://www.instagram.com/thenorthshop.arg/",
    },
  ];

  const sucursales = [
    {
      icon: Store,
      label: "North Santo Tomé",
      url: "https://bit.ly/TheNorthShop_ST",
    },
    {
      icon: Store,
      label: "North Itaembe Guazú",
      url: "https://walink.co/f98f4a",
    },
    { icon: Store, label: "North Maluh", url: "https://wa.link/5apw2u" },

    { icon: Store, label: "North Shop", url: "https://wa.link/16jfjm" },
    { icon: Store, label: "North Santa Ana", url: "https://wa.link/4svy66" },
    { icon: Store, label: "North Brickell", url: "https://walink.co/cca18a" },
    {
      icon: Store,
      label: "North Villa Cabello",
      url: "https://wa.link/x2vdvq",
    },
  ];

  const info = [
    { icon: Globe, label: "Sitio Web", url: "https://thenorthshop.net/" },
    {
      icon: CreditCard,
      label: "Formas de Pago",
      action: () => setOpenPago(true),
    },
  ];

  return (
    <motion.div
      className="lt-container glow-wrapper premium-shift"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* LOGO PREMIUM */}
      <motion.div
        className="lt-card lt-logo premium-logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        whileHover={{ scale: 1.06 }}
      >
        <img src="/img/logo/logoNorth.png" alt="Logo The North Shop" />
      </motion.div>

      {/* TÍTULO */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="premium-title"
      >
        @THENORTHSHOP.ARG
      </motion.h2>

      {/* SUBTÍTULO */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 1.1, delay: 0.3 }}
        className="lt-subtitle"
      >
        Seguinos en nuestras redes sociales
      </motion.p>

      <div className="lt-divider premium-divider"></div>

      {/* REDES */}
      {redes.map((r, i) => (
        <LinkButton
          key={i}
          icon={r.icon}
          label={r.label}
          url={r.url}
          delay={0.08 * i}
        />
      ))}

      <div className="lt-divider premium-divider"></div>

      {/* SUCURSALES */}
      <h3 className="lt-section premium-section">Sucursales</h3>

      {sucursales.map((s, i) => (
        <LinkButton
          key={i}
          icon={s.icon}
          label={s.label}
          url={s.url}
          delay={0.1 * i}
        />
      ))}

      <div className="lt-divider premium-divider"></div>

      {/* INFORMACIÓN */}
      <h3 className="lt-section premium-section">Más información</h3>

      {info.map((m, i) => (
        <LinkButton
          key={i}
          icon={m.icon}
          label={m.label}
          url={m.url}
          delay={0.07 * i}
          onClick={m.action}
        />
      ))}

      {/* MODAL */}
      <FormasPagoModal open={openPago} onClose={() => setOpenPago(false)} />
    </motion.div>
  );
}
