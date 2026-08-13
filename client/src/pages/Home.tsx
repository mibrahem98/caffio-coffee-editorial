import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Coffee,
  Compass,
  Droplets,
  Flame,
  Globe2,
  Leaf,
  Menu,
  Minus,
  Moon,
  Plus,
  Scale,
  Sparkles,
  ShoppingBag,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { paletteLabels, navLabels, ui, type Lang } from "@/lib/brandTranslations";
import { useTheme } from "@/contexts/ThemeContext";

const imagery = {
  hero: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=90",
  ritual: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1500&q=88",
  origin: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1500&q=88",
  journalOne: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=86",
  journalTwo: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=86",
  journalThree: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=86",
};

const products = [
  {
    id: "alto",
    name: { en: "ALTO / Ethiopia", ar: "ALTO / إثيوبيا" },
    origin: { en: "Guji, Ethiopia", ar: "قوجي، إثيوبيا" },
    notes: { en: "Apricot · jasmine · black tea", ar: "مشمش · ياسمين · شاي أسود" },
    roast: { en: "Light / expressive", ar: "خفيف / تعبيري" },
    altitude: { en: "1,950–2,100 masl", ar: "1950–2100 م" },
    process: { en: "Washed", ar: "مغسولة" },
    accent: "gold",
    price: 18,
  },
  {
    id: "sombra",
    name: { en: "SOMBRA / Colombia", ar: "سومبرا / كولومبيا" },
    origin: { en: "Huila, Colombia", ar: "هويلا، كولومبيا" },
    notes: { en: "Red apple · cacao · honey", ar: "تفاح أحمر · كاكاو · عسل" },
    roast: { en: "Medium / balanced", ar: "متوسط / متزن" },
    altitude: { en: "1,700–1,900 masl", ar: "1700–1900 م" },
    process: { en: "Honey", ar: "عسلية" },
    accent: "brown",
    price: 20,
  },
  {
    id: "mizan",
    name: { en: "MIZAN / House Espresso", ar: "ميزان / إسبريسو البيت" },
    origin: { en: "Brazil · Colombia", ar: "البرازيل · كولومبيا" },
    notes: { en: "Hazelnut · caramel · soft citrus", ar: "بندق · كراميل · حمضيات ناعمة" },
    roast: { en: "Medium-dark / round", ar: "متوسط داكن / ممتلئ" },
    altitude: { en: "1,100–1,600 masl", ar: "1100–1600 م" },
    process: { en: "Natural & washed", ar: "مجففة ومغسولة" },
    accent: "navy",
    price: 16,
  },
];

const palette = [
  { hex: "#1E2224", tone: "dark" },
  { hex: "#F2EBDD", tone: "light" },
  { hex: "#4A3025", tone: "dark" },
  { hex: "#B89152", tone: "light" },
  { hex: "#B8B1A5", tone: "dark" },
  { hex: "#0B1B2B", tone: "dark" },
];

function MizanMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "mizan-mark compact" : "mizan-mark"} aria-hidden="true">
      <span className="mark-orbit" />
      <span className="mark-bean" />
      <span className="mark-axis" />
    </span>
  );
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("mizan-lang") as Lang) || "en");
  const [activeProduct, setActiveProduct] = useState(products[0].id);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [waitlistState, setWaitlistState] = useState<"idle" | "error" | "success">("idle");
  const [emailError, setEmailError] = useState("");
  const direction = lang === "ar" ? "rtl" : "ltr";
  const t = ui[lang];
  const currentProduct = useMemo(() => products.find((product) => product.id === activeProduct) ?? products[0], [activeProduct]);
  const cartProducts = useMemo(() => products.filter((product) => cartItems[product.id]), [cartItems]);
  const cartCount = useMemo(() => Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => cartProducts.reduce((sum, product) => sum + product.price * cartItems[product.id], 0), [cartItems, cartProducts]);
  const navItems = [
    { id: "story", label: navLabels[lang].story, number: "01" },
    { id: "collection", label: navLabels[lang].collection, number: "02" },
    { id: "ritual", label: navLabels[lang].ritual, number: "03" },
    { id: "system", label: navLabels[lang].system, number: "04" },
  ];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
    localStorage.setItem("mizan-lang", lang);
  }, [direction, lang]);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
      setScrolled(window.scrollY > 22);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyColor = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      window.setTimeout(() => setCopied(null), 1700);
    } catch {
      toast.error(lang === "ar" ? "تعذر نسخ اللون" : "Unable to copy the color");
    }
  };

  const handleWaitlist = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("email") as HTMLInputElement | null;
    const email = input?.value.trim() || "";
    if (!email) {
      setEmailError(t.emailRequired);
      setWaitlistState("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t.emailInvalid);
      setWaitlistState("error");
      return;
    }
    setEmailError("");
    setWaitlistState("success");
    toast.success(t.joined);
  };

  const addToCart = (productId: string) => {
    setCartItems((items) => ({ ...items, [productId]: (items[productId] || 0) + 1 }));
    setCheckoutComplete(false);
    setCartOpen(true);
    toast.success(t.cartAdded);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCartItems((items) => {
      const nextQuantity = (items[productId] || 0) + delta;
      if (nextQuantity <= 0) {
        const nextItems = { ...items };
        delete nextItems[productId];
        return nextItems;
      }
      return { ...items, [productId]: nextQuantity };
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((items) => {
      const nextItems = { ...items };
      delete nextItems[productId];
      return nextItems;
    });
  };

  const formatPrice = (price: number) => lang === "ar" ? `${price} $` : `US$${price}`;

  return (
    <div className={direction === "rtl" ? "mizan-shell rtl" : "mizan-shell"}>
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      <header className={scrolled ? "site-nav is-scrolled" : "site-nav"}>
        <a className="brand-lockup" href="#top" aria-label="MIZAN COFFEE home">
          <MizanMark compact />
          <span><strong>MIZAN</strong><small>COFFEE / SPECIALTY ROASTERS</small></span>
        </a>
        <nav className={mobileNavOpen ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { scrollToId(item.id); setMobileNavOpen(false); }}><span>{item.number}</span>{item.label}</button>
          ))}
        </nav>
        <div className="nav-actions">
          <span className="nav-status"><CircleDashed size={13} /> {t.status}</span>
          <button className="language-toggle" onClick={() => setLang(lang === "en" ? "ar" : "en")} aria-label={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}><Globe2 size={14} />{lang === "en" ? "عربي" : "EN"}</button>
          <button className="theme-toggle" onClick={() => toggleTheme?.()} aria-label={theme === "dark" ? t.themeLight : t.themeDark} title={theme === "dark" ? t.themeLight : t.themeDark}>{theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}</button>
          <button className="cart-toggle" onClick={() => setCartOpen(true)} aria-label={`${t.cartLabel} (${cartCount})`}><ShoppingBag size={15} /><span>{cartCount}</span></button>
          <button className="nav-cta" onClick={() => scrollToId("collection")}>{t.navCta}<ArrowUpRight size={14} /></button>
          <button className="nav-menu" onClick={() => setMobileNavOpen((value) => !value)} aria-label="Toggle navigation">{mobileNavOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </header>

      <div className={cartOpen ? "cart-backdrop is-open" : "cart-backdrop"} onClick={() => setCartOpen(false)} aria-hidden="true" />
      <aside className={cartOpen ? "cart-drawer is-open" : "cart-drawer"} aria-label={t.cartTitle} aria-hidden={!cartOpen}>
        <div className="cart-drawer-head"><div><span className="cart-kicker">MIZAN / DEMO SHOP</span><h2>{t.cartTitle}</h2></div><button className="cart-close" onClick={() => setCartOpen(false)} aria-label={t.cartContinue}><X size={19} /></button></div>
        {checkoutComplete ? <div className="cart-success"><div className="cart-success-icon"><CheckCircle2 size={31} /></div><h3>{t.orderComplete}</h3><p>{t.orderCompleteBody}</p><button className="button button-gold" onClick={() => { setCheckoutComplete(false); setCartItems({}); }}>{t.orderReset}<ArrowUpRight size={15} /></button></div> : cartProducts.length === 0 ? <div className="cart-empty"><ShoppingBag size={28} /><h3>{t.cartEmpty}</h3><p>{t.cartEmptyHint}</p><button className="text-link cart-continue" onClick={() => { setCartOpen(false); scrollToId("collection"); }}>{t.cartContinue}<ArrowDownRight size={15} /></button></div> : <><div className="cart-items">{cartProducts.map((product) => <article className="cart-item" key={product.id}><img src={imagery.origin} alt="" /><div className="cart-item-copy"><strong>{product.name[lang]}</strong><span>{product.notes[lang]}</span><b>{formatPrice(product.price)}</b><div className="quantity-control"><button onClick={() => updateCartQuantity(product.id, -1)} aria-label={`${t.cartRemove} ${product.name[lang]}`}><Minus size={12} /></button><span>{cartItems[product.id]}</span><button onClick={() => updateCartQuantity(product.id, 1)} aria-label={`Add ${product.name[lang]}`}><Plus size={12} /></button><button className="remove-item" onClick={() => removeFromCart(product.id)} aria-label={`${t.cartRemove} ${product.name[lang]}`}><Trash2 size={13} /></button></div></div></article>)}</div><div className="cart-drawer-foot"><div className="cart-total-row"><span>{t.cartSubtotal}</span><strong>{formatPrice(cartTotal)}</strong></div><p className="cart-demo-note">{t.cartDemo}</p><button className="button button-gold cart-checkout" onClick={() => setCheckoutComplete(true)}>{t.cartCheckout}<ArrowUpRight size={15} /></button></div></>}
      </aside>

      <main id="top">
        <section className="hero-section">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="chapter-rail hero-rail"><span>00</span><i /><span>04</span></div>
          <div className="hero-copy reveal-up">
            <p className="eyebrow light"><span className="eyebrow-dot" /> {t.cover}</p>
            <h1>{t.heroTitleA}<br /><em>{t.heroTitleB}</em></h1>
            <p className="hero-lede">{t.heroLede}</p>
            <div className="hero-actions">
              <button className="button button-gold" onClick={() => scrollToId("collection")}>{t.heroPrimary}<ArrowDownRight size={16} /></button>
              <button className="text-link light-link" onClick={() => scrollToId("story")}>{t.heroSecondary}<ArrowUpRight size={15} /></button>
            </div>
            <div className="hero-meta"><span>{t.metaOne}</span><span>{t.metaTwo}</span><span>{t.metaThree}</span></div>
          </div>
          <div className="hero-visual reveal-up delay-one">
            <div className="hero-image-frame">
              <img src={imagery.hero} alt="Specialty coffee, ceramic cup and roasted beans on dark walnut" />
              <div className="hero-image-caption"><span>FIG. 01</span><span>{t.imageCaption}</span></div>
            </div>
            <div className="hero-seal"><MizanMark /><span>ROASTED<br />WITH BALANCE</span></div>
            <div className="hero-data-card"><span>HOUSE NOTE</span><strong>01 / 04</strong><p>{lang === "ar" ? "اختيار واضح. تحميص هادئ." : "Clear selection. Quiet roast."}</p></div>
          </div>
        </section>

        <section className="manifesto-strip">
          <MizanMark compact />
          <p className="eyebrow"><span className="eyebrow-dot" /> {t.manifestoLabel}</p>
          <p className="manifesto-copy">{t.manifestoA}<br /><strong>{t.manifestoB}</strong></p>
          <span className="strip-index">{t.manifestoSide}</span>
        </section>

        <section className="story-section section-light" id="story">
          <div className="section-intro"><div className="section-number">01<span>/</span>04</div><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.storyEyebrow}</p><h2>{t.storyTitleA}<br /><em>{t.storyTitleB}</em></h2></div></div>
          <div className="story-lead"><p>{t.storyBody}</p><div className="story-compass"><Compass size={17} /><span>{lang === "ar" ? "من المصدر إلى الكوب" : "From origin to cup"}</span></div></div>
          <div className="story-grid">
            <article className="story-card featured-card"><span className="card-kicker">01 / {t.storyCardOneLabel}</span><h3>{t.storyCardOneTitle}</h3><p>{t.storyCardOneBody}</p><Leaf className="card-icon" size={22} /></article>
            <article className="story-card"><span className="card-kicker">02 / {t.storyCardTwoLabel}</span><h3>{t.storyCardTwoTitle}</h3><p>{t.storyCardTwoBody}</p><Flame className="card-icon" size={22} /></article>
            <article className="story-card"><span className="card-kicker">03 / {t.storyCardThreeLabel}</span><h3>{t.storyCardThreeTitle}</h3><p>{t.storyCardThreeBody}</p><Coffee className="card-icon" size={22} /></article>
          </div>
        </section>

        <section className="collection-section section-dark" id="collection">
          <div className="chapter-rail"><span>02</span><i /><span>04</span></div>
          <div className="section-intro dark-intro"><div className="section-number">02<span>/</span>04</div><div><p className="eyebrow light"><span className="eyebrow-dot" /> {t.collectionEyebrow}</p><h2>{t.collectionTitleA}<br /><em>{t.collectionTitleB}</em></h2></div></div>
          <div className="collection-header"><p className="body-copy light-copy">{t.collectionBody}</p><span className="collection-marker"><Sparkles size={15} /> 03 / 03 seasonal profiles</span></div>
          <div className="collection-layout">
            <div className="product-tabs">
              {products.map((product, index) => <button key={product.id} className={activeProduct === product.id ? "product-tab active" : "product-tab"} onClick={() => setActiveProduct(product.id)}><span>0{index + 1}</span><strong>{product.name[lang]}</strong><small>{product.origin[lang]}</small><ChevronRight size={16} /></button>)}
              <div className="product-note"><Scale size={15} /><span>{t.collectionNote}</span></div>
            </div>
            <div className={`product-card accent-${currentProduct.accent}`}>
              <div className="product-photo"><img src={imagery.origin} alt="Coffee beans and tasting setup" /><span className="origin-stamp">MIZAN<br /><b>{currentProduct.id.toUpperCase()}</b></span></div>
              <div className="product-copy"><p className="eyebrow light"><span className="eyebrow-dot" /> {currentProduct.origin[lang]}</p><h3>{currentProduct.name[lang]}</h3><p className="product-notes">{currentProduct.notes[lang]}</p><div className="product-specs"><span><small>{t.roastLevel}</small><b>{currentProduct.roast[lang]}</b></span><span><small>{t.altitude}</small><b>{currentProduct.altitude[lang]}</b></span><span><small>{t.process}</small><b>{currentProduct.process[lang]}</b></span><span><small>{lang === "ar" ? "السعر التجريبي" : "Demo price"}</small><b>{formatPrice(currentProduct.price)}</b></span></div><button className="product-action" onClick={() => addToCart(currentProduct.id)}>{t.addToCart}<ShoppingBag size={15} /></button></div>
            </div>
          </div>
        </section>

        <section className="ritual-section section-light" id="ritual">
          <div className="section-intro"><div className="section-number">03<span>/</span>04</div><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.ritualEyebrow}</p><h2>{t.ritualTitleA}<br /><em>{t.ritualTitleB}</em></h2></div></div>
          <div className="ritual-layout"><div className="ritual-photo"><img src={imagery.ritual} alt="Pour-over coffee ritual in a calm morning light" /><span className="image-caption-dark">{t.ritualImageCaption}</span></div><div className="ritual-copy"><p className="ritual-intro">{t.ritualBody}</p><div className="brew-list"><article><div className="brew-icon"><Droplets size={18} /></div><div><span>{t.brewGuide} / 01</span><h3>Pour-over / <em>{lang === "ar" ? "واضح ومشرق" : "clear & bright"}</em></h3><p>{lang === "ar" ? "نسبة 1:16 · 92° م · صب على أربع دفعات" : "1:16 ratio · 92°C · four steady pours"}</p></div><b>04:00</b></article><article><div className="brew-icon"><Scale size={18} /></div><div><span>{t.brewGuide} / 02</span><h3>Espresso / <em>{lang === "ar" ? "متزن وممتلئ" : "round & full"}</em></h3><p>{lang === "ar" ? "نسبة 1:2 · 93° م · استخلاص هادئ" : "1:2 ratio · 93°C · gentle extraction"}</p></div><b>00:28</b></article></div></div></div>
        </section>

        <section className="system-section section-dark" id="system">
          <div className="section-intro dark-intro"><div className="section-number">04<span>/</span>04</div><div><p className="eyebrow light"><span className="eyebrow-dot" /> {t.systemEyebrow}</p><h2>{t.systemTitleA}<br /><em>{t.systemTitleB}</em></h2></div></div>
          <div className="system-lead"><p>{t.systemBody}</p><div className="system-rule"><MizanMark compact /><span>{lang === "ar" ? "مقياس بصري واحد" : "One visual measure"}</span></div></div>
          <div className="palette-block"><div className="palette-heading"><p className="eyebrow light"><span className="eyebrow-dot" /> {t.paletteTitle}</p><span>{t.paletteHint}</span></div><div className="palette-grid">{palette.map((color, index) => <button className={`color-swatch ${color.tone}`} key={color.hex} onClick={() => copyColor(color.hex)} style={{ background: color.hex }} aria-label={`Copy ${color.hex}`}><span className="swatch-hover">{copied === color.hex ? <Check size={14} /> : color.hex}</span><div><strong>{lang === "ar" ? paletteLabels[index][1] : paletteLabels[index][0]}</strong><small>{color.hex}</small><em>{lang === "ar" ? paletteLabels[index][3] : paletteLabels[index][2]}</em></div></button>)}</div></div>
          <div className="type-block"><div><p className="eyebrow light"><span className="eyebrow-dot" /> {t.typeTitle}</p><h3 className="serif-display">{t.typeSample}</h3></div><div className="type-specimens"><div className="type-row"><span>{t.typeDisplay}</span><strong>Make room<br />for the ritual.</strong></div><div className="type-row"><span>{t.typeUtility}</span><p>ORIGIN / ALTITUDE / PROCESS / CLARITY<br /><b>MIZAN COFFEE / BALANCE IN EVERY CUP</b></p></div></div></div>
        </section>

        <section className="journal-section section-light">
          <div className="section-intro journal-intro"><div className="section-number">FIELD<br />NOTES</div><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.journalEyebrow}</p><h2>{t.journalTitleA}<br /><em>{t.journalTitleB}</em></h2></div></div>
          <div className="journal-grid"><article className="journal-card large"><img src={imagery.journalOne} alt="Coffee cup and beans in warm light" /><div><span>01 / ORIGIN</span><h3>{t.journalOneTitle}</h3><p>{t.journalOneBody}</p><button onClick={() => toast(t.readNote)}>{t.readNote}<ArrowUpRight size={15} /></button></div></article><article className="journal-card"><img src={imagery.journalTwo} alt="Pour-over coffee preparation" /><div><span>02 / BREW</span><h3>{t.journalTwoTitle}</h3><p>{t.journalTwoBody}</p><button onClick={() => toast(t.readNote)}>{t.readNote}<ArrowUpRight size={15} /></button></div></article><article className="journal-card"><img src={imagery.journalThree} alt="Coffee served beside a window" /><div><span>03 / FRESHNESS</span><h3>{t.journalThreeTitle}</h3><p>{t.journalThreeBody}</p><button onClick={() => toast(t.readNote)}>{t.readNote}<ArrowUpRight size={15} /></button></div></article></div>
        </section>

        <section className="join-section">
          <div className="join-mark"><MizanMark /></div><div className={waitlistState === "success" ? "join-copy is-success" : "join-copy"}><p className="eyebrow light"><span className="eyebrow-dot" /> {t.joinEyebrow}</p>{waitlistState === "success" ? <div className="join-success"><div className="join-success-icon"><CheckCircle2 size={26} /></div><h2>{t.joinedTitle}</h2><p>{t.joinedBody}</p><button className="text-link light-link" onClick={() => setWaitlistState("idle")}>{t.joinAnother}<ArrowUpRight size={15} /></button></div> : <><h2>{t.joinTitleA}<br /><em>{t.joinTitleB}</em></h2><p>{t.joinBody}</p><form onSubmit={handleWaitlist} noValidate><input name="email" type="email" placeholder={t.emailPlaceholder} aria-label={t.emailPlaceholder} aria-invalid={waitlistState === "error"} aria-describedby={emailError ? "email-error" : undefined} onChange={() => { if (waitlistState === "error") { setWaitlistState("idle"); setEmailError(""); } }} /><button className="button button-gold" type="submit">{t.joinButton}<ArrowUpRight size={16} /></button></form>{emailError && <p className="email-error" id="email-error" role="alert">{emailError}</p>}</>}</div><div className="join-aside"><span>01</span><i /><span>{lang === "ar" ? "رسالة موسمية" : "Seasonal letters"}</span></div>
        </section>
      </main>

      <footer className="site-footer"><span>{t.footerA}</span><span>{t.footerB}</span><span>{t.footerC}</span></footer>
    </div>
  );
}
