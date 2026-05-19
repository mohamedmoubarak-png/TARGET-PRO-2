import { Stats, DaysInfo, Tip, YTDSummary } from "../../types";
import { HeroCard } from "./HeroCard";
import { ProductsGrid } from "./ProductsGrid";
import { ComparisonChart } from "./ComparisonChart";
import { SmartTips } from "./SmartTips";
import { YTDSection } from "./YTDSection";
import { useT } from "../../i18n/I18nContext";

interface Props {
  stats: Stats;
  month: string;
  currentMonth: string;
  daysInfo: DaysInfo;
  isCurrent: boolean;
  tips: Tip[];
  ytd: YTDSummary | null;
  hasData: boolean;
  onExportPDF: () => void;
  exporting: boolean;
}

export function DashboardView({
  stats, month, currentMonth, daysInfo, isCurrent,
  tips, ytd, hasData, onExportPDF, exporting
}: Props) {
  const t = useT();
  return (
    <div className="tab-content">
      {hasData && (
        <div className="dash-toolbar">
          <button
            className="btn btn--ghost"
            onClick={onExportPDF}
            disabled={exporting}
          >
            {exporting ? t.dash_exporting : t.dash_export}
          </button>
        </div>
      )}

      <HeroCard stats={stats} month={month} daysInfo={daysInfo} isCurrent={isCurrent} />
      <ProductsGrid products={stats.products} />
      <ComparisonChart products={stats.products} />
      <SmartTips tips={tips} />
      {ytd && <YTDSection ytd={ytd} currentMonth={currentMonth} />}
    </div>
  );
}
