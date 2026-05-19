import { Product, MonthData, YTDMonth, YTDSummary, DailyEntry } from "../types";
import { computeStats } from "./statsUtils";
import { dict, Lang } from "../i18n/translations";

const monthKey = (m: string) => `tp:m:${m}`;
const dailyKey = (m: string) => `tp:daily:${m}`;

function loadMonthData(month: string, products: Product[]): MonthData {
  const base: MonthData = {};
  products.forEach(p => { base[p.id] = { target: 0, achieved: 0 }; });

  try {
    const rawTargets = localStorage.getItem(monthKey(month));
    if (rawTargets) {
      const parsed = JSON.parse(rawTargets) as MonthData;
      products.forEach(p => {
        if (parsed[p.id]) base[p.id] = { ...parsed[p.id] };
      });
    }
    // Overlay daily totals for current-month-style storage
    const rawDaily = localStorage.getItem(dailyKey(month));
    if (rawDaily) {
      const entries = JSON.parse(rawDaily) as DailyEntry[];
      const dailyTotals: Record<string, number> = {};
      entries.forEach(e => {
        Object.entries(e.values).forEach(([pid, v]) => {
          dailyTotals[pid] = (dailyTotals[pid] || 0) + (Number(v) || 0);
        });
      });
      Object.entries(dailyTotals).forEach(([pid, v]) => {
        if (base[pid]) base[pid] = { ...base[pid], achieved: v };
      });
    }
  } catch {
    // ignore
  }

  return base;
}

export function computeYTD(products: Product[], referenceMonth: string, lang: Lang = "ar"): YTDSummary {
  const [yStr, mStr] = referenceMonth.split("-");
  const year = Number(yStr);
  const currentMonth = Number(mStr);
  const shortMonths = dict[lang].months_short;

  const months: YTDMonth[] = [];
  for (let i = 1; i <= currentMonth; i++) {
    const mm = String(i).padStart(2, "0");
    const month = `${year}-${mm}`;
    const data = loadMonthData(month, products);
    const stats = computeStats(data, products);
    const hasData = products.some(p => (data[p.id]?.target || 0) > 0);
    months.push({
      month,
      label: shortMonths[i - 1] || month,
      score: stats.overallScore,
      hasData
    });
  }

  const withData = months.filter(m => m.hasData);
  const avgScore = withData.length > 0
    ? withData.reduce((s, m) => s + m.score, 0) / withData.length
    : 0;

  let bestMonth: YTDMonth | null = null;
  let worstMonth: YTDMonth | null = null;
  withData.forEach(m => {
    if (!bestMonth || m.score > bestMonth.score) bestMonth = m;
    if (!worstMonth || m.score < worstMonth.score) worstMonth = m;
  });

  // Per-product averages across months with data
  const productAverages = products.map(p => {
    let sumPct = 0;
    let count = 0;
    withData.forEach(m => {
      const data = loadMonthData(m.month, products);
      const t = data[p.id]?.target || 0;
      const a = data[p.id]?.achieved || 0;
      if (t > 0) {
        sumPct += Math.min((a / t) * 100, 100);
        count++;
      }
    });
    const avgPct = count > 0 ? sumPct / count : 0;
    return { product: p, avgPct, weightedScore: avgPct * (p.weight / 100) };
  }).sort((a, b) => b.weightedScore - a.weightedScore);

  return {
    months,
    avgScore,
    bestMonth,
    worstMonth,
    monthsWithData: withData.length,
    productAverages
  };
}
