import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, BookOpen, CheckCircle2, ChevronDown, Coffee, Compass, Filter, Leaf, Package, Scale, Search, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import MizanHeader from "@/components/MizanHeader";
import CartDrawer from "@/components/CartDrawer";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useCart } from "@/contexts/CartContext";
import { coffeeProducts, formatPrice, type Lang } from "@/lib/mizanCatalog";
import { responsiveImages } from "@/lib/responsiveImages";

const copy = {
  en: {
    status: "Roastery / source records in progress", cover: "MIZAN COFFEE / SPECIALTY ROASTERS", heroA: "Balance", heroB: "in every cup.", heroBody: "Origin-led coffee for people who notice the quiet details — roasted with clarity, served with intention.", explore: "Explore the collection", story: "Our approach", skipMain: "Skip to main content", metaA: "Small-batch profiles", metaB: "Source-led content", metaC: "Est. 2026", manifesto: "Good coffee is a practice.", manifestoEm: "Not a performance.", storyEyebrow: "01 / The MIZAN approach", storyA: "A quieter", storyB: "way to care.", storyBody: "MIZAN is a coffee house built around balance: between source and roast, guidance and freedom, ritual and the everyday. Every product page is designed to show what is known, what is pending, and where the next document belongs.", sourceNote: "Content status: product claims remain pending until a batch card or producer document is attached.", sourceLink: "Read the source protocol", collectionEyebrow: "02 / The collection", collectionA: "Choose your", collectionB: "starting point.", collectionBody: "Explore the current working catalog. Prices, origin fields, and tasting notes are marked as demo content until verified product records are connected.", filter: "Filter", all: "All profiles", light: "Light roast", medium: "Medium roast", espresso: "Espresso", search: "Search coffee", compare: "Compare two coffees", compareHint: "A fast view for choosing a starting point.", field: "Field notes", add: "Add to cart", details: "View details", demo: "Demo profile", ritualEyebrow: "03 / The ritual", ritualA: "Brew with", ritualB: "a little room.", ritualBody: "Recipes are starting points, not rules. Keep the ratio steady, then let water, grind, and time become your own small experiment.", ritualCaption: "Small gestures / big difference", guide: "Open brew guide", notesEyebrow: "04 / Field notes", notesA: "A few things", notesB: "worth slowing down for.", read: "Read the note", note1: "What a product card should prove", note1Body: "A useful product page separates a documented fact from a working profile, so the cup can be understood without overclaiming.", note2: "A five-minute pour-over", note2Body: "A calm starting recipe built around repeatability, with room for the person holding the brewer.", note3: "Keep the good part", note3Body: "Storage, freshness, and the small habits that protect aroma deserve the same attention as the roast.", faqEyebrow: "05 / Common questions", faqA: "Clear answers", faqB: "for better mornings.", faq1: "How do I choose a coffee?", faq1Body: "Start with the roast profile and brew method, then open the product detail page. Origin and tasting fields are only treated as final when a supporting record is attached.", faq2: "Are the prices and checkout live?", faq2Body: "No. The cart is an interactive front-end simulation. It does not process payments or create a real order.", faq3: "When will reviews appear?", faq3Body: "Only after verified customer feedback is collected and approved for publication. Until then, each product shows a transparent empty state.", joinEyebrow: "Stay close to the roast", joinA: "The next good", joinB: "cup starts here.", joinBody: "Occasional origin records, brew notes, and quiet invitations from the roastery. No noise.", email: "Your email address", join: "Join the list", emailRequired: "Enter your email address.", emailInvalid: "Use a valid email format, such as hello@example.com.", joined: "You’re on the list. We’ll keep the next note close.", joinedTitle: "You’re on the list.", joinedBody: "The next note will find its way to your inbox.", useAnother: "Use another email", footerA: "MIZAN COFFEE / SPECIALTY ROASTERS", footerB: "BALANCE IN EVERY CUP", footerC: "© 2026 / CONTENT STATUS: DEMO", copyLang: "عربي" },
  ar: {
    status: "المحمصة / سجلات المصدر قيد الإعداد", cover: "ميزان / محمصة قهوة مختصة", heroA: "توازن", heroB: "في كل كوب.", heroBody: "قهوة تبدأ من المصدر لمن يلاحظ التفاصيل الهادئة — تُحمّص بوضوح وتُقدّم بنيّة.", explore: "استكشف المجموعة", story: "منهجنا في العمل", skipMain: "انتقل إلى المحتوى الرئيسي", metaA: "ملفات تحميص صغيرة", metaB: "محتوى يبدأ من المصدر", metaC: "منذ 2026", manifesto: "القهوة الجيدة ممارسة.", manifestoEm: "وليست استعراضًا.", storyEyebrow: "01 / منهج ميزان", storyA: "طريقة", storyB: "أهدأ للاهتمام.", storyBody: "ميزان بيت قهوة يقوم على التوازن: بين المصدر والتحميص، والإرشاد والحرية، والطقس واليومي. صُممت كل صفحة منتج لتوضح ما هو معروف، وما يزال قيد التوثيق، وأين يوضع المستند القادم.", sourceNote: "حالة المحتوى: تبقى ادعاءات المنتج قيد التوثيق حتى إرفاق بطاقة دفعة أو مستند منتج.", sourceLink: "اقرأ بروتوكول المصادر", collectionEyebrow: "02 / المجموعة", collectionA: "اختر", collectionB: "نقطة البداية.", collectionBody: "استكشف الكتالوج الحالي. تُوسم الأسعار وحقول المنشأ وملاحظات التذوق كمحتوى تجريبي حتى ربط سجلات المنتجات الموثقة.", filter: "تصفية", all: "كل الملفات", light: "تحميص خفيف", medium: "تحميص متوسط", espresso: "إسبريسو", search: "ابحث عن قهوة", compare: "قارن قهوتين", compareHint: "عرض سريع لاختيار نقطة البداية.", field: "ملاحظات الحقل", add: "أضف إلى السلة", details: "عرض التفاصيل", demo: "ملف تجريبي", ritualEyebrow: "03 / الطقس", ritualA: "حضّرها", ritualB: "مع مساحة للتجربة.", ritualBody: "الوصفات نقاط بداية لا قواعد. حافظ على النسبة، ثم دع الماء والطحن والوقت تصبح تجربتك الصغيرة.", ritualCaption: "إيماءات صغيرة / فرق كبير", guide: "افتح دليل التحضير", notesEyebrow: "04 / ملاحظات الحقل", notesA: "أشياء قليلة", notesB: "تستحق التمهّل.", read: "اقرأ الملاحظة", note1: "ما الذي يجب أن تثبته بطاقة المنتج؟", note1Body: "تفرق صفحة المنتج المفيدة بين الحقيقة الموثقة والملف التجريبي، حتى يُفهم الكوب دون مبالغة.", note2: "الترشيح في خمس دقائق", note2Body: "وصفة بداية هادئة مبنية على قابلية التكرار مع مساحة لصاحب أداة التحضير.", note3: "احتفظ بالجزء الجيد", note3Body: "التخزين والطزاجة والعادات الصغيرة التي تحمي الرائحة تستحق عناية تساوي عناية التحميص.", faqEyebrow: "05 / أسئلة شائعة", faqA: "إجابات واضحة", faqB: "لصباح أفضل.", faq1: "كيف أختار القهوة؟", faq1Body: "ابدأ بملف التحميص وطريقة التحضير، ثم افتح صفحة تفاصيل المنتج. لا تُعامل معلومات المنشأ والتذوق كنهائية إلا مع وجود سجل داعم.", faq2: "هل الأسعار وإتمام الطلب حقيقيان؟", faq2Body: "لا. السلة محاكاة أمامية تفاعلية ولا تعالج دفعات أو تنشئ طلبًا حقيقيًا.", faq3: "متى ستظهر المراجعات؟", faq3Body: "فقط بعد جمع ملاحظات عملاء موثقة واعتمادها للنشر. حتى ذلك الحين تعرض كل قهوة حالة فارغة شفافة.", joinEyebrow: "ابق قريبًا من التحميص", joinA: "الكوب الجيد", joinB: "التالي يبدأ هنا.", joinBody: "سجلات مصادر موسمية، وملاحظات تحضير، ودعوات هادئة من المحمصة. بلا ضجيج.", email: "بريدك الإلكتروني", join: "انضم إلى القائمة", emailRequired: "أدخل بريدك الإلكتروني.", emailInvalid: "استخدم صيغة بريد صحيحة مثل hello@example.com.", joined: "تم تسجيلك. سنبقي الملاحظة القادمة قريبة.", joinedTitle: "تم تسجيلك.", joinedBody: "ستصل الملاحظة القادمة إلى بريدك قريبًا.", useAnother: "استخدم بريدًا آخر", footerA: "ميزان / محمصة قهوة مختصة", footerB: "توازن في كل كوب", footerC: "© 2026 / حالة المحتوى: تجريبي", copyLang: "EN" },
};

