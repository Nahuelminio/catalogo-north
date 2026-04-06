// src/components/BrandCarousel.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ModelCard from "./ModelCard";

export default function BrandCarousel({
  brand,
  items = [],
  sucursalName,
  sucursalId,
}) {
  return (
    <section className="brand-block">
      <header className="brand-head">
        <h3 className="brand-title">{brand}</h3>
      </header>

      <Swiper
        spaceBetween={20}
        slidesPerView="auto"
        centeredSlides={false}
        grabCursor
      >
        {items.map((g) => (
          <SwiperSlide
            key={`${g.modelo}-${g.puffs || g.ml || "na"}`} // ✅ key
            className="slide-fixed" // ✅ ancho por CSS
          >
            <ModelCard
              grupo={g}
              sucursalName={sucursalName}
              sucursalId={sucursalId}
              compact
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
