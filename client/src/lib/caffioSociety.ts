import { coffeeProducts } from "@/lib/mizanCatalog";

export type SocietyCadence = "weekly" | "biweekly" | "monthly";
export type SocietyGrind = "whole" | "filter" | "espresso";
export type SocietyDelivery = "standard" | "priority";

export type SocietySelection = {
  productId: string;
  cadence: SocietyCadence;
  grind: SocietyGrind;
  delivery: SocietyDelivery;
};

export type DemoSocietySubscription = SocietySelection & {
  id: string;
  createdAt: string;
  total: number;
  status: "demo-active";
};

const cadenceMultiplier: Record<SocietyCadence, number> = {
  weekly: 4,
  biweekly: 2,
  monthly: 1,
};

export function getSocietyQuote(selection: SocietySelection) {
  const product = coffeeProducts.find((item) => item.id === selection.productId) ?? coffeeProducts[0];
  const coffeeTotal = product.price * cadenceMultiplier[selection.cadence];
  const deliveryTotal = selection.delivery === "priority" ? 4 : 0;
  return {
    product,
    coffeeTotal,
    deliveryTotal,
    total: coffeeTotal + deliveryTotal,
  };
}

export function createDemoSocietySubscription(selection: SocietySelection, now = new Date()): DemoSocietySubscription {
  const { total } = getSocietyQuote(selection);
  return {
    ...selection,
    id: `CF-SOCIETY-${now.getTime().toString(36).toUpperCase()}`,
    createdAt: now.toISOString(),
    total,
    status: "demo-active",
  };
}
