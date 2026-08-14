import { ArrowLeft, ArrowUpRight, BadgeCheck, CreditCard, ReceiptText, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";
import MizanHeader from "@/components/MizanHeader";
import type { Lang } from "@/lib/mizanCatalog";

const copy = {
  en: {
    back: "Back to Caffio", eyebrow: "CAFFIO / PAYMENT ACTIVITY", titleA: "Verified", titleB: "payment activity.", intro: "This space is reserved for provider-confirmed payment records only. Demo orders and local Society records never appear here as payments.", emptyTitle: "No verified payments yet.", emptyBody: "Stripe is not connected, so Caffio has no payment provider records to display. Nothing has been charged or stored by this website.", status: "Current payment status", statusValue: "Live payments unavailable", future: "When a verified provider is connected, this page can show the provider reference, confirmed status, recorded date, and amount from a server-side webhook.", local: "Your local demo orders remain separate", tracking: "Open demo order tracking", security: "No card number, billing address, or payment token is stored in this browser.", checklistA: "Provider-confirmed only", checklistB: "Server-side webhook source", checklistC: "No demo-to-payment conversion",
  },
  ar: {
    back: "العودة إلى كافيو", eyebrow: "كافيو / نشاط الدفع", titleA: "نشاط دفع", titleB: "موثّق.", intro: "هذه المساحة مخصصة لسجلات الدفع التي يؤكدها مزود الدفع فقط. لا تظهر الطلبات التجريبية أو سجلات Society المحلية هنا كمدفوعات.", emptyTitle: "لا توجد مدفوعات موثقة بعد.", emptyBody: "Stripe غير متصل، لذلك لا توجد سجلات من مزود دفع لعرضها. لم يُخصم أو يُخزَّن أي مبلغ عبر هذا الموقع.", status: "حالة الدفع الحالية", statusValue: "المدفوعات الحية غير متاحة", future: "بعد ربط مزود موثق، يمكن لهذه الصفحة عرض مرجع المزود والحالة المؤكدة والتاريخ والمبلغ من webhook يعمل على الخادم.", local: "تبقى طلباتك التجريبية المحلية منفصلة", tracking: "افتح تتبع الطلب التجريبي", security: "لا يُحفظ رقم بطاقة أو عنوان فوترة أو رمز دفع في هذا المتصفح.", checklistA: "مؤكد من المزود فقط", checklistB: "مصدره webhook على الخادم", checklistC: "لا تحويل للمحاكاة إلى دفع",
  },
};

export default function PaymentActivity() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("mizan-lang") as Lang) || "en");
  const t = copy[lang];

  return <div className="mizan-site payment-site" dir={lang === "ar" ? "rtl" : "ltr"}>
    <MizanHeader lang={lang} onLangChange={setLang} home={false} />
    <CartDrawer lang={lang} />
    <main className="payment-main">
      <div className="detail-topbar"><Link href="/"><ArrowLeft size={15} /> {t.back}</Link><span>{t.statusValue}</span></div>
      <section className="payment-hero"><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p>{t.intro}</p></div><div className="payment-mark"><ReceiptText size={32} /><span>VERIFIED<br />ONLY</span></div></section>
      <section className="payment-status" aria-label={t.status}><div><ShieldCheck size={21} /><span><small>{t.status}</small><strong>{t.statusValue}</strong></span></div><p>{t.future}</p></section>
      <section className="payment-empty" data-testid="payment-activity-empty"><div className="payment-empty-icon"><CreditCard size={27} /><i>0</i></div><h2>{t.emptyTitle}</h2><p>{t.emptyBody}</p><div className="payment-integrity"><span><BadgeCheck size={15} /> {t.checklistA}</span><span><ShieldCheck size={15} /> {t.checklistB}</span><span><ReceiptText size={15} /> {t.checklistC}</span></div><p className="payment-security"><ShieldCheck size={15} /> {t.security}</p><div className="payment-actions"><Link className="button button-gold" href="/track">{t.tracking}<ArrowUpRight size={15} /></Link><span>{t.local}</span></div></section>
    </main>
    <footer className="mizan-footer"><span>CAFFIO COFFEE / SPECIALTY ROASTERS</span><span>{lang === "ar" ? "سجلات موثقة فقط" : "VERIFIED RECORDS ONLY"}</span><span>© 2026 / PAYMENT ACTIVITY</span></footer>
  </div>;
}
