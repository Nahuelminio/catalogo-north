// src/hooks/useHScrollDrag.js
import { useEffect } from "react";

export default function useHScrollDrag(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    let isDown = false,
      startX = 0,
      startLeft = 0,
      dragged = false;
    const THRESH = 3;

    const onPointerDown = (e) => {
      isDown = true;
      dragged = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add("dragging");
    };
    const onPointerMove = (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > THRESH) dragged = true;
      el.scrollLeft = startLeft - dx;
    };
    const onPointerUp = () => {
      isDown = false;
      el.classList.remove("dragging");
      setTimeout(() => (dragged = false), 0);
    };
    const onClickCapture = (e) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [ref]);
}
