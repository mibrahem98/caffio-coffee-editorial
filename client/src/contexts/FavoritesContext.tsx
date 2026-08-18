import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { coffeeProducts } from "@/lib/mizanCatalog";
import { normalizeFavorites, toggleFavorite } from "@/lib/demoCommerce";

type FavoritesContextValue = {
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggle: (productId: string) => void;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const catalogIds = coffeeProducts.map((product) => product.id);
const catalogIdSet = new Set(catalogIds);

function loadFavorites(): string[] {
  try {
    const stored = localStorage.getItem("mizan-favorites");
    return normalizeFavorites(stored ? JSON.parse(stored) : [], catalogIds);
  } catch (error) {
    if (import.meta.env.DEV) console.warn("[Favorites] Ignored malformed local favorites", error);
    return [];
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem("mizan-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const value = useMemo<FavoritesContextValue>(() => ({
    favorites,
    isFavorite: (productId) => favorites.includes(productId),
    toggle: (productId) => { if (catalogIdSet.has(productId)) setFavorites((current) => toggleFavorite(current, productId)); },
    clear: () => setFavorites([]),
  }), [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}
