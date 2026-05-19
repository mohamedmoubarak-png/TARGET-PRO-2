import { TabId } from "../types";
import { useT } from "../i18n/I18nContext";

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function NavTabs({ active, onChange }: Props) {
  const t = useT();
  const tabs: { id: TabId; label: string }[] = [
    { id: "dashboard", label: t.tab_dashboard },
    { id: "targets",   label: t.tab_targets },
    { id: "achieved",  label: t.tab_achieved },
    { id: "settings",  label: t.tab_settings }
  ];
  return (
    <div className="tabs-wrapper">
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${active === tab.id ? "tab--active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
