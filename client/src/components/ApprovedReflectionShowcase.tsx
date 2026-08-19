import { useState } from "react";
import { ArrowUpRight, Compass, HeartHandshake, MessageSquareQuote, ShieldCheck, Sparkles, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { coffeeProducts, type Lang } from "@/lib/mizanCatalog";
import { getReflectionShowcaseState } from "@/lib/reflectionShowcaseState";

const copy = {
  en: {
    eyebrow: "Cup notes / reviewed only",
    titleA: "Reflections earned,",
    titleB: "not invented.",
    body: "Only visitor reflections approved for publication can appear here. Caffio does not seed ratings, testimonials, or tasting claims.",
    loading: "Checking reviewed cup notes…",
    emptyTitle: "No approved reflections yet.",
    emptyBody: "This space stays intentionally empty until a visitor note is reviewed. Product facts remain separate from visitor feedback.",
    reviewed: "reviewed notes",
    average: "average",
    record: "Open coffee record",
    benefitsEyebrow: "Why the experience converts",
    benefitsTitle: "A clearer way to explore before you decide.",
    benefits: [
      { label: "Bilingual by design", title: "One experience, two reading directions.", body: "Arabic RTL and English LTR retain the same editorial meaning, navigation, and practical controls." },
      { label: "Records stay visible", title: "Known, pending, and visitor feedback stay separate.", body: "Product records carry their evidence state so a working profile is never presented as a verified batch fact." },
      { label: "Try the tools safely", title: "Explore the buyer journey without a transaction.", body: "Search, comparison, cart, Society, and tracking remain clearly labeled browser-local demonstrations until live services are connected." },
    ],
    collection: "Explore the collection",
    compare: "Compare coffee records",
  },
  ar: {
    eyebrow: "انطباعات الأكواب / المعتمدة فقط",
    titleA: "انطباعات تُكتسب،",
    titleB: "لا تُختلق.",
    body: "لا تظهر هنا إلا انطباعات الزوار التي اعتُمد نشرها. لا تزرع كافيو تقييمات أو شهادات أو ادعاءات تذوق.",
    loading: "جارٍ التحقق من ملاحظات الأكواب المعتمدة…",
    emptyTitle: "لا توجد انطباعات معتمدة بعد.",
    emptyBody: "تبقى هذه المساحة فارغة عمدًا إلى أن تُراجع ملاحظة زائر. تبقى حقائق المنتج منفصلة عن ملاحظات الزوار.",
    reviewed: "انطباعات معتمدة",
    average: "المتوسط",
    record: "افتح سجل القهوة",
    benefitsEyebrow: "لماذا تساعد التجربة على القرار",
    benefitsTitle: "طريقة أوضح للاستكشاف قبل أن تقرر.",
    benefits: [
      { label: "ثنائية اللغة من الأساس", title: "تجربة واحدة، واتجاها قراءة.", body: "يحافظ العربي RTL والإنجليزي LTR على المعنى التحريري والتنقل والأدوات العملية نفسها." },
      { label: "السجلات تبقى ظاهرة", title: "المعروف والمعلّق وانطباعات الزوار منفصلة.", body: "تُظهر سجلات المنتج حالة الدليل حتى لا يُقدّم الملف العملي كأنه حقيقة دفعة موثقة." },
      { label: "جرّب الأدوات بأمان", title: "استكشف مسار المشتري من دون معاملة.", body: "يبقى البحث والمقارنة والسلة وSociety والتتبع محاكاة محلية موسومة بوضوح إلى أن ترتبط الخدمات الحية." },
    ],
    collection: "استكشف المجموعة",
    compare: "قارن سجلات القهوة",
  },
};

export default function ApprovedReflectionShowcase({ lang }: { lang: Lang }) {
  const product = coffeeProducts[0];
  const t = copy[lang];
  const [activeBenefit, setActiveBenefit] = useState(0);
  const reviewed = trpc.tastingReflection.listApproved.useQuery({ productId: product.id });
  const items = reviewed.data?.items.slice(0, 2) ?? [];
  const state = getReflectionShowcaseState({ isLoading: reviewed.isLoading, approvedCount: items.length });

  return (
    <section className="reflection-showcase section-light" id="reflections" aria-labelledby="reflection-showcase-title" data-testid="reflection-showcase">
      <div className="section-intro">
        <span className="section-number">05<span>/</span>08</span>
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p>
          <h2 id="reflection-showcase-title">{t.titleA}<br /><em>{t.titleB}</em></h2>
        </div>
      </div>
      <div className="reflection-showcase-layout">
        <div className="reflection-showcase-intro">
          <MessageSquareQuote size={29} aria-hidden="true" />
          <p>{t.body}</p>
          <a className="text-link" href={`/coffee/${product.id}`}>{t.record}<span>↗</span></a>
        </div>
        <div className="conversion-proof-stack">
          <div className="conversion-benefits" data-testid="conversion-benefits">
            <div className="conversion-benefits-head"><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.benefitsEyebrow}</p><h3>{t.benefitsTitle}</h3></div><Sparkles size={22} aria-hidden="true" /></div>
            <div className="conversion-benefit-tabs" aria-label={t.benefitsEyebrow}>{t.benefits.map((benefit, index) => <button type="button" key={benefit.label} className={index === activeBenefit ? "is-active" : ""} aria-pressed={index === activeBenefit} onClick={() => setActiveBenefit(index)}>{String(index + 1).padStart(2, "0")} <span>{benefit.label}</span></button>)}</div>
            <article className="conversion-benefit-detail" data-testid="conversion-benefit-detail" aria-live="polite"><div className="conversion-benefit-icon">{activeBenefit === 0 ? <HeartHandshake size={19} aria-hidden="true" /> : activeBenefit === 1 ? <Compass size={19} aria-hidden="true" /> : <ShieldCheck size={19} aria-hidden="true" />}</div><div><h4>{t.benefits[activeBenefit].title}</h4><p>{t.benefits[activeBenefit].body}</p></div></article>
            <div className="conversion-benefit-actions"><a href="#collection">{t.collection}<ArrowUpRight size={14} /></a><a href="/compare">{t.compare}<ArrowUpRight size={14} /></a></div>
          </div>
          <div className="reflection-showcase-panel" aria-live="polite">
            {state === "loading" ? <p className="reflection-showcase-status">{t.loading}</p> : state === "approved" ? <>
              <div className="reflection-showcase-summary"><strong>{reviewed.data?.average}/5</strong><span>{t.average} · {reviewed.data?.count} {t.reviewed}</span></div>
              <div className="reflection-showcase-cards">
                {items.map((item) => <article className="reflection-showcase-card" key={item.id}>
                  <div aria-label={`${item.rating} of 5`} className="reflection-showcase-stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < item.rating ? "currentColor" : "none"} />)}</div>
                  <p>“{item.comment}”</p>
                </article>)}
              </div>
            </> : <div className="reflection-showcase-empty" data-testid="reflection-showcase-empty"><ShieldCheck size={22} aria-hidden="true" /><div><strong>{t.emptyTitle}</strong><p>{t.emptyBody}</p></div></div>}
          </div>
        </div>
      </div>
    </section>
  );
}
