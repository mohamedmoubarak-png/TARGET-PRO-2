import { useState, useEffect, useMemo, useCallback } from "react";
import { TabId, ToastState, MonthData, Product } from "./types";
import { getCurrentMonth, getDaysInfo, shiftMonth } from "./utils/dateUtils";
import { computeStats } from "./utils/statsUtils";
import { generateTips } from "./utils/tipsEngine";
import { computeYTD } from "./utils/ytdUtils";
import { exportMonthlyReport } from "./utils/exportPDF";
import { useEmployeeName } from "./hooks/useEmployeeName";
import { useMonthData } from "./hooks/useMonthData";
import { useProducts } from "./hooks/useProducts";
import { useDailyData } from "./hooks/useDailyData";
import { useInstallPrompt } from "./hooks/useInstallPrompt";
import { useTheme } from "./hooks/useTheme";
import { useI18n } from "./i18n/I18nContext";
import { Header } from "./components/Header";
import { NavTabs } from "./components/NavTabs";
import { DashboardView } from "./components/dashboard/DashboardView";
import { TargetsForm } from "./components/forms/TargetsForm";
import { AchievementsForm } from "./components/forms/AchievementsForm";
import { SettingsView } from "./components/settings/SettingsView";
import { Toast } from "./components/ui/Toast";
import { WelcomeModal } from "./components/ui/WelcomeModal";
import { SplashScreen } from "./components/ui/SplashScreen";
import { InstallBanner } from "./components/ui/InstallBanner";

export default function App() {
  // Ensure theme is initialized (default light)
  useTheme();
  const { t, lang, tips: tipsPack } = useI18n();

  const NOW = useMemo(() => getCurrentMonth(), []);
  const [month, setMonth] = useState<string>(NOW);
  const [tab, setTab] = useState<TabId>("dashboard");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [splashHiding, setSplashHiding] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { name, jobTitle, ready: nameReady, save: saveEmployee } = useEmployeeName();
  const { products, ready: productsReady, save: saveProducts } = useProducts();
  const { data, loading, save: saveData } = useMonthData(month, products);
  const { entries: dailyEntries, upsertEntry, deleteEntry } = useDailyData(month);
  const { canInstall, install, dismiss } = useInstallPrompt();

  useEffect(() => {
    const fadeAt = setTimeout(() => setSplashHiding(true), 1500);
    const removeAt = setTimeout(() => setShowSplash(false), 1900);
    return () => { clearTimeout(fadeAt); clearTimeout(removeAt); };
  }, []);

  const notify = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const changeMonth = useCallback((dir: number) => {
    const next = shiftMonth(month, dir);
    if (next <= NOW) setMonth(next);
  }, [month, NOW]);

  const isCurrent = month === NOW;
  const di = useMemo(() => getDaysInfo(), []);

  const effectiveData: MonthData = useMemo(() => {
    if (!isCurrent) return data;
    const merged: MonthData = {};
    products.forEach(p => {
      const dailySum = dailyEntries.reduce((s, e) => s + (Number(e.values[p.id]) || 0), 0);
      merged[p.id] = {
        target: data[p.id]?.target || 0,
        achieved: dailySum
      };
    });
    return merged;
  }, [isCurrent, data, dailyEntries, products]);

  const stats = useMemo(() => computeStats(effectiveData, products), [effectiveData, products]);
  const tips = useMemo(
    () => generateTips(effectiveData, products, di, tipsPack, lang),
    [effectiveData, products, di, tipsPack, lang]
  );
  const ytd = useMemo(
    () => computeYTD(products, NOW, lang),
    // dailyEntries and data referenced to refresh on changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, NOW, dailyEntries, data, lang]
  );

  const hasData = useMemo(() =>
    products.some(p => (effectiveData[p.id]?.target || 0) > 0),
    [effectiveData, products]
  );

  const handleSaveTargets = useCallback((next: MonthData) => {
    saveData(next);
    notify(t.toast_targets_saved);
    setTab("dashboard");
  }, [saveData, notify, t]);

  const handleSaveCumulative = useCallback((next: MonthData) => {
    saveData(next);
    notify(t.toast_ach_saved);
    setTab("dashboard");
  }, [saveData, notify, t]);

  const handleUpsertDaily = useCallback((date: string, values: Record<string, number>) => {
    upsertEntry(date, values);
    notify(t.toast_daily_saved);
  }, [upsertEntry, notify, t]);

  const handleDeleteDaily = useCallback((date: string) => {
    deleteEntry(date);
    notify(t.toast_deleted, true);
  }, [deleteEntry, notify, t]);

  const handleSaveProducts = useCallback((next: Product[]) => {
    saveProducts(next);
  }, [saveProducts]);

  const handleExportPDF = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await exportMonthlyReport({
        employeeName: name,
        jobTitle,
        month,
        overallScore: stats.overallScore,
        products: stats.products,
        tips,
        ytd: ytd ?? undefined,
        lang
      });
      notify(t.toast_pdf_ok);
    } catch (err) {
      console.error(err);
      notify(t.toast_pdf_err, false);
    } finally {
      setExporting(false);
    }
  }, [exporting, name, jobTitle, month, stats, tips, ytd, lang, notify, t]);

  const preventContext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  if (showSplash) {
    return <SplashScreen hiding={splashHiding} />;
  }

  if (!nameReady || !productsReady || loading) {
    return (
      <div className="app-container loading">
        <div>
          <div className="loading__emoji">📊</div>
          <p className="loading__text">{t.loading_data}</p>
        </div>
      </div>
    );
  }

  const showWelcome = !name || !jobTitle;

  return (
    <div className="app-container" onContextMenu={preventContext}>
      <Toast toast={toast} />
      {showWelcome && <WelcomeModal onSave={saveEmployee} />}

      <Header
        month={month}
        currentMonth={NOW}
        employeeName={name}
        jobTitle={jobTitle}
        onChangeMonth={changeMonth}
      />
      <NavTabs active={tab} onChange={setTab} />

      <main className="shell">
        {tab === "dashboard" && (
          <DashboardView
            stats={stats}
            month={month}
            currentMonth={NOW}
            daysInfo={di}
            isCurrent={isCurrent}
            tips={tips}
            ytd={ytd}
            hasData={hasData}
            onExportPDF={handleExportPDF}
            exporting={exporting}
          />
        )}
        {tab === "targets" && (
          <TargetsForm
            month={month}
            data={data}
            products={products}
            onSave={handleSaveTargets}
          />
        )}
        {tab === "achieved" && (
          <AchievementsForm
            month={month}
            isCurrentMonth={isCurrent}
            data={effectiveData}
            products={products}
            dailyEntries={dailyEntries}
            onUpsertDaily={handleUpsertDaily}
            onDeleteDaily={handleDeleteDaily}
            onSaveCumulative={handleSaveCumulative}
          />
        )}
        {tab === "settings" && (
          <SettingsView
            products={products}
            employeeName={name}
            jobTitle={jobTitle}
            onSaveProducts={handleSaveProducts}
            onSaveEmployee={saveEmployee}
            notify={notify}
          />
        )}

        <p className="footer">{t.footer_text}</p>
      </main>

      {canInstall && <InstallBanner onInstall={install} onDismiss={dismiss} />}
    </div>
  );
}
