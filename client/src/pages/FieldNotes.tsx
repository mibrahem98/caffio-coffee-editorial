import { ArrowLeft, ArrowUpRight, ChevronDown, Clock3, Coffee, Filter, Flame, Thermometer } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import MizanHeader from "@/components/MizanHeader";
import CartDrawer from "@/components/CartDrawer";
import { fieldNotes, coffeeProducts, type Lang } from "@/lib/mizanCatalog";

const copy = {
  en: { back: "Back to Caffio", eyebrow: "CAFFIO / FIELD NOTES", titleA: "Brew with", titleB: "a little room.", intro: "Interactive starting points for each coffee and method. Recipes are editorial guidance, not a claim of one perfect cup.", all: "All methods", note: "Starting point", ratio: "Ratio", temp: "Water", grind: "Grind", time: "Time", steps: "Open the steps", source: "Content note", sourceBody: "These are working recipes. Product origin and tasting claims remain pending until the relevant batch documents are attached.", viewProduct: "View product" },
  ar: { back: "العودة إلى كافيو", eyebrow: "كافيو / ملاحظات الحقل", titleA: "حضّرها", titleB: "مع مساحة للتجربة.", intro: "نقاط بداية تفاعلية لكل قهوة وطريقة. الوصفات إرشاد تحريري وليست ادعاءً بوجود كوب مثالي واحد.", all: "كل الطرق", note: "نقطة بداية", ratio: "النسبة", temp: "الماء", grind: "الطحن", time: "الوقت", steps: "افتح الخطوات", source: "ملاحظة المحتوى", sourceBody: "هذه وصفات عمل. تبقى ادعاءات المنشأ والإيحاءات قيد التوثيق حتى إرفاق مستندات الدفعات ذات الصلة.", viewProduct: "عرض المنتج" },
};

export default function FieldNotes() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("mizan-lang") as Lang) || "en");
  const [method, setMethod] = useState("all");
  const t = copy[lang];
  const methods = Array.from(new Map(fieldNotes.map((note) => [note.method.en, note.method])).values());
  const visibleNotes = useMemo(() => method === "all" ? fieldNotes : fieldNotes.filter((note) => note.method.en === method), [method]);

  return <div className="mizan-site field-notes-site" dir={lang === "ar" ? "rtl" : "ltr"}>
    <MizanHeader lang={lang} onLangChange={setLang} home={false} />
    <CartDrawer lang={lang} />
    <main className="field-notes-main"><div className="detail-topbar"><Link href="/"><ArrowLeft size={15} /> {t.back}</Link><span>{t.note}</span></div><section className="field-hero"><div className="utility-chapter"><span>04</span><i /><span>06</span></div><div className="utility-copy"><p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p>{t.intro}</p></div><div className="utility-seal"><span className="mizan-symbol large" aria-hidden="true"><i /><b /><em /></span><Coffee size={18} /><span>FIELD<br />RECIPE</span></div></section><div className="field-toolbar"><Filter size={15} /><button className={method === "all" ? "is-active" : ""} onClick={() => setMethod("all")}>{t.all}</button>{methods.map((item) => <button className={method === item.en ? "is-active" : ""} onClick={() => setMethod(item.en)} key={item.en}>{item[lang]}</button>)}</div><section className="field-article-grid">{visibleNotes.map((note) => { const product = coffeeProducts.find((item) => item.id === note.productId); return <article className="field-article" key={note.id}><div className="field-article-head"><span>{note.method[lang]}</span><strong>{product?.shortName[lang]}</strong></div><div className="field-article-body"><p className="eyebrow"><span className="eyebrow-dot" /> {t.note}</p><h2>{note.title[lang]}</h2><p>{note.summary[lang]}</p><div className="brew-specs"><span><Flame size={14} /><small>{t.ratio}</small><b>{note.ratio}</b></span><span><Thermometer size={14} /><small>{t.temp}</small><b>{note.temperature}</b></span><span><Coffee size={14} /><small>{t.grind}</small><b>{note.grind[lang]}</b></span><span><Clock3 size={14} /><small>{t.time}</small><b>{note.time}</b></span></div><details><summary>{t.steps}<ChevronDown size={15} /></summary><ol>{note.steps.map((step, index) => <li key={index}>{step[lang]}</li>)}</ol></details><Link className="text-link" href={`/coffee/${note.productId}`}>{t.viewProduct}<ArrowUpRight size={14} /></Link></div></article>; })}</section><section className="field-source"><span><Flame size={16} /></span><p><strong>{t.source}</strong>{t.sourceBody}</p></section></main><footer className="mizan-footer"><span>CAFFIO COFFEE / SPECIALTY ROASTERS</span><span>{lang === "ar" ? "طقس مصمم بعناية" : "A RITUAL, DESIGNED"}</span><span>© 2026 / FIELD NOTES</span></footer>
  </div>;
}
