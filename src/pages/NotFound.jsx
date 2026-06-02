import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  useEffect(() => {
    document.title = "Página no encontrada — The North Shop";
    return () => { document.title = "The North Shop — Catálogo de pods"; };
  }, []);

  return (
    <main className="not-found-page">
      <motion.div
        className="not-found-inner"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.p
          className="not-found-code"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          404
        </motion.p>
        <motion.p
          className="not-found-msg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          Esta página no existe.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.35 }}
        >
          <Link to="/" className="not-found-btn">
            Volver al catálogo
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
