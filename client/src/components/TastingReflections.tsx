import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, MessageSquareText, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import type { Lang } from "@/lib/mizanCatalog";

type Props = { productId: string; lang: Lang };

const copy = {
  en: {
    eyebrow: "Cupping reflections / reviewed", title: "Taste, then leave a careful note.",
    body: "One short reflection per signed-in visitor and coffee. New entries are held for review before they become public; Caffio never seeds ratings or testimonials.",
    rating: "Your cup rating", comment: "A short, respectful note", placeholder: "What did you notice in your cup?", submit: "Send for review", sending: "Sending…",
    signIn: "Sign in to add a reflection", pending: "Your reflection is awaiting review.", approved: "Your reflection is published.", rejected: "Your previous reflection was not published. You can revise and resubmit it.",
    publicNone: "No reviewed reflections are published yet.", publicSummary: "reviewed reflections", average: "average", moderation: "Review queue", approve: "Approve", reject: "Reject", noQueue: "No reflections are waiting for review.",
    saved: "Your reflection was sent for review.", saveError: "Your reflection could not be saved. Please try again.", loading: "Loading reviewed reflections…",
  },
  ar: {
    eyebrow: "انطباعات التذوق / قيد المراجعة", title: "تذوّق أولًا، ثم اترك ملاحظة متأنية.",
    body: "ملاحظة قصيرة واحدة لكل زائر مسجّل ولكل قهوة. تُراجع الملاحظات الجديدة قبل نشرها؛ لا تزرع كافيو تقييمات أو شهادات جاهزة.",
    rating: "تقييم كوبك", comment: "ملاحظة قصيرة ومحترمة", placeholder: "ما الذي لاحظته في كوبك؟", submit: "أرسل للمراجعة", sending: "جارٍ الإرسال…",
    signIn: "سجّل الدخول لإضافة انطباع", pending: "انطباعك بانتظار المراجعة.", approved: "انطباعك منشور.", rejected: "لم يُنشر انطباعك السابق. يمكنك تعديله وإعادة إرساله.",
    publicNone: "لا توجد انطباعات مراجعة منشورة حتى الآن.", publicSummary: "انطباعات مراجعة", average: "المتوسط", moderation: "قائمة المراجعة", approve: "اعتمد", reject: "ارفض", noQueue: "لا توجد انطباعات بانتظار المراجعة.",
    saved: "أُرسل انطباعك للمراجعة.", saveError: "تعذر حفظ الانطباع. حاول مرة أخرى.", loading: "جارٍ تحميل الانطباعات المراجعة…",
  },
};

function RatingStars({ value, onChange, label, disabled = false }: { value: number; onChange?: (value: number) => void; label: string; disabled?: boolean }) {
  return <fieldset className="tasting-rating" disabled={disabled}><legend>{label}</legend><div>{[1, 2, 3, 4, 5].map(star => <button key={star} type="button" className={star <= value ? "is-selected" : ""} aria-label={`${star} of 5`} aria-pressed={star === value} onClick={() => onChange?.(star)}><Star size={18} fill={star <= value ? "currentColor" : "none"} /></button>)}</div></fieldset>;
}

export default function TastingReflections({ productId, lang }: Props) {
  const t = copy[lang];
  const { user, loading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const approved = trpc.tastingReflection.listApproved.useQuery({ productId });
  const mine = trpc.tastingReflection.mine.useQuery({ productId }, { enabled: isAuthenticated });
  const pending = trpc.tastingReflection.pending.useQuery({ productId }, { enabled: user?.role === "admin" });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!mine.data) return;
    setRating(mine.data.rating);
    setComment(mine.data.comment);
  }, [mine.data]);

  const submit = trpc.tastingReflection.submit.useMutation({
    onSuccess: async () => {
      toast.success(t.saved);
      await Promise.all([utils.tastingReflection.mine.invalidate({ productId }), utils.tastingReflection.pending.invalidate({ productId })]);
    },
    onError: () => toast.error(t.saveError),
  });
  const moderate = trpc.tastingReflection.moderate.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.tastingReflection.pending.invalidate({ productId }), utils.tastingReflection.listApproved.invalidate({ productId })]);
    },
  });

  const statusText = mine.data?.status === "approved" ? t.approved : mine.data?.status === "rejected" ? t.rejected : mine.data?.status === "pending" ? t.pending : null;
  const onSubmit = (event: FormEvent) => { event.preventDefault(); submit.mutate({ productId, rating, comment: comment.trim() }); };

  return <section className="tasting-reflections" aria-labelledby="tasting-reflections-title">
    <div className="tasting-reflections-intro"><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p><h2 id="tasting-reflections-title">{t.title}</h2><p>{t.body}</p></div><MessageSquareText aria-hidden="true" size={30} /></div>
    <div className="tasting-reflections-summary" aria-live="polite">
      {approved.isLoading ? <span><LoaderCircle className="spin" size={15} /> {t.loading}</span> : approved.data?.count ? <><strong>{approved.data.average}/5</strong><span>{t.average} · {approved.data.count} {t.publicSummary}</span></> : <span>{t.publicNone}</span>}
    </div>
    {approved.data?.items.length ? <div className="reflection-list">{approved.data.items.map(item => <article key={item.id} className="reflection-card"><div aria-label={`${item.rating} of 5`} className="reflection-stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < item.rating ? "currentColor" : "none"} />)}</div><p>{item.comment}</p></article>)}</div> : null}
    {loading ? null : isAuthenticated ? <form className="reflection-form" onSubmit={onSubmit}>
      <RatingStars value={rating} onChange={setRating} label={t.rating} disabled={submit.isPending} />
      <label>{t.comment}<textarea value={comment} required minLength={2} maxLength={280} onChange={event => setComment(event.target.value)} placeholder={t.placeholder} disabled={submit.isPending} /><span>{comment.length}/280</span></label>
      {statusText ? <p className="reflection-status"><CheckCircle2 size={16} /> {statusText}</p> : null}
      <button className="button button-gold" type="submit" disabled={submit.isPending || comment.trim().length < 2}>{submit.isPending ? t.sending : t.submit}</button>
    </form> : <button className="button button-outline tasting-login" type="button" onClick={startLogin}>{t.signIn}</button>}
    {user?.role === "admin" ? <aside className="moderation-queue"><div><ShieldCheck size={17} /><strong>{t.moderation}</strong></div>{pending.data?.length ? pending.data.map(item => <article key={item.id}><p>{item.comment}</p><small>{item.rating}/5</small><span><button type="button" onClick={() => moderate.mutate({ id: item.id, status: "approved" })}>{t.approve}</button><button type="button" onClick={() => moderate.mutate({ id: item.id, status: "rejected" })}>{t.reject}</button></span></article>) : <p>{t.noQueue}</p>}</aside> : null}
  </section>;
}
