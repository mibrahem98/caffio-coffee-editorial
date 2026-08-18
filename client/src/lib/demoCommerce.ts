export type CartItems = Record<string, number>;

export type DemoOrderDraft = {
  id: string;
  createdAt: string;
  items: CartItems;
  total: number;
  discountCode?: string;
  statusIndex: number;
};

export const demoOffers: Record<string, number> = { CAFFIO10: 10, RITUAL15: 15 };
export const demoStatusCount = 4;
const MAX_LOCAL_QUANTITY = 99;
const MAX_LOCAL_ORDERS = 12;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeProductId(value: unknown, allowedProductIds?: ReadonlySet<string>): value is string {
  return typeof value === "string"
    && value.length > 0
    && value.length <= 64
    && (!allowedProductIds || allowedProductIds.has(value));
}

function safeQuantity(value: unknown): number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0
    ? Math.min(value, MAX_LOCAL_QUANTITY)
    : 0;
}

function safeMoney(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.round(value * 100) / 100
    : 0;
}

export function normalizeCartItems(value: unknown, allowedProductIds: readonly string[]): CartItems {
  if (!isRecord(value)) return {};
  const allowed = new Set(allowedProductIds);

  return Object.entries(value).reduce<CartItems>((items, [productId, quantity]) => {
    const normalizedQuantity = safeQuantity(quantity);
    if (isSafeProductId(productId, allowed) && normalizedQuantity > 0) {
      items[productId] = normalizedQuantity;
    }
    return items;
  }, {});
}

export function normalizeFavorites(value: unknown, allowedProductIds: readonly string[]): string[] {
  if (!Array.isArray(value)) return [];
  const allowed = new Set(allowedProductIds);
  return Array.from(new Set(value.filter((productId): productId is string => isSafeProductId(productId, allowed))));
}

export function normalizeDemoOrders(value: unknown, allowedProductIds: readonly string[]): DemoOrderDraft[] {
  if (!Array.isArray(value)) return [];

  return value.reduce<DemoOrderDraft[]>((orders, candidate) => {
    if (!isRecord(candidate) || !isSafeProductId(candidate.id) || typeof candidate.createdAt !== "string" || !Number.isFinite(Date.parse(candidate.createdAt))) {
      return orders;
    }

    const items = normalizeCartItems(candidate.items, allowedProductIds);
    if (Object.keys(items).length === 0) return orders;

    const discountCode = typeof candidate.discountCode === "string" && applyDemoDiscount(candidate.discountCode)
      ? candidate.discountCode.trim().toUpperCase()
      : undefined;
    const statusIndex = typeof candidate.statusIndex === "number" && Number.isInteger(candidate.statusIndex)
      ? Math.min(demoStatusCount - 1, Math.max(0, candidate.statusIndex))
      : 0;

    orders.push({
      id: candidate.id,
      createdAt: candidate.createdAt,
      items,
      total: safeMoney(candidate.total),
      discountCode,
      statusIndex,
    });
    return orders;
  }, []).slice(0, MAX_LOCAL_ORDERS);
}

export function addItem(items: CartItems, productId: string): CartItems {
  if (!isSafeProductId(productId)) return { ...items };
  return { ...items, [productId]: Math.min(MAX_LOCAL_QUANTITY, safeQuantity(items[productId]) + 1) };
}

export function updateItem(items: CartItems, productId: string, delta: number): CartItems {
  if (!isSafeProductId(productId) || !Number.isSafeInteger(delta)) return { ...items };
  const nextQuantity = safeQuantity(items[productId]) + delta;
  const next = { ...items };
  if (nextQuantity <= 0) delete next[productId];
  else next[productId] = Math.min(nextQuantity, MAX_LOCAL_QUANTITY);
  return next;
}

export function getItemCount(items: CartItems): number {
  return Object.values(items).reduce((total, quantity) => total + safeQuantity(quantity), 0);
}

export function applyDemoDiscount(code: string): { code: string; percent: number } | null {
  if (typeof code !== "string") return null;
  const normalized = code.trim().toUpperCase();
  return demoOffers[normalized] ? { code: normalized, percent: demoOffers[normalized] } : null;
}

export function discountAmount(subtotal: number, percent: number): number {
  return Math.round(safeMoney(subtotal) * (Number.isFinite(percent) && percent > 0 ? percent / 100 : 0) * 100) / 100;
}

export function createDemoOrder(items: CartItems, total: number, discountCode: string | undefined, now = new Date(), id = `CF-${now.getTime().toString(36).toUpperCase()}`): DemoOrderDraft {
  return { id, createdAt: now.toISOString(), items: { ...items }, total: safeMoney(total), discountCode: applyDemoDiscount(discountCode ?? "")?.code, statusIndex: 0 };
}

export function advanceDemoOrder(order: DemoOrderDraft): DemoOrderDraft {
  const current = typeof order.statusIndex === "number" && Number.isInteger(order.statusIndex) ? order.statusIndex : 0;
  return { ...order, statusIndex: Math.min(demoStatusCount - 1, Math.max(0, current + 1)) };
}

export function toggleFavorite(favorites: string[], productId: string): string[] {
  if (!isSafeProductId(productId)) return [...favorites];
  return favorites.includes(productId) ? favorites.filter((id) => id !== productId) : Array.from(new Set([...favorites, productId]));
}
