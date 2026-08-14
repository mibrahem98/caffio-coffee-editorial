import { describe, expect, it } from "vitest";
import { createDemoSocietySubscription, getSocietyQuote } from "@/lib/caffioSociety";

describe("Caffio Society simulation", () => {
  const selection = { productId: "alto", cadence: "monthly" as const, grind: "whole" as const, delivery: "priority" as const };

  it("calculates a local quote from coffee cadence and demo delivery", () => {
    const quote = getSocietyQuote(selection);
    expect(quote.product.id).toBe("alto");
    expect(quote.coffeeTotal).toBe(18);
    expect(quote.deliveryTotal).toBe(4);
    expect(quote.total).toBe(22);
  });

  it("creates a non-sensitive local membership record", () => {
    const record = createDemoSocietySubscription(selection, new Date("2026-08-14T12:00:00.000Z"));
    expect(record).toMatchObject({ id: expect.stringMatching(/^CF-SOCIETY-/), total: 22, status: "demo-active" });
    expect(record).not.toHaveProperty("cardNumber");
    expect(record).not.toHaveProperty("shippingAddress");
  });
});
