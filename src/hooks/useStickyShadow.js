// src/hooks/useStickyShadow.js
import { useEffect } from "react";

export default function useStickyShadow(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => el.toggleAttribute("data-sticky", !e.isIntersecting),
      { rootMargin: "-1px 0px 0px 0px", threshold: 1 }
    );
    const sentinel = document.createElement("div");
    sentinel.style.height = "1px";
    sentinel.style.marginTop = "-1px";
    el.parentElement?.insertBefore(sentinel, el);
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, [ref]);
}
