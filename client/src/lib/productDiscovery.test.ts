import { describe, expect, it } from "vitest";
import { coffeeProducts } from "./mizanCatalog";
import { documentedTastingNotes, relatedProducts } from "./productDiscovery";

const isolatedVerifiedBatchFixture = {
  ...coffeeProducts[0],
  id: "test-fixture-verified-batch",
  batch: {
    ...coffeeProducts[0].batch,
    tastingStatus: "verified" as const,
    tastingNotes: [{ en: "Test only / citrus", ar: "اختبار فقط / حمضيات" }],
  },
};

describe("product discovery", () => {
  it("hides tasting notes until the current batch is verified", () => {
    expect(documentedTastingNotes(coffeeProducts[0], "en")).toEqual([]);
  });

  it("exposes tasting notes only when they are attached to a verified batch", () => {
    expect(documentedTastingNotes(isolatedVerifiedBatchFixture, "en")).toEqual(["Test only / citrus"]);
    expect(documentedTastingNotes(isolatedVerifiedBatchFixture, "ar")).toEqual(["اختبار فقط / حمضيات"]);
    expect(coffeeProducts.every((product) => product.batch.tastingStatus === "pending")).toBe(true);
  });

  it("recommends catalog products without treating pending tasting notes as evidence", () => {
    const picks = relatedProducts(coffeeProducts[0], coffeeProducts);
    expect(picks).toHaveLength(1);
    expect(picks.every((product) => product.id !== coffeeProducts[0].id)).toBe(true);
  });

  it("uses shared tasting notes only when both product batches are verified", () => {
    const anchor = { ...coffeeProducts[0], roastTone: "isolated", brewMethods: [{ en: "Rare brew", ar: "تحضير نادر" }], batch: { ...coffeeProducts[0].batch, tastingStatus: "verified" as const, tastingNotes: [{ en: "Cocoa", ar: "كاكاو" }] } };
    const tastingMatch = { ...coffeeProducts[1], roastTone: "different", brewMethods: [{ en: "Other brew", ar: "تحضير آخر" }], batch: { ...coffeeProducts[1].batch, tastingStatus: "verified" as const, tastingNotes: [{ en: "Cocoa", ar: "كاكاو" }] } };
    const pendingMatch = { ...tastingMatch, id: "pending-match", batch: { ...tastingMatch.batch, tastingStatus: "pending" as const } };
    expect(relatedProducts(anchor, [anchor, pendingMatch, tastingMatch])).toEqual([tastingMatch]);
  });

  it("returns no fallback products when catalog metadata has no meaningful relation", () => {
    const isolated = { ...coffeeProducts[0], roastTone: "isolated", brewMethods: [{ en: "Rare brew", ar: "تحضير نادر" }] };
    expect(relatedProducts(isolated, coffeeProducts)).toEqual([]);
  });
});
