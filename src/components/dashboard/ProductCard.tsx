import { ProductStats } from "../../types";
import { formatNum } from "../../utils/dateUtils";
import { pctColor } from "../../utils/statsUtils";
import { ProgressBar } from "../ui/ProgressBar";
import { useI18n } from "../../i18n/I18nContext";

interface Props {
  product: ProductStats;
}

export function ProductCard({ product: p }: Props) {
  const { t, lang } = useI18n();
  return (
    <div className="product-card" style={{ borderTop: `3px solid ${p.color}` }}>
      <div className="product-card__header">
        <div className="product-card__title">
          <span className="product-card__emoji">{p.emoji}</span>
          <span>{p.name}</span>
        </div>
        <span className="product-card__pct" style={{ color: pctColor(p.pct) }}>
          {p.pct.toFixed(0)}%
        </span>
      </div>
      <ProgressBar pct={p.pct} color={p.color} />
      <div className="product-card__footer">
        <span>{t.product_card_target} <strong>{formatNum(p.target, lang)}</strong></span>
        <span>{t.product_card_achieved} <strong style={{ color: p.color }}>{formatNum(p.achieved, lang)}</strong></span>
        <span>{t.product_card_weight} <strong style={{ color: "var(--gold)" }}>{p.weight}%</strong></span>
      </div>
    </div>
  );
}
