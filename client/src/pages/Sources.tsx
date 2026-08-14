import { ArrowLeft, ArrowUpRight, FileCheck2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import CartDrawer from "@/components/CartDrawer";
import MizanHeader from "@/components/MizanHeader";
import type { Lang } from "@/lib/mizanCatalog";

const copy = {
  en: {
    back: "Back to Caffio", eyebrow: "CAFFIO / SOURCE PROTOCOL", titleA: "Evidence before", titleB: "the adjective.",
    intro: "This public protocol explains how Caffio keeps product fields, batch notes, and editorial guidance separate from assumptions.",
    ruleTitle: "A field becomes visible only with its record.",
    ruleBody: "For a product or batch claim, record the source name, document or URL, review date, supporting section, and confidence. If that evidence is unavailable, keep the field pending or remove it.",
    registry: "Reference registry", reference: "Reference", purpose: "Permitted use", boundary: "Boundary", open: "Open reference",
    rows: [
      ["SCA Standards", "General standards, preparation, assessment, and shared terminology.", "Does not verify a farm, product, or batch claim by itself.", "https://sca.coffee/research/coffee-standards"],
      ["Coffee Quality Institute", "Education resources for processing, cupping, and protocols.", "Does not prove a specific farm source or commercial outcome.", "https://www.coffeeinstitute.org/education/education-resources"],
      ["World Coffee Research", "Initial checking of variety names and coffee vocabulary.", "Does not prove a variety applies to an individual Caffio lot.", "https://worldcoffeeresearch.org/resources/coffee-varieties-catalog"],
      ["W3C WCAG 2.2", "Accessibility, contrast, keyboard access, alternative text, and reflow guidance.", "Does not replace testing the actual interface.", "https://www.w3.org/TR/WCAG22/"],
    ],
  },
  ar: {
    back: "العودة إلى كافيو", eyebrow: "كافيو / بروتوكول المصادر", titleA: "الدليل قبل", titleB: "الوصف.",
    intro: "يوضح هذا البروتوكول العام كيف تفصل كافيو بين حقول المنتج وملاحظات الدفعة والإرشاد التحريري وبين الافتراضات.",
    ruleTitle: "لا يظهر الحقل إلا بسجله.",
    ruleBody: "لكل ادعاء عن منتج أو دفعة، يسجَّل اسم المصدر أو الوثيقة أو الرابط وتاريخ المراجعة والجزء الداعم ودرجة الثقة. عند غياب الدليل، يبقى الحقل معلّقًا أو يُحذف.",
    registry: "سجل المراجع", reference: "المرجع", purpose: "الاستخدام المسموح", boundary: "حدّ الاستخدام", open: "فتح المرجع",
    rows: [
      ["معايير SCA", "المعايير العامة والتحضير والتقييم والمصطلحات المشتركة.", "لا تثبت وحدها ادعاءً عن مزرعة أو منتج أو دفعة.", "https://sca.coffee/research/coffee-standards"],
      ["Coffee Quality Institute", "مواد تعليمية للمعالجة والتقييم والبروتوكولات.", "لا تثبت مصدر مزرعة بعينها أو نتيجة تجارية محددة.", "https://www.coffeeinstitute.org/education/education-resources"],
      ["World Coffee Research", "تحقق أولي من أسماء الأصناف ومفردات القهوة.", "لا تثبت انطباق الصنف على دفعة كافيو محددة.", "https://worldcoffeeresearch.org/resources/coffee-varieties-catalog"],
      ["W3C WCAG 2.2", "إرشادات الوصول والتباين ولوحة المفاتيح والنص البديل وإعادة التدفق.", "لا تغني عن اختبار الواجهة الفعلية.", "https://www.w3.org/TR/WCAG22/"],
    ],
  },
};

export default function Sources() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("mizan-lang") as Lang) || "en");
  const t = copy[lang];
  return <div className="mizan-site sources-site" dir={lang === "ar" ? "rtl" : "ltr"}>
    <MizanHeader lang={lang} onLangChange={setLang} home={false} />
    <CartDrawer lang={lang} />
    <main className="sources-main">
      <div className="detail-topbar"><Link href="/"><ArrowLeft size={15} /> {t.back}</Link><span>CAFFIO / 2026</span></div>
      <section className="sources-hero"><p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p>{t.intro}</p></section>
      <section className="source-rule"><FileCheck2 size={24} aria-hidden="true" /><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.registry}</p><h2>{t.ruleTitle}</h2><p>{t.ruleBody}</p></div></section>
      <section className="source-registry" aria-label={t.registry}>
        <div className="source-registry-head"><span>{t.reference}</span><span>{t.purpose}</span><span>{t.boundary}</span><span className="sr-only">{t.open}</span></div>
        {t.rows.map(([name, use, limit, href]) => <article key={href}><h2>{name}</h2><p>{use}</p><p>{limit}</p><a href={href} target="_blank" rel="noreferrer">{t.open}<ArrowUpRight size={14} aria-hidden="true" /></a></article>)}
      </section>
    </main>
    <footer className="mizan-footer"><span>CAFFIO COFFEE / SPECIALTY ROASTERS</span><span>{lang === "ar" ? "دليل قابل للتدقيق" : "AN AUDITABLE GUIDE"}</span><span>© 2026 / SOURCE PROTOCOL</span></footer>
  </div>;
}
