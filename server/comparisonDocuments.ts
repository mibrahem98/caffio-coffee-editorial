import PDFDocument from "pdfkit";
import sharp from "sharp";
import type { Express, NextFunction, Request, Response } from "express";
import { coffeeProducts, formatPrice, getVerifiedTastingNotes, type CoffeeProduct, type Lang } from "../client/src/lib/mizanCatalog";

const PDF_ARABIC_FONT = "/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf";
const ESCAPE = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
const SITE_TITLE = "Caffio Coffee — Specialty Roasters";

export type ComparisonRecord = { first: CoffeeProduct; second: CoffeeProduct; lang: Lang };
type ProductRecord = { product: CoffeeProduct; lang: Lang };
type EditorialKind = "notes" | "case-study";
type RouteMeta = { title: string; description: string; canonical: string; image: string; imageAlt: string; locale: "en_US" | "ar_AR"; body: string };

function asId(value: unknown) { return typeof value === "string" ? value : ""; }
function asLang(value: unknown): Lang { return value === "ar" ? "ar" : "en"; }
function resolveProduct(id: unknown) { return coffeeProducts.find(product => product.id === asId(id)); }

export function getComparisonRecord(input: { a?: unknown; b?: unknown; lang?: unknown }): ComparisonRecord | undefined {
  const first = resolveProduct(input.a);
  const second = resolveProduct(input.b);
  if (!first || !second || first.id === second.id) return undefined;
  return { first, second, lang: asLang(input.lang) };
}

export function getProductRecord(input: { id?: unknown; lang?: unknown }): ProductRecord | undefined {
  const product = resolveProduct(input.id);
  return product ? { product, lang: asLang(input.lang) } : undefined;
}

function rows(record: ComparisonRecord) {
  const labels = record.lang === "ar" ? { roast: "ملف التحميص", brew: "طرق التحضير", origin: "المنشأ", process: "المعالجة", altitude: "الارتفاع", tasting: "تذوق متحقق", batch: "سجل الدفعة", price: "السعر التجريبي" } : { roast: "Roast profile", brew: "Brew methods", origin: "Origin", process: "Process", altitude: "Altitude", tasting: "Verified tasting", batch: "Batch record", price: "Demo price" };
  const pending = record.lang === "ar" ? "بانتظار سجل تذوق موثّق للدفعة" : "Awaiting verified batch tasting record";
  const value = (product: CoffeeProduct, key: keyof typeof labels) => {
    if (key === "roast") return product.profile[record.lang];
    if (key === "brew") return product.brewMethods.map(method => method[record.lang]).join(" · ");
    if (key === "origin") return product.origin[record.lang];
    if (key === "process") return product.process[record.lang];
    if (key === "altitude") return product.altitude[record.lang];
    if (key === "batch") return product.batch.verification[record.lang];
    if (key === "price") return formatPrice(product.price, record.lang);
    const notes = getVerifiedTastingNotes(product);
    return notes.length ? notes.map(note => note[record.lang]).join(" · ") : pending;
  };
  return Object.keys(labels).map(key => ({ label: labels[key as keyof typeof labels], first: value(record.first, key as keyof typeof labels), second: value(record.second, key as keyof typeof labels) }));
}

export function comparisonCanonicalPath(record: ComparisonRecord) {
  return `/compare?a=${encodeURIComponent(record.first.id)}&b=${encodeURIComponent(record.second.id)}${record.lang === "ar" ? "&lang=ar" : ""}`;
}

function productCanonicalPath(record: ProductRecord) {
  return `/coffee/${encodeURIComponent(record.product.id)}${record.lang === "ar" ? "?lang=ar" : ""}`;
}

function editorialCanonicalPath(kind: EditorialKind, lang: Lang) {
  const path = kind === "notes" ? "/notes" : "/case-study";
  return `${path}${lang === "ar" ? "?lang=ar" : ""}`;
}

function defaultHead(requestUrl: URL, origin: string): RouteMeta {
  return { title: SITE_TITLE, description: "Caffio — specialty coffee shaped by craft, calm rituals, and warm precision.", canonical: `${origin}${requestUrl.pathname}`, image: `${origin}${coffeeProducts[0].ogImage}`, imageAlt: "Caffio specialty coffee ritual", locale: "en_US", body: "" };
}

