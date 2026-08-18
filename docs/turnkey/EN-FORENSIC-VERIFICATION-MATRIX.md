# Forensic Verification and Remediation Matrix — Caffio / MIZAN

**Audit date:** 18 August 2026  
**Reviewed scope:** The bilingual React/Vite public interface, local-commerce simulations, and the existing server layer without source-level server, database, or API changes in this round.  
**Method:** Reproduce a defect or establish a protective condition through an automated test, build check, dependency scan, route probe, or focused log review.

> This document is not an absolute “immunity certificate” or a promise that every device, browser, future dependency, or unknown attack path is defect-free. It records what was tested, remediated, and verified on the stated date, with explicit residual limits.

## Outcome summary

The final quality gate completed without a failing check. The build passed **37 Vitest tests** and **80 Playwright tests**, with two intentionally skipped touch-environment hover checks. `pnpm run check`, `pnpm run build`, and `git diff --check` also passed. `pnpm audit --prod` reported **0** critical, high, moderate, and low findings. These are repeatable signals for the tested flows—not a mathematical proof against every possible failure or exploit.

| Evidence layer | Result | Reproducible evidence |
|---|---:|---|
| Local-data logic | Pass | `pnpm test` — 37 tests, including malformed Cart/Favorites/Orders cases. |
| Interaction, routes, and accessibility | Pass | `pnpm run test:e2e` — 80 passed, 2 intentional skips. |
| Types and production build | Pass | `pnpm run check` and `pnpm run build`. |
| Production dependencies | 0 findings | `pnpm audit --prod --json`. |
| Post-verification logs | No browser error or 5xx in the review window | Last 160 lines of server, browser, and network logs reviewed. |
| Asset route | Pass | `GET /manus-storage/forensic-probe` returned 307 after restart. |

## Root-cause remediation matrix

| Tool / function | Verified root cause | Practical permanent remediation | Regression evidence |
|---|---|---|---|
| Demo cart and orders | Raw browser JSON was accepted without structural validation; string, negative, or unknown values could reach quantity and state calculations. | Added `normalizeCartItems`, `normalizeDemoOrders`, and `normalizeFavorites`. They permit only known catalog IDs, integer quantities from 1–99, finite non-negative money, and valid date/status values. | Vitest covers corrupt JSON, string/negative quantities, unknown IDs, out-of-range status, and `NaN` amounts. Playwright confirms only the valid cart quantity reaches the UI. |
| Favorites | `mizan-favorites` was consumed as stored, so an untrusted array could carry unexpected IDs or value types. | Initialization now removes non-string, unknown, and duplicate entries before rendering or persisting. | Browser test seeds `alto`, `unknown`, and a number, then proves only `alto` appears. |
| Authentication hook | `useMemo` wrote the user object to `localStorage` during render even though the key had no reader. This was an unnecessary render side effect and could leave local identity data. | Removed durable user-info storage entirely, made returned state render-pure, and retained protected preview-token removal with development-only diagnostics if storage is unavailable. | A source-use review found no remaining reader or writer for the former key; TypeScript, build, and test suites pass after removal. |
| Error boundary | The public fallback rendered `error.stack`, potentially exposing implementation paths or diagnostics. | Replaced it with a generic recovery state; details only reach `console.error` in development. | The recovery-route test confirms no diagnostic `pre` element and the browser-log review contains no new unhandled exception. |
| 404 recovery | The fallback worked but was a generic blue, English-only card outside the MIZAN design and bilingual recovery system. | Rebuilt it with the MIZAN header, language control, cart affordance, return and source-protocol links, and a focusable `main`. | Playwright covers an unknown route, both recovery links, and no exposed diagnostic stack; desktop visual review confirms visual continuity. |
| pnpm configuration and dependencies | pnpm 10 ignored the `pnpm` field in `package.json`, making intended overrides/patch configuration unreliable. Express 4.21.2 also retained an advisory-bearing transitive chain. | Moved overrides and the Wouter patch declaration to supported `pnpm-workspace.yaml`; upgraded Express to 4.22.2 with body-parser 1.20.6, path-to-regexp 0.1.13, and qs 6.15.3. | `pnpm install` no longer reports ignored settings; `pnpm why` shows the remediated versions; `pnpm audit --prod` reports zero findings. |
| `/manus-storage/*` | Historical logs included a `PathError` from an Express 5 experiment, while the project must retain Express 4 for the established wildcard syntax. | Preserved the compatible Express 4 line and upgraded only within it; no error-suppressing workaround or unverified path rewrite was applied. | After restart, the live probe returns 307 and the current review window has no `PathError` response. |

## Verified surfaces

The audit covered the responsive header and navigation, language and theme switching, RTL, skip focus, FAQ and autocomplete, search and locally persisted filters, comparison and link sharing, product records, cart/promo/demo tracking, local Society flow, favorites, verified-payment empty state, moderated reflections, brew guide, reduced motion, 404 recovery, and responsive-image loading. Cart, subscription, tracking, and payment remain **local simulations**. This audit does not establish a real payment gateway, shipping service, CRM, email capture, or settlement flow.

## Residual limits and sale-safe decisions

| Limit | Consequence | Required action before stating otherwise |
|---|---|---|
| No live payment provider or transaction | Payment acceptance, refunds, or verified transaction activity cannot be claimed. | Server-side provider integration, secrets outside the client, signed webhooks, and idempotent processing. |
| No newly supplied operational batch/source records | Product origin, tasting, and batch statements retain their existing pending/source-governed status. | Supply auditable records and link each claim to a source. |
| SPA client-side 404 | The dev server serves app HTML with status 200 before the client renders the fallback. | Server/deployment routing change for semantic HTTP 404, outside the static frontend scope. |
| No proof of zero leaks on every platform | Observers and timers were reviewed in tested flows, not on all future browser/device combinations. | Production monitoring, target-device profiling, and continuous regression checks. |
| Non-security install warnings remain | Deprecated transitive packages and a Vite peer mismatch for `vite-plugin-jsx-loc` were observed; they did not appear in the production audit. | Isolated compatibility test when upgrading Vite or replacing that plugin; do not mislabel this as a proven vulnerability. |

## References

[1] [OWASP Top 10 — input validation and error handling context](https://owasp.org/www-project-top-ten/).  
[2] [Express production security best practices](https://expressjs.com/en/advanced/best-practice-security.html).  
[3] [Final `pnpm audit --prod --json` result — project execution record, 18 August 2026](../../../../tmp/caffio-final-audit.json).
