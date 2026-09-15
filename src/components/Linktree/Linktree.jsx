import React, { useState } from "react";
import { motion } from "framer-motion";
import LinkButton from "./LinkButton";
import "./linktree.css";
import FormasPagoModal from "./FormasPagoModal";

// Íconos Lucide
import { Instagram, Phone, Globe, CreditCard, Store, ShoppingBag, Flame } from "lucide-react";

// Un solo lugar para los números: si cambia uno, se cambia acá.
const WA = (numero) => `https://wa.me/${numero}`;
const WA_PRINCIPAL = "5493764202408";

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

  // Los 12 puntos de venta activos, con los nombres que se usan de cara al
  // cliente (los mismos del linktree de Instagram). Se sacaron Maluh, que
  // ahora es Fagu Drink Bar, y Brickell, que dejó de operar.
  const sucursales = [
    { icon: Store, label: "Itaembé Guazú",                  url: WA("5493764939556") },
    { icon: Store, label: "Itaembé Guazú - Fagu Drink Bar", url: WA("5493764939556") },
    { icon: Store, label: "Santo Tomé",                     url: WA("5493764185019") },
    { icon: Store, label: "Santa Ana",                      url: WA("5493764170673") },
    { icon: Store, label: "Garupá",                         url: WA("5493764357807") },
    { icon: Store, label: "Posadas - Villa Cabello",        url: WA("5493764830712") },
    { icon: Store, label: "Posadas - Zoe Tec",              url: WA("5493764653102") },
    { icon: Store, label: "Posadas - Chacabuco 5742",       url: WA("5493764103171") },
    { icon: Store, label: "Posadas - Centro",               url: WA("5493764202408") },
    { icon: Store, label: "Posadas - Brown y las Heras",    url: WA("5493764757290") },
    { icon: Store, label: "Posadas - Matti Segovia Barber", url: WA("5493764637342") },
    { icon: Store, label: "Weekend Bebidas",                url: WA("5493764905547") },
  ];

  const info = [
    { icon: ShoppingBag, label: "Catálogo de vapes", url: "https://thenorthshop.net/" },
    { icon: Flame, label: "Carta de shishas", url: "https://thenorthshop.net/shishas" },
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
