import { ArrowLeft, ArrowUpRight, BookOpen, CheckCircle2, Download, FileText, Printer, Scale, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import CartDrawer from "@/components/CartDrawer";
import MizanHeader from "@/components/MizanHeader";
import { fieldNotes, formatPrice, getVerifiedTastingNotes, coffeeProducts, type CoffeeProduct, type Lang } from "@/lib/mizanCatalog";
import { buildComparisonSvg, downloadComparisonSvg } from "@/lib/comparisonExport";
import { comparisonSearch, isDistinctProductPair, NO_PRODUCT } from "@/lib/productComparison";

const copy = {
  en: {
    back: "Back to Caffio", eyebrow: "CAFFIO / SIDE-BY-SIDE", titleA: "Choose with", titleB: "the record open.", intro: "Compare two working product records in one shareable view. Pending fields remain pending; no origin or tasting claim is inferred.", first: "First coffee", second: "Second coffee", choose: "Select a coffee", same: "Choose two different coffees to compare.", emptyTitle: "Start with two records.", emptyBody: "Select two coffees to see their documented fields, pending states, and brew methods side by side.", source: "Evidence boundary", sourceBody: "Tasting cues appear only when both product records carry a verified batch note. The current catalog has no published verified tasting notes.", openSources: "Open source protocol", share: "Share comparison", copied: "Comparison link copied.", shared: "Share sheet opened.", shareError: "Unable to create a share link on this browser.", exportImage: "Download comparison image", exportPdf: "Print / save as PDF", serverPdf: "Download formatted PDF", imageExported: "Comparison image download started.", printHint: "Choose “Save as PDF” in the browser print dialog.", exportError: "Unable to export this comparison on this browser.", recipes: "Brew starting points", recipesTitle: "Two methods, kept practical.", recipesBody: "These are existing field-note recipes, shown as starting points rather than outcome promises.", noRecipe: "No method note is available for this product yet.", method: "Method", ratio: "Ratio", temperature: "Temperature", grind: "Grind", time: "Time", labels: { roast: "Roast profile", brew: "Brew methods", origin: "Origin", process: "Process", altitude: "Altitude", tasting: "Verified tasting", record: "Batch record", price: "Demo price" }, pending: "Pending source record", pendingTasting: "Awaiting verified batch tasting record", demo: "Demo only",
  },
  ar: {
    back: "العودة إلى كافيو", eyebrow: "كافيو / مقارنة جنبًا إلى جنب", titleA: "اختر مع", titleB: "فتح السجل.", intro: "قارن سجلي منتجين في عرض واحد قابل للمشاركة. تبقى الحقول المعلّقة معلّقة، ولا يُستنتج ادعاء عن المنشأ أو التذوق.", first: "القهوة الأولى", second: "القهوة الثانية", choose: "اختر قهوة", same: "اختر قهوتين مختلفتين للمقارنة.", emptyTitle: "ابدأ بسجلين.", emptyBody: "اختر قهوتين لعرض الحقول الموثقة والحالات المعلّقة وطرق التحضير جنبًا إلى جنب.", source: "حدّ الدليل", sourceBody: "لا تظهر إيحاءات التذوق إلا حين يحمل السجلان ملاحظة دفعة متحققة. لا يحوي الكتالوج الحالي إيحاءات تذوق متحققة منشورة.", openSources: "افتح بروتوكول المصادر", share: "مشاركة المقارنة", copied: "نُسخ رابط المقارنة.", shared: "فُتحت ورقة المشاركة.", shareError: "تعذر إنشاء رابط مشاركة من هذا المتصفح.", exportImage: "تنزيل صورة المقارنة", exportPdf: "طباعة / حفظ PDF", serverPdf: "تنزيل PDF منسق", imageExported: "بدأ تنزيل صورة المقارنة.", printHint: "اختر «حفظ كملف PDF» من مربع طباعة المتصفح.", exportError: "تعذر تصدير المقارنة من هذا المتصفح.", recipes: "نقاط بداية للتحضير", recipesTitle: "طريقتان، بصورة عملية.", recipesBody: "هذه وصفات من ملاحظات الحقل الحالية، وتُعرض كنقاط بداية لا كوعود بنتيجة.", noRecipe: "لا تتوفر ملاحظة لطريقة تحضير هذا المنتج بعد.", method: "الطريقة", ratio: "النسبة", temperature: "الحرارة", grind: "الطحن", time: "الوقت", labels: { roast: "ملف التحميص", brew: "طرق التحضير", origin: "المنشأ", process: "المعالجة", altitude: "الارتفاع", tasting: "تذوق متحقق", record: "سجل الدفعة", price: "السعر التجريبي" }, pending: "سجل مصدر معلّق", pendingTasting: "بانتظار سجل تذوق موثّق للدفعة", demo: "تجريبي فقط",
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
  const [exportMessage, setExportMessage] = useState("");
  const t = copy[lang];
  const products = useMemo(() => [coffeeProducts.find((product) => product.id === firstId), coffeeProducts.find((product) => product.id === secondId)] as [CoffeeProduct | undefined, CoffeeProduct | undefined], [firstId, secondId]);
  const canCompare = isDistinctProductPair(...products);

  useEffect(() => {
    const query = comparisonSearch(firstId, secondId);
    window.history.replaceState({}, "", `/compare${query ? `?${query}` : ""}`);
  }, [firstId, secondId]);

  const changeProduct = (position: 0 | 1, id: string) => {
    setShareMessage("");
    setExportMessage("");
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
  const exportRows = canCompare ? rows.map((key) => ({ label: t.labels[key], first: getValue(products[0]!, key), second: getValue(products[1]!, key) })) : [];
  const recipes = canCompare ? products.map((product) => fieldNotes.filter((article) => article.productId === product!.id)) : [];
  const exportImage = () => {
    if (!canCompare) return;
    setShareMessage("");
    try {
      const svg = buildComparisonSvg({ firstName: products[0]!.shortName[lang], secondName: products[1]!.shortName[lang], rows: exportRows, lang });
      downloadComparisonSvg(svg, `caffio-${products[0]!.id}-vs-${products[1]!.id}.svg`);
      setExportMessage(t.imageExported);
    } catch {
      setExportMessage(t.exportError);
    }
  };
  const printComparison = () => {
    setShareMessage("");
    setExportMessage(t.printHint);
    window.setTimeout(() => window.print(), 0);
  };
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
          <div className="comparison-actions"><div><button className="button button-gold" type="button" onClick={shareComparison}><Share2 size={15} />{t.share}</button><button className="comparison-export-button" data-testid="export-comparison-image" type="button" onClick={exportImage}><Download size={15} />{t.exportImage}</button><a className="comparison-export-button" data-testid="download-server-pdf" href={`/compare/pdf?a=${products[0]!.id}&b=${products[1]!.id}&lang=${lang}`}><FileText size={15} />{t.serverPdf}</a><button className="comparison-export-button" data-testid="print-comparison-pdf" type="button" onClick={printComparison}><Printer size={15} />{t.exportPdf}</button></div><p role="status" aria-live="polite">{shareMessage || exportMessage}</p></div>
          <div className="comparison-table" data-testid="product-comparison-table"><div className="comparison-table-head"><span>{t.labels.roast}</span>{products.map((product) => <strong key={product?.id}>{product?.shortName[lang]}</strong>)}</div>{rows.map((key) => <div key={key}><span>{t.labels[key]}</span>{products.map((product) => <strong key={`${key}-${product?.id}`} className={key === "tasting" && !getVerifiedTastingNotes(product!).length ? "comparison-pending" : ""}>{getValue(product!, key)}</strong>)}</div>)}</div>
          <aside className="comparison-evidence"><CheckCircle2 size={18} aria-hidden="true" /><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.source}</p><p>{t.sourceBody}</p><Link className="text-link" href="/sources">{t.openSources}<ArrowUpRight size={14} /></Link></div></aside>
          <section className="comparison-recipes" data-testid="comparison-recipes"><div className="comparison-recipes-head"><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.recipes}</p><h2>{t.recipesTitle}</h2><p>{t.recipesBody}</p></div><BookOpen size={25} aria-hidden="true" /></div><div className="comparison-recipe-grid">{products.map((product, productIndex) => <article key={product!.id}><header><span>{product!.shortName[lang]}</span><strong>{t.method}</strong></header>{recipes[productIndex].length ? <div>{recipes[productIndex].map((recipe) => <section key={recipe.id}><h3>{recipe.method[lang]}</h3><p>{recipe.summary[lang]}</p><dl><div><dt>{t.ratio}</dt><dd>{recipe.ratio}</dd></div><div><dt>{t.temperature}</dt><dd>{recipe.temperature}</dd></div><div><dt>{t.grind}</dt><dd>{recipe.grind[lang]}</dd></div><div><dt>{t.time}</dt><dd>{recipe.time}</dd></div></dl></section>)}</div> : <p className="comparison-no-recipe">{t.noRecipe}</p>}</article>)}</div></section>
        </> : <div className="comparison-empty" role="status"><Scale size={28} /><h2>{firstId !== NO_PRODUCT && secondId !== NO_PRODUCT ? t.same : t.emptyTitle}</h2><p>{firstId !== NO_PRODUCT && secondId !== NO_PRODUCT ? t.same : t.emptyBody}</p></div>}
      </section>
    </main>
    <footer className="mizan-footer"><span>CAFFIO COFFEE / SPECIALTY ROASTERS</span><span>{lang === "ar" ? "مقارنة قابلة للمشاركة" : "A SHAREABLE COMPARISON"}</span><span>© 2026 / {t.demo.toUpperCase()}</span></footer>
  </div>;
}
