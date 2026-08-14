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
