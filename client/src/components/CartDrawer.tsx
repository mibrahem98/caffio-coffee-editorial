import { ArrowDownRight, ArrowUpRight, CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCart, getCartProducts } from "@/contexts/CartContext";
import { formatPrice, type Lang } from "@/lib/mizanCatalog";

const copy = {
  en: { kicker: "CAFFIO / DEMO SHOP", title: "Your coffee cart", empty: "Your cart is waiting for its first roast.", emptyHint: "Choose a coffee from the collection to begin the ritual.", continue: "Continue exploring", subtotal: "Demo subtotal", discount: "Discount code", apply: "Apply", discountPlaceholder: "Try CAFFIO10", demo: "Demo checkout / no payment is processed", checkout: "Simulate checkout", added: "Offer applied", invalid: "That demo code is not active.", complete: "Your demo order is ready.", completeBody: "This is a front-end simulation. Connect a commerce backend to accept real orders.", track: "Track this demo order", reset: "Start another order", remove: "Remove" },
  ar: { kicker: "كافيو / متجر تجريبي", title: "سلة قهوتك", empty: "السلة بانتظار أول تحميص.", emptyHint: "اختر قهوة من المجموعة لبدء الطقس.", continue: "تابع الاستكشاف", subtotal: "الإجمالي التجريبي", discount: "كود الخصم", apply: "تطبيق", discountPlaceholder: "جرّب CAFFIO10", demo: "محاكاة الطلب / لا تتم معالجة أي دفعة", checkout: "محاكاة إتمام الطلب", added: "تم تطبيق العرض", invalid: "هذا الكود التجريبي غير نشط.", complete: "طلبك التجريبي جاهز.", completeBody: "هذه محاكاة أمامية فقط. اربط متجرًا فعليًا لقبول الطلبات الحقيقية.", track: "تتبع هذا الطلب التجريبي", reset: "ابدأ طلبًا جديدًا", remove: "إزالة" },
};

const offers: Record<string, number> = { CAFFIO10: 10, RITUAL15: 15 };

export default function CartDrawer({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discount, setDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [notice, setNotice] = useState("");
  const [complete, setComplete] = useState(false);
  const { items, count, update, remove, clear, createOrder } = useCart();
  const t = copy[lang];
  const products = useMemo(() => getCartProducts(items), [items]);
  const subtotal = products.reduce((sum, product) => sum + product.price * items[product.id], 0);
  const discountValue = discount ? Math.round(subtotal * (discount.percent / 100) * 100) / 100 : 0;
  const total = subtotal - discountValue;

  useEffect(() => {
    const openCart = () => setOpen(true);
    window.addEventListener("mizan:open-cart", openCart);
    return () => window.removeEventListener("mizan:open-cart", openCart);
  }, []);

  const applyDiscount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = discountInput.trim().toUpperCase();
    if (!offers[code]) {
      setDiscount(null);
      setNotice(t.invalid);
      return;
    }
    setDiscount({ code, percent: offers[code] });
    setNotice(`${t.added} · ${offers[code]}%`);
  };

  const reset = () => { setComplete(false); clear(); setDiscount(null); setDiscountInput(""); setNotice(""); };

  return <>
    <div className={open ? "cart-backdrop is-open" : "cart-backdrop"} onClick={() => setOpen(false)} aria-hidden="true" />
    <aside className={open ? "cart-drawer is-open" : "cart-drawer"} aria-label={t.title} aria-hidden={!open}>
      <div className="cart-head"><div><span className="cart-kicker">{t.kicker}</span><h2>{t.title}</h2><small>{count} {lang === "ar" ? "عنصر" : "items"}</small></div><button className="cart-close" onClick={() => setOpen(false)} aria-label={t.continue}><X size={19} /></button></div>
      {complete ? <div className="cart-complete"><div className="complete-icon"><CheckCircle2 size={29} /></div><h3>{t.complete}</h3><p>{t.completeBody}</p><a className="button button-gold" href="/track" onClick={() => setOpen(false)}>{t.track}<ArrowUpRight size={15} /></a><button className="text-link" onClick={reset}>{t.reset}<ArrowUpRight size={15} /></button></div> : products.length === 0 ? <div className="cart-empty"><ShoppingBag size={28} /><h3>{t.empty}</h3><p>{t.emptyHint}</p><button className="text-link" onClick={() => { setOpen(false); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}>{t.continue}<ArrowDownRight size={15} /></button></div> : <><div className="cart-lines">{products.map((product) => <article className="cart-line" key={product.id}><img src={product.image} alt="" /><div><strong>{product.shortName[lang]}</strong><span>{product.profile[lang]}</span><b>{formatPrice(product.price, lang)}</b><div className="quantity"><button onClick={() => update(product.id, -1)} aria-label={`${t.remove} ${product.shortName[lang]}`}><Minus size={12} /></button><span>{items[product.id]}</span><button onClick={() => update(product.id, 1)} aria-label={`Add ${product.shortName[lang]}`}><Plus size={12} /></button><button className="remove-line" onClick={() => remove(product.id)} aria-label={`${t.remove} ${product.shortName[lang]}`}><Trash2 size={13} /></button></div></div></article>)}</div><div className="cart-foot"><form className="discount-form" onSubmit={applyDiscount}><label htmlFor="discount-code">{t.discount}</label><div><input id="discount-code" value={discountInput} onChange={(event) => setDiscountInput(event.target.value)} placeholder={t.discountPlaceholder} /><button type="submit">{t.apply}</button></div></form>{notice && <p className={discount ? "discount-notice" : "discount-notice is-error"} role="status">{notice}</p>}<div className="summary-row"><span>{t.subtotal}</span><strong>{formatPrice(subtotal, lang)}</strong></div>{discount && <div className="summary-row discount-row"><span>{discount.code} / -{discount.percent}%</span><strong>-{formatPrice(discountValue, lang)}</strong></div>}<div className="summary-row total-row"><span>{lang === "ar" ? "المجموع" : "Total"}</span><strong>{formatPrice(total, lang)}</strong></div><p className="demo-note">{t.demo}</p><button className="button button-gold cart-checkout" onClick={() => { createOrder(total, discount?.code); setComplete(true); }}>{t.checkout}<ArrowUpRight size={15} /></button></div></>}
    </aside>
  </>;
}