export function comparisonHead(url: string, origin: string): RouteMeta {
  const requestUrl = new URL(url, origin);
  const record = requestUrl.pathname === "/compare" ? getComparisonRecord(Object.fromEntries(requestUrl.searchParams)) : undefined;
  if (!record) return defaultHead(requestUrl, origin);
  const isArabic = record.lang === "ar";
  const pair = `${record.first.shortName[record.lang]} × ${record.second.shortName[record.lang]}`;
  const title = isArabic ? `${pair} — مقارنة كافيو` : `${pair} — Caffio coffee comparison`;
  const description = isArabic ? `مقارنة جنبًا إلى جنب بين ${pair}. تبقى حقول المنشأ والتذوق المعلّقة معلّقة حتى توفر سجل دفعة موثق.` : `A side-by-side Caffio record comparison for ${pair}. Origin and tasting fields stay pending until a verified batch record exists.`;
  const canonical = `${origin}${comparisonCanonicalPath(record)}`;
  const image = `${origin}/compare/og.png?a=${encodeURIComponent(record.first.id)}&b=${encodeURIComponent(record.second.id)}&lang=${record.lang}`;
  const body = `<main data-caffio-ssr="comparison"><p>CAFFIO / SIDE-BY-SIDE</p><h1>${ESCAPE(pair)}</h1><p>${ESCAPE(description)}</p><p>${ESCAPE(isArabic ? "سجلات قابلة للتدقيق، دون افتراضات." : "Auditable records, without inferred claims.")}</p></main>`;
  return { title, description, canonical, image, imageAlt: `${pair} comparison`, locale: isArabic ? "ar_AR" : "en_US", body };
}

export function productHead(url: string, origin: string): RouteMeta {
  const requestUrl = new URL(url, origin);
  const id = requestUrl.pathname.match(/^\/coffee\/([^/]+)$/)?.[1];
  const record = getProductRecord({ id, lang: requestUrl.searchParams.get("lang") });
  if (!record) return defaultHead(requestUrl, origin);
  const { product, lang } = record;
  const isArabic = lang === "ar";
  const name = product.name[lang];
  const brew = product.brewMethods.map(method => method[lang]).join(isArabic ? "، " : ", ");
  const title = isArabic ? `${name} — سجل قهوة كافيو` : `${name} — Caffio coffee record`;
  const description = isArabic ? `سجل ${name} من كافيو. طرق التحضير المقترحة: ${brew}. تبقى بيانات الدفعة والتذوق غير المتحقق معلّقة حتى إرفاق المصدر.` : `Caffio’s ${name} record. Suggested brew methods: ${brew}. Batch-linked origin and tasting details remain pending until a source record is attached.`;
  const canonical = `${origin}${productCanonicalPath(record)}`;
  const image = `${origin}/coffee/${encodeURIComponent(product.id)}/og.png?lang=${lang}`;
  const verifiedNotes = getVerifiedTastingNotes(product);
  const evidence = verifiedNotes.length ? verifiedNotes.map(note => note[lang]).join(isArabic ? "، " : ", ") : isArabic ? "إيحاءات التذوق بانتظار سجل دفعة موثّق." : "Tasting cues await a verified batch record.";
  const body = `<main data-caffio-ssr="product"><p>CAFFIO / PRODUCT RECORD</p><h1>${ESCAPE(name)}</h1><p>${ESCAPE(product.profile[lang])}</p><p>${ESCAPE(evidence)}</p><p>${ESCAPE(isArabic ? "سجل قابل للتدقيق، دون افتراضات." : "An auditable record, without inferred claims.")}</p></main>`;
  return { title, description, canonical, image, imageAlt: `${name} Caffio coffee record`, locale: isArabic ? "ar_AR" : "en_US", body };
}

