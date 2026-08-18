import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Droplets, RotateCcw, Thermometer, Timer } from "lucide-react";
import { fieldNotes, type Lang } from "@/lib/mizanCatalog";

const copy = {
  en: { eyebrow: "Caffio / interactive brew guide", titleA: "Make the next", titleB: "step clear.", body: "Choose a documented field-note recipe, then move through its practical starting steps. These are guides, not promises of a fixed cup.", select: "Choose a recipe", step: "Step", of: "of", previous: "Back", next: "Next step", restart: "Start again", ratio: "Ratio", heat: "Water / heat", grind: "Grind", time: "Time", tip: "Practical tip", tipText: "Change one variable at a time, then taste again before changing the recipe.", complete: "Starting point complete", completeText: "Keep what worked, then make one small adjustment for the next cup." },
  ar: { eyebrow: "كافيو / دليل تحضير تفاعلي", titleA: "اجعل الخطوة", titleB: "التالية واضحة.", body: "اختر وصفة من ملاحظات الحقل، ثم انتقل عبر خطوات البداية العملية. هذه إرشادات وليست وعودًا بكوب ثابت.", select: "اختر وصفة", step: "الخطوة", of: "من", previous: "رجوع", next: "الخطوة التالية", restart: "ابدأ مجددًا", ratio: "النسبة", heat: "الماء / الحرارة", grind: "الطحن", time: "الوقت", tip: "نصيحة عملية", tipText: "غيّر متغيرًا واحدًا في كل مرة، ثم تذوق مجددًا قبل تعديل الوصفة.", complete: "اكتملت نقطة البداية", completeText: "احتفظ بما نجح، ثم عدّل خطوة صغيرة واحدة للكوب التالي." },
} as const;

export default function InteractiveBrewGuide({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [recipeId, setRecipeId] = useState(fieldNotes[0].id);
  const [step, setStep] = useState(0);
  const recipe = useMemo(() => fieldNotes.find((item) => item.id === recipeId) || fieldNotes[0], [recipeId]);
  const isComplete = step >= recipe.steps.length;
  const progress = Math.min(100, Math.round((step / recipe.steps.length) * 100));

  return <section className="interactive-brew-guide" aria-labelledby="interactive-brew-title" data-testid="interactive-brew-guide">
    <div className="interactive-brew-intro"><div><p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p><h2 id="interactive-brew-title">{t.titleA}<br /><em>{t.titleB}</em></h2></div><p>{t.body}</p></div>
    <div className="interactive-brew-layout">
      <div className="interactive-brew-control"><label><span>{t.select}</span><select value={recipeId} onChange={(event) => { setRecipeId(event.target.value); setStep(0); }}>{fieldNotes.map((item) => <option key={item.id} value={item.id}>{item.title[lang]} / {item.method[lang]}</option>)}</select></label><dl><div><dt><Droplets size={14} aria-hidden="true" />{t.ratio}</dt><dd>{recipe.ratio}</dd></div><div><dt><Thermometer size={14} aria-hidden="true" />{t.heat}</dt><dd>{recipe.temperature}</dd></div><div><dt><Timer size={14} aria-hidden="true" />{t.time}</dt><dd>{recipe.time}</dd></div><div><dt>{t.grind}</dt><dd>{recipe.grind[lang]}</dd></div></dl></div>
      <article className="interactive-brew-stage" aria-live="polite" aria-atomic="true"><div className="interactive-brew-progress"><span>{isComplete ? t.complete : `${t.step} ${step + 1} ${t.of} ${recipe.steps.length}`}</span><i><b style={{ width: `${progress}%` }} /></i></div>{isComplete ? <div className="interactive-brew-complete"><Check size={28} aria-hidden="true" /><h3>{t.complete}</h3><p>{t.completeText}</p></div> : <div className="interactive-brew-step"><span>{String(step + 1).padStart(2, "0")}</span><p>{recipe.steps[step][lang]}</p></div>}<div className="interactive-brew-actions">{step > 0 && <button className="text-link" type="button" onClick={() => setStep((current) => Math.max(0, current - 1))}><ArrowLeft size={15} />{t.previous}</button>}{isComplete ? <button className="button button-gold" type="button" onClick={() => setStep(0)}><RotateCcw size={15} />{t.restart}</button> : <button className="button button-gold" type="button" onClick={() => setStep((current) => current + 1)}>{t.next}<ArrowRight size={15} /></button>}</div></article>
    </div>
    <aside className="interactive-brew-tip"><span>{t.tip}</span><p>{t.tipText}</p></aside>
  </section>;
}
