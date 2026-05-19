import { MonthData, DaysInfo, Tip, Product, ProductStats } from "../types";
import { computeStats } from "./statsUtils";
import { formatNum } from "./dateUtils";
import { TipPack, Lang } from "../i18n/translations";

export function generateTips(
  data: MonthData,
  products: Product[],
  di: DaysInfo,
  pack: TipPack,
  lang: Lang
): Tip[] {
  const tips: Tip[] = [];
  const { remaining, total, passed } = di;
  const stats = computeStats(data, products);
  const score = stats.overallScore;

  const hasAnyTarget = products.some(p => (data[p.id]?.target || 0) > 0);

  if (!hasAnyTarget) {
    return pack.no_target.map((tp, i) => ({
      type: "info",
      icon: i === 0 ? "📋" : "🤝",
      title: tp.title,
      text: tp.text
    }));
  }

  const exp = (passed / total) * 100;
  const gap = 100 - score;
  const gapStr = formatNum(gap.toFixed(1), lang);

  if (score >= 100) {
    tips.push({ type: "success", icon: "🏆", title: pack.titles.exceed, text: pack.exceed(score) });
  } else if (score >= exp + 10) {
    tips.push({ type: "success", icon: "🚀", title: pack.titles.on_track, text: pack.on_track(score - exp, remaining) });
  } else if (score < exp - 15) {
    tips.push({ type: "danger", icon: "⚠️", title: pack.titles.needs_speed, text: pack.needs_speed(gapStr, remaining) });
  } else {
    tips.push({ type: "warning", icon: "💡", title: pack.titles.average, text: pack.average(gapStr) });
  }

  const worst: ProductStats | null = stats.worst;
  const best: ProductStats | null = stats.best;

  if (worst && (worst as ProductStats).pct < 50) {
    const w = worst as ProductStats;
    tips.push({
      type: "warning",
      icon: "🎯",
      title: pack.titles.focus_on(w.name),
      text: pack.focus_on(w.name, w.pct, w.weight)
    });
  }

  if (best && (best as ProductStats).pct >= 80 && best !== worst) {
    const b = best as ProductStats;
    tips.push({
      type: "success",
      icon: "💪",
      title: pack.titles.strength(b.name),
      text: pack.strength(b.name, b.pct)
    });
  }

  if (remaining <= 5 && score < 80 && hasAnyTarget) {
    tips.push({
      type: "danger",
      icon: "🔥",
      title: pack.titles.zero_hour,
      text: pack.zero_hour(remaining, score)
    });
  }

  if (tips.length < 3) {
    const extra = pack.extras[Math.floor(Math.random() * pack.extras.length)];
    tips.push({ type: "info", icon: extra.icon, title: extra.title, text: extra.text });
  }

  return tips.slice(0, 4);
}
