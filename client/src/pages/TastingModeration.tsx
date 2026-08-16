import { useState } from "react";
import { Check, Coffee, LoaderCircle, ShieldCheck, X } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { coffeeProducts, type Lang } from "@/lib/mizanCatalog";
import { trpc } from "@/lib/trpc";

const copy = {
  en: { eyebrow: "CAFFIO / MODERATION", title: "Review cup reflections with care.", body: "Approve or reject visitor reflections before publication. Ratings and comments stay private until approved; this console never changes product or batch facts.", pending: "Pending", approved: "Approved", rejected: "Rejected", empty: "No reflections match this review state.", approve: "Approve", reject: "Reject", signIn: "Sign in to access moderation", restricted: "This area is restricted to Caffio administrators.", back: "Back to Caffio", by: "Visitor", review: "review reflection", state: "Review state", loading: "Loading reflection queue…" },
  ar: { eyebrow: "كافيو / المراجعة", title: "راجع انطباعات الأكواب بعناية.", body: "اعتمد أو ارفض انطباعات الزوار قبل النشر. تبقى التقييمات والتعليقات خاصة حتى اعتمادها؛ ولا تعدّل هذه اللوحة حقائق المنتج أو الدفعة.", pending: "قيد المراجعة", approved: "معتمد", rejected: "مرفوض", empty: "لا توجد انطباعات مطابقة لحالة المراجعة.", approve: "اعتمد", reject: "ارفض", signIn: "سجّل الدخول للوصول إلى المراجعة", restricted: "هذه المنطقة مخصصة لمشرفي كافيو.", back: "العودة إلى كافيو", by: "الزائر", review: "مراجعة الانطباع", state: "حالة المراجعة", loading: "جارٍ تحميل قائمة الانطباعات…" },
};

type Status = "pending" | "approved" | "rejected";
export default function TastingModeration() {
  const [lang] = useState<Lang>(() => (typeof window === "undefined" ? "en" : (localStorage.getItem("mizan-lang") as Lang) || "en"));
  const [status, setStatus] = useState<Status>("pending");
  const { user, loading, isAuthenticated } = useAuth();
  const t = copy[lang];
  const utils = trpc.useUtils();
  const queue = trpc.tastingReflection.moderationQueue.useQuery({ status }, { enabled: user?.role === "admin" });
  const moderate = trpc.tastingReflection.moderate.useMutation({ onSuccess: () => utils.tastingReflection.moderationQueue.invalidate() });
  const productName = (id: string) => coffeeProducts.find(product => product.id === id)?.shortName[lang] || id;
  if (loading) return <main className="route-loader" aria-busy="true"><LoaderCircle className="spin" /><p>{t.loading}</p></main>;
  if (!isAuthenticated) return <main className="moderation-gate" dir={lang === "ar" ? "rtl" : "ltr"}><ShieldCheck size={28} /><h1>{t.restricted}</h1><p>{t.body}</p><button type="button" className="button button-gold" onClick={startLogin}>{t.signIn}</button></main>;
  if (user?.role !== "admin") return <main className="moderation-gate" dir={lang === "ar" ? "rtl" : "ltr"}><ShieldCheck size={28} /><h1>{t.restricted}</h1><Link className="text-link" href="/">{t.back}</Link></main>;
  return <main className="moderation-page" dir={lang === "ar" ? "rtl" : "ltr"}><div className="moderation-topbar"><Link href="/">{t.back}</Link><span><ShieldCheck size={15} /> {t.review}</span></div><header><p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p><h1>{t.title}</h1><p>{t.body}</p></header><div className="moderation-filters" aria-label={t.state}>{(["pending", "approved", "rejected"] as Status[]).map(item => <button key={item} type="button" className={item === status ? "is-active" : ""} onClick={() => setStatus(item)}>{t[item]}</button>)}</div>{queue.isLoading ? <p className="moderation-loading"><LoaderCircle className="spin" /> {t.loading}</p> : queue.data?.length ? <section className="moderation-list">{queue.data.map(item => <article key={item.id}><div className="moderation-item-head"><span><Coffee size={15} /> {productName(item.productId)}</span><small>{t.by}: {item.authorName || "—"} · {item.rating}/5</small></div><p>{item.comment}</p>{status === "pending" ? <div className="moderation-actions"><button type="button" onClick={() => moderate.mutate({ id: item.id, productId: item.productId, status: "approved" })} disabled={moderate.isPending}><Check size={15} /> {t.approve}</button><button type="button" onClick={() => moderate.mutate({ id: item.id, productId: item.productId, status: "rejected" })} disabled={moderate.isPending}><X size={15} /> {t.reject}</button></div> : null}</article>)}</section> : <p className="moderation-empty">{t.empty}</p>}</main>;
}
