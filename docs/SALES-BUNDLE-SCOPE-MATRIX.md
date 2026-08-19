# Caffio Coffee — Sales Bundle Scope Matrix

**Reference date:** 18 August 2026. This matrix adapts the requested turnkey-sales brief to the actual Caffio Coffee repository. It is a delivery-scope and evidence document, not a security certification, legal opinion, guarantee of revenue, or promise that an acquirer can operate a live store without supplying their own providers, policies, and assets.

| Requested area | Repository-grounded delivery | Evidence or planned artifact | Boundary that must remain explicit |
| --- | --- | --- | --- |
| Full source code | Clean source archive, route map, component inventory, environment guide, and installation steps | Source archive, README, handover manual, package scripts | Dependencies, generated builds, local cache, secrets, and platform-managed credentials are excluded |
| Clean architecture / strict typing | React feature components, typed catalog, Wouter routes, Express/tRPC, Drizzle records, global error boundary, theme context | `client/`, `server/`, `drizzle/`, TypeScript and test outputs | “Clean architecture” describes the current maintainable structure; it is not a certification or a claim that no refactoring is ever needed |
| Themes and bilingual UX | Tokenized light/dark system, Arabic/English interfaces, runtime `dir`/`lang`, responsive layouts | Theme context, CSS tokens, language controls, browser tests | Translation parity applies to shipped routes; buyer-added content must be translated and reviewed separately |
| Guarded routes | Authentication and server-enforced administrator checks for tasting moderation | OAuth context, protected/admin procedures, admin-route UI state | Public marketing routes remain public by design; buyer must configure their own identity and authorization policy |
| Error handling | Global error boundary and route-level loading/error states | `ErrorBoundary`, fallback UI, browser tests | It is not possible to warrant zero runtime failures across all browsers, providers, configurations, or future code changes |
| Cybersecurity / OWASP | Repository-based security review checklist covering input boundaries, authorization, secrets, dependency awareness, output escaping, and transport assumptions | Arabic/English technical-assurance reports and remediation register | No “OWASP certified,” “zero vulnerabilities,” “zero memory leaks,” or “100% secure” statement will be issued without an independently scoped audit and evidence |
| White-label readiness | Brand tokens, managed assets, bilingual content structures, and a documented rebranding checklist | White-label readiness section and handover checklist | “White-label ready” is conditional on the buyer licensing/replacing trademarks, fonts, photography, copy, policies, domain, and provider accounts |
| Commerce / payment | Browser-local cart, checkout, subscription, tracking, and payment-boundary simulations | Demo-boundary documentation and UI disclosures | No live payment, order, shipment, CRM, email capture, customer record, or fulfillment is included until server-side provider integration and policy approval |
| Reviews and flavor data | Moderated real-user reflections; approved-only automated flavor-summary capability | Database schema, admin procedures, review UI, governance document | No seeded reviews, ratings, testimonials, producer facts, or verified tasting claims will be added |
| PDF dossiers and decks | Independent Arabic/English buyer documents, investor decks, scripts, and a valuation matrix | Delivery directory with PDFs, deck files, and source documents | Legal/IP terms are drafts for qualified counsel; market and valuation figures are dated assumptions, not investment advice or a sale guarantee |
| Promotional video | Two independent 16:9 horizontal acquisition-promo videos, Arabic and English, with no voiceover, plus source-governed scripts and storyboards | Final video files, scene plans, reference images, and build notes | Video is a marketing presentation of verified shipped features and stated simulation boundaries; it cannot prove revenue, live provider operation, security certification, or legal transfer |
| Asset transfer | Documented delivery table for source, domain, data, assets, and rights | Asset handover schedule and exclusions manifest | No transfer can be executed or legally guaranteed until parties sign their own agreement and confirm third-party licenses |

## Verification language

Use the following wording in buyer-facing material:

> **Verified in this repository:** the listed code paths, tests, build artifacts, route behavior, and explicit simulation boundaries as of the reference date.

> **Buyer action required:** provider credentials, domain transfer, legal/IP assignment, privacy and commerce policy, production security review, payment configuration, operational monitoring, and any live-content validation.

## Prohibited claims in the delivery bundle

The delivery documents must not claim guaranteed revenue, a live operating store, formal OWASP certification, zero vulnerabilities, zero memory leaks, 100% white-label readiness, transferred intellectual-property rights, enforceable license terms, or a fixed market price. Each of these requires separate facts, independent review, signed agreements, or live operational evidence beyond the repository.
