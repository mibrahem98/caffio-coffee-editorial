import { Globe2, Heart, Menu, Moon, PackageSearch, ShoppingBag, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { Lang } from "@/lib/mizanCatalog";

const copy = {
  en: { story: "Story", collection: "Collection", ritual: "Ritual", notes: "Field notes", faq: "FAQ", explore: "Explore coffee", light: "Light mode", dark: "Dark mode", cart: "Open cart", favorites: "Saved coffees", tracking: "Track demo order" },
  ar: { story: "القصة", collection: "المجموعة", ritual: "الطقس", notes: "ملاحظات الحقل", faq: "الأسئلة الشائعة", explore: "استكشف القهوة", light: "الوضع الفاتح", dark: "الوضع الليلي", cart: "فتح السلة", favorites: "القهوة المفضلة", tracking: "تتبع الطلب التجريبي" },
};

export default function MizanHeader({ lang, onLangChange, home = true }: { lang: Lang; onLangChange: (lang: Lang) => void; home?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { count } = useCart();
  const { favorites } = useFavorites();
  const t = copy[lang];
  const link = (id: string) => home ? `#${id}` : `/#${id}`;
  const navHref = (id: string) => id === "notes" ? "/notes" : link(id);

  return (
    <header className="mizan-nav">
      <a className="mizan-wordmark" href={home ? "#top" : "/"} aria-label="MIZAN COFFEE home" onClick={() => setMobileOpen(false)}>
        <span className="mizan-symbol" aria-hidden="true"><i /><b /><em /></span>
        <span><strong>MIZAN</strong><small>COFFEE / SPECIALTY ROASTERS</small></span>
      </a>
      <nav className={mobileOpen ? "mizan-nav-links is-open" : "mizan-nav-links"} aria-label="Primary navigation">
        {["story", "collection", "ritual", "notes", "faq"].map((id, index) => <a key={id} href={navHref(id)} onClick={() => setMobileOpen(false)}><span>0{index + 1}</span>{t[id as keyof typeof t]}</a>)}
      </nav>
      <div className="mizan-nav-actions">
        <label className="locale-toggle"><Globe2 size={14} /><select value={lang} onChange={(event) => onLangChange(event.target.value as Lang)} aria-label="Select language"><option value="en">EN</option><option value="ar">عربي</option></select></label>
        <button className="icon-button" onClick={() => toggleTheme?.()} aria-label={theme === "dark" ? t.light : t.dark} title={theme === "dark" ? t.light : t.dark}>{theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}</button>
        <a className="cart-button" href="/favorites" aria-label={`${t.favorites} (${favorites.length})`} title={t.favorites}><Heart size={15} fill={favorites.length ? "currentColor" : "none"} /><span>{favorites.length}</span></a>
        <a className="icon-button" href="/track" aria-label={t.tracking} title={t.tracking}><PackageSearch size={15} /></a>
        <button className="cart-button" onClick={() => window.dispatchEvent(new CustomEvent("mizan:open-cart"))} aria-label={`${t.cart} (${count})`}><ShoppingBag size={15} /><span>{count}</span></button>
        <a className="nav-cta" href={link("collection")}>{t.explore}<span>↗</span></a>
        <button className="mobile-toggle" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle navigation">{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </header>
  );
}
