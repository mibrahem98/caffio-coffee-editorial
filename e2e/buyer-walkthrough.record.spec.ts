import { test } from "@playwright/test";

const hold = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

test("records a truthful 90-second buyer walkthrough of public Caffio services", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  await page.goto("/");
  await page.getByLabel("Select language").selectOption("ar");
  await hold(1_500);
  await page.getByLabel("Select language").selectOption("en");
  await page.getByRole("button", { name: "Dark mode" }).click();
  await hold(4_500);

  await page.goto("/coffee/alto");
  await hold(8_000);

  await page.goto("/search");
  await page.getByLabel("Search coffee, profile, or brew method").fill("alto");
  await hold(8_000);

  await page.goto("/compare?a=alto&b=sombra");
  await hold(8_000);

  await page.goto("/notes");
  await page.getByRole("button", { name: "Pour-over" }).click();
  await hold(7_000);

  await page.goto("/");
  const conversion = page.getByTestId("conversion-benefits");
  await conversion.scrollIntoViewIfNeeded();
  await conversion.getByRole("button", { name: /Records stay visible/i }).click();
  await hold(7_000);

  await page.goto("/favorites");
  await hold(4_000);
  await page.goto("/");
  await page.getByLabel("Open cart (0)").click();
  await hold(4_000);

  await page.goto("/society");
  await hold(8_000);

  await page.goto("/track");
  await hold(4_000);
  await page.goto("/profile");
  await hold(4_000);
  await page.goto("/payments");
  await hold(5_000);

  await page.goto("/");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await hold(6_000);
});
