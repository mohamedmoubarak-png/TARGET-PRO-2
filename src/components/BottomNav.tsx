import { TabId } from "../types";
import { useT } from "../i18n/I18nContext";

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: Props) {
  const t = useT();
  const tabs: { id: TabId; icon: string; label: string }[] = [
    { id: "dashboard", icon: "🏠", label: t.bn_dashboard },
    { id: "targets",   icon: "🎯", label: t.bn_targets },
    { id: "achieved",  icon: "✅", label: t.bn_achieved },
    { id: "settings",  icon: "⚙️", label: t.bn_settings }
  ];

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`bottom-nav__item ${active === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? "page" : undefined}
        >
          <span className="bottom-nav__icon">{tab.icon}</span>
          <span className="bottom-nav__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
