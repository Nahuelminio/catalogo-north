import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import PropTypes from "prop-types";

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <Search className="search-icon" size={15} aria-hidden="true" />
      <input
        className="search-input"
        type="search"
        placeholder="Buscar modelo o gusto…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar en el catálogo"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <AnimatePresence>
        {value && (
          <motion.button
            className="search-clear"
            onClick={() => onChange("")}
            aria-label="Limpiar búsqueda"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
          >
            <X size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
