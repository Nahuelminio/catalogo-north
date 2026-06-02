import React from "react";
import PropTypes from "prop-types";

// variant="north" → puntos rojos (catálogo principal)
// variant="brook" → puntos estilo Brook
export default function Loader({ variant = "north" }) {
  const dotClass =
    variant === "brook" ? "dot-spinner__dotBrook" : "dot-spinner__dot";

  return (
    <div className="dot-spinner">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={dotClass} />
      ))}
    </div>
  );
}

Loader.propTypes = {
  variant: PropTypes.oneOf(["north", "brook"]),
};
