import { describe, expect, it } from "vitest";
import { coffeeProducts } from "./mizanCatalog";
import { documentedTastingNotes, relatedProducts } from "./productDiscovery";

describe("product discovery", () => {
  it("hides tasting notes until the current batch is verified", () => {
    expect(documentedTastingNotes(coffeeProducts[0], "en")).toEqual([]);
  });

  it("exposes tasting notes only when they are attached to a verified batch", () => {
    const verified = { ...coffeeProducts[0], batch: { ...coffeeProducts[0].batch, tastingStatus: "verified" as const, tastingNotes: [{ en: "Cocoa", ar: "كاكاو" }] } };
    expect(documentedTastingNotes(verified, "en")).toEqual(["Cocoa"]);
    expect(documentedTastingNotes(verified, "ar")).toEqual(["كاكاو"]);
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
