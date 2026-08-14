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

  for (const route of ["/", "/coffee/alto", "/notes", "/favorites", "/track", "/profile", "/case-study", "/society", "/payments"]) {
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
  await page.goto("/search?q=alto&roast=all");
  await expect(page.getByTestId("related-products").getByRole("link")).toHaveCount(1);
});

test("product detail keeps tasting notes pending until its batch becomes verified", async ({ page }) => {
  await page.goto("/coffee/alto");
  await expect(page.getByTestId("pending-tasting-notes")).toHaveText(/Awaiting a verified batch tasting record/i);
  await expect(page.getByTestId("verified-tasting-notes")).toHaveCount(0);
  await page.locator(".batch-card summary").click();
  await expect(page.getByText("No verified tasting notes")).toBeVisible();
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
