import { Check, Copy, Facebook, Link2, Send, Share2 } from "lucide-react";
import { useState } from "react";
import type { CoffeeProduct, Lang } from "@/lib/mizanCatalog";

const copy = {
  en: { label: "Share this coffee", native: "Share", copy: "Copy link", copied: "Link copied", whatsapp: "WhatsApp", facebook: "Facebook", x: "X", error: "Copy the link from your browser to share it." },
  ar: { label: "شارك هذه القهوة", native: "مشاركة", copy: "نسخ الرابط", copied: "تم نسخ الرابط", whatsapp: "واتساب", facebook: "فيسبوك", x: "X", error: "انسخ الرابط من المتصفح لمشاركته." },
};

function getShareUrl(product: CoffeeProduct) {
  return `${window.location.origin}/coffee/${product.id}`;
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

export default function ShareProduct({ product, lang }: { product: CoffeeProduct; lang: Lang }) {
  const [copied, setCopied] = useState(false);
  const t = copy[lang];
  const url = getShareUrl(product);
  const title = product.name[lang];
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`${title} · Caffio Coffee`);

  const handleNativeShare = async () => {
    if (navigator.share) {
    await navigator.share({ title, text: `${title} · Caffio Coffee`, url });
      return;
    }
    const success = await copyToClipboard(url);
    setCopied(success);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const handleCopy = async () => {
    try {
      const success = await copyToClipboard(url);
      setCopied(success);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return <div className="share-product" aria-label={t.label}><div className="share-product-heading"><Share2 size={15} /><span>{t.label}</span></div><div className="share-product-actions"><button className="share-button share-native" onClick={handleNativeShare} aria-label={t.native}><Send size={14} />{t.native}</button><button className="share-button" onClick={handleCopy} aria-label={copied ? t.copied : t.copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? t.copied : t.copy}</button><a className="share-button" href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noreferrer" aria-label={t.whatsapp}><Link2 size={14} />{t.whatsapp}</a><a className="share-button" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer" aria-label={t.facebook}><Facebook size={14} />{t.facebook}</a><a className="share-button" href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noreferrer" aria-label={t.x}><span className="share-x-mark">𝕏</span>{t.x}</a></div><span className="share-product-hint">{lang === "ar" ? "مشاركة محلية عبر المتصفح / لا يتم إرسال بيانات إلى Caffio" : "Browser sharing only / no data is sent to Caffio"}</span></div>;
}
