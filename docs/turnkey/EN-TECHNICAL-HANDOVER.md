# Caffio Coffee — Technical Handover and Operating Guide

**Reference version:** current Caffio Coffee bundle. **Purpose:** an organized technical handover for an acquirer, not an operating manual for a live store or an executed IP-transfer agreement. The acquirer should have its technical and legal teams review this material before commercial use.

## 1. Executive summary

Caffio Coffee is a bilingual Arabic/English specialty-coffee editorial experience. It combines an auditable product catalog, brew recipes, search and comparison, favorites, local cart and checkout simulation, and server-generated social sharing metadata. The experience keeps its interaction model clear without representing payment, fulfillment, CRM, or email capture as live services.

> **Operating boundary:** every visible commerce, subscription, payment, and tracking flow is browser-local simulation until the buyer adds a server-side payment provider, webhook verification, shipping policy, fulfillment operations, and privacy controls.

| Area | Present in repository | Required before commercial launch |
| --- | --- | --- |
| Public UX | Responsive React, RTL/LTR, dark mode, route transitions, loading state, keyboard access | Final copy, domain, privacy and terms review |
| Catalog | Bilingual records, roast profiles, brew methods, pending/verified batch states | Producer/batch evidence for every live factual claim |
| Commerce | Cart, promotions, Society, tracking and profile simulations | Payment, tax, address, shipping, stock, refunds, webhooks |
| UGC | Protected tasting reflections, moderation, approved-only automated summary | Community policy, moderators, notification, legal retention policy |
| SEO/sharing | SSR product, comparison, and editorial metadata with canonical, Open Graph, Twitter, and cards | Final domain, robots/sitemap, final metadata review |

## 2. Architecture and data flow

The frontend uses **React 19**, **Vite 7**, and **TypeScript 5**, with **Wouter** routing, Tailwind CSS 4, and bespoke editorial CSS. The server uses **Express 4**, **tRPC 11**, **Drizzle ORM**, and MySQL/TiDB. OAuth, server-rendered share metadata, and managed storage are platform-integrated. `ThemeContext`, `CartContext`, and `FavoritesContext` own UI state; non-sensitive simulations only are stored in `localStorage`.

```text
Browser
  → React / Wouter / Contexts / typed catalog
  → tRPC (auth, reflections, moderation, automated summary)
  → Express + SSR metadata dispatcher
  → Drizzle ORM → MySQL/TiDB
  → managed storage for static media
```

| Layer | Main locations | Responsibility |
| --- | --- | --- |
| Application | `client/src/App.tsx`, `client/src/pages/` | public routing, lazy loading, page composition |
| Components | `client/src/components/` | header, cart, batch card, sharing, reflections, advisor, brew guide |
| Client logic | `client/src/lib/` | typed catalog, search, comparison, local commerce, deterministic recommendations |
| Server | `server/routers.ts`, `server/db.ts`, `server/comparisonDocuments.ts` | tRPC, persistence, moderation, share/PDF documents |
| Data | `drizzle/schema.ts`, `drizzle/*.sql` | users, tasting reflections, flavor summaries |
| Documentation | `docs/` | governance, QA, buyer handover, evolution, SSR scope |

## 3. Feature and route catalog

| Route | Purpose | Data boundary |
| --- | --- | --- |
| `/` | brand story, collection, selector, brew guide, FAQ, purchase preview | public; unsupported product fields stay pending |
| `/coffee/:id` | product/batch record, recipes, approved UGC | origin/tasting is not a fact without verification |
| `/search` | search, filters, sorting, local history, related records | real catalog fields only |
| `/compare` | record comparison, sharing, export | verified facts or explicit pending state only |
| `/notes` | field notes and recipes | starting points, not guaranteed cup outcomes |
| `/society`, `/track`, `/profile` | local subscription, tracking, profile simulation | no live card, address, shipment, or commercial account |
| `/payments` | payment-activity boundary | empty until provider-verified events exist |
| `/admin/tasting` | cross-product reflection moderation | OAuth and server-side administrator role required |

## 4. Zero-to-production setup

### Requirements

Use Node.js 22+, pnpm 10+, and MySQL/TiDB only when protected data paths are enabled. The buyer needs its own OAuth, storage, domain, and deployment accounts. Do not copy `.env` files or third-party tokens into the repository or acquisition archive.

```bash
pnpm install --frozen-lockfile
pnpm run check
pnpm test
pnpm run build
pnpm start
```

Use `pnpm run dev` for development. For a database change, edit `drizzle/schema.ts`, generate and inspect the migration SQL, then apply it only in an appropriate environment with a backup and rollback plan.

### Runtime configuration

The system relies on platform-managed variables for database, OAuth, JWT, and storage. Set `DATABASE_URL`, `JWT_SECRET`, OAuth variables, and any future provider keys exclusively through the deployment secret manager. No secret value belongs in source control or the buyer archive.

## 5. Data/API inventory

The web application uses tRPC under `/api/trpc` rather than a bespoke public REST surface. Live payments are intentionally absent until the buyer builds provider-backed checkout and webhook verification.

| Domain | Behavior | Guard |
| --- | --- | --- |
| Auth | read current user and log out | platform OAuth session |
| Reflections | submit/read approved/read own record | signed-in user; default publication state is pending |
| Moderation | queue and approve/reject decisions | server-enforced `admin` role |
| Automated flavor summary | approved-reflection-only derived summary | never replaces product or batch facts |
| Sharing | metadata and PNG/PDF comparison assets | source-governed server HTML |

## 6. Operations and monitoring

Before a release, run `pnpm test`, `pnpm run check`, `pnpm run build`, and `pnpm run test:e2e`. Review browser, server, and network logs; test desktop/mobile, RTL/LTR, dark mode, reduced motion, keyboard use, and empty/error/success states. Re-run the SSR verifier whenever metadata or sharing routes change.

After acquisition, the buyer should instrument application exceptions, OAuth errors, tRPC latency, payment-webhook failures, moderation actions, storage requests, and social-card failures. Those production observability services are buyer choices and are not bundled as live operations.

## 7. Handover checklist

| Item | Recipient | Notes |
| --- | --- | --- |
| Source, lockfile, and documentation | contract-defined buyer | exclusions are listed separately |
| Domain and DNS | buyer after registrar transfer | requires registrar consent and HTTPS setup |
| Database | buyer after migration/backup | no live customer dataset is included |
| Brand assets | subject to confirmed licenses | verify every asset license before resale |
| Provider accounts | buyer creates/owns them | platform/developer credentials do not transfer automatically |
| Brand/IP rights | separate agreement | this guide is not a legal assignment |

## 8. White-label and IP transition

The structure can support a change of brand name, colors, copy, media, and domain, but it does not transfer rights automatically. Before calling the asset white-label ready, confirm trademark, photography, font, copy, open-source, domain, and vendor rights. Review `EN-IP-LICENSE-DRAFT.md` with qualified counsel before signing.

## 9. Internal references

Use `SALES-BUNDLE-SCOPE-MATRIX.md` for promise boundaries; `BUYER-HANDOVER.md`, `PROJECT-EVOLUTION.md`, and `QA-EDITORIAL-MODERATION.md` for delivery history and verification; and `RESEARCH-SOURCES.md` for coffee-content governance.
