import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { coffeeProducts } from "@/lib/mizanCatalog";

type CartItems = Record<string, number>;

export type DemoOrder = {
  id: string;
  createdAt: string;
  items: CartItems;
  total: number;
  discountCode?: string;
  statusIndex: number;
};

type CartContextValue = {
  items: CartItems;
  count: number;
  add: (productId: string) => void;
  update: (productId: string, delta: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  lastOrder: DemoOrder | null;
  createOrder: (total: number, discountCode?: string) => DemoOrder;
  advanceOrder: () => void;
  clearOrder: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItems>(() => {
    try {
      const stored = localStorage.getItem("mizan-cart");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [lastOrder, setLastOrder] = useState<DemoOrder | null>(() => {
    try {
      const stored = localStorage.getItem("mizan-demo-order");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("mizan-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (lastOrder) localStorage.setItem("mizan-demo-order", JSON.stringify(lastOrder));
    else localStorage.removeItem("mizan-demo-order");
  }, [lastOrder]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: Object.values(items).reduce((total, quantity) => total + quantity, 0),
    add: (productId) => setItems((current) => ({ ...current, [productId]: (current[productId] || 0) + 1 })),
    update: (productId, delta) => setItems((current) => {
      const nextQuantity = (current[productId] || 0) + delta;
      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: nextQuantity };
    }),
    remove: (productId) => setItems((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    }),
    clear: () => setItems({}),
    lastOrder,
    createOrder: (total, discountCode) => {
      const order: DemoOrder = {
        id: `MZ-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        items: { ...items },
        total,
        discountCode,
        statusIndex: 0,
      };
      setLastOrder(order);
      return order;
    },
    advanceOrder: () => setLastOrder((current) => current ? { ...current, statusIndex: Math.min(3, current.statusIndex + 1) } : current),
    clearOrder: () => setLastOrder(null),
  }), [items, lastOrder]);

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
