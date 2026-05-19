import { useT } from "../../i18n/I18nContext";

interface Props {
  hiding: boolean;
}

export function SplashScreen({ hiding }: Props) {
  const t = useT();
  return (
    <div className={`splash ${hiding ? "splash--hide" : ""}`}>
      <div className="splash__logo">📊</div>
      <h1 className="splash__title">{t.brand_title}</h1>
      <p className="splash__subtitle">{t.splash_subtitle}</p>
      <div className="splash__dots">
        <div className="splash__dot" />
        <div className="splash__dot" />
        <div className="splash__dot" />
      </div>
    </div>
  );
}
