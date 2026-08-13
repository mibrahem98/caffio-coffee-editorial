import { ChevronDown, FileCheck2, ShieldAlert } from "lucide-react";
import type { CoffeeProduct, Lang } from "@/lib/mizanCatalog";

const copy = {
  en: { label: "Batch record / audit card", id: "Record ID", lot: "Lot label", verification: "Verification", source: "Expected source", evidence: "Evidence", reviewed: "Reviewed", open: "Open audit card", pending: "Pending documentation" },
  ar: { label: "سجل الدفعة / بطاقة تدقيق", id: "معرّف السجل", lot: "وصف الدفعة", verification: "التحقق", source: "المصدر المطلوب", evidence: "الدليل", reviewed: "المراجعة", open: "افتح بطاقة التدقيق", pending: "بانتظار التوثيق" },
};

export default function BatchRecordCard({ product, lang }: { product: CoffeeProduct; lang: Lang }) {
  const t = copy[lang];
  return <details className="batch-card"><summary><span className="batch-card-label"><FileCheck2 size={16} /> {t.label}</span><span className="batch-status"><ShieldAlert size={14} /> {t.pending}<ChevronDown size={15} /></span></summary><div className="batch-card-body"><div className="batch-card-intro"><div><span>{t.id}</span><strong>{product.batch.recordId}</strong></div><p>{product.sourceLabel[lang]}</p></div><div className="batch-card-grid"><div><span>{t.lot}</span><strong>{product.batch.lotLabel[lang]}</strong></div><div><span>{t.verification}</span><strong>{product.batch.verification[lang]}</strong></div><div><span>{t.source}</span><strong>{product.batch.sourceType[lang]}</strong></div><div><span>{t.evidence}</span><strong>{product.batch.evidence[lang]}</strong></div><div><span>{t.reviewed}</span><strong>{product.batch.reviewedAt[lang]}</strong></div></div><div className="batch-card-foot"><ShieldAlert size={15} /><span>{lang === "ar" ? "لا يُعرض أي ادعاء زراعي كحقيقة نهائية قبل إرفاق المصدر ومراجعته." : "No agricultural claim is treated as final until the source is attached and reviewed."}</span></div></div></details>;
}
