import { describe, expect, it } from "vitest";
import { recommendCoffee } from "./coffeeAdvisor";

describe("recommendCoffee", () => {
  it("ranks a record by its listed brew method and roast profile", () => {
    const [first] = recommendCoffee({ brewMethod: "Espresso", roast: "espresso" });
    expect(first.product.id).toBe("mizan-house");
    expect(first.matches).toEqual(["brewMethod", "roast"]);
  });

  it("keeps every record available when no preference is selected", () => {
    const recommendations = recommendCoffee({ brewMethod: "any", roast: "any" });
    expect(recommendations).toHaveLength(3);
    expect(recommendations.every((recommendation) => recommendation.score === 0)).toBe(true);
  });
});
