import { coffeeProducts, type CoffeeProduct } from "@/lib/mizanCatalog";

export type BrewMethodPreference = "any" | "Pour-over" | "AeroPress" | "French press" | "Espresso" | "Moka pot";
export type RoastPreference = "any" | CoffeeProduct["roastTone"];

export type CoffeeAdvisorPreferences = {
  brewMethod: BrewMethodPreference;
  roast: RoastPreference;
};

export type CoffeeRecommendation = {
  product: CoffeeProduct;
  score: number;
  matches: Array<"brewMethod" | "roast">;
};

export function recommendCoffee(preferences: CoffeeAdvisorPreferences): CoffeeRecommendation[] {
  return coffeeProducts
    .map((product) => {
      const matches: CoffeeRecommendation["matches"] = [];
      if (preferences.brewMethod !== "any" && product.brewMethods.some((method) => method.en === preferences.brewMethod)) matches.push("brewMethod");
      if (preferences.roast !== "any" && product.roastTone === preferences.roast) matches.push("roast");
      return { product, score: matches.length, matches };
    })
    .sort((first, second) => second.score - first.score || first.product.price - second.product.price);
}
