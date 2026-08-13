import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollMotion() {
  const [location] = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>("section, .product-tile, .notes-grid article, .field-article, .batch-card, .profile-column, .share-product"));
      elements.forEach((element, index) => {
        if (element.classList.contains("mizan-hero")) return;
        element.classList.add("reveal-on-scroll");
        element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 45}ms`);
      });

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || !("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
      elements.forEach((element) => observer.observe(element));
      return () => observer.disconnect();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location]);

  return null;
}
