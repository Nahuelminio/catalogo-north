import React, { useRef } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import useHScrollDrag from "../hooks/useHScrollDrag";
import useStickyShadow from "../hooks/useStickyShadow";

ToolbarChips.propTypes = {
  sucursales: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.any, nombre: PropTypes.string })
  ).isRequired,
  sucursalId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func.isRequired,
};

export default function ToolbarChips({ sucursales, sucursalId, onSelect }) {
  const ref = useRef(null);
  useHScrollDrag(ref);
  useStickyShadow(ref);

  return (
    <nav className="toolbar" ref={ref} aria-label="Sucursales">
      {sucursales.map((s, i) => (
        <motion.button
          key={s.id}
          className={`chip ${
            String(s.id) === String(sucursalId) ? "is-active" : ""
          }`}
          onClick={() => onSelect(s.id)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22, delay: i * 0.045, ease: "easeOut" }}
          whileTap={{ scale: 0.94, transition: { duration: 0.08 } }}
        >
          {s.nombre}
        </motion.button>
      ))}
    </nav>
  );
}