const profileLabels: Record<Lang, Record<string, string>> = {
  en: { light: "Light", medium: "Medium", espresso: "Espresso" },
  ar: { light: "خفيف", medium: "متوسط", espresso: "إسبريسو" },
};

const heroSignals = {
  en: [
    { label: "Source-aware", detail: "Records stay distinct from working notes", icon: Compass },
    { label: "Three roast profiles", detail: "A calm starting point for every ritual", icon: Coffee },
    { label: "Guides, not rules", detail: "Brew notes leave room for your method", icon: BookOpen },
  ],
  ar: [
    { label: "مصدر واضح", detail: "السجل الموثق منفصل عن الملاحظات التجريبية", icon: Compass },
    { label: "ثلاثة ملفات تحميص", detail: "نقطة بداية هادئة لكل طقس", icon: Coffee },
    { label: "إرشاد لا أوامر", detail: "ملاحظات التحضير تترك مساحة لطريقتك", icon: BookOpen },
  ],
};

const societyFaq = {
  en: { question: "Is Caffio Society ready for paid subscriptions?", answer: "Not yet. Society currently creates a local demo record only. It remains clearly marked as a simulation until Stripe, webhook verification, pricing, and fulfillment rules are approved." },
  ar: { question: "هل مجتمع كافيو جاهز لاشتراك مدفوع؟", answer: "ليس بعد. ينشئ المجتمع حاليًا سجلًا تجريبيًا محليًا فقط، وسيبقى موسومًا كمحاكاة إلى أن يعتمد Stripe والتحقق عبر webhook والأسعار وقواعد التنفيذ." },
};

