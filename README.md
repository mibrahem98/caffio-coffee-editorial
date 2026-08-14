# Caffio Coffee — Neo-Minimalism 2026

Caffio is a bilingual specialty-coffee brand experience built around a Neo-Minimalism 2026 system: coffee craft shaped by architectural calm, practical ritual, and warm precision. The project combines a cinematic landing page with auditable product records, interactive field notes, local demo commerce, Caffio Society subscription simulation, order tracking, saved coffees, a local profile, social sharing, and a design case study.

**Live experience:** [apexroast-5n8tojyv.manus.space](https://apexroast-5n8tojyv.manus.space/)

## Screenshots

| Home / editorial landing | Product record / batch audit | Local profile / demo history |
|---|---|---|
| ![Caffio home](https://files.manuscdn.com/user_upload_by_module/session_file/310519663707167899/MfmFpJnXXjPQpsYQ.png) | ![Caffio product detail](https://files.manuscdn.com/user_upload_by_module/session_file/310519663707167899/VAoHXImmMgTHtwvj.png) | ![Caffio profile](https://files.manuscdn.com/user_upload_by_module/session_file/310519663707167899/dgdmcHlGeAuQUknB.png) |

These captures show the current public-facing composition. The product capture includes the local share rail and the interactive batch-record disclosure; the profile capture shows the empty-state behavior before browser-local orders or favorites exist.

## Portfolio highlights

| Area | What is demonstrated |
|---|---|
| Brand experience | DM Serif Display and Manrope, charcoal/ivory/roast brown/brass palette, asymmetric editorial chapters, bilingual RTL/LTR parity, and dark mode |
| Product storytelling | Independent product routes with origin, farm, process, altitude, roast, tasting cues, brew methods, and interactive batch audit cards |
| Demo commerce | Local cart drawer, quantity controls, demo promo codes, local checkout simulation, bounded order history, and a demo tracking timeline |
| Retention UX | Saved-coffee favorites, interactive field-note recipes, and a local profile combining orders and favorites |
| Social interaction | Product sharing through the browser-native share sheet when available, with copy-link, WhatsApp, Facebook, and X fallbacks |
| Share previews | Dedicated 1.91:1 Caffio packaging Open Graph image for each product route, injected with title, description, canonical URL, and Twitter large-image metadata |
| Society prototype | A four-step local subscription flow for coffee, cadence, grind, delivery, review, and completion; it explicitly avoids payment, address, account, or shipment creation |
| Trust and compliance | Pending states for unsupported facts, source-aware content structure, and an intentionally empty verified-review state rather than fabricated testimonials |
| Quality | Vitest coverage for cart, discounts, Society quote calculation, immutable order snapshots, bounded tracking status, and favorites; Playwright coverage for hover, native share, clipboard fallback, mobile overflow, product OG metadata, and Society completion |

## Routes

The main experience is available at `/`. Product records use `/coffee/:id`. The supporting editorial and local demo routes are `/notes`, `/favorites`, `/track`, `/profile`, `/society`, and `/case-study`.

## Design decisions

| Decision | Rationale |
|---|---|
| Quiet Roast Editorial | The interface treats coffee as a considered ritual rather than a generic catalog. Large serif statements, measured whitespace, archival metadata, and calm chapter pacing make the brand feel tactile without becoming decorative noise. |
| Caffio visual grammar | A charcoal field, warm ivory reading surface, roast brown, and aged brass create a warm precision system. The rising diagonal, contour lines, orbit seals, and oversized chapter numbers turn architectural calm into a repeatable visual motif. |
| Origin before ornament | Product pages separate known records from pending documentation. Batch cards expose record ID, verification state, expected source, evidence state, and review date so visual polish never hides content uncertainty. |
| Practical ritual | Field notes present ratios, temperature, grind, time, and ordered steps as starting points rather than universal claims. The interaction uses accessible disclosure panels so the page stays editorial and useful. |
| Demo-first commerce | Cart, promo codes, checkout, tracking, favorites, and profile history are deliberately local-only. The interface communicates the boundary instead of pretending that payment, shipping, CRM, or customer accounts exist. |
| Bilingual parity | Arabic and English share the same information architecture and meaning while the document direction, alignment, and labels adapt to RTL/LTR. |
| Motion with restraint | Scroll reveals use short opacity/transform transitions through `IntersectionObserver`; content is still readable before observation, and `prefers-reduced-motion` disables the effect. |
| Share-ready packaging | Each product owns a restrained Open Graph packaging image so a link preview remains recognizably Caffio before a visitor opens the site. |
| Integration-ready Society | The client models a safe demo flow now and keeps a clear boundary for a future server-side subscription provider; payment keys, checkout, webhooks, shipping rules, and customer data stay outside the browser. |

## Interaction notes

On a product detail page, the share rail first tries the browser-native `navigator.share` flow. Where that is unavailable, visitors can copy the product URL or open a prefilled share URL for WhatsApp, Facebook, or X. These fallbacks do not send product or customer data to Caffio. All interactive states are designed to remain keyboard reachable and to preserve the same content hierarchy in both themes.

## Local development

```bash
pnpm install
pnpm dev
```

Run the quality checks before shipping:

```bash
pnpm test
pnpm run test:e2e
pnpm run check
pnpm run build
```

## Architecture

The public experience is a React 19 application using Vite, Tailwind CSS 4, Wouter, Lucide icons, Sonner, Vitest, and Playwright. The project base also supports a server and database for future authenticated commerce integrations, but the current Caffio catalog and Society prototype use typed browser-local state only. Pure demo-commerce and Society behavior are extracted to `client/src/lib/` so they can be tested independently of the UI.

## Important demo boundary

This repository intentionally does not process payments, create real orders, send email, connect a CRM, or track a real shipment. Cart, promo codes, Caffio Society, order history, tracking, favorites, and profile data are browser-local simulations. The Stripe sandbox could not be claimed automatically for the project's region; a live Caffio Society checkout requires the owner to supply Stripe keys in project payment settings, then configure server-side checkout sessions, webhooks, fulfillment, cancellations, and shipping rules. Product origin and batch details remain pending until a supporting record is attached to the project research registry.

The project does not seed customer reviews, ratings, quotes, or testimonials. The product review area is designed to accept verified feedback later without manufacturing social proof.

## Content governance

Before replacing a pending product field, attach the supporting record and add its source to `docs/RESEARCH-SOURCES.md`. SEO and social metadata references are recorded in `docs/CAFFIO-SEO-SOURCES.md`. The reusable workflow for this process is packaged as the `mizan-coffee-web-workflow` Manus skill.

## License

The source is published as a portfolio case study. Add a project-specific license before redistributing the code commercially.
