import React from "react";
import { motion } from "framer-motion";
import { X, DollarSign, Bitcoin, Wallet, Landmark } from "lucide-react";
import "./formasPagoModal.css";

export default function FormasPagoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <motion.div
      className="fp-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="fp-modal"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Cerrar */}
        <button className="fp-close" onClick={onClose}>
          <X size={22} />
        </button>

        <h2 className="fp-title">Formas de Pago</h2>

        <div className="fp-item">
          <DollarSign size={26} />
          <span>USD — Efectivo</span>
        </div>

        <div className="fp-item">
          <Wallet size={26} />
          <span>Pesos — Efectivo / Transferencia </span>
        </div>

        <div className="fp-item">
          <Bitcoin size={26} />
          <span>Crypto — USDT / USDC / BTC / ETH</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
