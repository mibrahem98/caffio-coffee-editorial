# MIZAN COFFEE — Quiet Roast Editorial

MIZAN COFFEE / ميزان is a bilingual specialty-coffee brand experience built around a quiet editorial system: origin before ornament, practical ritual, and warm precision. The project combines a premium landing page with auditable product records, interactive field notes, local demo commerce, order tracking, saved coffees, and a local profile.

**Live experience:** [apexroast-5n8tojyv.manus.space](https://apexroast-5n8tojyv.manus.space/)

## Portfolio highlights

| Area | What is demonstrated |
|---|---|
| Brand experience | DM Serif Display and Manrope, charcoal/ivory/roast brown/brass palette, asymmetric editorial chapters, bilingual RTL/LTR parity, and dark mode |
| Product storytelling | Independent product routes with origin, farm, process, altitude, roast, tasting cues, brew methods, and interactive batch audit cards |
| Demo commerce | Local cart drawer, quantity controls, demo promo codes, local checkout simulation, bounded order history, and a demo tracking timeline |
| Retention UX | Saved-coffee favorites, interactive field-note recipes, and a local profile combining orders and favorites |
| Trust and compliance | Pending states for unsupported facts, source-aware content structure, and an intentionally empty verified-review state rather than fabricated testimonials |
| Quality | Vitest coverage for cart, discounts, immutable order snapshots, bounded tracking status, and favorites; TypeScript and production build checks |

## Routes

The main experience is available at `/`. Product records use `/coffee/:id`. The supporting editorial and local demo routes are `/notes`, `/favorites`, `/track`, and `/profile`.

## Local development

```bash
pnpm install
pnpm dev
```

Run the quality checks before shipping:

```bash
pnpm test
pnpm run check
pnpm run build
```

## Architecture

The frontend is a static React 19 application using Vite, Tailwind CSS 4, Wouter, Lucide icons, Sonner, and Vitest. Product and field-note content lives in typed modules under `client/src/lib/`. `CartContext` and `FavoritesContext` keep browser-local state only. Pure demo-commerce behavior is extracted to `client/src/lib/demoCommerce.ts` so it can be tested independently of the UI.

## Important demo boundary

This repository intentionally does not process payments, create real orders, send email, connect a CRM, or track a real shipment. Cart, promo codes, order history, tracking, favorites, and profile data are browser-local simulations. Product origin and batch details remain pending until a supporting record is attached to the project research registry.

The project does not seed customer reviews, ratings, quotes, or testimonials. The product review area is designed to accept verified feedback later without manufacturing social proof.

## Content governance

Before replacing a pending product field, attach the supporting record and add its source to `docs/RESEARCH-SOURCES.md`. The reusable workflow for this process is packaged as the `mizan-coffee-web-workflow` Manus skill.

## License

The source is published as a portfolio case study. Add a project-specific license before redistributing the code commercially.
