import { CategoryKey, CategoryValue } from "../../setting/category";
import { PrefKey } from "../../setting/pref";
import { RawOverviewData } from "../../types/raw";
import { BadgeLogic } from "../../utils/badgeLogic";

export interface StationRaw {
  id: string;
  station_name: string;
  lat: number;
  lon: number;
  official_name?: string;
  city?: string;
  height?: number;
  pref: string;
  category: string;
}

export type Rarity = "UR" | "SSR" | "SR" | "R" | "UC" | "C";

export interface CollectionItem {
  id: string;
  count: number;
  firstDrawnAt: string;
  lastDrawnAt: string;
  rarity: Rarity;
}

export const RARITY_META = {
  UR: {
    label: "UR (ウルトラレア)",
    bgClass: "rainbow-gradient text-white",
    cardBg: "bg-white border-2 border-pink-500 shadow-lg shadow-pink-100",
    textClass: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500",
    badgeClass: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md animate-pulse",
    title: "全国最上位クラス (統計順位が全国トップ3位)",
    description: "例: 富士山（気温低1位）、酸ケ湯（積雪1位）など",
  },
  SSR: {
    label: "SSR (ダブルエスレア)",
    bgClass: "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 text-white",
    cardBg: "bg-white border-2 border-yellow-500 shadow-lg shadow-yellow-100",
    textClass: "text-yellow-500",
    badgeClass: "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 text-white shadow-sm",
    title: "気象台・官署",
    description: "例: 東京管区気象台、大阪管区気象台、沖縄気象台",
  },
  SR: {
    label: "SR (エスレア)",
    bgClass: "bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white",
    cardBg: "bg-white border-2 border-indigo-500 shadow-lg shadow-indigo-100",
    textClass: "text-indigo-500",
    badgeClass: "bg-gradient-to-r from-purple-500 via-indigo-600 to-indigo-700 text-white",
    title: "全国上位クラス (統計順位が全国トップ10位以内)",
    description: "例: 尾鷲（降水6位）、御前崎（日照4位）など",
  },
  R: {
    label: "R (レア)",
    bgClass: "bg-blue-600 text-white",
    cardBg: "bg-white border border-blue-400 shadow-md shadow-blue-50",
    textClass: "text-blue-500",
    badgeClass: "bg-blue-600 text-white",
    title: "特別観測所、その他気象台",
    description: "山間部や離島などにある旧測候所アメダス",
  },
  UC: {
    label: "UC (アンコモン)",
    bgClass: "bg-emerald-600 text-white",
    cardBg: "bg-white border border-emerald-400 shadow-md shadow-emerald-50",
    textClass: "text-emerald-500",
    badgeClass: "bg-emerald-600 text-white",
    title: "全国特色クラス (統計順位が全国トップ50位以内)",
    description: "いずれかの統計で銀バッジを1つ以上獲得した地点",
  },
  C: {
    label: "C (コモン)",
    bgClass: "bg-slate-500 text-white",
    cardBg: "bg-white border border-slate-200 shadow-sm shadow-slate-100",
    textClass: "text-slate-500",
    badgeClass: "bg-slate-500 text-white",
    title: "一般アメダス",
    description: "全国の平地などに設置された標準的なアメダス",
  },
};

export const getPrefLabel = (code: string): string => {
  const pref = Object.values(PrefKey).find((p) => p.code === code);
  return pref ? pref.label.replace(/\(.*\)/g, "") : "不明";
};

export const getPrefRegionColor = (code: string): string => {
  const pref = Object.values(PrefKey).find((p) => p.code === code);
  return pref ? pref.region.colorStrong : "#475569";
};

export const getCategoryLabel = (cat: string): string => {
  const meta = CategoryKey[cat as CategoryValue];
  return meta ? meta.label : cat;
};

export const getCategoryBadgeClass = (cat: string): string => {
  const meta = CategoryKey[cat as CategoryValue];
  if (!meta) return "text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-800/50 text-slate-450 border-slate-700/50 shadow-sm";
  return "text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-950/40 border-slate-800/60 text-slate-400 shadow-sm";
};

export const getCategoryIcon = (cat: string) => {
  const meta = CategoryKey[cat as CategoryValue];
  return meta ? meta.icon : "🌡️";
};

export const determineRarity = (station: StationRaw, overview?: RawOverviewData): Rarity => {
  if (overview) {
    const badges = BadgeLogic.getBadges(overview, {});
    const hasRainbow = badges.some((b) => b.rank === "rainbow");
    if (hasRainbow) return "UR";
  }
  if (station.category === "meteo" ) {
    return "SSR";
  }
  if (overview) {
    const badges = BadgeLogic.getBadges(overview, {});
    const hasGold = badges.some((b) => b.rank === "gold");
    if (hasGold) return "SR";
  }
  if (station.category === "special"||station.category === "submeteo") {
    return "R";
  }
  if (overview) {
    const badges = BadgeLogic.getBadges(overview, {});
    const hasSilver = badges.some((b) => b.rank === "silver");
    if (hasSilver) return "UC";
  }
  return "C";
};
