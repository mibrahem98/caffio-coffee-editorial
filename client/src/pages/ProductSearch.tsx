import { ArrowLeft, ArrowUpRight, ChevronDown, Clock3, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import CartDrawer from "@/components/CartDrawer";
import MizanHeader from "@/components/MizanHeader";
import ResponsiveImage from "@/components/ResponsiveImage";
import { coffeeProducts, formatPrice, type Lang } from "@/lib/mizanCatalog";
import { responsiveImages } from "@/lib/responsiveImages";

type Sort = "featured" | "price-asc" | "price-desc" | "name";
type RecentSearch = { term: string; at: number };
const RECENT_SEARCH_KEY = "caffio-recent-product-searches-v1";

const copy = {
  en: { back: "Back to Caffio", eyebrow: "CAFFIO / PRODUCT SEARCH", titleA: "Find your", titleB: "starting point.", intro: "Search the working collection, then refine it by roast, brew method, and demo price. Product facts remain marked as pending until source records are attached.", search: "Search coffee, profile, or brew method", filters: "Refine results", roast: "Roast", brew: "Brew method", tasting: "Tasting note", tastingAll: "All documented notes", tastingUnavailable: "Tasting-note filters unlock only after a verified batch record is attached.", price: "Demo price", allRoasts: "All roasts", allBrews: "All brew methods", anyPrice: "Any price", under18: "Under $18", from18to19: "$18–$19", from20: "$20 and above", sort: "Sort by", featured: "Editorial order", priceAsc: "Price: low to high", priceDesc: "Price: high to low", name: "Name", results: "coffees found", clear: "Clear filters", noTitle: "No coffees match this view.", noBody: "Try clearing a filter or search with a broader word. The current catalog is intentionally small while source records are prepared.", reset: "Reset search", details: "View details", sourcePending: "Source record pending", demo: "Demo price", recent: "Recent searches", recentBody: "Saved in this browser only. No account or profile is created.", clearRecent: "Clear recent searches", loading: "Updating results" },
  ar: { back: "العودة إلى كافيو", eyebrow: "كافيو / بحث المنتجات", titleA: "اعثر على", titleB: "نقطة بدايتك.", intro: "ابحث في المجموعة الحالية ثم صفِّ النتائج بالتحميص وطريقة التحضير والسعر التجريبي. تبقى حقائق المنتج موسومة بأنها قيد التوثيق إلى أن تُرفق سجلات المصدر.", search: "ابحث عن قهوة أو ملف أو طريقة تحضير", filters: "صقل النتائج", roast: "التحميص", brew: "طريقة التحضير", tasting: "إيحاءات التذوق", tastingAll: "كل الإيحاءات الموثقة", tastingUnavailable: "تتوافر تصفية الإيحاءات بعد إرفاق سجل دفعة موثّق فقط.", price: "السعر التجريبي", allRoasts: "كل التحميصات", allBrews: "كل طرق التحضير", anyPrice: "أي سعر", under18: "أقل من 18 دولارًا", from18to19: "18–19 دولارًا", from20: "20 دولارًا فأعلى", sort: "ترتيب حسب", featured: "الترتيب التحريري", priceAsc: "السعر: الأقل أولًا", priceDesc: "السعر: الأعلى أولًا", name: "الاسم", results: "قهوة متاحة", clear: "مسح التصفية", noTitle: "لا توجد قهوة مطابقة لهذا العرض.", noBody: "جرّب مسح فلتر أو كلمة بحث أوسع. الكتالوج صغير عمدًا بينما تُجهّز سجلات المصدر.", reset: "إعادة ضبط البحث", details: "عرض التفاصيل", sourcePending: "سجل المصدر قيد الإعداد", demo: "سعر تجريبي", recent: "عمليات البحث الأخيرة", recentBody: "محفوظة في هذا المتصفح فقط. لا يُنشأ حساب أو ملف شخصي.", clearRecent: "مسح عمليات البحث", loading: "يتم تحديث النتائج" },
};

function initialParam(key: string, fallback = "all") { return new URLSearchParams(window.location.search).get(key) || fallback; }
function loadRecentSearches(): RecentSearch[] { try { const value = JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) || "[]"); return Array.isArray(value) ? value.filter((item): item is RecentSearch => typeof item?.term === "string" && typeof item?.at === "number").slice(0, 5) : []; } catch { return []; } }
function isDocumentedTastingNote(note: { en: string; ar: string }) { return !/(pending|بانتظار|not reviewed)/i.test(`${note.en} ${note.ar}`); }

