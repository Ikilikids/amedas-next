import { AllData, BadgeData, StationData } from "../types/all";
import { RawBadgeData, RawData, RawStationData } from "../types/raw";
import { CategoryKey, CategoryMeta } from "../setting/category";
import { MetricKey, MetricMeta, MetricValue } from "../setting/metric";
import { PrefKey, PrefMeta } from "../setting/pref";
export function resolveCategory(key: string): CategoryMeta {
  return CategoryKey[key as keyof typeof CategoryKey];
}

function resolveMetric(key: string): MetricMeta {
  return MetricKey[key as MetricValue];
}

function resolvePref(key: string): PrefMeta {
  const pref: PrefMeta = Object.values(PrefKey).find((p) => p.code === key);
  return pref;
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
    height: raw.height ?? undefined,
    lon: raw.lon ?? undefined,
    lat: raw.lat ?? undefined,

    similar: raw.similar ?? undefined,
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

function toBadge(raw: RawBadgeData): BadgeData {
  return {
    metric: resolveMetric(raw.metric),
    rank: raw.rank,
    isHigh: raw.isHigh,
  };
}

/* =========================================================
 * Main
 * ========================================================= */

export function toAllData(raw: RawData): AllData {
  return {
    station: toStation(raw.station),
    overview: toMetricMap(raw.overview, (v) => v),
    uonzu: toMetricMap(raw.uonzu, (v) => v),
    table: toMetricMap(raw.table, (v) => v),
    ratio: toMetricMap(raw.ratio, (v) => v),
    similarAll: raw.similarAll?.map(toStation),
    similarMeteo: raw.similarMeteo?.map(toStation),
    sameStations: raw.sameStations?.map(toStation),
    meteoStations: raw.meteoStations?.map(toStation),
    badge: raw.badge?.map(toBadge),
    description: raw.description ?? undefined,
  };
}
