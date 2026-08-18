import { expect, test } from "@playwright/test";

test("product card elevates on hover", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile-chromium", "Hover is validated with a desktop pointer.");
  await page.goto("/");
  const card = page.getByTestId("product-card-alto");
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await page.waitForTimeout(250);
  await expect(card).toHaveAttribute("data-testid", "product-card-alto");
  const transform = await card.evaluate((element) => getComputedStyle(element).transform);
  expect(transform).not.toBe("none");
});

test("homepage actions lead to working collection, Society, source, and field-note destinations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("hero-collection-link")).toHaveAttribute("href", "#collection");
  await expect(page.getByTestId("hero-society-link")).toHaveAttribute("href", "/society");
  await expect(page.getByRole("link", { name: "Read the source protocol" })).toHaveAttribute("href", "/case-study");
  await expect(page.getByRole("link", { name: "Read the note" }).first()).toHaveAttribute("href", "/notes");
  await expect(page.getByLabel("Open cart (0)")).toBeVisible();
});

test("desktop header groups secondary account tools behind an accessible menu", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile-chromium", "Secondary utilities are intentionally collected in the mobile navigation panel.");
  await page.goto("/");
  const moreTools = page.getByTitle("More tools");
  await expect(moreTools).toBeVisible();
  await moreTools.click();
  const menu = page.getByRole("menu", { name: "More tools" });
  await expect(menu.getByRole("menuitem", { name: "Track demo order" })).toHaveAttribute("href", "/track");
  await expect(menu.getByRole("menuitem", { name: "Verified payment activity" })).toHaveAttribute("href", "/payments");
  await expect(menu.getByRole("menuitem", { name: "Local profile" })).toHaveAttribute("href", "/profile");
});

test("Field Notes renders documented recipe starting points and filters them by brew method", async ({ page }) => {
  await page.goto("/notes");
  const articles = page.locator(".field-article");
  await expect(articles).toHaveCount(6);
  await page.getByRole("button", { name: "Moka pot" }).click();
  await expect(articles).toHaveCount(1);
  await expect(articles.getByRole("heading", { name: "A steady moka pot" })).toBeVisible();
});

test("homepage prioritizes its hero image and defers non-critical catalog imagery", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-image img")).toHaveAttribute("fetchpriority", "high");
  await expect(page.locator(".hero-image img")).toHaveAttribute("decoding", "async");
  await expect(page.locator(".hero-image source[type='image/avif']")).toHaveAttribute("srcset", /hero-480_.*\.avif/);
  await expect(page.getByTestId("product-card-alto").locator("source[type='image/webp']")).toHaveAttribute("srcset", /alto-480_.*\.webp/);
  await expect(page.getByTestId("product-card-alto").locator("img")).toHaveAttribute("loading", "lazy");
  await expect(page.locator(".notes-grid article img").first()).toHaveAttribute("loading", "lazy");
});

test("deferred responsive images load after their sections enter the viewport", async ({ page }) => {
  await page.goto("/");
  const ritualImage = page.locator(".ritual-photo img");
  await ritualImage.scrollIntoViewIfNeeded();
  await expect.poll(() => ritualImage.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  const journalImage = page.locator(".notes-grid article img").first();
  await journalImage.scrollIntoViewIfNeeded();
  await expect.poll(() => journalImage.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
});

test("FAQ accordion exposes one answer at a time and supports keyboard activation", async ({ page }) => {
  await page.goto("/");
  const accordion = page.getByTestId("faq-accordion");
  const firstQuestion = accordion.getByRole("button", { name: "How do I choose a coffee?" });
  const pricingQuestion = accordion.getByRole("button", { name: "Are the prices and checkout live?" });
  await expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
  await expect(pricingQuestion).toHaveAttribute("aria-expanded", "false");
  await pricingQuestion.focus();
  await pricingQuestion.press("Enter");
  await expect(pricingQuestion).toHaveAttribute("aria-expanded", "true");
  await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#faq-panel-commerce")).toHaveAttribute("aria-hidden", "false");

  const discovery = page.getByTestId("faq-discovery");
  await discovery.getByRole("button", { name: "Records & reviews" }).click();
  await expect(accordion.getByRole("button")).toHaveCount(1);
  await discovery.getByRole("button", { name: "All" }).click();
  await discovery.getByRole("combobox", { name: "Search questions" }).fill("subscription");
  await expect(accordion.getByRole("button", { name: "Is Caffio Society ready for paid subscriptions?" })).toBeVisible();
});

test("FAQ search exposes accessible autocomplete suggestions and opens the selected answer", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("combobox", { name: "Search questions" });
  await search.fill("subscription");
  await expect(search).toHaveAttribute("aria-expanded", "true");
  const suggestions = page.getByRole("listbox", { name: "Question suggestions" });
  await expect(suggestions.getByRole("option")).toHaveCount(1);
  await search.press("ArrowDown");
  await expect(search).toHaveAttribute("aria-activedescendant", "faq-suggestion-society");
  await search.press("Enter");
  await expect(page.getByRole("button", { name: "Is Caffio Society ready for paid subscriptions?" })).toHaveAttribute("aria-expanded", "true");
  await search.fill("unmatched phrase");
  await expect(suggestions.getByRole("option", { name: "No matching question suggestion" })).toHaveAttribute("aria-disabled", "true");
});

test("scroll reveals stay visible without transitions when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const reveal = page.locator(".hero-signal").first();
  await expect(reveal).toHaveClass(/is-visible/);
  const duration = await reveal.evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});

