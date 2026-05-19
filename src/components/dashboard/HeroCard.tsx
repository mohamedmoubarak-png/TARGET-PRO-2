import { Stats, DaysInfo } from "../../types";
import { getMonthLabel } from "../../utils/dateUtils";
import { RingChart } from "./RingChart";
import { useI18n } from "../../i18n/I18nContext";

interface Props {
  stats: Stats;
  month: string;
  daysInfo: DaysInfo;
  isCurrent: boolean;
}

export function HeroCard({ stats, month, daysInfo, isCurrent }: Props) {
  const { t, lang } = useI18n();
  const score = stats.overallScore;
  const heading =
    score >= 100 ? t.hero_heading_excellent :
    score >= 70  ? t.hero_heading_on_track :
    score >= 40  ? t.hero_heading_keep_going :
                   t.hero_heading_start_pushing;

  const kpis = [
    { label: t.hero_kpi_score, val: score.toFixed(1), color: "#D4A843" },
    {
      label: t.hero_kpi_best,
      val: stats.best ? `${stats.best.emoji} ${stats.best.pct.toFixed(0)}%` : "—",
      color: "var(--success)"
    },
    {
      label: t.hero_kpi_worst,
      val: stats.worst ? `${stats.worst.emoji} ${stats.worst.pct.toFixed(0)}%` : "—",
      color: "var(--danger)"
    },
    {
      label: t.hero_kpi_days_left,
      val: isCurrent ? String(daysInfo.remaining) : "—",
      color: "var(--info)"
    }
  ];

  return (
    <div className="card card--gold-border hero">
      <RingChart pct={score} label={t.ring_label} valueText={score.toFixed(1)} />
      <div className="hero__body">
        <p className="hero__eyebrow">{getMonthLabel(month, lang)}</p>
        <h2 className="hero__title">{heading}</h2>
        <div className="kpis">
          {kpis.map(k => (
            <div key={k.label} className="kpi">
              <div className="kpi__label">{k.label}</div>
              <div className="kpi__value" style={{ color: k.color }}>{k.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
