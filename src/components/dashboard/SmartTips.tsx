import { Tip } from "../../types";
import { useT } from "../../i18n/I18nContext";

interface Props {
  tips: Tip[];
}

function TipCard({ tip }: { tip: Tip }) {
  return (
    <div className={`tip tip--${tip.type}`}>
      <div className="tip__head">
        <span className="tip__icon">{tip.icon}</span>
        <span className="tip__title">{tip.title}</span>
      </div>
      <p className="tip__text">{tip.text}</p>
    </div>
  );
}

export function SmartTips({ tips }: Props) {
  const t = useT();
  return (
    <div className="card">
      <div className="tips-header">
        <h3 className="tips-header__title">{t.tips_title}</h3>
        <span className="tips-header__badge">{t.tips_badge}</span>
      </div>
      {tips.map((tp, i) => <TipCard key={i} tip={tp} />)}
    </div>
  );
}
