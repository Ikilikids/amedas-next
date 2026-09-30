import { AllData, StationData } from "../types/all";
import { RawData, RawStationData } from "../types/raw";
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

function resolveMetric(key: string): MetricMeta {
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

/* =========================================================
 * Converters
 * ========================================================= */

/* ★ここが重要：Stationは完全に作る */
export function toStation(raw: RawStationData): StationData {
  return {
    id: raw.id,
    station_name: raw.station_name,

    category: resolveCategory(raw.category),
    pref: resolvePref(raw.pref),

    official_name: raw.official_name ?? undefined,
    city: raw.city ?? undefined,
    area: resolveArea(raw.area),
    height: raw.height ?? undefined,
    lon: raw.lon ?? undefined,
    lat: raw.lat ?? undefined,
  };
}

/* =========================================================
 * Metric Map
 * ========================================================= */

export function toMetricMap<V, R>(
  raw: Record<string, V> | undefined | null,
  fn: (v: V) => R
): Map<MetricMeta, R> {
  const map = new Map<MetricMeta, R>();
  if (!raw) return map;

  for (const [k, v] of Object.entries(raw)) {
    const meta = resolveMetric(k as MetricValue);
    if (!meta) continue;

    map.set(meta, fn(v));
  }

  return map;
}


/* =========================================================
 * Main
 * ========================================================= */

export function toAllData(raw: RawData): AllData {
  let otherStations: AllData["otherStations"] = undefined;
  if (raw.otherStations) {
    otherStations = {};
    for (const [key, list] of Object.entries(raw.otherStations)) {
      if (!list) continue;
      otherStations[key as keyof typeof otherStations] = list.map((item) => ({
        ...toStation(item),
        similar: item.similar,
      }));
    }
  }

  return {
    station: toStation(raw.station),
    climateData: toMetricMap(raw.climateData, (v) => v),
    otherStations,
  };
}
