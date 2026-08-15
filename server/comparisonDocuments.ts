import type { Express, Request, Response } from "express";
import PDFDocument from "pdfkit";
import sharp from "sharp";
import { coffeeProducts, formatPrice, getVerifiedTastingNotes, type CoffeeProduct, type Lang } from "../client/src/lib/mizanCatalog";

const PDF_ARABIC_FONT = "/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf";
const ESCAPE = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);

export type ComparisonRecord = { first: CoffeeProduct; second: CoffeeProduct; lang: Lang };

function asId(value: unknown) { return typeof value === "string" ? value : ""; }
function asLang(value: unknown): Lang { return value === "ar" ? "ar" : "en"; }

export function getComparisonRecord(input: { a?: unknown; b?: unknown; lang?: unknown }): ComparisonRecord | undefined {
  const first = coffeeProducts.find(product => product.id === asId(input.a));
  const second = coffeeProducts.find(product => product.id === asId(input.b));
  if (!first || !second || first.id === second.id) return undefined;
  return { first, second, lang: asLang(input.lang) };
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

export function comparisonHead(url: string, origin: string) {
  const requestUrl = new URL(url, origin);
  const record = requestUrl.pathname === "/compare" ? getComparisonRecord(Object.fromEntries(requestUrl.searchParams)) : undefined;
  const siteTitle = "Caffio Coffee — Specialty Roasters";
  if (!record) return { title: siteTitle, description: "Caffio — specialty coffee shaped by craft, calm rituals, and warm precision.", canonical: `${origin}${requestUrl.pathname}`, image: `${origin}${coffeeProducts[0].ogImage}`, imageAlt: "Caffio specialty coffee ritual", locale: "en_US", body: "" };
  const isArabic = record.lang === "ar";
  const pair = `${record.first.shortName[record.lang]} × ${record.second.shortName[record.lang]}`;
  const title = isArabic ? `${pair} — مقارنة كافيو` : `${pair} — Caffio coffee comparison`;
  const description = isArabic ? `مقارنة جنبًا إلى جنب بين ${pair}. تبقى حقول المنشأ والتذوق المعلّقة معلّقة حتى توفر سجل دفعة موثق.` : `A side-by-side Caffio record comparison for ${pair}. Origin and tasting fields stay pending until a verified batch record exists.`;
  const canonical = `${origin}${comparisonCanonicalPath(record)}`;
  const image = `${origin}/compare/og.png?a=${encodeURIComponent(record.first.id)}&b=${encodeURIComponent(record.second.id)}&lang=${record.lang}`;
  const body = `<main data-caffio-ssr="comparison"><p>CAFFIO / SIDE-BY-SIDE</p><h1>${ESCAPE(pair)}</h1><p>${ESCAPE(description)}</p><p>${ESCAPE(isArabic ? "سجلات قابلة للتدقيق، دون افتراضات." : "Auditable records, without inferred claims.")}</p></main>`;
  return { title, description, canonical, image, imageAlt: `${pair} comparison`, locale: isArabic ? "ar_AR" : "en_US", body };
}

export function renderRouteHead(url: string, origin: string) {
  const meta = comparisonHead(url, origin);
  return `<title>${ESCAPE(meta.title)}</title><meta name="description" content="${ESCAPE(meta.description)}" /><meta property="og:title" content="${ESCAPE(meta.title)}" /><meta property="og:type" content="website" /><meta property="og:url" content="${ESCAPE(meta.canonical)}" /><meta property="og:site_name" content="Caffio Coffee" /><meta property="og:description" content="${ESCAPE(meta.description)}" /><meta property="og:image" content="${ESCAPE(meta.image)}" /><meta property="og:image:alt" content="${ESCAPE(meta.imageAlt)}" /><meta property="og:locale" content="${meta.locale}" /><meta property="og:locale:alternate" content="${meta.locale === "ar_AR" ? "en_US" : "ar_AR"}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${ESCAPE(meta.title)}" /><meta name="twitter:description" content="${ESCAPE(meta.description)}" /><meta name="twitter:image" content="${ESCAPE(meta.image)}" /><link rel="canonical" href="${ESCAPE(meta.canonical)}" />`;
}

export function renderRouteSnapshot(url: string, origin: string) { return comparisonHead(url, origin).body; }

function comparisonImageSvg(record: ComparisonRecord) {
  const pair = `${record.first.shortName[record.lang]} × ${record.second.shortName[record.lang]}`;
  const notes = record.lang === "ar" ? "المقارنة تحتفظ بحالات التوثيق" : "Evidence states retained in this comparison";
  const direction = record.lang === "ar" ? "rtl" : "ltr";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" direction="${direction}"><rect width="1200" height="630" fill="#1e2224"/><circle cx="1045" cy="100" r="270" fill="none" stroke="#c29b58" stroke-opacity=".35"/><circle cx="1045" cy="100" r="180" fill="none" stroke="#c29b58" stroke-opacity=".2"/><text x="74" y="95" fill="#c29b58" font-family="Manrope,Arial,sans-serif" font-size="20" letter-spacing="4">CAFFIO / SIDE-BY-SIDE</text><text x="74" y="250" fill="#f4ecdf" font-family="Georgia,serif" font-size="82">${ESCAPE(pair)}</text><line x1="74" y1="308" x2="1126" y2="308" stroke="#c29b58" stroke-opacity=".55"/><text x="74" y="372" fill="#f4ecdf" font-family="Manrope,Arial,sans-serif" font-size="28">${ESCAPE(notes)}</text><text x="74" y="524" fill="#c29b58" font-family="Manrope,Arial,sans-serif" font-size="18" letter-spacing="3">CAFFIO COFFEE / RECORDS BEFORE ASSUMPTIONS</text></svg>`;
}

function resolveOrigin(req: Request) {
  const forwarded = req.header("x-forwarded-proto")?.split(",")[0];
  const protocol = forwarded || req.protocol || "https";
  return `${protocol}://${req.get("host") || "apexroast-5n8tojyv.manus.space"}`;
}

export function registerComparisonOutputRoutes(app: Express) {
  app.get("/compare/og.png", async (req, res) => {
    const record = getComparisonRecord(req.query);
    if (!record) return res.status(404).end();
    try {
      const png = await sharp(Buffer.from(comparisonImageSvg(record))).png().toBuffer();
      res.set({ "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" }).end(png);
    } catch { res.status(500).end(); }
  });
  app.get("/compare/pdf", (req, res) => {
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
    const tableRows = rows(record);
    for (const row of tableRows) {
      pdf.fillColor("#efe4d2").rect(42, y, 511, 42).fill();
      pdf.fillColor("#745531").fontSize(isArabic ? 8 : 8).text(row.label, 50, y + 8, { width: 120, align: isArabic ? "right" : "left" });
      pdf.fillColor("#1e2224").fontSize(isArabic ? 8 : 9).text(row.first, 178, y + 8, { width: 170, align: isArabic ? "right" : "left" });
      pdf.text(row.second, 360, y + 8, { width: 184, align: isArabic ? "right" : "left" });
      y += 45;
    }
    pdf.fillColor("#745531").fontSize(isArabic ? 8 : 8).text(isArabic ? "وثيقة مقارنة تجريبية. لا تمثل طلبًا أو دفعًا أو ضمانًا لتوافر المنتج." : "Demo comparison document. It does not represent an order, payment, or availability guarantee.", 42, y + 20, { width: 511, align: isArabic ? "right" : "left" });
    pdf.end();
  });
  app.use((req, _res, next) => { (req as Request & { caffioOrigin?: string }).caffioOrigin = resolveOrigin(req); next(); });
}
