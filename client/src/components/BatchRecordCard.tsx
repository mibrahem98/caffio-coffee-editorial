import { ChevronDown, FileCheck2, ShieldAlert } from "lucide-react";
import type { CoffeeProduct, Lang } from "@/lib/mizanCatalog";

const copy = {
  en: { label: "Batch record / audit card", id: "Record ID", lot: "Lot label", verification: "Verification", tasting: "Tasting record", tastingPending: "No verified tasting notes", tastingVerified: "Verified tasting notes", source: "Expected source", evidence: "Evidence", reviewed: "Reviewed", open: "Open audit card", pending: "Pending documentation" },
  ar: { label: "سجل الدفعة / بطاقة تدقيق", id: "معرّف السجل", lot: "وصف الدفعة", verification: "التحقق", tasting: "سجل التذوق", tastingPending: "لا توجد ملاحظات تذوق موثقة", tastingVerified: "ملاحظات تذوق موثقة", source: "المصدر المطلوب", evidence: "الدليل", reviewed: "المراجعة", open: "افتح بطاقة التدقيق", pending: "بانتظار التوثيق" },
};

export default function BatchRecordCard({ product, lang }: { product: CoffeeProduct; lang: Lang }) {
  const t = copy[lang];
  const verifiedTastingNotes = product.batch.tastingStatus === "verified" ? product.batch.tastingNotes || [] : [];
  return <details className="batch-card"><summary><span className="batch-card-label"><FileCheck2 size={16} /> {t.label}</span><span className="batch-status"><ShieldAlert size={14} /> {t.pending}<ChevronDown size={15} /></span></summary><div className="batch-card-body"><div className="batch-card-intro"><div><span>{t.id}</span><strong>{product.batch.recordId}</strong></div><p>{product.sourceLabel[lang]}</p></div><div className="batch-card-grid"><div><span>{t.lot}</span><strong>{product.batch.lotLabel[lang]}</strong></div><div><span>{t.verification}</span><strong>{product.batch.verification[lang]}</strong></div><div><span>{t.tasting}</span><strong>{verifiedTastingNotes.length ? t.tastingVerified : t.tastingPending}</strong></div><div><span>{t.source}</span><strong>{product.batch.sourceType[lang]}</strong></div><div><span>{t.evidence}</span><strong>{product.batch.evidence[lang]}</strong></div><div><span>{t.reviewed}</span><strong>{product.batch.reviewedAt[lang]}</strong></div></div>{verifiedTastingNotes.length > 0 && <div className="batch-tasting-notes">{verifiedTastingNotes.map((note, index) => <span key={index}>{note[lang]}</span>)}</div>}<div className="batch-card-foot"><ShieldAlert size={15} /><span>{lang === "ar" ? "لا يُعرض أي ادعاء زراعي كحقيقة نهائية قبل إرفاق المصدر ومراجعته." : "No agricultural claim is treated as final until the source is attached and reviewed."}</span></div></div></details>;
}