test("mobile navigation control references and opens the primary navigation", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Toggle navigation" });
  await expect(menu).toHaveAttribute("aria-controls", "primary-navigation");
  await expect(page.locator("#primary-navigation")).toHaveAttribute("aria-label", "Primary navigation");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#primary-navigation")).toHaveClass(/is-open/);
});

test("keyboard users can skip the homepage navigation and every public route renders a main landmark", async ({ page }) => {
  await page.goto("/");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  expect(await skipLink.evaluate((element) => element.tabIndex)).toBe(0);
  await skipLink.focus();
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  for (const route of ["/", "/coffee/alto", "/notes", "/favorites", "/track", "/profile", "/case-study", "/society", "/payments", "/search", "/compare?a=alto&b=sombra", "/sources"]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1").first()).toBeVisible();
  }
});

test("fixed navigation gains a contrast surface after scrolling into light editorial content", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header.mizan-nav");
  await expect(header).not.toHaveClass(/is-scrolled/);
  await page.evaluate(() => window.scrollTo({ top: 1000 }));
  await expect(header).toHaveClass(/is-scrolled/);
});

test("saved-coffee empty state explains local storage and offers two valid next actions", async ({ page }) => {
  await page.goto("/favorites");
  const emptyState = page.getByTestId("favorites-empty");
  await expect(emptyState).toBeVisible();
  await expect(emptyState.getByText("Saved only in this browser")).toBeVisible();
  await expect(emptyState.getByText("No account or personal profile is created")).toBeVisible();
  await expect(emptyState.getByRole("link", { name: "Explore the collection" })).toHaveAttribute("href", "/#collection");
  await expect(emptyState.getByRole("link", { name: "Read the field notes" })).toHaveAttribute("href", "/notes");
});

test("payment activity shows a verified-only empty state without fabricating any transaction", async ({ page }) => {
  await page.goto("/payments");
  const activity = page.getByTestId("payment-activity-empty");
  await expect(activity).toBeVisible();
  await expect(activity.getByText("No verified payments yet.")).toBeVisible();
  await expect(activity.getByText(/nothing has been charged or stored/i)).toBeVisible();
  await expect(activity.getByRole("link", { name: "Open demo order tracking" })).toHaveAttribute("href", "/track");
});

test("advanced product search filters and sorts collection results while persisting query state", async ({ page }) => {
  await page.goto("/search?q=alto");
  await expect(page.getByRole("heading", { name: /Find your/i })).toBeVisible();
  await expect(page.getByText("ALTO / Seasonal Lot")).toBeVisible();
  await expect(page).toHaveURL(/q=alto/);
  await page.getByLabel("Roast").selectOption("espresso");
  await expect(page.getByText("No coffees match this view.")).toBeVisible();
  await page.getByRole("button", { name: "Reset search" }).click();
  await expect(page.locator(".search-results-head > p")).toHaveText("3 coffees found");
  await page.getByLabel("Sort by").selectOption("price-desc");
  await expect(page).toHaveURL(/sort=price-desc/);
  await expect(page.getByTestId("search-result-status")).toContainText("Sorted by: Price: high to low");
  await expect(page.locator('a[href="/search"]').first()).toHaveAttribute("href", "/search");
});

