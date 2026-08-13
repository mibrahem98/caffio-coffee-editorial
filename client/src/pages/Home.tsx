/*
  APEX ROAST — Quiet Summit Editorial.
  This page treats the brand manual as an interactive studio book: dark cover,
  offset editorial chapters, tactile image plates, and restrained gold rules.
*/
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleDashed,
  Clipboard,
  Coffee,
  Compass,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Image as ImageIcon,
  Layers3,
  Menu,
  Package,
  Palette,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import { applicationCopy, navLabels, paletteLabels, promptArabic, promptTags, promptTitles, ui, type Lang } from "@/lib/brandTranslations";

const asset = {
  logo: "/manus-storage/apex-roast-logo_2e612c7e.png",
  hero: "/manus-storage/apex-roast-hero-reference_5ed83964.jpg",
  packaging: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85",
  ritual: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1400&q=85",
  materials: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1400&q=85",
};

const downloadable = {
  brandPdf: "/manus-storage/APEX_ROAST_brand_guidelines_f4ba978c.pdf",
  logoSvg: "/manus-storage/apex-roast-symbol_225a1f6b.svg",
};

const promptThumbs = [
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=500&q=80&sat=-20",
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=500&q=80",
];

function RiseSeal({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "rise-seal compact" : "rise-seal"} aria-hidden="true">
      <span className="rise-seal-mark"><i /><b /></span>
      <span className="rise-seal-copy">APEX / ROAST</span>
    </span>
  );
}

const navItems = [
  { id: "strategy", label: "Strategy", number: "01" },
  { id: "dna", label: "Visual DNA", number: "02" },
  { id: "applications", label: "Applications", number: "03" },
  { id: "prompts", label: "Prompt atelier", number: "04" },
];

const palette = [
  { name: "Summit Charcoal", hex: "#1E2224", note: "Main dark field", tone: "dark" },
  { name: "Night Navy", hex: "#0B1B2B", note: "Digital depth", tone: "dark" },
  { name: "Warm Ivory", hex: "#F2EBDD", note: "Editorial space", tone: "light" },
  { name: "Roast Brown", hex: "#4A3025", note: "Sensory warmth", tone: "dark" },
  { name: "Aged Gold", hex: "#B89152", note: "Value accent", tone: "light" },
  { name: "Mist Stone", hex: "#B8B1A5", note: "Quiet utility", tone: "dark" },
];

const applications = [
  { id: "packaging", label: "Packaging", eyebrow: "01 / shelf presence", title: "A tactile system that reads before it speaks.", body: "Matte paper, a rising mark, and a calm information hierarchy turn every bag into a quiet sign of intention.", image: asset.packaging, tint: "rust" },
  { id: "ritual", label: "Serving ritual", eyebrow: "02 / daily object", title: "The identity lands in the hand.", body: "Cups, sleeves, and ceramics carry the same summit logic into the small gestures that make coffee memorable.", image: asset.ritual, tint: "ivory" },
  { id: "materials", label: "Material language", eyebrow: "03 / tactile DNA", title: "Luxury, with the volume turned down.", body: "Uncoated stock, dark walnut, smoked glass, and aged gold build a world that feels considered rather than decorated.", image: asset.materials, tint: "navy" },
];

