import { ArrowLeft, ArrowUpRight, Check, Clock3, PackageCheck, RotateCcw, Truck } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import MizanHeader from "@/components/MizanHeader";
import CartDrawer from "@/components/CartDrawer";
import { getCartProducts, useCart } from "@/contexts/CartContext";
import { formatPrice, type Lang } from "@/lib/mizanCatalog";

const copy = {
  en: { eyebrow: "MIZAN / DEMO TRACKING", titleA: "Follow the", titleB: "small journey.", intro: "A local front-end simulation of what an order status could feel like. No carrier, address, payment, or shipment is connected.", empty: "No demo order yet.", emptyBody: "Complete the simulated checkout from the cart and the local timeline will appear here.", shop: "Explore the collection", order: "Demo order", created: "Created", total: "Demo total", timeline: "Status timeline", advance: "Advance simulation", done: "Simulation complete", reset: "Reset demo order", source: "Simulation only", sourceBody: "This page uses browser-local state. It does not create a real order or track a shipment.", received: "Order received", receivedBody: "The demo order was created in this browser.", roast: "Roast scheduled", roastBody: "A working status for the next roastery step.", packed: "Packed", packedBody: "A working status for preparation and handoff.", ready: "Ready for handoff", readyBody: "The demo timeline has reached its final state.", viewCoffee: "View coffee", noItems: "No saved line items" },
  ar: { eyebrow: "ميزان / تتبع تجريبي", titleA: "تابع", titleB: "الرحلة الصغيرة.", intro: "محاكاة أمامية محلية لما يمكن أن تبدو عليه حالة الطلب. لا توجد شركة شحن أو عنوان أو دفعة أو شحنة مرتبطة.", empty: "لا يوجد طلب تجريبي بعد.", emptyBody: "أتمم محاكاة الطلب من السلة وستظهر الرحلة المحلية هنا.", shop: "استكشف المجموعة", order: "الطلب التجريبي", created: "تاريخ الإنشاء", total: "الإجمالي التجريبي", timeline: "الخط الزمني للحالة", advance: "تقدم المحاكاة", done: "اكتملت المحاكاة", reset: "إعادة الطلب التجريبي", source: "محاكاة فقط", sourceBody: "تستخدم هذه الصفحة حالة محفوظة في المتصفح. لا تنشئ طلبًا حقيقيًا ولا تتتبع شحنة.", received: "تم استلام الطلب", receivedBody: "تم إنشاء الطلب التجريبي في هذا المتصفح.", roast: "جدولة التحميص", roastBody: "حالة عمل للخطوة التالية في المحمصة.", packed: "تم التجهيز", packedBody: "حالة عمل للتجهيز والتسليم.", ready: "جاهز للتسليم", readyBody: "وصل الخط الزمني التجريبي إلى حالته الأخيرة.", viewCoffee: "عرض القهوة", noItems: "لا توجد عناصر محفوظة" },
};

const icons = [Clock3, CoffeeIcon, PackageCheck, Truck];
function CoffeeIcon(props: { size?: number }) { return <span className="coffee-icon" aria-hidden="true"><CoffeeGlyph {...props} /></span>; }
function CoffeeGlyph({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9Z" /><path d="M16 11h2a2 2 0 0 1 0 4h-2M7 5c1 1 1 2 0 3M11 5c1 1 1 2 0 3" /></svg>; }

export default function OrderTracking() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("mizan-lang") as Lang) || "en");
  const { lastOrder, advanceOrder, clearOrder } = useCart();
  const [locationKey] = useState("tracking");
  const t = copy[lang];
  const products = lastOrder ? getCartProducts(lastOrder.items) : [];
  const statuses = [
    { title: t.received, body: t.receivedBody },
    { title: t.roast, body: t.roastBody },
    { title: t.packed, body: t.packedBody },
    { title: t.ready, body: t.readyBody },
  ];

  return <div className="mizan-site tracking-site" dir={lang === "ar" ? "rtl" : "ltr"}>
    <MizanHeader lang={lang} onLangChange={setLang} home={false} />
    <CartDrawer lang={lang} />
    <main className="tracking-main">
      <div className="detail-topbar"><Link href="/"><ArrowLeft size={15} /> {t.shop}</Link><span>{t.source}</span></div>
      <section className="tracking-hero"><div className="utility-chapter"><span>05</span><i /><span>06</span></div><div className="utility-copy"><p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p>{t.intro}</p></div><div className="tracking-orbit"><span className="mizan-symbol large" aria-hidden="true"><i /><b /><em /></span><span>LOCAL<br />ONLY</span><i /><b /></div></section>
      {!lastOrder ? <section className="tracking-empty"><Clock3 size={28} /><h2>{t.empty}</h2><p>{t.emptyBody}</p><Link className="button button-gold" href="/#collection">{t.shop}<ArrowUpRight size={15} /></Link></section> : <section className="tracking-content"><div className="order-summary"><div><span>{t.order}</span><strong>{lastOrder.id}</strong></div><div><span>{t.created}</span><strong>{new Date(lastOrder.createdAt).toLocaleString(lang === "ar" ? "ar-SA" : "en-US", { dateStyle: "medium", timeStyle: "short" })}</strong></div><div><span>{t.total}</span><strong>{formatPrice(lastOrder.total, lang)}</strong></div></div><div className="tracking-columns"><div className="status-card"><div className="status-card-head"><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.timeline}</p><h2>{statuses[lastOrder.statusIndex].title}</h2></div><PackageCheck size={25} /></div><div className="status-timeline">{statuses.map((status, index) => { const Icon = icons[index]; const active = index <= lastOrder.statusIndex; return <div className={active ? "status-step is-active" : "status-step"} key={status.title}><span className="status-icon">{active ? <Check size={15} /> : <Icon size={15} />}</span><div><strong>{status.title}</strong><p>{status.body}</p></div></div>; })}</div><div className="tracking-actions">{lastOrder.statusIndex < 3 ? <button className="button button-gold" onClick={advanceOrder}>{t.advance}<ArrowUpRight size={15} /></button> : <span className="tracking-done"><Check size={15} /> {t.done}</span>}<button className="text-link" onClick={clearOrder}><RotateCcw size={14} /> {t.reset}</button></div></div><aside className="order-lines"><p className="eyebrow"><span className="eyebrow-dot" /> {t.order}</p>{products.length ? products.map((product) => <Link className="order-line" href={`/coffee/${product.id}`} key={product.id}><img src={product.image} alt="" /><span><strong>{product.shortName[lang]}</strong><small>{lastOrder.items[product.id]} × {formatPrice(product.price, lang)}</small></span><ArrowUpRight size={15} /></Link>) : <p>{t.noItems}</p>}<div className="tracking-note"><Truck size={16} /><span><strong>{t.source}</strong>{t.sourceBody}</span></div></aside></div></section>}
    </main>
    <footer className="mizan-footer"><span>MIZAN COFFEE / SPECIALTY ROASTERS</span><span>{lang === "ar" ? "توازن في كل كوب" : "BALANCE IN EVERY CUP"}</span><span>© 2026 / DEMO TRACKING</span></footer>
  </div>;
}
