import { useState, useEffect, useCallback } from "react";
import { Product, DEFAULT_PRODUCTS } from "../types";

const KEY = "tp:products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed.map(p => ({ ...p, weight: Number(p.weight) || 0 })));
        }
      }
    } catch {
      // fallback to defaults
    }
    setReady(true);
  }, []);

  const save = useCallback((next: Product[]) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setProducts(next);
  }, []);

  return { products, ready, save };
}