const prompts = [
  { number: "01", title: "Primary logo system", tag: "identity", prompt: "Using the APEX ROAST master visual direction, create a premium logo identity presentation sheet on a warm ivory background and a Summit Charcoal background. Show the primary horizontal lockup, centered stacked lockup, standalone summit-bean symbol, wordmark-only version, monochrome black version, ivory reverse version, and a restrained aged-gold material preview. The symbol must be an original abstract rising summit with one clean negative-space split inspired by a coffee bean, constructed with simple geometric proportions and strong optical balance. The wordmark “APEX ROAST” must be elegant, accurately spelled, highly legible, and custom-looking. Vector-like precision, timeless identity, crisp edges, no fake extra copy." },
  { number: "02", title: "Premium coffee packaging", tag: "packaging", prompt: "Create a complete APEX ROAST premium specialty coffee packaging system with three coordinated resealable coffee bags: Origin Series, House Espresso, and Seasonal Micro-Lot. Use the same bag structure and the same abstract summit-bean symbol, differentiating each product through controlled Roast Brown, Night Navy, or Warm Ivory fields. Use matte Summit Charcoal paper, subtle tactile grain, restrained aged-gold foil, minimal contour lines, and a clear information hierarchy. Include front and back views with origin, altitude, process, roast profile, tasting notes, brew method, weight, barcode placeholder, and regulatory information placeholder. Realistic folds, accurate seals, believable paper texture, clean flat artwork references alongside the 3D mockup." },
  { number: "03", title: "Brand guidelines board", tag: "system", prompt: "Design a highly organized APEX ROAST brand guidelines board as a premium editorial presentation. Include the primary logo, summit-bean symbol, clear-space diagram, color swatches with exact HEX codes, typography hierarchy, 8-point grid, 30/60-degree geometry, approved materials, photography direction, icon style, and one coffee bag mockup. Use a warm ivory paper background, Summit Charcoal typography, Night Navy panels, and restrained Aged Gold rules. Keep it clean, spacious, precise, and readable, with short accurate labels and no decorative moodboard clutter." },
  { number: "04", title: "Cups & serving ritual", tag: "touchpoint", prompt: "Create a refined APEX ROAST serving ritual scene with an ivory ceramic espresso cup, a matte charcoal takeaway cup, a dark coffee sleeve, a saucer, a napkin, a loyalty card, and a small coffee bag arranged on dark walnut. Apply the summit-bean symbol at a believable small scale and use Warm Ivory, Summit Charcoal, Night Navy, Roast Brown, and one restrained Aged Gold detail. Show natural espresso crema, subtle steam, realistic ceramic glaze, tactile paper, and soft morning side light. Warm, human, contemporary, and practical." },
  { number: "05", title: "Website & commerce", tag: "digital", prompt: "Design a high-end responsive APEX ROAST ecommerce website homepage displayed in a realistic desktop browser and mobile companion frame. Use a calm Warm Ivory and Night Navy interface with Summit Charcoal text and restrained Aged Gold accents. Include navigation with the logo, hero statement “Precision at the Peak.”, origin-led coffee feature, product cards with roast and tasting data, brew guide, subscription offer, brand story, and a clear footer. Strong accessibility contrast, generous whitespace, simple summit-inspired dividers, realistic product hierarchy, no clutter." },
  { number: "06", title: "Social template system", tag: "content", prompt: "Create a coordinated APEX ROAST social media template system shown as six square posts in a clean grid. The six categories are new coffee launch, origin story, tasting notes, brew guide, customer ritual, and seasonal campaign. Use the same 8-point grid, rising diagonal, summit-bean symbol, color palette, typography hierarchy, and generous negative space across all tiles. Alternate between tactile coffee close-ups, editorial information layouts, and quiet product compositions. Keep headline phrases short and accurately spelled." },
  { number: "07", title: "Cafe environment", tag: "space", prompt: "Create a realistic APEX ROAST specialty coffee shop interior identity application. Show a matte Summit Charcoal feature wall with a refined dimensional summit-bean sign, a warm ivory menu board, dark walnut counter, smoked glass details, matte black metal fixtures, branded takeaway station, and a small origin map panel. Integrate one subtle rising diagonal and one bean-oval detail. Use soft daylight with warm practical lighting, realistic scale, believable materials, and an inviting premium atmosphere." },
  { number: "08", title: "Iconography & motifs", tag: "assets", prompt: "Design an APEX ROAST supporting graphic language presentation sheet with seven custom monoline icons: origin, altitude, roast, aroma, brew, freshness, and subscription. Include one contour-line pattern derived from the rising summit, one bean-inspired oval motif, one elevation marker, and three border treatments. Use a consistent stroke weight, 30/60-degree geometry, rounded bean curves, and the APEX ROAST color system. Minimal, recognizable, scalable, suitable for packaging, menus, web interfaces, and social templates." },
  { number: "09", title: "Campaign poster", tag: "campaign", prompt: "Create a premium APEX ROAST campaign poster in portrait format for the campaign “Rise Into the Ritual.” Show one beautiful, realistic coffee preparation moment with controlled liquid movement, a carefully placed APEX ROAST product bag, and a strong Warm Ivory headline area. Use a Summit Charcoal or Night Navy field, one rising diagonal inspired by the summit symbol, subtle Roast Brown warmth, and a small Aged Gold accent. Establish a clear reading order from headline to product to call-to-action. Editorial, printable, memorable, and commercially effective." },
  { number: "10", title: "Complete case study", tag: "presentation", prompt: "Create a polished APEX ROAST brand identity case-study presentation board showing the full visual story in one coherent sequence. Arrange the primary logo, packaging family, ceramic cup, website interface, social templates, cafe sign, menu, icon sheet, campaign poster, and a final coffee ritual scene across a spacious editorial layout. Build a clear narrative from origin to roast to preparation to customer moment. Use the same summit-bean symbol, palette, tactile materials, soft directional lighting, 8-point grid, and controlled negative space. High-end professional branding presentation, no visual clutter." },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Home() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("apex-roast-lang") as Lang) || "en");
  const [activeApp, setActiveApp] = useState(applications[0].id);
  const [openPrompt, setOpenPrompt] = useState("01");
  const [copied, setCopied] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const direction = lang === "ar" ? "rtl" : "ltr";
  const t = ui[lang];
  const currentNav = [
    { id: "strategy", label: navLabels[lang].strategy, number: "01" },
    { id: "dna", label: navLabels[lang].dna, number: "02" },
    { id: "applications", label: navLabels[lang].applications, number: "03" },
    { id: "prompts", label: navLabels[lang].prompts, number: "04" },
    { id: "downloads", label: navLabels[lang].downloads, number: "05" },
  ];
  const selectedAppIndex = Math.max(0, applications.findIndex((item) => item.id === activeApp));
  const selectedAppCopy = applicationCopy[selectedAppIndex];
  const currentPrompts = prompts.map((item, index) => ({ ...item, title: promptTitles[lang][index], tag: promptTags[lang][index], prompt: lang === "ar" ? promptArabic[index] : item.prompt, thumb: promptThumbs[index] }));

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
    localStorage.setItem("apex-roast-lang", lang);
  }, [lang, direction]);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const selectedApp = useMemo(() => applications.find((item) => item.id === activeApp) ?? applications[0], [activeApp]);

  const copyPrompt = async (number: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(number);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="site-shell">
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      <header className="site-nav">
        <a className="brand-lockup" href="#top" aria-label="APEX ROAST home">
          <img src={asset.logo} alt="" className="brand-mark" />
          <span>
            <strong>APEX</strong>
            <small>ROAST / BRAND GUIDE</small>
          </span>
        </a>
        <nav className={mobileNavOpen ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
          {currentNav.map((item) => (
            <button key={item.id} onClick={() => { scrollToId(item.id); setMobileNavOpen(false); }}>
              <span>{item.number}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <span className="nav-status"><CircleDashed size={13} /> {t.status}</span>
          <button className="language-toggle" onClick={() => setLang(lang === "en" ? "ar" : "en")} aria-label={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}><Globe2 size={14} />{lang === "en" ? "عربي" : "EN"}</button>
          <button className="nav-menu" onClick={() => setMobileNavOpen((value) => !value)} aria-label="Toggle navigation">
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="chapter-rail hero-rail"><span>00</span><i /><span>06</span></div>
          <div className="hero-copy">
            <p className="eyebrow light"><span className="eyebrow-dot" /> {t.cover}</p>
            <h1>{t.heroTitleA}<br /><em>{t.heroTitleB}</em></h1>
            <p className="hero-lede">{t.heroLede}</p>
            <div className="hero-actions">
              <button className="button button-gold" onClick={() => scrollToId("dna")}>{t.explore} <ArrowDownRight size={16} /></button>
              <button className="text-link light-link" onClick={() => scrollToId("prompts")}>{t.openPrompts} <ArrowUpRight size={15} /></button>
            </div>
            <div className="hero-meta"><span>{t.metaOne}</span><span>{t.metaTwo}</span><span>{t.metaThree}</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <img src={asset.hero} alt="APEX ROAST coffee bag and ceramic cup in warm directional light" />
              <div className="hero-image-caption"><span>FIG. 01</span><span>{lang === "ar" ? "طقس الارتقاء" : "The ritual of elevation"}</span></div>
            </div>
            <div className="hero-stamp"><img src={asset.logo} alt="" /><span>ROASTED<br />WITH INTENT</span></div>
          </div>
        </section>

        <section className="manifesto-strip">
          <RiseSeal compact />
          <p className="eyebrow"><span className="eyebrow-dot" /> {t.idea}</p>
          <p className="manifesto-copy">{t.manifestoA}<br /><strong>{t.manifestoB}</strong></p>
          <span className="strip-index">01 — 04</span>
        </section>

        <section className="strategy-section section-light" id="strategy">
          <div className="section-intro">
            <div className="section-number">01<span>/</span>04</div>
            <div>
              <p className="eyebrow"><span className="eyebrow-dot" /> {t.strategyEyebrow}</p>
              <h2>{t.strategyTitleA}<br /><em>{t.strategyTitleB}</em></h2>
            </div>
          </div>
          <div className="strategy-content">
            <div className="strategy-lead"><p>{t.positioningBody}</p><span className="big-quote">“</span></div>
            <div className="strategy-grid">
              <article className="editorial-card featured-card"><span className="card-kicker">{t.positioning}</span><h3>{t.positioningTitle}</h3><p>{t.positioningBody}</p><span className="card-index">01</span></article>
              <article className="editorial-card"><span className="card-kicker">{t.promise}</span><h3>{t.promiseTitle}</h3><p>{t.promiseBody}</p><span className="card-index">02</span></article>
              <article className="editorial-card"><span className="card-kicker">{t.personality}</span><h3>{t.personalityTitle}</h3><p>{t.personalityBody}</p><span className="card-index">03</span></article>
            </div>
          </div>
        </section>

        <section className="dna-section section-dark" id="dna">
          <div className="chapter-rail"><span>02</span><i /><span>04</span></div>
          <div className="section-intro dark-intro">
            <div className="section-number">02<span>/</span>04</div>
            <div><p className="eyebrow light"><span className="eyebrow-dot" /> {t.dnaEyebrow}</p><h2>{t.dnaTitleA}<br /><em>{t.dnaTitleB}</em></h2></div>
          </div>
          <div className="dna-layout">
            <div className="logo-specimen">
              <div className="specimen-header"><span>{t.primarySymbol}</span><span>01 / 04</span></div>
              <div className="logo-stage"><div className="logo-grid-lines" /><img src={asset.logo} alt="APEX ROAST summit bean symbol" /><span className="axis-label axis-top">APEX</span><span className="axis-label axis-bottom">ROAST</span></div>
              <div className="specimen-footer"><span>{t.geometry}</span><span>{t.beanSpace}</span></div>
            </div>
            <div className="dna-copy"><p className="section-kicker light">{t.dnaKicker}</p><p className="body-copy light-copy">{t.dnaBody}</p><div className="rule-list"><div><span>01</span><p>{lang === "ar" ? "شبكة 8 نقاط" : "8-point grid"}<br /><small>{lang === "ar" ? "منضبطة وليست جامدة." : "Disciplined, never rigid."}</small></p></div><div><span>02</span><p>{lang === "ar" ? "الفراغ السلبي" : "Negative space"}<br /><small>{lang === "ar" ? "الفخامة عبر التحكم." : "Luxury through control."}</small></p></div><div><span>03</span><p>{lang === "ar" ? "دقة دافئة" : "Warm precision"}<br /><small>{lang === "ar" ? "المعلومات تلتقي بالإحساس." : "Data meets sensation."}</small></p></div></div></div>
          </div>
          <div className="palette-wrap"><div className="palette-heading"><p className="eyebrow light"><span className="eyebrow-dot" /> {t.palette}</p><span>{t.clickSwatch}</span></div><div className="palette-grid">{palette.map((color, index) => <button className={`color-swatch ${color.tone}`} key={color.hex} onClick={() => copyPrompt(color.hex, color.hex)} style={{ background: color.hex }} aria-label={`Copy ${color.name} ${color.hex}`}><span className="swatch-hover">{copied === color.hex ? <Check size={14} /> : <Copy size={14} />}</span><div><strong>{lang === "ar" ? paletteLabels[index][1] : paletteLabels[index][0]}</strong><small>{color.hex}</small><em>{lang === "ar" ? paletteLabels[index][3] : paletteLabels[index][2]}</em></div></button>)}</div></div>
          <div className="type-section"><div><p className="eyebrow light"><span className="eyebrow-dot" /> {t.typography}</p><h3 className="serif-display">{t.typeTitleA}<br /><em>{t.typeTitleB}</em></h3></div><div className="type-specimens"><div className="type-row"><span>{t.display}</span><strong>{lang === "ar" ? "اصعد إلى<br />الطقس." : "Rise into<br />the ritual."}</strong></div><div className="type-row"><span>{t.utility}</span><p>{lang === "ar" ? "المصدر / الارتفاع / المعالجة / الوضوح" : "Origin / altitude / process / clarity"}<br /><b>{lang === "ar" ? "محمصة بنية." : "ROASTED WITH INTENT."}</b></p></div></div></div>
        </section>

        <section className="applications-section section-light" id="applications">
          <div className="section-intro"><div className="section-number">03<span>/</span>04</div><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.appsEyebrow}</p><h2>{t.appsTitleA}<br /><em>{t.appsTitleB}</em></h2></div></div>
          <div className="applications-layout"><div className="app-tabs">{applications.map((item, index) => <button key={item.id} className={activeApp === item.id ? "app-tab active" : "app-tab"} onClick={() => setActiveApp(item.id)}><span>0{index + 1}</span>{lang === "ar" ? applicationCopy[index][1] : applicationCopy[index][0]}<ArrowUpRight size={15} /></button>)}<div className="app-note"><Sparkles size={15} /> {t.appNote}</div></div><div className={`application-card tint-${selectedApp.tint}`}><img src={selectedApp.image} alt={lang === "ar" ? selectedAppCopy[5] : selectedAppCopy[4]} /><div className="application-overlay"><p className="eyebrow light"><span className="eyebrow-dot" /> {lang === "ar" ? selectedAppCopy[3] : selectedAppCopy[2]}</p><h3>{lang === "ar" ? selectedAppCopy[5] : selectedAppCopy[4]}</h3><p>{lang === "ar" ? selectedAppCopy[7] : selectedAppCopy[6]}</p><span className="application-arrow"><ArrowUpRight size={19} /></span></div></div></div>
          <div className="application-footnote"><span>03</span><p>{t.appFoot}</p><ArrowDownRight size={18} /></div>
        </section>

        <section className="prompt-section section-dark" id="prompts">
          <div className="chapter-rail"><span>04</span><i /><span>05</span></div>
          <div className="section-intro dark-intro"><div className="section-number">04<span>/</span>05</div><div><p className="eyebrow light"><span className="eyebrow-dot" /> {t.promptEyebrow}</p><h2>{t.promptTitleA}<br /><em>{t.promptTitleB}</em></h2></div></div>
          <div className="prompt-header"><p className="body-copy light-copy">{t.promptBody}</p><div className="prompt-meta"><span><Clipboard size={15} /> {t.promptCount}</span><span><Layers3 size={15} /> {t.oneDna}</span></div></div>
          <div className="prompt-list">{currentPrompts.map((item) => { const isOpen = openPrompt === item.number; return <article className={isOpen ? "prompt-item is-open" : "prompt-item"} key={item.number}><button className="prompt-trigger" onClick={() => setOpenPrompt(isOpen ? "" : item.number)} aria-expanded={isOpen}><span className="prompt-number">{item.number}</span><span className="prompt-title">{item.title}</span><span className="prompt-thumb" aria-hidden="true"><img src={item.thumb} alt="" /><span>{t.preview}</span></span><span className="prompt-tag">{item.tag}</span>{isOpen ? <ChevronDown size={17} /> : <ArrowUpRight size={17} />}</button>{isOpen && <div className="prompt-detail"><p>{item.prompt}</p><button className="copy-button" onClick={() => copyPrompt(item.number, item.prompt)}>{copied === item.number ? <Check size={15} /> : <Copy size={15} />}{copied === item.number ? t.copied : t.copyPrompt}</button></div>}</article>; })}</div>
        </section>

        <section className="downloads-section section-light" id="downloads">
          <div className="section-intro"><div className="section-number">05<span>/</span>05</div><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.downloadEyebrow}</p><h2>{t.downloadTitleA}<br /><em>{t.downloadTitleB}</em></h2></div></div>
          <div className="download-lead"><p>{t.downloadBody}</p><span className="download-rule"><Package size={17} /> {lang === "ar" ? "APEX ROAST / مكتبة الأصول" : "APEX ROAST / ASSET LIBRARY"}</span></div>
          <div className="download-grid">
            <article className="download-card download-featured"><div className="download-icon"><FileText size={23} /></div><div><span className="card-kicker">{lang === "ar" ? "PDF / 12 صفحة" : "PDF / 12 pages"}</span><h3>{t.brandGuidelines}</h3><p>{t.brandGuidelinesBody}</p></div><a className="download-link" href={downloadable.brandPdf} download><Download size={16} /> {t.downloadPdf}</a></article>
            <article className="download-card"><div className="download-icon"><Layers3 size={23} /></div><div><span className="card-kicker">{lang === "ar" ? "متجهي / قابل للتحرير" : "Vector / editable"}</span><h3>{t.logoSvg}</h3><p>{t.logoSvgBody}</p></div><a className="download-link" href={downloadable.logoSvg} download><Download size={16} /> {t.downloadSvg}</a></article>
            <article className="download-card"><div className="download-icon"><ImageIcon size={23} /></div><div><span className="card-kicker">{lang === "ar" ? "PNG / معاينة" : "PNG / preview"}</span><h3>{t.logoPng}</h3><p>{t.logoPngBody}</p></div><a className="download-link" href={asset.logo} download><Download size={16} /> {t.downloadPng}</a></article>
          </div>
        </section>

        <section className="handoff-section">
          <div className="handoff-mark"><img src={asset.logo} alt="" /></div>
          <div className="handoff-content"><p className="eyebrow light"><span className="eyebrow-dot" /> {t.finalEyebrow}</p><h2>{t.finalTitleA}<br /><em>{t.finalTitleB}</em></h2><p>{t.finalBody}</p><button className="button button-gold" onClick={() => scrollToId("top")}>{t.back} <ArrowUpRight size={16} /></button></div>
          <div className="handoff-side"><div className="handoff-list"><span>{t.logoSystem}</span><span>{t.colorType}</span><span>{lang === "ar" ? "التغليف" : "Packaging"}</span><span>{t.digitalSocial}</span><span>{t.productionPrompts}</span></div><div className="handoff-signature">APEX ROAST <span>{lang === "ar" ? "الدقة في القمة." : "Precision at the Peak."}</span></div></div>
        </section>
      </main>

      <footer className="site-footer"><span>{t.footerA}</span><span>{t.footerB}</span><span>{t.footerC}</span></footer>
    </div>
  );
}

export default Home;
