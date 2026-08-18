import { ArrowLeft, Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import CartDrawer from "@/components/CartDrawer";
import MizanHeader from "@/components/MizanHeader";
import type { Lang } from "@/lib/mizanCatalog";

const copy = {
  en: {
    eyebrow: "CAFFIO / RECORD NOT FOUND",
    title: "This record is not in the working collection.",
    body: "The link may be incomplete, moved, or no longer available. Return to the collection to continue with a documented record.",
    home: "Return to Caffio",
    sources: "Open source protocol",
  },
  ar: {
    eyebrow: "كافيو / السجل غير موجود",
    title: "هذا السجل ليس ضمن المجموعة الحالية.",
    body: "قد يكون الرابط غير مكتمل أو نُقل أو لم يعد متاحًا. عُد إلى المجموعة لمتابعة سجل موثق.",
    home: "العودة إلى كافيو",
    sources: "فتح بروتوكول المصادر",
  },
};

export default function NotFound() {
  const [lang, setLang] = useState<Lang>(() => localStorage.getItem("mizan-lang") === "ar" ? "ar" : "en");
  const direction = lang === "ar" ? "rtl" : "ltr";
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
    localStorage.setItem("mizan-lang", lang);
  }, [direction, lang]);

  return (
    <div className="mizan-site not-found-site" dir={direction}>
      <MizanHeader lang={lang} onLangChange={setLang} home={false} />
      <CartDrawer lang={lang} />
      <main className="not-found-main" id="main-content" tabIndex={-1}>
        <section className="not-found-hero" data-testid="not-found-recovery">
          <div className="utility-chapter" aria-hidden="true"><span>404</span><i /></div>
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p>
            <h1>404<br /><em>{t.title}</em></h1>
            <p>{t.body}</p>
            <div className="not-found-actions">
              <Link className="button button-gold" href="/"><ArrowLeft size={16} aria-hidden="true" /> {t.home}</Link>
              <Link className="text-link" href="/sources"><Compass size={15} aria-hidden="true" /> {t.sources}</Link>
            </div>
          </div>
          <div className="utility-seal" aria-hidden="true"><span className="mizan-symbol"><i /><b /><em /></span></div>
        </section>
      </main>
    </div>
  );
}
