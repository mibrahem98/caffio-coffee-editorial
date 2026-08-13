export type CartItems = Record<string, number>;

export type DemoOrderDraft = {
  id: string;
  createdAt: string;
  items: CartItems;
  total: number;
  discountCode?: string;
  statusIndex: number;
};

export const demoOffers: Record<string, number> = { MIZAN10: 10, RITUAL15: 15 };
export const demoStatusCount = 4;

export function addItem(items: CartItems, productId: string): CartItems {
  return { ...items, [productId]: (items[productId] || 0) + 1 };
}

export function updateItem(items: CartItems, productId: string, delta: number): CartItems {
  const nextQuantity = (items[productId] || 0) + delta;
  const next = { ...items };
  if (nextQuantity <= 0) delete next[productId];
  else next[productId] = nextQuantity;
  return next;
}

export function getItemCount(items: CartItems): number {
  return Object.values(items).reduce((total, quantity) => total + quantity, 0);
}

export function applyDemoDiscount(code: string): { code: string; percent: number } | null {
  const normalized = code.trim().toUpperCase();
  return demoOffers[normalized] ? { code: normalized, percent: demoOffers[normalized] } : null;
}

export function discountAmount(subtotal: number, percent: number): number {
  return Math.round(subtotal * (percent / 100) * 100) / 100;
}

export function createDemoOrder(items: CartItems, total: number, discountCode: string | undefined, now = new Date(), id = `MZ-${now.getTime().toString(36).toUpperCase()}`): DemoOrderDraft {
  return { id, createdAt: now.toISOString(), items: { ...items }, total, discountCode, statusIndex: 0 };
}

export function advanceDemoOrder(order: DemoOrderDraft): DemoOrderDraft {
  return { ...order, statusIndex: Math.min(demoStatusCount - 1, order.statusIndex + 1) };
}

export function toggleFavorite(favorites: string[], productId: string): string[] {
  return favorites.includes(productId) ? favorites.filter((id) => id !== productId) : [...favorites, productId];
}
