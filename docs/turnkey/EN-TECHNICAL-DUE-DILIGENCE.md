# Caffio Coffee — Technical Due Diligence and Security Review

**Reference date:** 18 August 2026. This is a scoped repository review, not an OWASP certification, penetration test, “zero vulnerability” statement, “zero memory leak” warranty, or operating-security guarantee. A buyer needs independent application, infrastructure, cloud, and vendor review before launch.

## Scope and evidence

The review covered source structure, tracked files, secret-pattern scanning, configuration, production dependencies, routes, data boundaries, and automated validation. Vitest, TypeScript, and production build were run after dependency changes. The initial dependency scan identified multiple exposures; `axios`, `drizzle-orm`, `nanoid`, and `streamdown` were updated, while unused `recharts` and its unused chart component were removed.

| Check | Verifiable result | Limit |
| --- | --- | --- |
| Tracked secrets | no tracked `.env`, PEM, or KEY file was found by the repository scan | does not expose platform secrets or rewritten git history outside the current checkout |
| Client-data boundary | simulations do not store card, address, or payment data | buyer owns privacy/retention policy for a live launch |
| Admin protection | tasting moderation uses OAuth and a server-side admin role | buyer must test its own accounts and role policy |
| UGC controls | pending by default, approved-only public output, approved-only automated summary | does not replace human moderation policy or abuse protection |
| Share rendering | SSR is restricted to pending/verified record states and stable editorial copy | final domain, CDN, and social-card behavior need buyer validation |
| Automated validation | 35 unit and 76 browser tests at the most recent pre-audit checkpoint | counts change with releases; final execution is part of handover |

## OWASP-aligned control review

| Review topic | Present evidence | Buyer action before production |
| --- | --- | --- |
| Access control | OAuth user context and guarded admin procedures | least privilege and administrator lifecycle review |
| Input handling | Zod/tRPC contracts, bounded reflections, explicit publication states | fuzzing, rate limits, and WAF on the production domain |
| Disclosure | commerce/payment demo boundaries are visible | legal copy, cookie, and privacy review |
| Secrets | no committed `.env`; platform secret manager boundary | key rotation, dev/stage/prod separation, access logging |
| Dependencies | direct exposure updates and unused-chart removal | monthly SCA and CI dependency policy |
| Rendering/sharing | escaped server HTML and source-governed record boundary | CSP, headers, CDN, and WAF review |
| Availability | lazy loading plus error/loading states | health checks, DB backups, DR plan, alerts |

## Dependency-audit result

The compatible final `pnpm audit --prod` result is **0 critical, 1 high, 2 moderate, and 2 low** across 514 production dependencies. The remaining high finding flows through `express@4.21.2` and its older `path-to-regexp`. Express 5.2.1 was evaluated, but it broke the platform wildcard route `/manus-storage/*`; the compatible version was restored and the server returned HTTP 200. This is a disclosed remediation item, not a hidden exception: an Express-major upgrade requires route-layer changes and full SSR/asset/route regression in a dedicated branch.

## Permitted assurance language

> A scoped source review, documented dependency remediation, and build/type/unit verification were performed. This is not a formal certification or warranty against vulnerabilities, memory leaks, outages, or future configuration defects. The buyer must commission penetration testing and environment/vendor review before commercial operation.

## Pre-launch action register

1. Upgrade Express in an isolated branch, update the wildcard route layer, and regress SSR, assets, and public routes.
2. Add CSP, appropriate security headers, and buyer-domain CORS policy.
3. Enable rate limiting, audit logs, secret management, and rotation.
4. Commission third-party penetration testing with written scope and remediate findings before handling payments or PII.
5. Enable monitoring, backups, retention rules, and incident-response runbooks.