test("product search keeps a bounded local recent-search list that the visitor can clear", async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem("caffio-recent-product-searches-v1"));
  await page.goto("/search");
  const input = page.getByLabel("Search coffee, profile, or brew method");
  await input.fill("alto");
  const recent = page.getByTestId("recent-searches");
  await expect(recent).toBeVisible({ timeout: 1500 });
  await expect(recent.getByRole("button", { name: "alto" })).toBeVisible();
  await expect(recent.getByText("Saved in this browser only. No account or profile is created.")).toBeVisible();
  await recent.getByRole("button", { name: "Clear recent searches" }).click();
  await expect(recent).toHaveCount(0);
});

test("product search keeps tasting-note filtering unavailable until documented notes exist and shows a skeleton while updating", async ({ page }) => {
  await page.goto("/search");
  const tasting = page.getByLabel("Tasting note");
  await expect(tasting).toBeDisabled();
  await expect(page.getByText("Tasting-note filters unlock only after a verified batch record is attached.")).toBeVisible();
  await page.getByLabel("Roast").selectOption("espresso");
  await expect(page.locator(".search-skeleton-grid")).toBeVisible();
  await expect(page.locator(".search-results-body")).toHaveAttribute("aria-busy", "false", { timeout: 1000 });
});

test("product search exposes removable active refinements, a live result status, and source-aware guidance", async ({ page }) => {
  await page.goto("/search?q=alto&roast=light");
  const active = page.getByTestId("active-search-filters");
  await expect(active).toBeVisible();
  await expect(active.getByRole("button", { name: /Roast: Light/i })).toBeVisible();
  await expect(page.getByTestId("search-result-status")).toContainText("1 coffees found · 2 active refinements");
  await active.getByRole("button", { name: /Roast: Light/i }).click();
  await expect(page.getByLabel("Roast")).toHaveValue("all");
  await expect(page.locator(".product-search-input input")).toHaveValue("alto");
  await active.getByRole("button", { name: /Search: alto/i }).click();
  await expect(page.locator(".product-search-input input")).toHaveValue("");
  await expect(active).toHaveCount(0);
  const guidance = page.getByTestId("search-guidance");
  await expect(guidance.getByText("Tasting filters remain unavailable until a verified batch record is attached.")).toBeVisible();
  await expect(guidance.getByRole("link", { name: "Open source protocol" })).toHaveAttribute("href", "/sources");
});

test("product search restores filters from the same browser without creating a profile and shows related catalog picks", async ({ page }) => {
  await page.goto("/search");
  await page.evaluate(() => localStorage.removeItem("caffio-product-search-filters-v1"));
  await page.getByLabel("Roast").selectOption("espresso");
  await expect(page.getByTestId("saved-search-filters")).toHaveText("Filters saved on this browser");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("caffio-product-search-filters-v1"))).toContain('"roast":"espresso"');
  await page.goto("/search");
  await expect(page.getByLabel("Roast")).toHaveValue("espresso");
  const related = page.getByTestId("related-products");
  await expect(related).toBeVisible();
  await expect(related.getByText("No related catalog match is documented for this view yet.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByLabel("Roast")).toHaveValue("all");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("caffio-product-search-filters-v1"))).toContain('"roast":"all"');
  await page.getByLabel("Roast").selectOption("espresso");
  await page.locator(".product-search-input input").fill("alto");
  await page.getByTestId("clear-saved-filter-preferences").click();
  await expect(page.getByLabel("Roast")).toHaveValue("all");
  await expect(page.locator(".product-search-input input")).toHaveValue("alto");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("caffio-product-search-filters-v1"))).toBeNull();
  await expect(page.getByTestId("search-result-status")).toContainText("Saved filter preferences cleared.");
  await page.goto("/search?q=alto&roast=all");
  await expect(page.getByTestId("related-products").getByRole("link")).toHaveCount(1);
});

test("search refinements and source guidance retain Arabic RTL parity", async ({ page }) => {
  await page.goto("/search?q=alto&roast=light");
  await page.getByLabel("Select language").selectOption("ar");
  await expect(page.locator(".search-site")).toHaveAttribute("dir", "rtl");
  await expect(page.getByTestId("active-search-filters")).toHaveAttribute("aria-label", "التصفية الحالية");
  await expect(page.getByTestId("search-guidance").getByRole("link", { name: "فتح بروتوكول المصادر" })).toHaveAttribute("href", "/sources");
});