function editorialHead(url: string, origin: string, kind: EditorialKind): RouteMeta {
  const requestUrl = new URL(url, origin);
  const lang = asLang(requestUrl.searchParams.get("lang"));
  const isArabic = lang === "ar";
  const content = kind === "notes"
    ? isArabic
      ? { title: "ملاحظات الحقل — كافيو", description: "وصفات تحضير تحريرية تفاعلية من كافيو. تبقى ادعاءات المنشأ والإيحاءات قيد التوثيق حتى إرفاق مستندات الدفعات.", eyebrow: "كافيو / ملاحظات الحقل", heading: "حضّرها مع مساحة للتجربة.", body: "نقاط بداية تفاعلية لكل قهوة وطريقة. الوصفات إرشاد تحريري وليست ادعاءً بوجود كوب مثالي واحد.", note: "هذه وصفات عمل. تبقى ادعاءات المنشأ والإيحاءات قيد التوثيق حتى إرفاق مستندات الدفعات ذات الصلة." }
      : { title: "Field Notes — Caffio coffee", description: "Interactive Caffio brew guidance. Origin and tasting claims remain pending until relevant batch documents are attached.", eyebrow: "CAFFIO / FIELD NOTES", heading: "Brew with a little room.", body: "Interactive starting points for each coffee and method. Recipes are editorial guidance, not a claim of one perfect cup.", note: "These are working recipes. Product origin and tasting claims remain pending until the relevant batch documents are attached." }
    : isArabic
      ? { title: "دراسة حالة كافيو — 2026", description: "دراسة حالة رقمية لكافيو: هوية تحريرية، تجربة استخدام، وملاحظات تسليم مقيدة بالسجل المصدر.", eyebrow: "دراسة حالة / كافيو 2026", heading: "حرفة مثل القهوة. وبنية مثل العمارة.", body: "مفهوم Neo-Minimalism 2026 لعلامة قهوة مختصة فاخرة: هادئ بما يكفي للثقة، ودقيق بما يكفي للاستخدام.", note: "يفصل النظام بوضوح بين بيانات المنتج الموثقة والحقول التي تنتظر سجل مصدر." }
      : { title: "Caffio case study — 2026", description: "Caffio’s digital case study: editorial brand direction, product UX, and source-governed delivery notes.", eyebrow: "CASE STUDY / CAFFIO 2026", heading: "Crafted like coffee. Structured like architecture.", body: "A Neo-Minimalism 2026 concept for a luxury specialty-coffee brand: quiet enough to trust, precise enough to use.", note: "The system visibly separates documented product facts from fields still awaiting a source record." };
  const canonical = `${origin}${editorialCanonicalPath(kind, lang)}`;
  const image = `${origin}/editorial/og.png?kind=${kind}&lang=${lang}`;
  const body = `<main data-caffio-ssr="editorial-${kind}"><p>${ESCAPE(content.eyebrow)}</p><h1>${ESCAPE(content.heading)}</h1><p>${ESCAPE(content.body)}</p><p>${ESCAPE(content.note)}</p></main>`;
  return { title: content.title, description: content.description, canonical, image, imageAlt: content.heading, locale: isArabic ? "ar_AR" : "en_US", body };
}

export function routeHead(url: string, origin: string): RouteMeta {
  const requestUrl = new URL(url, origin);
  if (requestUrl.pathname === "/compare") return comparisonHead(url, origin);
  if (requestUrl.pathname.startsWith("/coffee/")) return productHead(url, origin);
  if (requestUrl.pathname === "/notes") return editorialHead(url, origin, "notes");
  if (requestUrl.pathname === "/case-study") return editorialHead(url, origin, "case-study");
  return defaultHead(requestUrl, origin);
}

export function renderRouteHead(url: string, origin: string) {
  const meta = routeHead(url, origin);
  return `<title>${ESCAPE(meta.title)}</title><meta name="description" content="${ESCAPE(meta.description)}" /><meta property="og:title" content="${ESCAPE(meta.title)}" /><meta property="og:type" content="website" /><meta property="og:url" content="${ESCAPE(meta.canonical)}" /><meta property="og:site_name" content="Caffio Coffee" /><meta property="og:description" content="${ESCAPE(meta.description)}" /><meta property="og:image" content="${ESCAPE(meta.image)}" /><meta property="og:image:alt" content="${ESCAPE(meta.imageAlt)}" /><meta property="og:locale" content="${meta.locale}" /><meta property="og:locale:alternate" content="${meta.locale === "ar_AR" ? "en_US" : "ar_AR"}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${ESCAPE(meta.title)}" /><meta name="twitter:description" content="${ESCAPE(meta.description)}" /><meta name="twitter:image" content="${ESCAPE(meta.image)}" /><link rel="canonical" href="${ESCAPE(meta.canonical)}" />`;
}

