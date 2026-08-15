# Caffio Coffee — Bilingual Specialty Coffee Editorial Experience

[![Live Experience](https://img.shields.io/badge/Live-Caffio%20Coffee-C29B58?style=flat-square)](https://apexroast-5n8tojyv.manus.space/) [![Portfolio Repository](https://img.shields.io/badge/GitHub-Portfolio%20Case%20Study-1E2224?style=flat-square&logo=github)](https://github.com/mibrahem98/caffio-coffee-editorial) [![Quality](https://img.shields.io/badge/Quality-22%20Vitest%20%2B%2055%20Playwright-4E6653?style=flat-square)](#quality-assurance)

> **Caffio Coffee** is a bilingual Arabic/English specialty-coffee experience that treats the product record as the center of the story. Its visual system combines quiet editorial pacing, warm neo-minimalism, and auditable content states so that the interface never turns pending origin or tasting information into a marketing claim.

**المشروع باختصار:** Caffio تجربة قهوة مختصة ثنائية اللغة تضع السجل قبل الزخرفة. تجمع بين سرد تحريري هادئ، تجربة مقارنة قابلة للمشاركة، وصفات تحضير عملية، ومحاكاة تجارة واضحة الحدود، مع إبقاء أي معلومة غير موثقة في حالة معلّقة بدل اختلاقها.

| Link | Destination |
|---|---|
| **Live website** | [apexroast-5n8tojyv.manus.space](https://apexroast-5n8tojyv.manus.space/) |
| **Comparison workflow** | [Open a shareable comparison](https://apexroast-5n8tojyv.manus.space/compare?a=alto&b=sombra) |
| **Source protocol** | [Review evidence boundaries](https://apexroast-5n8tojyv.manus.space/sources) |
| **Case study in product** | [Read the design case study](https://apexroast-5n8tojyv.manus.space/case-study) |
| **Repository** | [mibrahem98/caffio-coffee-editorial](https://github.com/mibrahem98/caffio-coffee-editorial) |

---

## The Portfolio Thesis

Most coffee sites optimize for catalog density or lifestyle imagery. Caffio was designed around a different question: **how can a premium coffee interface remain useful and editorial when source evidence is incomplete?** The answer is a product system that makes verification visible. Pending batch records, unsupported tasting claims, empty review states, local demo commerce, and browser-only preferences are expressed honestly in the interface rather than hidden behind generic storefront conventions.

The result is both a brand exercise and a production-minded UX case study: a responsive public experience with accessible interactions, route-aware performance work, shareable comparisons, server-generated social cards, and a documented path from local simulation to future live integrations.

## Visual Evidence

| Editorial landing | Product record and audit | Local profile and demo history |
|---|---|---|
| ![Caffio editorial landing page](https://files.manuscdn.com/user_upload_by_module/session_file/310519663707167899/MfmFpJnXXjPQpsYQ.png) | ![Caffio product record with batch audit](https://files.manuscdn.com/user_upload_by_module/session_file/310519663707167899/VAoHXImmMgTHtwvj.png) | ![Caffio local profile empty state](https://files.manuscdn.com/user_upload_by_module/session_file/310519663707167899/dgdmcHlGeAuQUknB.png) |

The live comparison route extends this system with side-by-side record fields, verified-only tasting behavior, field-note recipe cards, SVG export, a browser print flow, and a formatted server PDF.

---

## What the Experience Demonstrates

| Capability | Implementation | Portfolio value |
|---|---|---|
| **Bilingual editorial system** | Arabic/English parity, RTL/LTR direction handling, DM Serif Display for expression and Manrope for utility text | Shows brand-sensitive interface design beyond a translated template |
| **Auditable product storytelling** | Independent product records, batch audit cards, pending evidence states, source protocol route | Demonstrates content governance embedded in UX |
| **Product discovery** | Search URL state, active refinements, locally saved filters, verified-note gating, recent searches, related products | Shows practical search interaction design and accessible state communication |
| **Comparison engine** | Two-product URL pairing, evidence-aware fields, recipe cards, browser sharing, SVG image export, server PDF | Demonstrates decision support, export design, and URL-driven composition |
| **Social preview layer** | Server-rendered comparison metadata, canonical URLs, Open Graph/Twitter tags, branded PNG endpoint | Shows share-ready metadata design for crawler-facing routes |
| **Demo commerce boundary** | Local cart, promo code, checkout, society flow, tracking, favorites, profile | Demonstrates commerce UX without falsely representing payments or fulfilment |
| **Responsive performance** | Route lazy-loading, responsive AVIF/WebP imagery, prioritized Hero, deferred non-critical media | Shows performance-aware front-end architecture |
| **Quality discipline** | Unit tests, browser flows, mobile/RTL coverage, reduced-motion checks, type checking, production build verification | Shows a repeatable engineering workflow, not only visual output |

---

## Product and Design Direction

### Quiet Roast Editorial / Neo-Minimalism 2026

The visual language is deliberately quiet. **Charcoal** provides the framing field, **warm ivory** creates a reading surface, **roast brown** carries factual utility text, and **aged brass** creates restrained emphasis. Large serif headlines, contour lines, orbit seals, archival metadata, and ample negative space turn the interface into an editorial object without losing shopping clarity.

| Design decision | Why it exists |
|---|---|
| **Origin before ornament** | A product record should disclose uncertainty rather than fill gaps with attractive language. |
| **Practical ritual** | Brew ratios, temperatures, grind, and time are shown as starting points—not promises of one perfect cup. |
| **Evidence as interface** | Batch verification, source type, review state, and pending fields are visible components of the product story. |
| **Warm precision** | The palette and typography create premium restraint while preserving legibility and hierarchy. |
| **Motion with restraint** | Short opacity/transform transitions respect `prefers-reduced-motion` and never gate content. |

---

## Development Journey

The project evolved in deliberate stages, each designed to add a demonstrable capability while protecting content integrity.

| Stage | Outcome | Representative routes or systems |
|---|---|---|
| **01 — Brand foundation** | Reframed the original guide as Caffio Coffee with a distinct bilingual editorial system | `/`, dark mode, responsive header, brand tokens |
| **02 — Auditable catalog** | Added independent product detail pages and batch-record disclosure instead of unsupported copy | `/coffee/:id`, batch cards, source protocol |
| **03 — Honest demo commerce** | Built cart, promo, checkout, tracking, favorites, and profile as transparent browser-local simulations | `/track`, `/favorites`, `/profile` |
| **04 — Editorial utility** | Added interactive field notes, FAQ discovery, search, filters, and local search memory | `/notes`, `/search` |
| **05 — Performance and interaction** | Introduced lazy routes, responsive AVIF/WebP, skeleton states, motion preferences, and automated interaction checks | responsive image system, Playwright |
| **06 — Decision support** | Added comparison pairs, evidence-aware related products, verified-only tasting paths, and comparison recipes | `/compare?a=alto&b=sombra` |
| **07 — Share and export** | Added browser sharing, SVG export, formatted PDF generation, server-rendered social metadata, and a dynamic PNG card | `/compare/og.png`, `/compare/pdf` |

---

## Route Map

| Route | Purpose | Data and integration boundary |
|---|---|---|
| `/` | Editorial landing, collection entry, FAQ, lightweight compare entry | Public static catalog and local UI state |
| `/coffee/:id` | Product record, recipes, batch audit, favorites, sharing | Product facts stay pending until documented |
| `/search` | Search, sort, refine, restore filters, related products | Browser-local query/filter memory; verified notes only |
| `/compare?a=:id&b=:id` | Side-by-side decision workflow and recipe comparison | Two real catalog records; no inferred tasting claims |
| `/compare/og.png` | Dynamic social image for a comparison URL | Server-generated PNG from selected record names and evidence state |
| `/compare/pdf` | Formatted comparison download | Server-generated PDF; not an order, invoice, or availability statement |
| `/notes` | Field-note brew guidance | Typed editorial recipe data |
| `/society` | Subscription concept prototype | Explicit local simulation; no payment, address, or delivery transaction |
| `/track`, `/profile`, `/favorites` | Browser-local demo order and preference surfaces | No account, CRM, shipping, or payment system |
| `/payments` | Payment activity boundary | Empty until verified provider webhook events exist |
| `/sources` | Content evidence protocol | Links and governance only; no unsupported product proof |
| `/case-study` | In-product process narrative | Public portfolio narrative |

---

## Comparison Workflow: From Choice to Shareable Artifact

The comparison route is the strongest example of Caffio’s product-thinking approach. A visitor chooses two distinct catalog records, and the interface composes a stable URL that can be shared or revisited. The table compares profile, brew methods, origin, process, altitude, batch state, price, and tasting status. **Tasting notes contribute only when the relevant batch record is verified.**

The same comparison can then be expressed in four formats:

1. **Shareable URL** through the native browser share sheet or clipboard fallback.
2. **Branded SVG** generated locally from the visible table values.
3. **Print / Save as PDF** through the browser print flow.
4. **Formatted server PDF** at `/compare/pdf`, generated from the same source-governed record fields.

For social platforms, the server injects comparison-specific title, description, canonical URL, Open Graph, and Twitter metadata before JavaScript runs. It also serves a branded PNG at `/compare/og.png`. This server-rendered metadata scope currently targets comparison links; the interactive React application remains client-rendered.

## Content Governance and Trust Boundaries

> A refined interface must not turn a missing document into a factual claim.

The project intentionally avoids fabricated reviews, ratings, testimonials, origin claims, farm claims, certifications, traceability claims, and tasting notes. Visible facts are either tied to a record model or explicitly marked pending. Before replacing a pending field, add the supporting record to [`docs/RESEARCH-SOURCES.md`](./docs/RESEARCH-SOURCES.md) and record the related batch evidence.

| Topic | Current posture |
|---|---|
| **Origin, farm, process, altitude** | Pending unless a product or batch source supports the field |
| **Tasting notes** | Hidden from public filtering and comparison until the related batch is verified |
| **Reviews and ratings** | Intentionally empty; never seeded as social proof |
| **Payments and shipment** | No real payment, shipping, CRM, email capture, or fulfilment is represented |
| **Orders and profiles** | Browser-local demo records only |
| **Server PDF** | A comparison document only—not an invoice, purchase record, or stock confirmation |

### Data required to activate verified tasting

To publish a tasting record, provide a producer document, batch card, or cupping report containing the batch identifier, review date, verification status, source URL/file, and bilingual tasting notes when available. Until then, the interface remains intentionally pending.

---

## Technical Architecture

```text
React 19 + Vite + TypeScript
│
├── Editorial interface: Wouter routes, custom CSS tokens, Lucide, Sonner
├── Client interactions: local cart, favorites, filters, recent searches, comparison URL state
├── Content model: typed bilingual catalog, batch records, field-note recipes
├── Quality: Vitest + Playwright + TypeScript checks + production build
└── Express output layer
    ├── /compare                → crawler-facing metadata + evidence-bound snapshot
    ├── /compare/og.png         → branded PNG social card
    └── /compare/pdf            → formatted Unicode-capable comparison PDF
```

### Stack

| Layer | Tools |
|---|---|
| Front end | React 19, Vite 7, TypeScript, Wouter, Tailwind CSS 4, Lucide, Sonner |
| Server | Express 4, tRPC-ready project foundation, PDFKit, Sharp |
| Testing | Vitest, Playwright, TypeScript compiler checks |
| Media | Managed static storage, responsive AVIF/WebP `<picture>` sources, product Open Graph assets |
| Documentation | Source registry, content policy, release checklist, reusable Manus workflow skill |

---

## Quality Assurance

The latest portfolio release validated **22 Vitest assertions** and **55 Playwright scenarios**; one touch-hover scenario remains intentionally skipped because hover is not a reliable touch interaction. In addition, TypeScript, production build, server PDF, raw crawler HTML, Open Graph image MIME, Arabic metadata, and responsive desktop/mobile layouts were reviewed before release.

| Check | Examples covered |
|---|---|
| Unit behavior | Cart arithmetic, discounts, local orders, favorites, Society calculations, discovery ranking, comparison URL state, SVG export, server comparison metadata |
| Browser behavior | Header navigation, share sheet/clipboard fallback, comparison selection, PDF controls, FAQ keyboard interaction, search filtering, empty states, mobile routes |
| Accessibility | Keyboard reachability, visible focus, polite live status, ARIA controls, RTL parity, reduced-motion handling |
| Server output | Raw comparison HTML, Open Graph/Twitter tags, canonical URL, dynamic PNG response, English/Arabic PDF response |
| Build confidence | `pnpm test`, `pnpm run test:e2e`, `pnpm run check`, `pnpm run build` |

## Local Development

```bash
pnpm install
pnpm dev
```

Run the release checks:

```bash
pnpm test
pnpm run test:e2e
pnpm run check
pnpm run build
```

For a local production verification of the share-output layer:

```bash
PORT=4101 NODE_ENV=production node dist/index.js
curl "http://localhost:4101/compare?a=alto&b=sombra"
curl -I "http://localhost:4101/compare/og.png?a=alto&b=sombra"
curl -I "http://localhost:4101/compare/pdf?a=alto&b=sombra&lang=ar"
```

## Reusable Workflow

The project workflow is packaged as the **`mizan-coffee-web-workflow`** Manus skill. It captures the reusable patterns behind the experience: bilingual editorial layout, audited batch states, local demo boundaries, product search, comparison, field-note recipes, dynamic share metadata, server PDF generation, and quality verification.

## Roadmap

The following work is intentionally not represented as complete:

1. **Verified tasting data:** Publish it only after producer or cupping documents are supplied and logged in the source registry.
2. **Full public-route React SSR:** Expand beyond comparison metadata only after auditing all browser-local state and hydration behavior across public routes.
3. **Live commerce:** Configure a payment provider, server-side checkout, webhooks, fulfillment, cancellation, data retention, and shipping rules before claiming real subscription capability.
4. **Structured discovery:** Add `sitemap.xml`, `robots.txt` sitemap reference, and record-backed JSON-LD only once product facts are supported.

## License

This repository is published as a portfolio case study. Add a project-specific license before commercial redistribution.
