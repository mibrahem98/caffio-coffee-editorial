import type { CoffeeProduct, Lang } from "./mizanCatalog";
import { getVerifiedTastingNotes } from "./mizanCatalog";

export function documentedTastingNotes(product: CoffeeProduct, lang: Lang) {
  return getVerifiedTastingNotes(product).map((note) => note[lang]);
}

export function relatedProducts(anchor: CoffeeProduct | undefined, products: CoffeeProduct[], limit = 2) {
  if (!anchor) return products.slice(0, limit);
  const anchorTasting = getVerifiedTastingNotes(anchor).map((note) => note.en);
  return products
    .filter((product) => product.id !== anchor.id)
    .map((product) => ({
      product,
      score: (product.roastTone === anchor.roastTone ? 3 : 0) + product.brewMethods.filter((method) => anchor.brewMethods.some((anchorMethod) => anchorMethod.en === method.en)).length + getVerifiedTastingNotes(product).filter((note) => anchorTasting.includes(note.en)).length * 2,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || Math.abs(a.product.price - anchor.price) - Math.abs(b.product.price - anchor.price))
    .slice(0, limit)
    .map(({ product }) => product);
}
