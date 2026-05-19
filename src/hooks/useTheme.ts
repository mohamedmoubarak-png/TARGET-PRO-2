import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark";

const KEY = "tp:theme";
const DEFAULT_THEME: Theme = "light";

function readStored(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "dark" || v === "light") return v;
  } catch {
    // ignore
  }
  return DEFAULT_THEME;
}

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const t = readStored();
    apply(t);
    return t;
  });

  useEffect(() => {
    apply(theme);
    try { localStorage.setItem(KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme(t => (t === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggle, setTheme };
}
