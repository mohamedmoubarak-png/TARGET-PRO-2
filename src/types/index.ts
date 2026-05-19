export interface Product {
  id: string;
  name: string;
  short: string;
  emoji: string;
  unit: string;
  color: string;
  weight: number;
}

export interface ProductEntry {
  target: number;
  achieved: number;
}

export type MonthData = Record<string, ProductEntry>;

export interface DailyEntry {
  date: string;
  values: Record<string, number>;
}

export interface DaysInfo {
  remaining: number;
  total: number;
  passed: number;
}

export type TipType = "success" | "warning" | "danger" | "info";

export interface Tip {
  type: TipType;
  icon: string;
  title: string;
  text: string;
}

export interface ProductStats extends Product {
  target: number;
  achieved: number;
  gap: number;
  pct: number;
  weightedScore: number;
}

export interface Stats {
  overallScore: number;
  best: ProductStats | null;
  worst: ProductStats | null;
  products: ProductStats[];
}

export type TabId = "dashboard" | "targets" | "achieved" | "settings";

export interface ToastState {
  msg: string;
  ok: boolean;
}

export interface YTDMonth {
  month: string;
  label: string;
  score: number;
  hasData: boolean;
}

export interface YTDSummary {
  months: YTDMonth[];
  avgScore: number;
  bestMonth: YTDMonth | null;
  worstMonth: YTDMonth | null;
  monthsWithData: number;
  productAverages: { product: Product; avgPct: number; weightedScore: number }[];
}

export const DEFAULT_PRODUCTS: Product[] = [
  { id: "certificates", name: "الشهادات",            short: "شهادات", emoji: "🏆", unit: "عدد",     color: "#D4A843", weight: 25 },
  { id: "loans",        name: "القروض الشخصية",      short: "قروض",   emoji: "💰", unit: "ألف ج.م", color: "#4F9CF9", weight: 25 },
  { id: "cards",        name: "البطاقات الائتمانية", short: "بطاقات", emoji: "💳", unit: "عدد",     color: "#A78BFA", weight: 15 },
  { id: "accounts",     name: "حسابات التوفير",      short: "حسابات", emoji: "🏦", unit: "عدد",     color: "#34D399", weight: 15 },
  { id: "insurance",    name: "التأمين",              short: "تأمين",  emoji: "🛡️", unit: "عدد",    color: "#F87171", weight: 10 },
  { id: "digital",      name: "الخدمات الرقمية",     short: "رقمي",   emoji: "📱", unit: "عدد",     color: "#22D3EE", weight: 10 }
];

export const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

export const MONTHS_AR_SHORT = [
  "ينا", "فبر", "مار", "أبر", "ماي", "يون",
  "يول", "أغس", "سبت", "أكت", "نوف", "ديس"
];

export const PRESET_EMOJIS = [
  "🏆", "💰", "💳", "🏦", "🛡️", "📱",
  "🎯", "📈", "💼", "🌟", "🚀", "📊",
  "🔑", "📞", "🤝", "💎", "🏡", "🚗", "🎓", "💡"
];

export const PRESET_COLORS = [
  "#D4A843", "#4F9CF9", "#A78BFA", "#34D399",
  "#F87171", "#22D3EE", "#FB923C", "#E879F9",
  "#4ADE80", "#F472B6", "#60A5FA", "#FACC15"
];

export const PRESET_UNITS = ["عدد", "ألف ج.م", "%"];

export const emptyMonthData = (products: Product[]): MonthData => {
  const d: MonthData = {};
  products.forEach(p => { d[p.id] = { target: 0, achieved: 0 }; });
  return d;
};
