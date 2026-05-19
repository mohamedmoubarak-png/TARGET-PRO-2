import { useState, useEffect, useCallback } from "react";
import { MonthData, Product, emptyMonthData } from "../types";

const storageKey = (month: string) => `tp:m:${month}`;

export function useMonthData(month: string, products: Product[]) {
  const [data, setData] = useState<MonthData>(() => emptyMonthData(products));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const raw = localStorage.getItem(storageKey(month));
      const base = emptyMonthData(products);
      if (raw) {
        const parsed = JSON.parse(raw) as MonthData;
        // Merge so newly added products show with zeros
        products.forEach(p => {
          if (parsed[p.id]) base[p.id] = parsed[p.id];
        });
      }
      setData(base);
    } catch {
      setData(emptyMonthData(products));
    }
    setLoading(false);
  }, [month, products]);

  const save = useCallback((next: MonthData) => {
    localStorage.setItem(storageKey(month), JSON.stringify(next));
    setData(next);
  }, [month]);

  return { data, loading, save };
}