export default function ProductSearch() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("mizan-lang") as Lang) || "en");
  const [query, setQuery] = useState(() => initialParam("q", ""));
  const [roast, setRoast] = useState(() => initialParam("roast"));
  const [brew, setBrew] = useState(() => initialParam("brew"));
  const [tasting, setTasting] = useState(() => initialParam("tasting"));
  const [price, setPrice] = useState(() => initialParam("price"));
  const [sort, setSort] = useState<Sort>(() => initialParam("sort", "featured") as Sort);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(loadRecentSearches);
  const [isUpdating, setIsUpdating] = useState(false);
  const t = copy[lang];
  const direction = lang === "ar" ? "rtl" : "ltr";
  const brewOptions = useMemo(() => Array.from(new Set(coffeeProducts.flatMap((product) => product.brewMethods.map((method) => method[lang])))), [lang]);
  const tastingOptions = useMemo(() => Array.from(new Set(coffeeProducts.flatMap((product) => product.tastingNotes.filter(isDocumentedTastingNote).map((note) => note[lang])))), [lang]);
  const startUpdate = () => setIsUpdating(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (roast !== "all") params.set("roast", roast);
    if (brew !== "all") params.set("brew", brew);
    if (tasting !== "all") params.set("tasting", tasting);
    if (price !== "all") params.set("price", price);
    if (sort !== "featured") params.set("sort", sort);
    window.history.replaceState({}, "", `${window.location.pathname}${params.size ? `?${params}` : ""}`);
  }, [query, roast, brew, tasting, price, sort]);

  useEffect(() => {
    if (!query.trim()) return;
    const timer = window.setTimeout(() => {
      const term = query.trim();
      setRecentSearches((current) => {
        const next = [{ term, at: Date.now() }, ...current.filter((item) => item.term.toLocaleLowerCase() !== term.toLocaleLowerCase())].slice(0, 5);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next));
        return next;
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!isUpdating) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setIsUpdating(false), reduceMotion ? 0 : 180);
    return () => window.clearTimeout(timer);
  }, [isUpdating, query, roast, brew, tasting, price, sort]);

  const results = useMemo(() => coffeeProducts.filter((product) => {
    const haystack = [product.name[lang], product.shortName[lang], product.profile[lang], product.origin[lang], product.process[lang], ...product.brewMethods.map((method) => method[lang])].join(" ").toLocaleLowerCase(lang === "ar" ? "ar" : "en");
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLocaleLowerCase(lang === "ar" ? "ar" : "en"));
    const matchesRoast = roast === "all" || product.roastTone === roast;
    const matchesBrew = brew === "all" || product.brewMethods.some((method) => method[lang] === brew);
    const matchesTasting = tasting === "all" || product.tastingNotes.filter(isDocumentedTastingNote).some((note) => note[lang] === tasting);
    const matchesPrice = price === "all" || (price === "under18" && product.price < 18) || (price === "18to19" && product.price >= 18 && product.price < 20) || (price === "from20" && product.price >= 20);
    return matchesQuery && matchesRoast && matchesBrew && matchesTasting && matchesPrice;
  }).sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "name" ? a.name[lang].localeCompare(b.name[lang], lang) : coffeeProducts.indexOf(a) - coffeeProducts.indexOf(b)), [brew, lang, price, query, roast, sort, tasting]);

  const reset = () => { startUpdate(); setQuery(""); setRoast("all"); setBrew("all"); setTasting("all"); setPrice("all"); setSort("featured"); };
  const selectRecent = (term: string) => { startUpdate(); setQuery(term); };
  const clearRecent = () => { localStorage.removeItem(RECENT_SEARCH_KEY); setRecentSearches([]); };

  return <div className="mizan-site search-site" dir={direction}>
    <MizanHeader lang={lang} onLangChange={setLang} home={false} />
    <CartDrawer lang={lang} />
    <main className="product-search-main"><div className="detail-topbar"><Link href="/"><ArrowLeft size={15} /> {t.back}</Link><span>{results.length} {t.results}</span></div><section className="search-hero"><p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p>{t.intro}</p><label className="product-search-input"><Search size={20} /><input value={query} onChange={(event) => { startUpdate(); setQuery(event.target.value); }} placeholder={t.search} aria-label={t.search} /><span>{query && <button type="button" onClick={() => { startUpdate(); setQuery(""); }} aria-label={t.clear}><X size={16} /></button>}</span></label>{recentSearches.length > 0 && <div className="recent-searches" data-testid="recent-searches"><div><span><Clock3 size={14} /> {t.recent}</span><button type="button" onClick={clearRecent}>{t.clearRecent}</button></div><p>{t.recentBody}</p><ul>{recentSearches.map((item) => <li key={`${item.term}-${item.at}`}><button type="button" onClick={() => selectRecent(item.term)}>{item.term}</button></li>)}</ul></div>}</section><section className="search-results-section"><aside className="search-filters" aria-label={t.filters}><div className="search-filter-head"><span><SlidersHorizontal size={16} /> {t.filters}</span><button type="button" onClick={reset}>{t.clear}</button></div><label><span>{t.roast}</span><select value={roast} onChange={(event) => { startUpdate(); setRoast(event.target.value); }}><option value="all">{t.allRoasts}</option><option value="light">{lang === "ar" ? "خفيف" : "Light"}</option><option value="medium">{lang === "ar" ? "متوسط" : "Medium"}</option><option value="espresso">{lang === "ar" ? "إسبريسو" : "Espresso"}</option></select></label><label><span>{t.brew}</span><select value={brew} onChange={(event) => { startUpdate(); setBrew(event.target.value); }}><option value="all">{t.allBrews}</option>{brewOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label><label><span>{t.tasting}</span><select value={tasting} disabled={!tastingOptions.length} aria-describedby="tasting-note-filter-status" onChange={(event) => { startUpdate(); setTasting(event.target.value); }}><option value="all">{t.tastingAll}</option>{tastingOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select><small id="tasting-note-filter-status">{tastingOptions.length ? "" : t.tastingUnavailable}</small></label><label><span>{t.price}</span><select value={price} onChange={(event) => { startUpdate(); setPrice(event.target.value); }}><option value="all">{t.anyPrice}</option><option value="under18">{t.under18}</option><option value="18to19">{t.from18to19}</option><option value="from20">{t.from20}</option></select></label></aside><div className="search-results"><div className="search-results-head"><p><Filter size={15} /> {results.length} {t.results}</p><label><span>{t.sort}</span><select value={sort} onChange={(event) => { startUpdate(); setSort(event.target.value as Sort); }}><option value="featured">{t.featured}</option><option value="price-asc">{t.priceAsc}</option><option value="price-desc">{t.priceDesc}</option><option value="name">{t.name}</option></select><ChevronDown size={14} /></label></div><div className={isUpdating ? "search-results-body is-updating" : "search-results-body"} aria-busy={isUpdating}>{isUpdating && <div className="search-skeleton-grid" aria-hidden="true">{Array.from({ length: 3 }).map((_, index) => <div className="search-skeleton-card" key={index}><i /><span><b /><b /><b /></span></div>)}</div>}{results.length ? <div className="search-product-grid">{results.map((product) => <article className="search-product-card" key={product.id}><ResponsiveImage image={responsiveImages[product.imageKey]} alt={`${product.shortName[lang]} coffee`} loading="lazy" decoding="async" /><div><span>{t.sourcePending}</span><h2>{product.name[lang]}</h2><p>{product.profile[lang]}</p><small>{product.brewMethods.map((method) => method[lang]).join(" · ")}</small><div><strong>{t.demo} / {formatPrice(product.price, lang)}</strong><Link className="text-link" href={`/coffee/${product.id}`}>{t.details}<ArrowUpRight size={14} /></Link></div></div></article>)}</div> : <div className="search-empty" role="status"><Search size={28} /><h2>{t.noTitle}</h2><p>{t.noBody}</p><button className="button button-gold" type="button" onClick={reset}>{t.reset}<ArrowUpRight size={15} /></button></div>}</div></div></section></main>
    <footer className="mizan-footer"><span>CAFFIO COFFEE / SPECIALTY ROASTERS</span><span>{lang === "ar" ? "بحث منظم" : "A CONSIDERED SEARCH"}</span><span>© 2026 / PRODUCT SEARCH</span></footer>
  </div>;
}