test("public source protocol exposes content-evidence boundaries without product claims", async ({ page }) => {
  await page.goto("/sources");
  await expect(page.getByRole("heading", { name: /Evidence before/i })).toBeVisible();
  await expect(page.getByText("Does not verify a farm, product, or batch claim by itself.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open reference" }).first()).toHaveAttribute("href", "https://sca.coffee/research/coffee-standards");
});

test("shareable comparison renders two records, preserves its pair in the URL, and keeps tasting notes pending", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: async (payload: unknown) => { (window as Window & { comparisonShare?: unknown }).comparisonShare = payload; } });
    Object.defineProperty(window, "print", { configurable: true, value: () => { (window as Window & { comparisonPrinted?: boolean }).comparisonPrinted = true; } });
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: () => "blob:comparison-test" });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: () => undefined });
  });
  await page.goto("/compare?a=alto&b=sombra");
  await expect(page.getByTestId("product-comparison-table")).toBeVisible();
  await expect(page.getByText("Awaiting verified batch tasting record")).toHaveCount(2);
  const recipes = page.getByTestId("comparison-recipes");
  await expect(recipes).toBeVisible();
  await expect(recipes.getByText("Pour-over").first()).toBeVisible();
  await expect(recipes.getByText("French press")).toBeVisible();
  await page.getByRole("button", { name: "Share comparison" }).click();
  await expect(page.getByRole("status")).toContainText("Share sheet opened.");
  await expect.poll(() => page.evaluate(() => (window as Window & { comparisonShare?: { url?: string } }).comparisonShare?.url)).toContain("/compare?a=alto&b=sombra");
  await page.getByTestId("export-comparison-image").click();
  await expect(page.getByRole("status")).toContainText("Comparison image download started.");
  await page.getByTestId("print-comparison-pdf").click();
  await expect(page.getByRole("status")).toContainText("Choose “Save as PDF” in the browser print dialog.");
  await expect.poll(() => page.evaluate(() => (window as Window & { comparisonPrinted?: boolean }).comparisonPrinted)).toBe(true);
  await page.getByLabel("Second coffee").selectOption("mizan-house");
  await expect(page).toHaveURL(/a=alto&b=mizan-house/);
  await expect(recipes.getByText("Moka pot")).toBeVisible();
});

