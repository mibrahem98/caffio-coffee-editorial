import { useMemo, useState } from "react";
import { ArrowUpRight, Bot, Compass, Coffee, Sparkles } from "lucide-react";
import { recommendCoffee, type BrewMethodPreference, type RoastPreference } from "@/lib/coffeeAdvisor";
import { type Lang } from "@/lib/mizanCatalog";

const copy = {
  en: {
    eyebrow: "Caffio / record-guided selection", titleA: "Find a coffee", titleB: "from the record.", body: "Choose how you plan to brew and a roast direction. This assistant reads only the listed roast profile and brew methods; it does not invent origin or tasting claims.", method: "Brew method", roast: "Roast direction", anyMethod: "Any listed method", anyRoast: "Any profile", suggest: "Show starting points", result: "Suggested starting point", methodMatch: "Listed for your brew method", roastMatch: "Matches your roast direction", neutral: "A current catalog record", record: "Open record", boundary: "Why this result", boundaryText: "Recommendations are deterministic: matching listed methods and roast tones come first. Pending origin and tasting fields are never used.", methodOptions: { "Pour-over": "Pour-over", AeroPress: "AeroPress", "French press": "French press", Espresso: "Espresso", "Moka pot": "Moka pot" }, roastOptions: { light: "Light", medium: "Medium", espresso: "Espresso" }, status: "Recommendation updated",
  },
  ar: {
    eyebrow: "كافيو / اختيار يستند إلى السجل", titleA: "اعثر على قهوة", titleB: "من السجل.", body: "اختر طريقة التحضير واتجاه التحميص. يقرأ هذا المساعد ملف التحميص وطرق التحضير المسجلة فقط؛ ولا يخترع ادعاءات منشأ أو تذوق.", method: "طريقة التحضير", roast: "اتجاه التحميص", anyMethod: "أي طريقة مسجلة", anyRoast: "أي ملف", suggest: "اعرض نقاط البداية", result: "نقطة بداية مقترحة", methodMatch: "مدرجة لطريقة تحضيرك", roastMatch: "تطابق اتجاه تحميصك", neutral: "سجل من الكتالوج الحالي", record: "افتح السجل", boundary: "لماذا هذه النتيجة؟", boundaryText: "الترتيب حتمي: تتقدم طرق التحضير ودرجات التحميص المسجلة. لا تستخدم حقول المنشأ أو التذوق المعلقة مطلقًا.", methodOptions: { "Pour-over": "ترشيح", AeroPress: "إيروبرس", "French press": "فرنش برس", Espresso: "إسبريسو", "Moka pot": "موكا بوت" }, roastOptions: { light: "خفيف", medium: "متوسط", espresso: "إسبريسو" }, status: "تم تحديث الاقتراح",
  },
} as const;

const methods = ["Pour-over", "AeroPress", "French press", "Espresso", "Moka pot"] as const;
const roasts = ["light", "medium", "espresso"] as const;

export default function CoffeeAdvisor({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [brewMethod, setBrewMethod] = useState<BrewMethodPreference>("any");
  const [roast, setRoast] = useState<RoastPreference>("any");
  const [hasInteracted, setHasInteracted] = useState(false);
  const recommendation = useMemo(() => recommendCoffee({ brewMethod, roast })[0], [brewMethod, roast]);
  const matchLabels = recommendation.matches.map((match) => match === "brewMethod" ? t.methodMatch : t.roastMatch);

  return <section className="coffee-advisor section-dark" aria-labelledby="coffee-advisor-title" data-testid="coffee-advisor">
    <div className="coffee-advisor-intro"><div><p className="eyebrow light"><span className="eyebrow-dot" /> {t.eyebrow}</p><h2 id="coffee-advisor-title">{t.titleA}<br /><em>{t.titleB}</em></h2></div><p>{t.body}</p></div>
    <div className="coffee-advisor-layout">
      <form className="coffee-advisor-form" onSubmit={(event) => { event.preventDefault(); setHasInteracted(true); }}>
        <div className="coffee-advisor-mark" aria-hidden="true"><Bot size={21} /><span>01</span></div>
        <label><span>{t.method}</span><select value={brewMethod} onChange={(event) => setBrewMethod(event.target.value as BrewMethodPreference)}><option value="any">{t.anyMethod}</option>{methods.map((method) => <option key={method} value={method}>{t.methodOptions[method]}</option>)}</select></label>
        <label><span>{t.roast}</span><select value={roast} onChange={(event) => setRoast(event.target.value as RoastPreference)}><option value="any">{t.anyRoast}</option>{roasts.map((tone) => <option key={tone} value={tone}>{t.roastOptions[tone]}</option>)}</select></label>
        <button className="button button-gold" type="submit"><Sparkles size={15} />{t.suggest}</button>
      </form>
      <article className="coffee-advisor-result" aria-live="polite" aria-atomic="true">
        <div className="coffee-advisor-result-head"><span><Coffee size={17} aria-hidden="true" /> {t.result}</span><small>{hasInteracted ? t.status : t.neutral}</small></div>
        <h3>{recommendation.product.name[lang]}</h3>
        <p>{recommendation.product.profile[lang]}</p>
        <div className="coffee-advisor-matches">{matchLabels.length ? matchLabels.map((label) => <span key={label}><Compass size={13} aria-hidden="true" />{label}</span>) : <span><Compass size={13} aria-hidden="true" />{t.neutral}</span>}</div>
        <a className="text-link" href={`/coffee/${recommendation.product.id}`}>{t.record}<ArrowUpRight size={15} /></a>
      </article>
    </div>
    <aside className="coffee-advisor-boundary"><Compass size={17} aria-hidden="true" /><div><strong>{t.boundary}</strong><p>{t.boundaryText}</p></div></aside>
  </section>;
}
