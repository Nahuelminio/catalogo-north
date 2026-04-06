// src/components/FooterBrook.jsx
import React from "react";
import "../css/MenuBrook.css";

export default function FooterBrook({
  img1 = "/img/footer-1.jpg",
  img2 = "/img/footer-2.jpg",
  alt1 = "Foto 1",
  alt2 = "Foto 2",
}) {
  return (
    <footer className="footer-photos">
      <div className="footer-photos__inner">
        <img
          src={img1}
          alt={alt1}
          loading="lazy"
          className="footer-photos__img"
        />
        <img
          src={img2}
          alt={alt2}
          loading="lazy"
          className="footer-photos__img"
        />
      </div>
    </footer>
  );
}