test("comparison entry points and empty search state guide visitors to a clear next step", async ({ page }) => {
  await page.goto("/coffee/alto");
  await expect(page.getByTestId("compare-from-detail")).toHaveAttribute("href", "/compare?a=alto");
  await page.goto("/search?q=not-a-catalog-coffee");
  await expect(page.locator(".search-results-body")).toHaveAttribute("aria-busy", "false");
  await expect(page.getByLabel("Roast")).toBeVisible();
  await expect(page.getByText("No coffees match this view.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset search" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Compare two coffees instead" })).toHaveAttribute("href", "/compare");
  await page.goto("/search?q=alto");
  await expect(page.getByTestId("compare-from-search")).toHaveAttribute("href", "/compare?a=alto");
});

test("comparison retains Arabic RTL parity and its pending-evidence boundary", async ({ page }) => {
  await page.goto("/compare?a=alto&b=sombra");
  await page.getByLabel("Select language").selectOption("ar");
  await expect(page.locator(".comparison-site")).toHaveAttribute("dir", "rtl");
  await expect(page.getByText("بانتظار سجل تذوق موثّق للدفعة")).toHaveCount(2);
  await expect(page.getByRole("link", { name: "افتح بروتوكول المصادر" })).toHaveAttribute("href", "/sources");
});

test("server renders comparison metadata, a social image, and a formatted PDF without inventing tasting data", async ({ page, request }) => {
  const comparison = await request.get("/compare?a=alto&b=sombra");
  const html = await comparison.text();
  expect(comparison.ok()).toBeTruthy();
  expect(html).toContain('property="og:title" content="ALTO × SOMBRA');
  expect(html).toContain('/compare/og.png?a=alto&amp;b=sombra');
  expect(html).toContain("Auditable records, without inferred claims.");
  const image = await request.get("/compare/og.png?a=alto&b=sombra");
  expect(image.headers()["content-type"]).toContain("image/png");
  const pdf = await request.get("/compare/pdf?a=alto&b=sombra");
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  const arabicComparison = await request.get("/compare?a=alto&b=sombra&lang=ar");
  const arabicHtml = await arabicComparison.text();
  expect(arabicHtml).toContain('property="og:locale" content="ar_AR"');
  expect(arabicHtml).toContain("مقارنة كافيو");
  const arabicPdf = await request.get("/compare/pdf?a=alto&b=sombra&lang=ar");
  expect(arabicPdf.headers()["content-type"]).toContain("application/pdf");
  expect(arabicPdf.headers()["content-disposition"]).toContain("caffio-alto-vs-sombra.pdf");
  await page.goto("/compare?a=alto&b=sombra");
  await expect(page.getByTestId("download-server-pdf")).toHaveAttribute("href", "/compare/pdf?a=alto&b=sombra&lang=en");
});

test("server renders product metadata and a product-specific social image without publishing pending tasting facts", async ({ page, request }) => {
  const product = await request.get("/coffee/alto");
  const html = await product.text();
  expect(product.ok()).toBeTruthy();
  expect(html).toContain('property="og:title" content="ALTO / Seasonal Lot — Caffio coffee record"');
  expect(html).toContain('rel="canonical" href="');
  expect(html).toContain("/coffee/alto");
  expect(html).toContain("Tasting cues await a verified batch record.");
  const image = await request.get("/coffee/alto/og.png?lang=en");
  expect(image.headers()["content-type"]).toContain("image/png");
  const arabicProduct = await request.get("/coffee/alto?lang=ar");
  const arabicHtml = await arabicProduct.text();
  expect(arabicHtml).toContain('property="og:locale" content="ar_AR"');
  expect(arabicHtml).toContain("سجل قهوة كافيو");
  await page.goto("/coffee/alto");
  await expect(page.getByRole("button", { name: "Sign in to add a reflection" })).toBeVisible();
  await expect(page.getByText("No reviewed reflections are published yet.")).toBeVisible();
});

test("product detail keeps tasting notes pending until its batch becomes verified", async ({ page }) => {
  await page.goto("/coffee/alto");
  await expect(page.getByTestId("pending-tasting-notes")).toHaveText(/Awaiting a verified batch tasting record/i);
  await expect(page.getByTestId("verified-tasting-notes")).toHaveCount(0);
  await page.locator(".batch-card summary").click();
  await expect(page.getByText("No verified tasting notes")).toBeVisible();
});

test("administrative reflection review remains gated for a signed-out visitor", async ({ page }) => {
  await page.goto("/admin/tasting");
  await expect(page.getByRole("heading", { name: "This area is restricted to Caffio administrators." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in to access moderation" })).toBeVisible();
  await expect(page.locator(".moderation-list")).toHaveCount(0);
});

test("product detail labels an unavailable automated flavor summary without implying product facts", async ({ page }) => {
  await page.goto("/coffee/alto");
  await expect(page.getByText("No reviewed reflections are published yet.")).toBeVisible();
  const summary = page.locator(".flavor-summary");
  await expect(summary).toContainText("A careful automated summary appears when approved reflections are available.");
  await expect(summary).toContainText("This is not a verified batch tasting record or product claim.");
});

test("native share receives the current product URL", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (payload: unknown) => { (window as Window & { sharePayload?: unknown }).sharePayload = payload; },
    });
  });
  await page.goto("/coffee/alto");
  await page.getByTestId("share-native").click();
  const payload = await page.evaluate(() => (window as Window & { sharePayload?: { url?: string } }).sharePayload);
  expect(payload?.url).toContain("/coffee/alto");
});

test("product metadata points to its dedicated Open Graph asset", async ({ page }) => {
  await page.goto("/coffee/alto");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /caffio-alto-og_3ea1405c\.jpg/);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", /caffio-alto-og_3ea1405c\.jpg/);
});

test("mobile share falls back to the clipboard when native sharing is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => undefined } });
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/coffee/alto");
  await page.getByTestId("share-native").click();
  await expect(page.getByTestId("share-copy")).toHaveAccessibleName(/Link copied/i);
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
});

test("Society completes a clearly labeled local-only subscription simulation", async ({ page }) => {
  await page.goto("/society");
  await page.getByRole("button", { name: /Continue/i }).click();
  await page.getByRole("button", { name: /Continue/i }).click();
  const demoReview = page.getByTestId("society-payment-shipping-demo");
  await expect(demoReview).toBeVisible();
  await expect(demoReview.getByText("No payment method collected")).toBeVisible();
  await expect(demoReview.getByText("No shipping address collected")).toBeVisible();
  await expect(demoReview.getByText(/no card is requested, stored, tokenized, or charged/i)).toBeVisible();
  await page.getByRole("button", { name: /Create demo membership/i }).click();
  await expect(page.getByText("Your demo rhythm is ready.")).toBeVisible();
  await expect(page.getByText(/no billing or shipping action occurred/i)).toBeVisible();
});

