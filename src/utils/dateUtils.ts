import { DaysInfo } from "../types";
import { dict, Lang } from "../i18n/translations";

export const getCurrentMonth = (): string => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
};

export const getMonthLabel = (m: string, lang: Lang = "ar"): string => {
  const [y, mo] = m.split("-");
  const arr = dict[lang].months_full;
  return `${arr[Number(mo) - 1]} ${y}`;
};

export const getMonthShortLabel = (m: string, lang: Lang = "ar"): string => {
  const [, mo] = m.split("-");
  const arr = dict[lang].months_short;
  return arr[Number(mo) - 1] || m;
};

export const getDaysInfo = (): DaysInfo => {
  const n = new Date();
  const total = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
  return { remaining: total - n.getDate(), total, passed: n.getDate() };
};

// Numbers are always displayed in Latin digits regardless of UI language —
// only the thousand separator follows English convention.
export const formatNum = (n: number | string, _lang: Lang = "ar"): string =>
  Number(n).toLocaleString("en-US");

export const shiftMonth = (month: string, dir: number): string => {
  const [y, m] = month.split("-").map(Number);
  let ny = y;
  let nm = m + dir;
  if (nm > 12) { ny++; nm = 1; }
  if (nm < 1) { ny--; nm = 12; }
  return `${ny}-${String(nm).padStart(2, "0")}`;
};
