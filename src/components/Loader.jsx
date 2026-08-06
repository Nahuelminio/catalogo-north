import React from "react";

export default function Loader() {
  return (
    <div className="dot-spinner">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="dot-spinner__dot" />
      ))}
    </div>
  );
}
