import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollMotion() {
  const [location] = useLocation();

  useEffect(() => {
    const selector = "section, .hero-signal, .principle-grid article, .product-tile, .notes-grid article, .faq-item, .field-article, .batch-card, .profile-column, .share-product, .reflection-showcase-card";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const observer = !reduceMotion && "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }) : null;

    const prepareReveals = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
      elements.forEach((element, index) => {
        if (element.classList.contains("mizan-hero") || element.classList.contains("reveal-on-scroll")) return;
        element.classList.add("reveal-on-scroll");
        element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 45}ms`);
        if (reduceMotion || !observer) element.classList.add("is-visible");
        else observer.observe(element);
      });
    };

    const schedulePrepare = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(prepareReveals);
    };

    const mutations = new MutationObserver(schedulePrepare);
    mutations.observe(document.body, { childList: true, subtree: true });
    schedulePrepare();

    return () => {
      window.cancelAnimationFrame(frame);
      mutations.disconnect();
      observer?.disconnect();
    };
  }, [location]);

  return null;
}
