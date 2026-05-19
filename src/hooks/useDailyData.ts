import { useState, useEffect, useCallback } from "react";
import { DailyEntry } from "../types";

const storageKey = (month: string) => `tp:daily:${month}`;

export function useDailyData(month: string) {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const raw = localStorage.getItem(storageKey(month));
      setEntries(raw ? (JSON.parse(raw) as DailyEntry[]) : []);
    } catch {
      setEntries([]);
    }
    setLoading(false);
  }, [month]);

  const persist = useCallback((next: DailyEntry[]) => {
    localStorage.setItem(storageKey(month), JSON.stringify(next));
    setEntries(next);
  }, [month]);

  const upsertEntry = useCallback((date: string, values: Record<string, number>) => {
    const next = [...entries];
    const idx = next.findIndex(e => e.date === date);
    if (idx >= 0) next[idx] = { date, values };
    else next.push({ date, values });
    next.sort((a, b) => (a.date < b.date ? 1 : -1));
    persist(next);
  }, [entries, persist]);

  const deleteEntry = useCallback((date: string) => {
    persist(entries.filter(e => e.date !== date));
  }, [entries, persist]);

  return { entries, loading, upsertEntry, deleteEntry };
}

export function loadDailyTotalsFor(month: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(storageKey(month));
    if (!raw) return {};
    const entries = JSON.parse(raw) as DailyEntry[];
    const totals: Record<string, number> = {};
    entries.forEach(e => {
      Object.entries(e.values).forEach(([pid, v]) => {
        totals[pid] = (totals[pid] || 0) + (Number(v) || 0);
      });
    });
    return totals;
  } catch {
    return {};
  }
}
