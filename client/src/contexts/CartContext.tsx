import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { coffeeProducts } from "@/lib/mizanCatalog";
import { addItem, advanceDemoOrder, createDemoOrder, getItemCount, updateItem, type CartItems as DemoCartItems, type DemoOrderDraft } from "@/lib/demoCommerce";

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

function loadOrders(): DemoOrder[] {
  try {
    const storedOrders = localStorage.getItem("mizan-demo-orders");
    if (storedOrders) {
      const parsed = JSON.parse(storedOrders);
      if (Array.isArray(parsed)) return parsed;
    }
    const legacy = localStorage.getItem("mizan-demo-order");
    return legacy ? [JSON.parse(legacy)] : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItems>(() => {
    try {
      const stored = localStorage.getItem("mizan-cart");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
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
    add: (productId) => setItems((current) => addItem(current, productId)),
    update: (productId, delta) => setItems((current) => updateItem(current, productId, delta)),
    remove: (productId) => setItems((current) => updateItem(current, productId, -current[productId])),
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
