import { getMonthLabel } from "../utils/dateUtils";
import { useI18n } from "../i18n/I18nContext";
import { useTheme } from "../hooks/useTheme";

interface Props {
  month: string;
  currentMonth: string;
  employeeName: string;
  jobTitle: string;
  onChangeMonth: (dir: number) => void;
}

export function Header({ month, currentMonth, employeeName, jobTitle, onChangeMonth }: Props) {
  const { t, lang, toggle: toggleLang } = useI18n();
  const { theme, toggle: toggleTheme } = useTheme();
  const atCurrent = month >= currentMonth;

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <div className="header__icon">🎯</div>
          <div>
            <div className="header__title">{t.brand_title}</div>
            <div className="header__subtitle">{t.brand_subtitle}</div>
          </div>
        </div>

        <div className="month-nav">
          <button
            className="btn btn--icon"
            onClick={() => onChangeMonth(-1)}
            aria-label={t.prev_month}
          >
            ‹
          </button>
          <span className="month-nav__label">{getMonthLabel(month, lang)}</span>
          <button
            className="btn btn--icon"
            onClick={() => onChangeMonth(1)}
            disabled={atCurrent}
            aria-label={t.next_month}
          >
            ›
          </button>
        </div>

        <div className="header-controls">
          <button
            className="icon-toggle"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark" : "Switch to light"}
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            {theme === "light" ? "🌙" : "🌞"}
          </button>
          <button
            className="icon-toggle icon-toggle--lang"
            onClick={toggleLang}
            aria-label="Toggle language"
            title={lang === "ar" ? "English" : "العربية"}
          >
            {lang === "ar" ? "EN" : "ع"}
          </button>
          {employeeName && (
            <div className="employee">
              <div className="employee__dot" />
              <div className="employee__row">
                <span className="employee__name">👤 {employeeName}</span>
                {jobTitle && <span className="employee__job">{jobTitle}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
