import { describe, expect, it } from "vitest";
import { addItem, advanceDemoOrder, applyDemoDiscount, createDemoOrder, discountAmount, getItemCount, normalizeCartItems, normalizeDemoOrders, normalizeFavorites, toggleFavorite, updateItem } from "@/lib/demoCommerce";

describe("Caffio demo commerce", () => {
  it("adds items, counts them, updates quantity, and removes at zero", () => {
    let items = addItem({}, "alto");
    items = addItem(items, "alto");
    items = addItem(items, "sombra");
    expect(items).toEqual({ alto: 2, sombra: 1 });
    expect(getItemCount(items)).toBe(3);
    items = updateItem(items, "alto", -1);
    expect(items.alto).toBe(1);
    items = updateItem(items, "alto", -1);
    expect(items).not.toHaveProperty("alto");
    expect(getItemCount(items)).toBe(1);
  });

  it("applies supported promo codes case-insensitively and rejects unknown codes", () => {
    expect(applyDemoDiscount(" caffio10 ")).toEqual({ code: "CAFFIO10", percent: 10 });
    expect(applyDemoDiscount("not-active")).toBeNull();
    expect(discountAmount(18, 10)).toBe(1.8);
  });

  it("creates an immutable local order snapshot and advances through a bounded timeline", () => {
    const items = { alto: 2 };
    const order = createDemoOrder(items, 32.4, "CAFFIO10", new Date("2026-08-14T10:00:00.000Z"), "CF-TEST");
    items.alto = 8;
    expect(order).toMatchObject({ id: "CF-TEST", total: 32.4, statusIndex: 0, discountCode: "CAFFIO10" });
    expect(order.items).toEqual({ alto: 2 });
    expect(advanceDemoOrder(order).statusIndex).toBe(1);
    expect(advanceDemoOrder({ ...order, statusIndex: 3 }).statusIndex).toBe(3);
  });

  it("toggles favorites without duplicates and removes only the selected product", () => {
    let favorites = toggleFavorite([], "alto");
    favorites = toggleFavorite(favorites, "sombra");
    favorites = toggleFavorite(favorites, "alto");
    expect(favorites).toEqual(["sombra"]);
    expect(toggleFavorite(favorites, "sombra")).toEqual([]);
  });

  it("normalizes malformed browser storage into known, bounded local demo records", () => {
    expect(normalizeCartItems({ alto: 2, unknown: 9, sombra: "4", sol: 1000, "": 1 }, ["alto", "sombra", "sol"]))
      .toEqual({ alto: 2, sol: 99 });
    expect(normalizeFavorites(["alto", "alto", "unknown", 4], ["alto", "sombra"])).toEqual(["alto"]);
    expect(normalizeDemoOrders([
      { id: "CF-ONE", createdAt: "2026-08-18T10:00:00.000Z", items: { alto: 1, unknown: 2 }, total: 18.999, discountCode: "caffio10", statusIndex: 99 },
      { id: "", createdAt: "not-a-date", items: { alto: 1 }, total: 18, statusIndex: 0 },
    ], ["alto"]))
      .toEqual([{ id: "CF-ONE", createdAt: "2026-08-18T10:00:00.000Z", items: { alto: 1 }, total: 19, discountCode: "CAFFIO10", statusIndex: 3 }]);
  });

  it("keeps item and order calculations finite when callers pass malformed runtime values", () => {
    expect(getItemCount({ alto: 2, sombra: Number.NaN, sol: -1 } as unknown as Record<string, number>)).toBe(2);
    expect(updateItem({ alto: 1 }, "alto", Number.NaN)).toEqual({ alto: 1 });
    expect(discountAmount(Number.NaN, 10)).toBe(0);
    expect(createDemoOrder({ alto: 1 }, Number.NaN, "unknown", new Date("2026-08-18T10:00:00.000Z"), "CF-SAFE")).toMatchObject({ total: 0, discountCode: undefined });
  });
});
