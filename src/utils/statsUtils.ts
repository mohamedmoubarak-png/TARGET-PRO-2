import { MonthData, Product, Stats, ProductStats } from "../types";

export const computeStats = (data: MonthData, products: Product[]): Stats => {
  const productStats: ProductStats[] = products.map(p => {
    const t = data[p.id]?.target || 0;
    const a = data[p.id]?.achieved || 0;
    const pct = t > 0 ? Math.min((a / t) * 100, 100) : 0;
    const weightedScore = pct * (p.weight / 100);
    return {
      ...p,
      target: t,
      achieved: a,
      gap: Math.max(0, t - a),
      pct,
      weightedScore
    };
  });

  const overallScore = productStats.reduce((s, p) => s + p.weightedScore, 0);

  let best: ProductStats | null = null;
  let worst: ProductStats | null = null;
  productStats.forEach(p => {
    if (p.target <= 0) return;
    if (!best || p.pct > best.pct) best = p;
    if (!worst || p.pct < worst.pct) worst = p;
  });

  return { overallScore, best, worst, products: productStats };
};

export const pctColor = (pct: number): string =>
  pct >= 100 ? "#34D399" : pct >= 70 ? "#D4A843" : pct >= 40 ? "#4F9CF9" : "#F87171";

export const scoreColor = (score: number): string =>
  score >= 80 ? "#34D399" : score >= 50 ? "#D4A843" : "#F87171";