export function renderRouteSnapshot(url: string, origin: string) { return routeHead(url, origin).body; }

function comparisonImageSvg(record: ComparisonRecord) {
  const pair = `${record.first.shortName[record.lang]} × ${record.second.shortName[record.lang]}`;
  const notes = record.lang === "ar" ? "المقارنة تحتفظ بحالات التوثيق" : "Evidence states retained in this comparison";
  return socialCardSvg({ eyebrow: "CAFFIO / SIDE-BY-SIDE", title: pair, note: notes, lang: record.lang });
}

function productImageSvg(record: ProductRecord) {
  const { product, lang } = record;
  const notes = getVerifiedTastingNotes(product);
  const note = notes.length ? notes.map(item => item[lang]).join(lang === "ar" ? "، " : " · ") : lang === "ar" ? "إيحاءات التذوق بانتظار سجل موثّق" : "Tasting cues await a verified record";
  return socialCardSvg({ eyebrow: "CAFFIO / PRODUCT RECORD", title: product.shortName[lang], note, lang });
}

function editorialImageSvg(kind: EditorialKind, lang: Lang) {
  const isArabic = lang === "ar";
  const content = kind === "notes"
    ? { eyebrow: isArabic ? "كافيو / ملاحظات الحقل" : "CAFFIO / FIELD NOTES", title: isArabic ? "حضّرها مع مساحة للتجربة." : "Brew with a little room.", note: isArabic ? "وصفات عمل، دون افتراضات عن الدفعة" : "Working recipes, without batch assumptions" }
    : { eyebrow: isArabic ? "دراسة حالة / كافيو 2026" : "CASE STUDY / CAFFIO 2026", title: isArabic ? "حرفة مثل القهوة. وبنية مثل العمارة." : "Crafted like coffee. Structured like architecture.", note: isArabic ? "هوية وتجربة مقيدتان بالسجل المصدر" : "Brand and UX, governed by source records" };
  return socialCardSvg({ ...content, lang });
}

function socialCardSvg(input: { eyebrow: string; title: string; note: string; lang: Lang }) {
  const anchor = input.lang === "ar" ? "end" : "start";
  const x = input.lang === "ar" ? 1126 : 74;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" direction="${input.lang === "ar" ? "rtl" : "ltr"}"><rect width="1200" height="630" fill="#1e2224"/><circle cx="1045" cy="100" r="270" fill="none" stroke="#c29b58" stroke-opacity=".35"/><circle cx="1045" cy="100" r="180" fill="none" stroke="#c29b58" stroke-opacity=".2"/><text x="${x}" y="95" text-anchor="${anchor}" fill="#c29b58" font-family="Manrope,Arial,sans-serif" font-size="20" letter-spacing="4">${ESCAPE(input.eyebrow)}</text><text x="${x}" y="250" text-anchor="${anchor}" fill="#f4ecdf" font-family="Georgia,serif" font-size="82">${ESCAPE(input.title)}</text><line x1="74" y1="308" x2="1126" y2="308" stroke="#c29b58" stroke-opacity=".55"/><text x="${x}" y="372" text-anchor="${anchor}" fill="#f4ecdf" font-family="Manrope,Arial,sans-serif" font-size="28">${ESCAPE(input.note)}</text><text x="${x}" y="524" text-anchor="${anchor}" fill="#c29b58" font-family="Manrope,Arial,sans-serif" font-size="18" letter-spacing="3">CAFFIO COFFEE / RECORDS BEFORE ASSUMPTIONS</text></svg>`;
}