const faqDiscovery = {
  en: { search: "Search questions", all: "All", choosing: "Choosing coffee", commerce: "Orders & payment", trust: "Records & reviews", society: "Society", results: "answers shown", empty: "No answer matches that search. Try another category or phrase." },
  ar: { search: "ابحث في الأسئلة", all: "الكل", choosing: "اختيار القهوة", commerce: "الطلبات والدفع", trust: "السجلات والمراجعات", society: "المجتمع", results: "إجابة ظاهرة", empty: "لا توجد إجابة مطابقة. جرّب فئة أو عبارة أخرى." },
};

function MizanHome() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("mizan-lang") as Lang) || "en");
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [compareIds, setCompareIds] = useState([coffeeProducts[0].id, coffeeProducts[1].id]);
  const [progress, setProgress] = useState(0);
  const [waitlistState, setWaitlistState] = useState<"idle" | "error" | "success">("idle");
  const [emailError, setEmailError] = useState("");
  const [openFaq, setOpenFaq] = useState("choosing");
  const [faqQuery, setFaqQuery] = useState("");
  const [faqCategory, setFaqCategory] = useState("all");
  const t = useMemo(() => Object.fromEntries(Object.entries(copy[lang]).map(([key, value]) => [key, value.replaceAll("MIZAN", "CAFFIO").replaceAll("ميزان", "كافيو")])) as typeof copy[typeof lang], [lang]);
  const { add } = useCart();
  const direction = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
    localStorage.setItem("mizan-lang", lang);
  }, [direction, lang]);

  useEffect(() => {
    const onScroll = () => { const max = document.documentElement.scrollHeight - window.innerHeight; setProgress(max ? Math.round((window.scrollY / max) * 100) : 0); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredProducts = useMemo(() => coffeeProducts.filter((product) => {
    const matchesFilter = activeFilter === "all" || product.roastTone === activeFilter;
    const haystack = `${product.name[lang]} ${product.origin[lang]} ${product.profile[lang]}`.toLowerCase();
    return matchesFilter && (!query.trim() || haystack.includes(query.trim().toLowerCase()));
  }), [activeFilter, lang, query]);
  const compareProducts = compareIds.map((id) => coffeeProducts.find((product) => product.id === id) || coffeeProducts[0]);
  const faqItems = [
    { id: "choosing", category: "choosing", question: t.faq1, answer: t.faq1Body },
    { id: "commerce", category: "commerce", question: t.faq2, answer: t.faq2Body },
    { id: "trust", category: "trust", question: t.faq3, answer: t.faq3Body },
    { id: "society", category: "society", question: societyFaq[lang].question, answer: societyFaq[lang].answer },
  ];
  const faqLabels = faqDiscovery[lang];
  const filteredFaqItems = faqItems.filter((item) => {
    const normalizedQuery = faqQuery.trim().toLocaleLowerCase(lang === "ar" ? "ar" : "en");
    const matchesCategory = faqCategory === "all" || item.category === faqCategory;
    const matchesQuery = !normalizedQuery || `${item.question} ${item.answer}`.toLocaleLowerCase(lang === "ar" ? "ar" : "en").includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  const handleWaitlist = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("email") as HTMLInputElement | null;
    const email = input?.value.trim() || "";
    if (!email) { setEmailError(t.emailRequired); setWaitlistState("error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError(t.emailInvalid); setWaitlistState("error"); return; }
    setEmailError(""); setWaitlistState("success"); toast.success(t.joined);
  };

  return <div className="mizan-site" dir={direction}>
    <a className="skip-link" href="#main-content">{t.skipMain}</a>
    <div className="reading-progress" style={{ width: `${progress}%` }} />
    <MizanHeader lang={lang} onLangChange={setLang} />
    <CartDrawer lang={lang} />
    <main id="main-content" tabIndex={-1}>
      <section className="mizan-hero">
        <div className="hero-contour contour-one" /><div className="hero-contour contour-two" />
        <div className="hero-rail"><span>00</span><i /><span>06</span></div>
        <div className="hero-copy"><p className="eyebrow light"><span className="eyebrow-dot" /> {t.cover}</p><h1>{t.heroA}<br /><em>{t.heroB}</em></h1><p className="hero-lede">{t.heroBody}</p><div className="hero-actions"><a className="button button-gold" data-testid="hero-collection-link" href="#collection">{t.explore}<ArrowDownRight size={16} /></a><a className="text-link light-link" href="#story">{t.story}<ArrowUpRight size={15} /></a><a className="hero-society-link" data-testid="hero-society-link" href="/society"><Sparkles size={15} /> {lang === "ar" ? "صمّم إيقاعك" : "Build your rhythm"}</a></div><div className="hero-signals" aria-label={lang === "ar" ? "مبادئ تجربة كافيو" : "Caffio experience principles"}>{heroSignals[lang].map(({ label, detail, icon: Icon }) => <div className="hero-signal" key={label}><span className="hero-signal-icon"><Icon size={15} aria-hidden="true" /></span><span><strong>{label}</strong><small>{detail}</small></span></div>)}</div><div className="hero-meta"><span>{t.metaA}</span><span>{t.metaB}</span><span>{t.metaC}</span></div></div>
        <div className="hero-visual"><div className="hero-image"><ResponsiveImage image={responsiveImages.hero} alt="Specialty coffee cups and roasted beans in warm light" fetchPriority="high" decoding="async" /><div className="hero-image-caption"><span>FIG. 01</span><span>{lang === "ar" ? "صباح محسوب التفاصيل" : "A considered morning"}</span></div></div><div className="hero-seal"><span className="mizan-symbol large" aria-hidden="true"><i /><b /><em /></span><span>ROASTED<br />WITH BALANCE</span></div><div className="hero-data"><small>{lang === "ar" ? "حالة المحتوى" : "CONTENT STATUS"}</small><strong>{lang === "ar" ? "تجريبي" : "DEMO"}</strong><span>{lang === "ar" ? "بانتظار سجلات الدفعات" : "Awaiting batch records"}</span></div></div>
      </section>
      <section className="manifesto"><span className="manifesto-mark"><span className="mizan-symbol" aria-hidden="true"><i /><b /><em /></span></span><p className="eyebrow"><span className="eyebrow-dot" /> {lang === "ar" ? "فكرة كافيو" : "The CAFFIO idea"}</p><p className="manifesto-copy">{t.manifesto}<br /><strong>{t.manifestoEm}</strong></p><span className="strip-index">01 — 06</span></section>

      <section className="story-section section-light" id="story"><div className="section-intro"><span className="section-number">01<span>/</span>06</span><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.storyEyebrow}</p><h2>{t.storyA}<br /><em>{t.storyB}</em></h2></div></div><div className="story-body"><p>{t.storyBody}</p><div className="source-note"><Compass size={16} /><span>{t.sourceNote}<a href="/case-study">{t.sourceLink}</a></span></div></div><div className="principle-grid"><article><span>01 / ORIGIN</span><h3>{lang === "ar" ? "المصدر قبل الزخرفة." : "Origin before ornament."}</h3><p>{lang === "ar" ? "نوضح ما نعرفه، ونوسم ما ينتظر التوثيق." : "Show what is known, label what still needs a source."}</p><Leaf size={21} /></article><article><span>02 / ROAST</span><h3>{lang === "ar" ? "تحميص بوضوح." : "Roast with clarity."}</h3><p>{lang === "ar" ? "ملف عملي يترك للشخصية مساحة لتظهر." : "A practical profile that leaves room for character."}</p><Coffee size={21} /></article><article><span>03 / RITUAL</span><h3>{lang === "ar" ? "الخطوة الأخيرة إنسانية." : "The last step is human."}</h3><p>{lang === "ar" ? "إرشاد يساعدك دون أن يملي عليك الطقس." : "Guidance that helps without prescribing the ritual."}</p><Sparkles size={21} /></article></div></section>

      <section className="collection-section section-dark" id="collection"><div className="chapter-rail"><span>02</span><i /><span>06</span></div><div className="section-intro dark-intro"><span className="section-number">02<span>/</span>06</span><div><p className="eyebrow light"><span className="eyebrow-dot" /> {t.collectionEyebrow}</p><h2>{t.collectionA}<br /><em>{t.collectionB}</em></h2></div></div><div className="collection-toolbar"><p>{t.collectionBody}</p><div className="toolbar-actions"><label className="coffee-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} /></label><div className="filter-group"><Filter size={14} />{["all", "light", "medium", "espresso"].map((filter) => <button key={filter} className={activeFilter === filter ? "is-active" : ""} onClick={() => setActiveFilter(filter)}>{t[filter as "all" | "light" | "medium" | "espresso"]}</button>)}</div></div></div><div className="product-grid">{filteredProducts.map((product) => <article className="product-tile" data-testid={`product-card-${product.id}`} key={product.id}><div className="product-image"><ResponsiveImage image={responsiveImages[product.imageKey]} alt={`${product.shortName[lang]} coffee profile`} loading="lazy" decoding="async" /><span>{t.demo}</span></div><div className="product-tile-copy"><div className="product-topline"><span><Coffee size={12} aria-hidden="true" /> {profileLabels[lang][product.roastTone]}</span><span><Package size={12} aria-hidden="true" /> {product.weight}</span></div><h3>{product.name[lang]}</h3><p>{product.profile[lang]}</p><small className="product-origin"><Compass size={12} aria-hidden="true" /><span>{product.origin[lang]}</span></small><div className="product-tile-actions"><a href={`/coffee/${product.id}`}>{t.details}<ArrowUpRight size={14} /></a><button onClick={() => { add(product.id); window.dispatchEvent(new CustomEvent("mizan:open-cart")); toast.success(lang === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart"); }}>{t.add}<ShoppingBag size={14} /></button></div></div></article>)}</div>{filteredProducts.length === 0 && <div className="empty-filter"><Search size={18} /><p>{lang === "ar" ? "لا توجد نتائج بهذا البحث." : "No coffee matches this search."}</p></div>}<div className="comparison-wrap"><div className="comparison-heading"><div><span className="eyebrow light"><span className="eyebrow-dot" /> {t.compare}</span><p>{t.compareHint}</p></div><Scale size={23} /></div><div className="compare-selects">{compareProducts.map((product, index) => <label key={index}><span>{lang === "ar" ? `القهوة ${index + 1}` : `Coffee ${index + 1}`}</span><select value={compareIds[index]} onChange={(event) => setCompareIds((current) => current.map((id, position) => position === index ? event.target.value : id))}>{coffeeProducts.map((option) => <option value={option.id} key={option.id}>{option.shortName[lang]}</option>)}</select></label>)}</div><div className="compare-table"><div><span>{lang === "ar" ? "التحميص" : "Roast"}</span>{compareProducts.map((product) => <strong key={product.id}>{product.profile[lang]}</strong>)}</div><div><span>{lang === "ar" ? "المصدر" : "Origin"}</span>{compareProducts.map((product) => <strong key={product.id}>{product.origin[lang]}</strong>)}</div><div><span>{lang === "ar" ? "الإيحاءات" : "Tasting"}</span>{compareProducts.map((product) => <strong key={product.id}>{product.tastingNotes[0][lang]}</strong>)}</div></div></div></section>

      <section className="ritual-section section-light" id="ritual"><div className="section-intro"><span className="section-number">03<span>/</span>06</span><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.ritualEyebrow}</p><h2>{t.ritualA}<br /><em>{t.ritualB}</em></h2></div></div><div className="ritual-grid"><div className="ritual-photo"><ResponsiveImage image={responsiveImages.ritual} alt="Pour-over coffee ritual in a calm morning light" loading="lazy" decoding="async" /><span>{t.ritualCaption}</span></div><div className="ritual-copy"><p>{t.ritualBody}</p><div className="brew-lines"><div><span>01 / POUR-OVER</span><strong>1:16 · 92°C · 04:00</strong></div><div><span>02 / ESPRESSO</span><strong>1:2 · 93°C · 00:28</strong></div><a href="#faq">{t.guide}<ArrowUpRight size={15} /></a></div></div></div></section>

      <section className="notes-section section-light" id="notes"><div className="section-intro"><span className="section-number">04<span>/</span>06</span><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.notesEyebrow}</p><h2>{t.notesA}<br /><em>{t.notesB}</em></h2></div></div><div className="notes-grid"><article><ResponsiveImage image={responsiveImages.sombra} alt="Coffee beans on a tactile surface" loading="lazy" decoding="async" /><div><span>01 / CONTENT</span><h3>{t.note1}</h3><p>{t.note1Body}</p><a href="/notes">{t.read}<ArrowUpRight size={14} /></a></div></article><article><ResponsiveImage image={responsiveImages.house} alt="Pour-over coffee preparation" loading="lazy" decoding="async" /><div><span>02 / BREW</span><h3>{t.note2}</h3><p>{t.note2Body}</p><a href="/notes">{t.read}<ArrowUpRight size={14} /></a></div></article><article><ResponsiveImage image={responsiveImages.journal} alt="Coffee beside a window" loading="lazy" decoding="async" /><div><span>03 / FRESHNESS</span><h3>{t.note3}</h3><p>{t.note3Body}</p><a href="/notes">{t.read}<ArrowUpRight size={14} /></a></div></article></div></section>

      <section className="faq-section section-dark" id="faq"><div className="section-intro dark-intro"><span className="section-number">05<span>/</span>06</span><div><p className="eyebrow light"><span className="eyebrow-dot" /> {t.faqEyebrow}</p><h2>{t.faqA}<br /><em>{t.faqB}</em></h2></div></div><div className="faq-discovery" data-testid="faq-discovery"><label className="faq-search"><Search size={16} /><input value={faqQuery} onChange={(event) => setFaqQuery(event.target.value)} placeholder={faqLabels.search} aria-label={faqLabels.search} /></label><div className="faq-categories" aria-label={lang === "ar" ? "تصنيفات الأسئلة" : "Question categories"}>{(["all", "choosing", "commerce", "trust", "society"] as const).map((category) => <button type="button" key={category} className={faqCategory === category ? "is-active" : ""} aria-pressed={faqCategory === category} onClick={() => { setFaqCategory(category); setOpenFaq(category === "all" ? "choosing" : category); }}>{faqLabels[category]}</button>)}</div><p className="faq-result-count" role="status">{filteredFaqItems.length} {faqLabels.results}</p></div><div className="faq-list" data-testid="faq-accordion">{filteredFaqItems.length ? filteredFaqItems.map((item, index) => { const isOpen = openFaq === item.id; const panelId = `faq-panel-${item.id}`; return <article className={isOpen ? "faq-item is-open" : "faq-item"} key={item.id}><button className="faq-trigger" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenFaq(isOpen ? "" : item.id)}><span><small>{String(index + 1).padStart(2, "0")}</small>{item.question}</span><ChevronDown size={17} aria-hidden="true" /></button><div className="faq-answer" id={panelId} aria-hidden={!isOpen}><div><p>{item.answer}</p></div></div></article>; }) : <div className="faq-empty" role="status"><Search size={18} /><p>{faqLabels.empty}</p></div>}</div></section>

      <section className="join-section" id="join"><div className="join-mark"><span className="mizan-symbol large" aria-hidden="true"><i /><b /><em /></span></div><div className="join-copy"><p className="eyebrow light"><span className="eyebrow-dot" /> {t.joinEyebrow}</p>{waitlistState === "success" ? <div className="join-success"><div className="success-icon"><CheckCircle2 size={28} /></div><h2>{t.joinedTitle}</h2><p>{t.joinedBody}</p><button className="text-link light-link" onClick={() => setWaitlistState("idle")}>{t.useAnother}<ArrowUpRight size={15} /></button></div> : <><h2>{t.joinA}<br /><em>{t.joinB}</em></h2><p>{t.joinBody}</p><form onSubmit={handleWaitlist} noValidate><input name="email" type="email" placeholder={t.email} aria-label={t.email} aria-invalid={waitlistState === "error"} aria-describedby={emailError ? "email-error" : undefined} onChange={() => { setEmailError(""); setWaitlistState("idle"); }} /><button className="button button-gold" type="submit">{t.join}<ArrowUpRight size={16} /></button></form>{emailError && <span className="email-error" id="email-error" role="alert">{emailError}</span>}</>}</div><div className="join-aside"><span>01</span><i /><span>{lang === "ar" ? "رسائل موسمية" : "Seasonal letters"}</span></div></section>
    </main>
    <footer className="mizan-footer"><span>{t.footerA}</span><span>{t.footerB}</span><span>{t.footerC}</span></footer>
  </div>;
}

export default function Home() {
  return <MizanHome />;
}
