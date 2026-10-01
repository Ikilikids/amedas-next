import { RawStationData } from "../types/raw";
import { CategoryKey, CategoryMeta } from "../setting/category";
import { MetricKey, MetricMeta, MetricValue } from "../setting/metric";
import { PrefKey, PrefMeta } from "../setting/pref";
import { AreaKey, AreaMeta, AreaValue } from "../setting/area";

export function resolveArea(key?: string): AreaMeta | undefined {
  if (!key) return undefined;
  return AreaKey[key as AreaValue];
}
export function resolveCategory(key: string): CategoryMeta {
  return CategoryKey[key as keyof typeof CategoryKey];
}

export function resolveMetric(key: string): MetricMeta {
  return MetricKey[key as MetricValue];
}

export function resolvePref(key: string): PrefMeta {
  const pref = Object.values(PrefKey).find((p) => p.code.includes(key));
  return pref as PrefMeta;
}

/* =========================================================
 * Utilities
 * ========================================================= */

/**
 * 都道府県ラベルからカッコとその中身を削除する (例: "東京都(東京)" -> "東京都")
 */
export function sanitizePrefLabel(label: string): string {
  return label.replace(/\(.*\)/g, "");
}

/**
 * 市区町村名から「●●郡」を削除する (例: "●●郡▲▲町" -> "▲▲町")
 */
export function sanitizeCityName(city: string): string {
  return city.replace(/^.*郡/, "");
}


