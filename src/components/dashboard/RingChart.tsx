import { pctColor } from "../../utils/statsUtils";
import { useT } from "../../i18n/I18nContext";

interface Props {
  pct: number;
  label?: string;
  valueText?: string;
}

export function RingChart({ pct, label, valueText }: Props) {
  const t = useT();
  const R = 72;
  const C = 2 * Math.PI * R;
  const off = C - (Math.min(pct, 100) / 100) * C;
  const color = pctColor(pct);
  const display = valueText !== undefined ? valueText : `${Math.min(pct, 999).toFixed(0)}%`;
  const lbl = label !== undefined ? label : t.ring_label;

  return (
    <div className="ring-wrap">
      <svg
        viewBox="0 0 180 180"
        className="ring-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx={90} cy={90} r={R} fill="none" stroke="var(--ring-track)" strokeWidth={14} />
        <circle
          cx={90} cy={90} r={R}
          fill="none" stroke={color} strokeWidth={14}
          strokeDasharray={C} strokeDashoffset={off}
          strokeLinecap="round"
          className="ring-circle"
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="ring-text">
        <span className="ring-text__pct" style={{ color }}>{display}</span>
        <span className="ring-text__label">{lbl}</span>
      </div>
    </div>
  );
}
