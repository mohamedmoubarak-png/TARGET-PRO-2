import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import { YTDSummary } from "../../types";
import { scoreColor } from "../../utils/statsUtils";
import { useT } from "../../i18n/I18nContext";

interface Props {
  ytd: YTDSummary;
  currentMonth: string;
}

interface TooltipPayload { name: string; value: number; color: string; }

export function YTDSection({ ytd, currentMonth }: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);

  if (ytd.monthsWithData === 0) return null;

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

  return (
    <div className="card ytd-card">
      <button
        className="ytd-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="ytd-toggle__title">{t.ytd_title}</span>
        <span className={`ytd-toggle__arrow ${open ? "ytd-toggle__arrow--open" : ""}`}>▼</span>
      </button>

      {open && (
        <div className="ytd-body">
          <div className="ytd-kpis">
            <div className="ytd-kpi">
              <div className="ytd-kpi__label">{t.ytd_avg}</div>
              <div className="ytd-kpi__value" style={{ color: scoreColor(ytd.avgScore) }}>
                {ytd.avgScore.toFixed(1)}
              </div>
            </div>
            <div className="ytd-kpi">
              <div className="ytd-kpi__label">{t.ytd_best_month}</div>
              <div className="ytd-kpi__value" style={{ color: "var(--success)" }}>
                {ytd.bestMonth ? `${ytd.bestMonth.label} (${ytd.bestMonth.score.toFixed(1)})` : "—"}
              </div>
            </div>
            <div className="ytd-kpi">
              <div className="ytd-kpi__label">{t.ytd_worst_month}</div>
              <div className="ytd-kpi__value" style={{ color: "var(--danger)" }}>
                {ytd.worstMonth ? `${ytd.worstMonth.label} (${ytd.worstMonth.score.toFixed(1)})` : "—"}
              </div>
            </div>
            <div className="ytd-kpi">
              <div className="ytd-kpi__label">{t.ytd_months_with_data}</div>
              <div className="ytd-kpi__value" style={{ color: "var(--info)" }}>
                {ytd.monthsWithData}
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ytd.months} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,140,0.18)" />
              <XAxis
                dataKey="label"
                stroke="rgba(127,127,140,0.4)"
                tick={{ fontSize: 11, fill: "rgba(127,127,140,0.85)", fontFamily: "Cairo" }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="rgba(127,127,140,0.4)"
                tick={{ fontSize: 10, fill: "rgba(127,127,140,0.85)", fontFamily: "Cairo" }}
              />
              <Tooltip content={<YTDTooltip />} cursor={{ fill: "rgba(127,127,140,0.08)" }} />
              <Bar dataKey="score" radius={[5, 5, 0, 0]}>
                {ytd.months.map((m, i) => (
                  <Cell key={i} fill={m.month === currentMonth ? "#f0c857" : "#D4A843"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

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
      )}
    </div>
  );
}
