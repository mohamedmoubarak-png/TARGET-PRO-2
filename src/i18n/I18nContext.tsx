import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from "react";
import { Lang, dict, TString, tipsDict, TipPack } from "./translations";

interface I18nValue {
  lang: Lang;
  t: TString;
  tips: TipPack;
  toggle: () => void;
  setLang: (l: Lang) => void;
}

const KEY = "tp:lang";
const DEFAULT_LANG: Lang = "ar";

const I18nContext = createContext<I18nValue | null>(null);

function readStored(): Lang {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "ar" || v === "en") return v;
  } catch {
    // ignore
  }
  return DEFAULT_LANG;
}

function apply(lang: Lang) {
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const l = readStored();
    apply(l);
    return l;
  });

  useEffect(() => {
    apply(lang);
    try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState(l => (l === "ar" ? "en" : "ar")), []);

  const value = useMemo<I18nValue>(() => ({
    lang,
    t: dict[lang],
    tips: tipsDict[lang],
    setLang,
    toggle
  }), [lang, setLang, toggle]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export function useT(): TString {
  return useI18n().t;
}

// Numbers everywhere use Latin digits, independent of UI language.
export function formatNumLocale(n: number | string, _lang: Lang): string {
  return Number(n).toLocaleString("en-US");
}

// Dates: Arabic text (day name, month name) with Latin digits via `u-nu-latn`.
export function formatDateAr(dateStr: string, lang: Lang): string {
  try {
    const dt = new Date(dateStr);
    const locale = lang === "ar" ? "ar-EG-u-nu-latn" : "en-US";
    return dt.toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  } catch {
    return dateStr;
  }
}
