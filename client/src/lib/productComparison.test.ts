import { describe, expect, it } from "vitest";
import { coffeeProducts } from "./mizanCatalog";
import { comparisonSearch, isDistinctProductPair, NO_PRODUCT } from "./productComparison";

describe("product comparison", () => {
  it("encodes only selected products into a shareable comparison query", () => {
    expect(comparisonSearch("alto", "sombra")).toBe("a=alto&b=sombra");
    expect(comparisonSearch("alto", NO_PRODUCT)).toBe("a=alto");
  });

  it("requires two distinct catalog products before rendering a comparison", () => {
    expect(isDistinctProductPair(coffeeProducts[0], coffeeProducts[1])).toBe(true);
    expect(isDistinctProductPair(coffeeProducts[0], coffeeProducts[0])).toBe(false);
    expect(isDistinctProductPair(coffeeProducts[0], undefined)).toBe(false);
  });
});
