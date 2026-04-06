// src/components/ToolbarChips.jsx
import React, { useRef } from "react";
import useHScrollDrag from "../hooks/useHScrollDrag";
import useStickyShadow from "../hooks/useStickyShadow";

export default function ToolbarChips({ sucursales, sucursalId, onSelect }) {
  const ref = useRef(null);
  useHScrollDrag(ref);
  useStickyShadow(ref);

  return (
    <nav className="toolbar" ref={ref} aria-label="Sucursales">
      {sucursales.map((s) => (
        <button
          key={s.id}
          className={`chip ${
            String(s.id) === String(sucursalId) ? "is-active" : ""
          }`}
          onClick={() => onSelect(s.id)}
        >
          {s.nombre}
        </button>
      ))}
    </nav>
  );
}
