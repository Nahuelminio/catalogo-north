// src/components/ToolbarChipsBrook.jsx
import React, { useRef } from "react";
import useHScrollDrag from "../hooks/useHScrollDrag";
import useStickyShadow from "../hooks/useStickyShadow";

export default function ToolbarChipsBrook({
  sucursales,
  sucursalId,
  onSelect,
}) {
  const ref = useRef(null);
  useHScrollDrag(ref);
  useStickyShadow(ref);

  return (
    <nav className="toolbarBrook center" ref={ref} aria-label="Sucursales">
      {sucursales.map((s) => (
        <button
          key={s.id}
          title={s.nombre}
          className={`chip_brook ${
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
