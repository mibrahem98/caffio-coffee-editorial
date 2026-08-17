import { MessageSquareQuote, ShieldCheck, Star } from "lucide-react";
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
  },
};

export default function ApprovedReflectionShowcase({ lang }: { lang: Lang }) {
  const product = coffeeProducts[0];
  const t = copy[lang];
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
    </section>
  );
}
