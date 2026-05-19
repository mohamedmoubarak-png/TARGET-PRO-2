import { getMonthLabel } from "../utils/dateUtils";
import { useI18n } from "../i18n/I18nContext";
import { useTheme } from "../hooks/useTheme";

interface Props {
  month: string;
  currentMonth: string;
  employeeName: string;
  onChangeMonth: (dir: number) => void;
}

export function Header({ month, currentMonth, employeeName, onChangeMonth }: Props) {
  const { t, lang, toggle: toggleLang } = useI18n();
  const { theme, toggle: toggleTheme } = useTheme();
  const atCurrent = month >= currentMonth;

  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__logo">🎯</div>
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

      <div className="header__right">
        {employeeName && (
          <div className="header__employee-pill">
            <div className="header__online-dot" />
            <span>{employeeName}</span>
          </div>
        )}
        <button
          className="icon-toggle"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Dark mode" : "Light mode"}
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
      </div>
    </header>
  );
}
