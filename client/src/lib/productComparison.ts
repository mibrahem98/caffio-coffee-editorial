import type { CoffeeProduct } from "./mizanCatalog";

export const NO_PRODUCT = "none";

export function comparisonSearch(first: string, second: string) {
  const params = new URLSearchParams();
  if (first !== NO_PRODUCT) params.set("a", first);
  if (second !== NO_PRODUCT) params.set("b", second);
  return params.toString();
}

export function isDistinctProductPair(first: CoffeeProduct | undefined, second: CoffeeProduct | undefined) {
  return Boolean(first && second && first.id !== second.id);
}
