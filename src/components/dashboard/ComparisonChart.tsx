import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, ReferenceLine
} from "recharts";
import { useMemo } from "react";
import { ProductStats } from "../../types";
import { formatNum } from "../../utils/dateUtils";
import { useI18n } from "../../i18n/I18nContext";

interface Props {
  products: ProductStats[];
}

interface TooltipPayload {
  payload: { name: string; pct: number; target: number; achieved: number; unit: string; fill: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

export function ComparisonChart({ products }: Props) {
  const { t, lang } = useI18n();

  const data = useMemo(() =>
    products
      .filter(p => p.target > 0)
      .map(p => ({
        name: p.short,
        pct: Math.round(p.pct * 10) / 10,
        target: p.target,
        achieved: p.achieved,
        unit: p.unit,
        fill: p.color
      })),
    [products]
  );

  const chartKey = useMemo(
    () => data.map(d => `${d.name}:${d.pct}`).join("|"),
    [data]
  );

  if (data.length === 0) return null;

  function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label">{d.name}</p>
        <p className="chart-tooltip__row" style={{ color: d.fill }}>
          {t.compare_tooltip_pct}: {d.pct.toFixed(1)}%
        </p>
        <p className="chart-tooltip__row" style={{ color: "var(--text-secondary)" }}>
          {formatNum(d.achieved, lang)} / {formatNum(d.target, lang)} {d.unit}
        </p>
      </div>
    );
  }

  return (
    <div className="card chart-card">
      <h3 className="chart-card__title">{t.compare_title}</h3>
      <ResponsiveContainer width="100%" height={230} key={chartKey}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,140,0.18)" />
          <XAxis
            dataKey="name"
            stroke="rgba(127,127,140,0.4)"
            tick={{ fontSize: 11, fill: "rgba(127,127,140,0.85)", fontFamily: "Cairo" }}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            stroke="rgba(127,127,140,0.4)"
            tick={{ fontSize: 10, fill: "rgba(127,127,140,0.85)", fontFamily: "Cairo" }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(127,127,140,0.08)" }} />
          <ReferenceLine y={100} stroke="rgba(212,168,67,0.45)" strokeDasharray="4 4" />
          <Bar dataKey="pct" radius={[5, 5, 0, 0]} isAnimationActive={true} animationDuration={600}>
            {data.map((e, i) => <Cell key={i} fill={e.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
