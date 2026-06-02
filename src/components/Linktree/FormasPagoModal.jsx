import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, DollarSign, Bitcoin, Wallet } from "lucide-react";
import "./formasPagoModal.css";

export default function FormasPagoModal({ open, onClose }) {
  const modalRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    first?.focus();

    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  if (!open) return null;

  return (
    <motion.div
      className="fp-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="fp-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fp-title"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="fp-close" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>

        <h2 className="fp-title" id="fp-title">Formas de Pago</h2>

        <div className="fp-item">
          <DollarSign size={24} />
          <span>USD — Efectivo</span>
        </div>
        <div className="fp-item">
          <Wallet size={24} />
          <span>Pesos — Efectivo / Transferencia</span>
        </div>
        <div className="fp-item">
          <Bitcoin size={24} />
          <span>Crypto — USDT / USDC / BTC / ETH</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
