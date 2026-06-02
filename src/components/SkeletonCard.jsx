import React from "react";

function SkeletonCard() {
  return (
    <div className="group-card sk-card" aria-hidden="true">
      <div className="sk sk-media" />
      <div className="sk" style={{ height: 26, width: "55%" }} />
      <div className="sk" style={{ height: 16, width: "75%" }} />
      <div className="sk" style={{ height: 44 }} />
    </div>
  );
}

export default React.memo(SkeletonCard);
