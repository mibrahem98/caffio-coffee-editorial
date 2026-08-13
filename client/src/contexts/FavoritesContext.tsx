import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toggleFavorite } from "@/lib/demoCommerce";

type FavoritesContextValue = {
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggle: (productId: string) => void;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("mizan-favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("mizan-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const value = useMemo<FavoritesContextValue>(() => ({
    favorites,
    isFavorite: (productId) => favorites.includes(productId),
    toggle: (productId) => setFavorites((current) => toggleFavorite(current, productId)),
    clear: () => setFavorites([]),
  }), [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}
