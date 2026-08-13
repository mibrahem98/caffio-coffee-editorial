import { useEffect } from "react";
import type { CoffeeProduct, Lang } from "@/lib/mizanCatalog";

const DEFAULT_TITLE = "Caffio Coffee — Specialty Roasters";
const DEFAULT_DESCRIPTION = "Caffio — specialty coffee shaped by craft, calm rituals, and warm precision.";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=88";

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let node = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    node.dataset.caffioMeta = "true";
    document.head.appendChild(node);
  }
  node.content = content;
}

function setLink(rel: string, href: string) {
  let node = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-caffio-meta="true"]`);
  if (!node) {
    node = document.createElement("link");
    node.rel = rel;
    node.dataset.caffioMeta = "true";
    document.head.appendChild(node);
  }
  node.href = href;
}

export default function PageMeta({ product, lang }: { product?: CoffeeProduct; lang?: Lang }) {
  useEffect(() => {
    const isArabic = lang === "ar";
    const title = product ? `${product.name[lang || "en"]} · Caffio Coffee` : DEFAULT_TITLE;
    const description = product
      ? `${product.shortName[lang || "en"]} — ${product.profile[lang || "en"]}. Caffio product record with origin, process, brew cues, and source status.`
      : DEFAULT_DESCRIPTION;
    const url = `${window.location.origin}${product ? `/coffee/${product.id}` : "/"}`;
    const image = product?.image || DEFAULT_IMAGE;
    const imageAlt = product ? `${product.shortName[lang || "en"]} coffee by Caffio` : "Caffio specialty coffee ritual";

    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", url);
    setMeta("property", "og:site_name", "Caffio Coffee");
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
    setMeta("property", "og:image:alt", imageAlt);
    setMeta("property", "og:locale", isArabic ? "ar_AR" : "en_US");
    setMeta("property", "og:locale:alternate", isArabic ? "en_US" : "ar_AR");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
    setLink("canonical", url);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta("name", "description", DEFAULT_DESCRIPTION);
    };
  }, [lang, product]);

  return null;
}
