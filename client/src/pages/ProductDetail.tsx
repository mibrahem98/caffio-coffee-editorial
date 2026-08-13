import { ArrowLeft, ArrowUpRight, CheckCircle2, Coffee, Compass, FileCheck2, Heart, Leaf, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";
import BatchRecordCard from "@/components/BatchRecordCard";
import ShareProduct from "@/components/ShareProduct";
import MizanHeader from "@/components/MizanHeader";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { coffeeProducts, formatPrice, getCoffeeProduct, type Lang } from "@/lib/mizanCatalog";

const copy = {
  en: { back: "Back to collection", record: "Product record / working draft", status: "Content status", origin: "Origin", farm: "Farm / producer", process: "Process", altitude: "Altitude", roast: "Roast profile", tasting: "Tasting cues", brew: "Suggested brew methods", source: "Audit note", sourceBody: "The fields below remain marked as pending until a producer document, batch card, or cupping sheet is attached to the project source registry.", reviewEyebrow: "Customer notes / verified only", reviewTitle: "No reviews published yet.", reviewBody: "Verified customer feedback will appear here once it is collected and approved. MIZAN does not publish placeholder ratings or invented testimonials.", reviewAction: "How reviews will be added", related: "Continue through the collection", add: "Add to cart", added: "Added to your coffee cart.", favorite: "Save this coffee", saved: "Saved to your coffees.", demoPrice: "Demo price" },
  ar: { back: "العودة إلى المجموعة", record: "سجل المنتج / مسودة عمل", status: "حالة المحتوى", origin: "المنشأ", farm: "المزرعة / المنتج", process: "المعالجة", altitude: "الارتفاع", roast: "ملف التحميص", tasting: "إيحاءات التذوق", brew: "طرق التحضير المقترحة", source: "ملاحظة التدقيق", sourceBody: "تبقى الحقول التالية موسومة بأنها قيد التوثيق حتى إرفاق مستند منتج أو بطاقة دفعة أو بطاقة تذوق في سجل المصادر.", reviewEyebrow: "ملاحظات العملاء / موثقة فقط", reviewTitle: "لا توجد مراجعات منشورة بعد.", reviewBody: "ستظهر ملاحظات العملاء الموثقة بعد جمعها واعتمادها. لا تنشر ميزان تقييمات مؤقتة أو شهادات مختلقة.", reviewAction: "كيف ستضاف المراجعات؟", related: "تابع عبر المجموعة", add: "أضف إلى السلة", added: "تمت إضافة القهوة إلى سلتك.", favorite: "احفظ القهوة", saved: "تم حفظها في مفضلاتك.", demoPrice: "السعر التجريبي" },
};

export default function ProductDetail() {
  const [, params] = useRoute("/coffee/:id");
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("mizan-lang") as Lang) || "en");
  const product = getCoffeeProduct(params?.id || "alto");
  const t = copy[lang];
  const { add } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(product.id);

  const addProduct = () => { add(product.id); window.dispatchEvent(new CustomEvent("mizan:open-cart")); toast.success(t.added); };
  const toggleFavorite = () => { toggle(product.id); toast.success(favorite ? t.favorite : t.saved); };

  return <div className="mizan-site detail-site" dir={lang === "ar" ? "rtl" : "ltr"}>
    <MizanHeader lang={lang} onLangChange={setLang} home={false} />
    <CartDrawer lang={lang} />
    <main className="product-detail-main">
      <div className="detail-topbar"><Link href="/#collection"><ArrowLeft size={15} /> {t.back}</Link><span>{t.record}</span></div>
      <section className="detail-hero"><div className="detail-image"><img src={product.image} alt={`${product.shortName[lang]} coffee`} /><span className="detail-stamp"><span className="mizan-symbol" aria-hidden="true"><i /><b /><em /></span>MIZAN<br /><b>{product.id.toUpperCase()}</b></span></div><div className="detail-intro"><p className="eyebrow"><span className="eyebrow-dot" /> {product.status[lang]}</p><h1>{product.name[lang]}</h1><p className="detail-profile">{product.profile[lang]}</p><p className="detail-copy">{lang === "ar" ? "صفحة قابلة للتدقيق تجمع ما نعرفه عن المنتج وما ينتظر بطاقة الدفعة. استخدمها كنقطة بداية، لا كبديل عن مستند المصدر." : "A product page that separates what is known from what still needs a batch record. Use it as a starting point, never as a substitute for source documentation."}</p><div className="detail-actions"><button className="button button-gold" onClick={addProduct}>{t.add}<ShoppingBag size={15} /></button><button className={favorite ? "favorite-toggle is-saved" : "favorite-toggle"} onClick={toggleFavorite} aria-pressed={favorite} aria-label={t.favorite}><Heart size={15} fill={favorite ? "currentColor" : "none"} />{favorite ? t.saved : t.favorite}</button><span>{t.demoPrice} / {formatPrice(product.price, lang)} · {product.weight}</span></div></div></section>
      <ShareProduct product={product} lang={lang} />
      <section className="audit-section"><div className="audit-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.status}</p><h2>{lang === "ar" ? "بيانات المنتج" : "The product record"}</h2></div><FileCheck2 size={28} /></div><div className="audit-grid"><article><Compass size={18} /><span>{t.origin}</span><strong>{product.origin[lang]}</strong></article><article><Leaf size={18} /><span>{t.farm}</span><strong>{product.farm[lang]}</strong></article><article><Sparkles size={18} /><span>{t.process}</span><strong>{product.process[lang]}</strong></article><article><Coffee size={18} /><span>{t.altitude}</span><strong>{product.altitude[lang]}</strong></article><article><span className="roast-dot" /><span>{t.roast}</span><strong>{product.profile[lang]}</strong></article></div><div className="audit-callout"><FileCheck2 size={17} /><p><strong>{t.source}</strong>{t.sourceBody}<a href="/#story">{lang === "ar" ? "بروتوكول سجل المصادر ↗" : "Open the source protocol ↗"}</a></p></div><BatchRecordCard product={product} lang={lang} /></section>
      <section className="detail-notes"><div className="detail-notes-grid"><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.tasting}</p><h2>{lang === "ar" ? "ما الذي نبحث عنه؟" : "What we are looking for."}</h2><div className="tasting-list">{product.tastingNotes.map((note, index) => <span key={index}><i>0{index + 1}</i>{note[lang]}</span>)}</div></div><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.brew}</p><div className="brew-methods">{product.brewMethods.map((method) => <span key={method.en}>{method[lang]}<ArrowUpRight size={14} /></span>)}</div></div></div></section>
      <section className="review-section"><div className="review-badge"><CheckCircle2 size={19} /><span>{t.reviewEyebrow}</span></div><h2>{t.reviewTitle}</h2><p>{t.reviewBody}</p><button className="text-link" onClick={() => toast(t.reviewAction)}>{t.reviewAction}<ArrowUpRight size={15} /></button></section>
      <section className="related-section"><div className="section-intro"><span className="section-number">MORE</span><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.related}</p><h2>{lang === "ar" ? "قهوة أخرى" : "Another starting point."}</h2></div></div><div className="related-grid">{coffeeProducts.filter((item) => item.id !== product.id).map((item) => <Link key={item.id} href={`/coffee/${item.id}`} className="related-card"><img src={item.image} alt="" /><div><span>{item.shortName[lang]}</span><strong>{item.profile[lang]}</strong><ArrowUpRight size={15} /></div></Link>)}</div></section>
    </main>
    <footer className="mizan-footer"><span>MIZAN COFFEE / SPECIALTY ROASTERS</span><span>{lang === "ar" ? "توازن في كل كوب" : "BALANCE IN EVERY CUP"}</span><span>© 2026 / CONTENT STATUS: DEMO</span></footer>
  </div>;
}
