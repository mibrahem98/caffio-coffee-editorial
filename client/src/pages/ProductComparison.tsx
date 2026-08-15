import { ArrowLeft, ArrowUpRight, CheckCircle2, Copy, Scale, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import CartDrawer from "@/components/CartDrawer";
import MizanHeader from "@/components/MizanHeader";
import { formatPrice, getVerifiedTastingNotes, coffeeProducts, type CoffeeProduct, type Lang } from "@/lib/mizanCatalog";
import { comparisonSearch, isDistinctProductPair, NO_PRODUCT } from "@/lib/productComparison";

const copy = {
  en: {
    back: "Back to Caffio", eyebrow: "CAFFIO / SIDE-BY-SIDE", titleA: "Choose with", titleB: "the record open.", intro: "Compare two working product records in one shareable view. Pending fields remain pending; no origin or tasting claim is inferred.", first: "First coffee", second: "Second coffee", choose: "Select a coffee", same: "Choose two different coffees to compare.", emptyTitle: "Start with two records.", emptyBody: "Select two coffees to see their documented fields, pending states, and brew methods side by side.", source: "Evidence boundary", sourceBody: "Tasting cues appear only when both product records carry a verified batch note. The current catalog has no published verified tasting notes.", openSources: "Open source protocol", share: "Share comparison", copied: "Comparison link copied.", shared: "Share sheet opened.", shareError: "Unable to create a share link on this browser.", labels: { roast: "Roast profile", brew: "Brew methods", origin: "Origin", process: "Process", altitude: "Altitude", tasting: "Verified tasting", record: "Batch record", price: "Demo price" }, pending: "Pending source record", pendingTasting: "Awaiting verified batch tasting record", demo: "Demo only",
  },
  ar: {
    back: "العودة إلى كافيو", eyebrow: "كافيو / مقارنة جنبًا إلى جنب", titleA: "اختر مع", titleB: "فتح السجل.", intro: "قارن سجلي منتجين في عرض واحد قابل للمشاركة. تبقى الحقول المعلّقة معلّقة، ولا يُستنتج ادعاء عن المنشأ أو التذوق.", first: "القهوة الأولى", second: "القهوة الثانية", choose: "اختر قهوة", same: "اختر قهوتين مختلفتين للمقارنة.", emptyTitle: "ابدأ بسجلين.", emptyBody: "اختر قهوتين لعرض الحقول الموثقة والحالات المعلّقة وطرق التحضير جنبًا إلى جنب.", source: "حدّ الدليل", sourceBody: "لا تظهر إيحاءات التذوق إلا حين يحمل السجلان ملاحظة دفعة متحققة. لا يحوي الكتالوج الحالي إيحاءات تذوق متحققة منشورة.", openSources: "افتح بروتوكول المصادر", share: "مشاركة المقارنة", copied: "نُسخ رابط المقارنة.", shared: "فُتحت ورقة المشاركة.", shareError: "تعذر إنشاء رابط مشاركة من هذا المتصفح.", labels: { roast: "ملف التحميص", brew: "طرق التحضير", origin: "المنشأ", process: "المعالجة", altitude: "الارتفاع", tasting: "تذوق متحقق", record: "سجل الدفعة", price: "السعر التجريبي" }, pending: "سجل مصدر معلّق", pendingTasting: "بانتظار سجل تذوق موثّق للدفعة", demo: "تجريبي فقط",
  },
};

function initialProduct(key: "a" | "b") {
  const id = new URLSearchParams(window.location.search).get(key) || NO_PRODUCT;
  return coffeeProducts.some((product) => product.id === id) ? id : NO_PRODUCT;
}

export default function ProductComparison() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("mizan-lang") as Lang) || "en");
  const [firstId, setFirstId] = useState(() => initialProduct("a"));
  const [secondId, setSecondId] = useState(() => initialProduct("b"));
  const [shareMessage, setShareMessage] = useState("");
  const t = copy[lang];
  const products = useMemo(() => [coffeeProducts.find((product) => product.id === firstId), coffeeProducts.find((product) => product.id === secondId)] as [CoffeeProduct | undefined, CoffeeProduct | undefined], [firstId, secondId]);
  const canCompare = isDistinctProductPair(...products);

  useEffect(() => {
    const query = comparisonSearch(firstId, secondId);
    window.history.replaceState({}, "", `/compare${query ? `?${query}` : ""}`);
  }, [firstId, secondId]);

  const changeProduct = (position: 0 | 1, id: string) => {
    setShareMessage("");
    if (position === 0) setFirstId(id);
    else setSecondId(id);
  };

  const shareComparison = async () => {
    if (!canCompare) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Caffio Coffee comparison", url });
        setShareMessage(t.shared);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareMessage(t.copied);
      } else {
        setShareMessage(t.shareError);
      }
    } catch {
      setShareMessage(t.shareError);
    }
  };

  const getValue = (product: CoffeeProduct, key: keyof typeof t.labels) => {
    if (key === "roast") return product.profile[lang];
    if (key === "brew") return product.brewMethods.map((method) => method[lang]).join(" · ");
    if (key === "origin") return product.origin[lang];
    if (key === "process") return product.process[lang];
    if (key === "altitude") return product.altitude[lang];
    if (key === "record") return product.batch.verification[lang];
    if (key === "price") return formatPrice(product.price, lang);
    const notes = getVerifiedTastingNotes(product);
    return notes.length ? notes.map((note) => note[lang]).join(" · ") : t.pendingTasting;
  };

  const rows = Object.keys(t.labels) as (keyof typeof t.labels)[];
  return <div className="mizan-site comparison-site" dir={lang === "ar" ? "rtl" : "ltr"}>
    <MizanHeader lang={lang} onLangChange={setLang} home={false} />
    <CartDrawer lang={lang} />
    <main className="comparison-main">
      <div className="detail-topbar"><Link href="/"><ArrowLeft size={15} /> {t.back}</Link><span>{t.demo}</span></div>
      <section className="comparison-hero"><p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p>{t.intro}</p></section>
      <section className="comparison-workspace" aria-labelledby="comparison-title">
        <div className="comparison-workspace-head"><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p><h2 id="comparison-title">{canCompare ? `${products[0]?.shortName[lang]} / ${products[1]?.shortName[lang]}` : t.emptyTitle}</h2></div><Scale size={28} aria-hidden="true" /></div>
        <div className="comparison-selects">
          {[t.first, t.second].map((label, index) => <label key={label}><span>{label}</span><select value={index === 0 ? firstId : secondId} onChange={(event) => changeProduct(index as 0 | 1, event.target.value)}><option value={NO_PRODUCT}>{t.choose}</option>{coffeeProducts.map((product) => <option key={product.id} value={product.id}>{product.shortName[lang]}</option>)}</select></label>)}
        </div>
        {canCompare ? <>
          <div className="comparison-actions"><button className="button button-gold" type="button" onClick={shareComparison}><Share2 size={15} />{t.share}</button><p role="status" aria-live="polite">{shareMessage}</p></div>
          <div className="comparison-table" data-testid="product-comparison-table"><div className="comparison-table-head"><span>{t.labels.roast}</span>{products.map((product) => <strong key={product?.id}>{product?.shortName[lang]}</strong>)}</div>{rows.map((key) => <div key={key}><span>{t.labels[key]}</span>{products.map((product) => <strong key={`${key}-${product?.id}`} className={key === "tasting" && !getVerifiedTastingNotes(product!).length ? "comparison-pending" : ""}>{getValue(product!, key)}</strong>)}</div>)}</div>
          <aside className="comparison-evidence"><CheckCircle2 size={18} aria-hidden="true" /><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.source}</p><p>{t.sourceBody}</p><Link className="text-link" href="/sources">{t.openSources}<ArrowUpRight size={14} /></Link></div></aside>
        </> : <div className="comparison-empty" role="status"><Scale size={28} /><h2>{firstId !== NO_PRODUCT && secondId !== NO_PRODUCT ? t.same : t.emptyTitle}</h2><p>{firstId !== NO_PRODUCT && secondId !== NO_PRODUCT ? t.same : t.emptyBody}</p></div>}
      </section>
    </main>
    <footer className="mizan-footer"><span>CAFFIO COFFEE / SPECIALTY ROASTERS</span><span>{lang === "ar" ? "مقارنة قابلة للمشاركة" : "A SHAREABLE COMPARISON"}</span><span>© 2026 / {t.demo.toUpperCase()}</span></footer>
  </div>;
}
