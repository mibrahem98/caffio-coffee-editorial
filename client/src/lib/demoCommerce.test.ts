import { describe, expect, it } from "vitest";
import { addItem, advanceDemoOrder, applyDemoDiscount, createDemoOrder, discountAmount, getItemCount, toggleFavorite, updateItem } from "@/lib/demoCommerce";

describe("MIZAN demo commerce", () => {
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
    expect(applyDemoDiscount(" mizan10 ")).toEqual({ code: "MIZAN10", percent: 10 });
    expect(applyDemoDiscount("not-active")).toBeNull();
    expect(discountAmount(18, 10)).toBe(1.8);
  });

  it("creates an immutable local order snapshot and advances through a bounded timeline", () => {
    const items = { alto: 2 };
    const order = createDemoOrder(items, 32.4, "MIZAN10", new Date("2026-08-14T10:00:00.000Z"), "MZ-TEST");
    items.alto = 8;
    expect(order).toMatchObject({ id: "MZ-TEST", total: 32.4, statusIndex: 0, discountCode: "MIZAN10" });
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
});