function resolveOrigin(req: Request) {
  const forwarded = req.header("x-forwarded-proto")?.split(",")[0];
  const protocol = forwarded || req.protocol || "https";
  return `${protocol}://${req.get("host") || "apexroast-5n8tojyv.manus.space"}`;
}

export function registerComparisonOutputRoutes(app: Express) {
  app.get("/compare/og.png", async (req: Request, res: Response) => {
    const record = getComparisonRecord(req.query);
    if (!record) return res.status(404).end();
    try {
      const png = await sharp(Buffer.from(comparisonImageSvg(record))).png().toBuffer();
      res.set({ "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" }).end(png);
    } catch { res.status(500).end(); }
  });
  app.get("/coffee/:id/og.png", async (req: Request, res: Response) => {
    const record = getProductRecord({ id: req.params.id, lang: req.query.lang });
    if (!record) return res.status(404).end();
    try {
      const png = await sharp(Buffer.from(productImageSvg(record))).png().toBuffer();
      res.set({ "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" }).end(png);
    } catch { res.status(500).end(); }
  });
  app.get("/editorial/og.png", async (req: Request, res: Response) => {
    const kind = req.query.kind === "notes" || req.query.kind === "case-study" ? req.query.kind : undefined;
    if (!kind) return res.status(404).end();
    try {
      const png = await sharp(Buffer.from(editorialImageSvg(kind, asLang(req.query.lang)))).png().toBuffer();
      res.set({ "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" }).end(png);
    } catch { res.status(500).end(); }
  });
  app.get("/compare/pdf", (req: Request, res: Response) => {
    const record = getComparisonRecord(req.query);
    if (!record) return res.status(404).send("Choose two distinct Caffio records.");
    const isArabic = record.lang === "ar";
    const pair = `${record.first.shortName[record.lang]} × ${record.second.shortName[record.lang]}`;
    const pdf = new PDFDocument({ size: "A4", margin: 42, info: { Title: `Caffio comparison — ${pair}`, Author: "Caffio Coffee" } });
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="caffio-${record.first.id}-vs-${record.second.id}.pdf"`, "Cache-Control": "no-store" });
    pdf.pipe(res);
    if (isArabic) pdf.font(PDF_ARABIC_FONT);
    pdf.fillColor("#1e2224").rect(0, 0, 595, 145).fill();
    pdf.fillColor("#c29b58").fontSize(11).text("CAFFIO / SIDE-BY-SIDE", 42, 35, { characterSpacing: 2 });
    pdf.fillColor("#f4ecdf").fontSize(isArabic ? 27 : 31).text(pair, 42, 70, { width: 510, align: isArabic ? "right" : "left" });
    pdf.fillColor("#745531").fontSize(isArabic ? 10 : 9).text(isArabic ? "سجلان قابلان للتدقيق — تبقى الحقول المعلّقة معلّقة." : "Two auditable records — pending fields remain pending.", 42, 116, { width: 510, align: isArabic ? "right" : "left" });
    let y = 178;
    for (const row of rows(record)) {
      pdf.fillColor("#efe4d2").rect(42, y, 511, 42).fill();
      pdf.fillColor("#745531").fontSize(8).text(row.label, 50, y + 8, { width: 120, align: isArabic ? "right" : "left" });
      pdf.fillColor("#1e2224").fontSize(isArabic ? 8 : 9).text(row.first, 178, y + 8, { width: 170, align: isArabic ? "right" : "left" });
      pdf.text(row.second, 360, y + 8, { width: 184, align: isArabic ? "right" : "left" });
      y += 45;
    }
    pdf.fillColor("#745531").fontSize(8).text(isArabic ? "وثيقة مقارنة تجريبية. لا تمثل طلبًا أو دفعًا أو ضمانًا لتوافر المنتج." : "Demo comparison document. It does not represent an order, payment, or availability guarantee.", 42, y + 20, { width: 511, align: isArabic ? "right" : "left" });
    pdf.end();
  });
  app.use((req: Request, _res: Response, next: NextFunction) => { (req as Request & { caffioOrigin?: string }).caffioOrigin = resolveOrigin(req); next(); });
}