test("dark mode applies a polished persisted surface without changing the available routes", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.removeItem("mizan-theme"));
  await page.reload();
  if (testInfo.project.name === "mobile-chromium") {
    await page.getByRole("button", { name: "Toggle navigation" }).click();
  }
  const themeControl = page.getByRole("button", { name: "Dark mode" });
  await expect(themeControl).toBeVisible();
  await themeControl.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator(".mizan-site")).toHaveCSS("background-color", "rgb(18, 25, 26)");
  await page.reload();
  if (testInfo.project.name === "mobile-chromium") {
    await page.getByRole("button", { name: "Toggle navigation" }).click();
  }
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("button", { name: "Light mode" })).toBeVisible();
});

test("homepage purchase preview routes visitors to a local-only simulation and a verified-payment boundary", async ({ page }) => {
  await page.goto("/");
  const preview = page.getByTestId("checkout-preview");
  await expect(preview).toBeVisible();
  await expect(preview.getByText("No charge is made")).toBeVisible();
  await expect(preview.getByRole("link", { name: "Open purchase simulation" })).toHaveAttribute("href", "/society");
  await expect(preview.getByRole("link", { name: "Read payment boundary" })).toHaveAttribute("href", "/payments");
});

test("homepage reflection showcase stays transparent when no approved visitor feedback exists", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const showcase = page.getByTestId("reflection-showcase");
  await showcase.scrollIntoViewIfNeeded();
  await expect(showcase).toHaveClass(/is-visible/);
  const empty = page.getByTestId("reflection-showcase-empty");
  await expect(empty).toBeVisible();
  await expect(empty.getByText("No approved reflections yet.")).toBeVisible();
  await expect(empty.getByText(/stays intentionally empty/i)).toBeVisible();
});

test("record-guided coffee assistant explains a deterministic match without inventing tasting data", async ({ page }) => {
  await page.goto("/");
  const advisor = page.getByTestId("coffee-advisor");
  await advisor.scrollIntoViewIfNeeded();
  await advisor.getByLabel("Brew method").selectOption("Espresso");
  await advisor.getByLabel("Roast direction").selectOption("espresso");
  await advisor.getByRole("button", { name: "Show starting points" }).click();
  await expect(advisor.getByRole("heading", { name: "CAFFIO / House Espresso" })).toBeVisible();
  await expect(advisor.getByText("Listed for your brew method")).toBeVisible();
  await expect(advisor.getByText("Matches your roast direction")).toBeVisible();
  await expect(advisor.getByText(/Pending origin and tasting fields are never used/i)).toBeVisible();
  await expect(advisor.getByRole("link", { name: "Open record" })).toHaveAttribute("href", "/coffee/mizan-house");
});

test("interactive brew guide progresses through an existing field-note recipe and restarts accessibly", async ({ page }) => {
  await page.goto("/");
  const guide = page.getByTestId("interactive-brew-guide");
  await guide.scrollIntoViewIfNeeded();
  await guide.getByLabel("Choose a recipe").selectOption("mizan-espresso");
  await expect(guide.getByText("Step 1 of 3")).toBeVisible();
  await expect(guide.getByText("Distribute evenly and tamp level.")).toBeVisible();
  await guide.getByRole("button", { name: "Next step" }).click();
  await expect(guide.getByText("Watch time and yield before changing dose.")).toBeVisible();
  await guide.getByRole("button", { name: "Next step" }).click();
  await guide.getByRole("button", { name: "Next step" }).click();
  await expect(guide.getByRole("heading", { name: "Starting point complete" })).toBeVisible();
  await guide.getByRole("button", { name: "Start again" }).click();
  await expect(guide.getByText("Step 1 of 3")).toBeVisible();
});

test("route transition is restrained and disables motion when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/notes");
  await expect(page.locator(".route-transition")).toBeVisible();
  const animationName = await page.locator(".route-transition").evaluate((element) => getComputedStyle(element).animationName);
  expect(animationName).toBe("none");
});
