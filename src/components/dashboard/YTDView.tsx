import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import { YTDSummary, Tip } from "../../types";
import { scoreColor } from "../../utils/statsUtils";
import { useT } from "../../i18n/I18nContext";
import { RingChart } from "./RingChart";
import { SmartTips } from "./SmartTips";

interface Props {
  ytd: YTDSummary;
  currentMonth: string;
}

interface TooltipPayload { name: string; value: number; color: string; }

export function YTDView({ ytd, currentMonth }: Props) {
  const t = useT();

  if (ytd.monthsWithData === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: "2rem", marginBottom: 8, opacity: 0.6 }}>📅</div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{t.ytd_empty}</div>
      </div>
    );
  }

  function YTDTooltip({ active, payload, label }: {
    active?: boolean; payload?: TooltipPayload[]; label?: string;
  }) {
    if (!active || !payload?.length) return null;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label">{label}</p>
        <p className="chart-tooltip__row" style={{ color: "#D4A843" }}>
          {t.hero_kpi_score}: {payload[0].value.toFixed(1)}
        </p>
      </div>
    );
  }

  const tips = buildYTDTips(ytd, t);

  return (
    <>
      {/* YTD Hero */}
      <div className="card card--gold-border hero">
        <RingChart
          pct={ytd.avgScore}
          label={t.ytd_hero_label}
          valueText={ytd.avgScore.toFixed(1)}
        />
        <div className="hero__body">
          <p className="hero__eyebrow">{t.ytd_title.replace(/^📅\s*/, "")}</p>
          <h2 className="hero__title">📈 {t.ytd_kpi_avg}: {ytd.avgScore.toFixed(1)}</h2>
          <div className="kpis">
            <div className="kpi">
              <div className="kpi__label">{t.ytd_kpi_avg}</div>
              <div className="kpi__value" style={{ color: scoreColor(ytd.avgScore) }}>
                {ytd.avgScore.toFixed(1)}
              </div>
            </div>
            <div className="kpi">
              <div className="kpi__label">{t.ytd_kpi_best}</div>
              <div className="kpi__value" style={{ color: "var(--success)" }}>
                {ytd.bestMonth ? `${ytd.bestMonth.label} (${ytd.bestMonth.score.toFixed(0)})` : "—"}
              </div>
            </div>
            <div className="kpi">
              <div className="kpi__label">{t.ytd_kpi_worst}</div>
              <div className="kpi__value" style={{ color: "var(--danger)" }}>
                {ytd.worstMonth ? `${ytd.worstMonth.label} (${ytd.worstMonth.score.toFixed(0)})` : "—"}
              </div>
            </div>
            <div className="kpi">
              <div className="kpi__label">{t.ytd_kpi_logged}</div>
              <div className="kpi__value" style={{ color: "var(--info)" }}>
                {ytd.monthsWithData}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* YTD Chart — no title (already shown above in hero) */}
      <div className="card chart-card">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ytd.months} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,140,0.18)" />
            <XAxis
              dataKey="label"
              stroke="rgba(127,127,140,0.4)"
              tick={{ fontSize: 11, fill: "rgba(127,127,140,0.85)", fontFamily: "Cairo" }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              stroke="rgba(127,127,140,0.4)"
              tick={{ fontSize: 10, fill: "rgba(127,127,140,0.85)", fontFamily: "Cairo" }}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<YTDTooltip />} cursor={{ fill: "rgba(127,127,140,0.08)" }} />
            <Bar dataKey="score" radius={[5, 5, 0, 0]}>
              {ytd.months.map((m, i) => (
                <Cell
                  key={i}
                  fill={m.month === currentMonth ? "#f0c857" : "#D4A843"}
                  fillOpacity={m.hasData ? 1 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* YTD Product Table */}
      <div className="card">
        <h3 className="chart-card__title">{t.ytd_table_title}</h3>
        <table className="ytd-product-table">
          <thead>
            <tr>
              <th style={{ textAlign: "right", paddingRight: 8 }}>{t.ytd_table_product}</th>
              <th>{t.ytd_table_avg_pct}</th>
              <th>{t.ytd_table_weight}</th>
              <th>{t.ytd_table_weighted}</th>
            </tr>
          </thead>
          <tbody>
            {ytd.productAverages.map(row => {
              const cls = row.avgPct >= 80 ? "row-good" : row.avgPct >= 50 ? "row-mid" : "row-bad";
              return (
                <tr key={row.product.id} className={cls}>
                  <td style={{ textAlign: "right", paddingRight: 8 }}>
                    {row.product.emoji} {row.product.name}
                  </td>
                  <td>{row.avgPct.toFixed(0)}%</td>
                  <td>{row.product.weight}%</td>
                  <td>{row.weightedScore.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* YTD Tips */}
      {tips.length > 0 && <SmartTips tips={tips} />}
    </>
  );
}

function buildYTDTips(ytd: YTDSummary, t: ReturnType<typeof useT>): Tip[] {
  const tips: Tip[] = [];
  const avg = ytd.avgScore;

  if (avg >= 80) {
    tips.push({
      type: "success", icon: "🏆",
      title: t.ytd_tip_excellent_title,
      text: t.ytd_tip_excellent(avg)
    });
  } else if (avg >= 60) {
    tips.push({
      type: "warning", icon: "💡",
      title: t.ytd_tip_good_title,
      text: t.ytd_tip_good(avg)
    });
  } else if (avg > 0) {
    tips.push({
      type: "danger", icon: "⚠️",
      title: t.ytd_tip_low_title,
      text: t.ytd_tip_low(avg)
    });
  }

  if (ytd.bestMonth && ytd.bestMonth.score > 0) {
    tips.push({
      type: "info", icon: "🌟",
      title: t.ytd_tip_best_title,
      text: t.ytd_tip_best(ytd.bestMonth.label, ytd.bestMonth.score)
    });
  }

  if (ytd.worstMonth && ytd.worstMonth.score < 50 && ytd.worstMonth !== ytd.bestMonth) {
    tips.push({
      type: "warning", icon: "🔎",
      title: t.ytd_tip_worst_title,
      text: t.ytd_tip_worst(ytd.worstMonth.label, ytd.worstMonth.score)
    });
  }

  return tips.slice(0, 4);
}
