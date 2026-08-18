import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { coffeeProducts } from "@/lib/mizanCatalog";
import { addItem, advanceDemoOrder, createDemoOrder, getItemCount, normalizeCartItems, normalizeDemoOrders, updateItem, type CartItems as DemoCartItems, type DemoOrderDraft } from "@/lib/demoCommerce";

export type CartItems = DemoCartItems;
export type DemoOrder = DemoOrderDraft;

type CartContextValue = {
  items: CartItems;
  count: number;
  add: (productId: string) => void;
  update: (productId: string, delta: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  orders: DemoOrder[];
  lastOrder: DemoOrder | null;
  createOrder: (total: number, discountCode?: string) => DemoOrder;
  advanceOrder: () => void;
  clearOrder: () => void;
  clearOrders: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const catalogIds = coffeeProducts.map((product) => product.id);
const catalogIdSet = new Set(catalogIds);

function readLocalJson(key: string): unknown {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    if (import.meta.env.DEV) console.warn(`[Cart] Ignored malformed local value for ${key}`, error);
    return null;
  }
}

function loadItems(): CartItems {
  return normalizeCartItems(readLocalJson("mizan-cart"), catalogIds);
}

function loadOrders(): DemoOrder[] {
  const modern = readLocalJson("mizan-demo-orders");
  if (Array.isArray(modern)) return normalizeDemoOrders(modern, catalogIds);
  const legacy = readLocalJson("mizan-demo-order");
  return normalizeDemoOrders(legacy ? [legacy] : [], catalogIds);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItems>(loadItems);
  const [orders, setOrders] = useState<DemoOrder[]>(loadOrders);
  const lastOrder = orders[0] ?? null;

  useEffect(() => {
    localStorage.setItem("mizan-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("mizan-demo-orders", JSON.stringify(orders));
    if (orders[0]) localStorage.setItem("mizan-demo-order", JSON.stringify(orders[0]));
    else localStorage.removeItem("mizan-demo-order");
  }, [orders]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: getItemCount(items),
    add: (productId) => { if (catalogIdSet.has(productId)) setItems((current) => addItem(current, productId)); },
    update: (productId, delta) => { if (catalogIdSet.has(productId)) setItems((current) => updateItem(current, productId, delta)); },
    remove: (productId) => { if (catalogIdSet.has(productId)) setItems((current) => updateItem(current, productId, -getItemCount({ [productId]: current[productId] }))); },
    clear: () => setItems({}),
    orders,
    lastOrder,
    createOrder: (total, discountCode) => {
      const order = createDemoOrder(items, total, discountCode);
      setOrders((current) => [order, ...current.filter((item) => item.id !== order.id)].slice(0, 12));
      return order;
    },
    advanceOrder: () => setOrders((current) => current.length ? [advanceDemoOrder(current[0]), ...current.slice(1)] : current),
    clearOrder: () => setOrders((current) => current.slice(1)),
    clearOrders: () => setOrders([]),
  }), [items, lastOrder, orders]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

export function getCartProducts(items: CartItems) {
  return coffeeProducts.filter((product) => items[product.id]);
}
