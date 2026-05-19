import { useT } from "../../i18n/I18nContext";

interface Props {
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallBanner({ onInstall, onDismiss }: Props) {
  const t = useT();
  return (
    <div className="install-banner">
      <div className="install-banner__msg">{t.install_msg}</div>
      <div className="install-banner__actions">
        <button className="install-banner__btn" onClick={onInstall}>
          {t.install_install}
        </button>
        <button className="install-banner__close" onClick={onDismiss}>
          {t.install_later}
        </button>
      </div>
    </div>
  );
}
