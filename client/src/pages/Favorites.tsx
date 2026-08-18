import { ArrowLeft, ArrowUpRight, BookOpen, Heart, Monitor, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import MizanHeader from "@/components/MizanHeader";
import CartDrawer from "@/components/CartDrawer";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { coffeeProducts, formatPrice, type Lang } from "@/lib/mizanCatalog";
import { responsiveImages } from "@/lib/responsiveImages";

const copy = {
  en: { back: "Back to Caffio", eyebrow: "CAFFIO / SAVED COFFEES", titleA: "Keep the", titleB: "good ones close.", intro: "A local shelf for coffees you want to revisit. Only product IDs are saved in this browser.", emptyLabel: "Your local coffee shelf", empty: "No saved coffees yet.", emptyBody: "Open a product detail page and use the heart to keep a coffee here.", emptyStorage: "Saved only in this browser", emptyPrivacy: "No account or personal profile is created", notes: "Read the field notes", explore: "Explore the collection", remove: "Remove", add: "Add to cart", added: "Added to your cart.", clear: "Clear saved coffees", local: "Local only / no account required" },
  ar: { back: "العودة إلى كافيو", eyebrow: "كافيو / القهوة المفضلة", titleA: "احتفظ", titleB: "بالجيد قريبًا.", intro: "رف محلي للقهوة التي تريد العودة إليها. يُحفظ معرّف المنتج فقط في هذا المتصفح.", emptyLabel: "رف قهوتك المحلي", empty: "لا توجد قهوة مفضلة بعد.", emptyBody: "افتح صفحة تفاصيل منتج واستخدم القلب لحفظ القهوة هنا.", emptyStorage: "محفوظة في هذا المتصفح فقط", emptyPrivacy: "لا يُنشأ حساب أو ملف شخصي", notes: "اقرأ ملاحظات الحقل", explore: "استكشف المجموعة", remove: "إزالة", add: "أضف إلى السلة", added: "تمت الإضافة إلى سلتك.", clear: "مسح المفضلة", local: "محلي فقط / لا يتطلب حسابًا" },
};

export default function Favorites() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("mizan-lang") as Lang) || "en");
  const { favorites, toggle, clear } = useFavorites();
  const { add } = useCart();
  const t = copy[lang];
  const products = coffeeProducts.filter((product) => favorites.includes(product.id));

  return <div className="mizan-site favorites-site" dir={lang === "ar" ? "rtl" : "ltr"}>
    <MizanHeader lang={lang} onLangChange={setLang} home={false} />
    <CartDrawer lang={lang} />
    <main className="favorites-main"><div className="detail-topbar"><Link href="/"><ArrowLeft size={15} /> {t.back}</Link><span>{t.local}</span></div><section className="favorites-hero"><div className="utility-chapter"><span>06</span><i /><span>06</span></div><div className="utility-copy"><p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p>{t.intro}</p></div><div className="utility-seal"><span className="mizan-symbol large" aria-hidden="true"><i /><b /><em /></span><Heart size={18} /><span>SAVED<br />COFFEES</span></div></section>{products.length === 0 ? <section className="favorites-empty" data-testid="favorites-empty"><div className="favorites-empty-mark"><Heart size={27} aria-hidden="true" /><span>LOCAL</span></div><p className="eyebrow"><span className="eyebrow-dot" /> {t.emptyLabel}</p><h2>{t.empty}</h2><p>{t.emptyBody}</p><div className="favorites-empty-points"><span><Monitor size={15} aria-hidden="true" /> {t.emptyStorage}</span><span><Heart size={15} aria-hidden="true" /> {t.emptyPrivacy}</span></div><div className="favorites-empty-actions"><Link className="button button-gold" href="/#collection">{t.explore}<ArrowUpRight size={15} /></Link><Link className="text-link" href="/notes">{t.notes}<BookOpen size={15} /></Link></div></section> : <section className="favorites-content"><div className="favorites-toolbar"><span>{products.length} {lang === "ar" ? "محفوظ" : "saved"}</span><button className="text-link" onClick={clear}><Trash2 size={14} /> {t.clear}</button></div><div className="favorites-grid">{products.map((product) => <article className="favorite-card" data-testid={`favorite-card-${product.id}`} key={product.id}><ResponsiveImage image={responsiveImages[product.imageKey]} alt={`${product.shortName[lang]} coffee profile`} loading="lazy" decoding="async" /><div><span>{product.shortName[lang]}</span><h2>{product.name[lang]}</h2><p>{product.profile[lang]}</p><small>{formatPrice(product.price, lang)} · {product.weight}</small><div><Link className="text-link" href={`/coffee/${product.id}`}>{t.explore}<ArrowUpRight size={14} /></Link><button className="favorite-add" onClick={() => { add(product.id); toast.success(t.added); }}>{t.add}<ShoppingBag size={14} /></button><button className="favorite-remove" onClick={() => toggle(product.id)} aria-label={`${t.remove} ${product.shortName[lang]}`}><Trash2 size={14} /></button></div></div></article>)}</div></section>}</main><footer className="mizan-footer"><span>CAFFIO COFFEE / SPECIALTY ROASTERS</span><span>{lang === "ar" ? "طقس مصمم بعناية" : "A RITUAL, DESIGNED"}</span><span>© 2026 / SAVED COFFEES</span></footer>
  </div>;
}
