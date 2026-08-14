import { Globe2, Heart, Menu, Moon, PackageSearch, ReceiptText, ShoppingBag, Sun, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { Lang } from "@/lib/mizanCatalog";

const copy = {
  en: { story: "Story", collection: "Collection", ritual: "Ritual", notes: "Field notes", faq: "FAQ", caseStudy: "Case study", society: "Society", explore: "Explore coffee", light: "Light mode", dark: "Dark mode", cart: "Open cart", favorites: "Saved coffees", tracking: "Track demo order", payments: "Verified payment activity", profile: "Local profile" },
  ar: { story: "القصة", collection: "المجموعة", ritual: "الطقس", notes: "ملاحظات الحقل", faq: "الأسئلة الشائعة", caseStudy: "دراسة الحالة", society: "المجتمع", explore: "استكشف القهوة", light: "الوضع الفاتح", dark: "الوضع الليلي", cart: "فتح السلة", favorites: "القهوة المفضلة", tracking: "تتبع الطلب التجريبي", payments: "نشاط الدفع الموثق", profile: "الملف المحلي" },
};

export default function MizanHeader({ lang, onLangChange, home = true }: { lang: Lang; onLangChange: (lang: Lang) => void; home?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(!home);
  const { theme, toggleTheme } = useTheme();
  const { count } = useCart();
  const { favorites } = useFavorites();
  const t = copy[lang];
  const link = (id: string) => home ? `#${id}` : `/#${id}`;
  const navHref = (id: string) => id === "notes" ? "/notes" : id === "caseStudy" ? "/case-study" : id === "society" ? "/society" : link(id);

  useEffect(() => {
    const updateHeaderContrast = () => setHasScrolled(!home || window.scrollY > 12);
    updateHeaderContrast();
    window.addEventListener("scroll", updateHeaderContrast, { passive: true });
    return () => window.removeEventListener("scroll", updateHeaderContrast);
  }, [home]);

  return (
    <header className={hasScrolled ? "mizan-nav is-scrolled" : "mizan-nav"}>
      <a className="mizan-wordmark" href={home ? "#top" : "/"} aria-label="Caffio Coffee home" onClick={() => setMobileOpen(false)}>
        <span className="mizan-symbol" aria-hidden="true"><i /><b /><em /></span>
        <span><strong>CAFFIO</strong><small>COFFEE / SPECIALTY ROASTERS</small></span>
      </a>
      <nav id="primary-navigation" className={mobileOpen ? "mizan-nav-links is-open" : "mizan-nav-links"} aria-label="Primary navigation">
        {["story", "collection", "ritual", "notes", "faq", "caseStudy", "society"].map((id, index) => <a key={id} href={navHref(id)} onClick={() => setMobileOpen(false)}><span>{String(index + 1).padStart(2, "0")}</span>{t[id as keyof typeof t]}</a>)}
        <div className="mobile-utility-links" aria-label={lang === "ar" ? "أدوات الحساب والسلة" : "Account and cart tools"}>
          <button type="button" onClick={() => toggleTheme?.()}><span>{theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}</span>{theme === "dark" ? t.light : t.dark}</button>
          <a href="/favorites" onClick={() => setMobileOpen(false)}><span><Heart size={15} /></span>{t.favorites}</a>
          <a href="/track" onClick={() => setMobileOpen(false)}><span><PackageSearch size={15} /></span>{t.tracking}</a>
          <a href="/payments" onClick={() => setMobileOpen(false)}><span><ReceiptText size={15} /></span>{t.payments}</a>
          <a href="/profile" onClick={() => setMobileOpen(false)}><span><UserRound size={15} /></span>{t.profile}</a>
        </div>
      </nav>
      <div className="mizan-nav-actions">
        <label className="locale-toggle"><Globe2 size={14} /><select value={lang} onChange={(event) => onLangChange(event.target.value as Lang)} aria-label="Select language"><option value="en">EN</option><option value="ar">عربي</option></select></label>
        <button className="icon-button utility-icon" data-utility-label={theme === "dark" ? t.light : t.dark} onClick={() => toggleTheme?.()} aria-label={theme === "dark" ? t.light : t.dark} title={theme === "dark" ? t.light : t.dark}>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button>
        <a className="cart-button utility-icon favorite-utility" data-utility-label={t.favorites} href="/favorites" aria-label={`${t.favorites} (${favorites.length})`} title={t.favorites}><Heart size={16} fill={favorites.length ? "currentColor" : "none"} /><span>{favorites.length}</span></a>
        <a className="icon-button utility-icon" data-utility-label={t.tracking} href="/track" aria-label={t.tracking} title={t.tracking}><PackageSearch size={16} /></a>
        <a className="icon-button utility-icon" data-utility-label={t.payments} href="/payments" aria-label={t.payments} title={t.payments}><ReceiptText size={16} /></a>
        <a className="icon-button utility-icon" data-utility-label={t.profile} href="/profile" aria-label={t.profile} title={t.profile}><UserRound size={16} /></a>
        <button className="cart-button utility-icon cart-utility" data-utility-label={t.cart} onClick={() => window.dispatchEvent(new CustomEvent("mizan:open-cart"))} aria-label={`${t.cart} (${count})`}><ShoppingBag size={16} /><span>{count}</span></button>
        <a className="nav-cta" href={link("collection")}>{t.explore}<span>↗</span></a>
        <button className="mobile-toggle" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={mobileOpen} aria-controls="primary-navigation">{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </header>
  );
}
