import { useState } from "react";
import { Stats, DaysInfo, Tip, YTDSummary } from "../../types";
import { HeroCard } from "./HeroCard";
import { ProductsGrid } from "./ProductsGrid";
import { ComparisonChart } from "./ComparisonChart";
import { SmartTips } from "./SmartTips";
import { YTDView } from "./YTDView";
import { useI18n } from "../../i18n/I18nContext";
import { getMonthLabel } from "../../utils/dateUtils";

type ViewMode = "month" | "ytd";

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
  const { t, lang } = useI18n();
  const [viewMode, setViewMode] = useState<ViewMode>("month");

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

      {/* View toggle */}
      <div className="view-toggle">
        <button
          className={`view-toggle__btn ${viewMode === "month" ? "active" : ""}`}
          onClick={() => setViewMode("month")}
        >
          📅 {getMonthLabel(month, lang)}
        </button>
        <button
          className={`view-toggle__btn ${viewMode === "ytd" ? "active" : ""}`}
          onClick={() => setViewMode("ytd")}
        >
          {t.view_ytd}
        </button>
      </div>

      <div key={viewMode} className="view-content">
        {viewMode === "month" ? (
          <>
            <HeroCard stats={stats} month={month} daysInfo={daysInfo} isCurrent={isCurrent} />
            <ProductsGrid products={stats.products} />
            <ComparisonChart products={stats.products} />
            <SmartTips tips={tips} />
          </>
        ) : (
          ytd && <YTDView ytd={ytd} currentMonth={currentMonth} />
        )}
      </div>
    </div>
  );
}
