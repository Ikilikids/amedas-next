import { AllData, BadgeData, StationData } from "../types/all";
import { RawBadgeData, RawData, RawStationData } from "../types/raw";
import { CATEGORY_KEYS, CategoryMeta } from "../utils/category";
import { MetricKey, MetricMeta, MetricValue } from "../utils/metric";
import { PrefKey, PrefMeta } from "../utils/pref";
export function resolveCategory(key: string): CategoryMeta {
  return CATEGORY_KEYS[key as keyof typeof CATEGORY_KEYS];
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
export function toStation(raw: RawStationData): StationData | null {
  if (!raw || !raw.id) return null;

  const cat = resolveCategory(raw.category || "amedas");
  const pref = resolvePref(raw.pref || "01");

  if (!cat || !pref) return null;

  return {
    id: raw.id,
    station_name: raw.station_name || "不明",

    category: cat,
    pref: pref,

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
  if (!raw || typeof raw !== "object") return map;

  for (const [k, v] of Object.entries(raw)) {
    if (!k) continue;
    const meta = resolveMetric(k as MetricValue);
    if (!meta) continue;

    map.set(meta, fn(v));
  }

  return map;
}

function toBadge(raw: RawBadgeData): BadgeData | null {
  if (!raw || !raw.metric) return null;
  const meta = resolveMetric(raw.metric as MetricValue);
  if (!meta) return null;

  return {
    metric: meta,
    rank: raw.rank,
    isHigh: raw.isHigh,
  };
}

/* =========================================================
 * Main
 * ========================================================= */

export function toAllData(raw: RawData): AllData {
  if (!raw) return {} as AllData;

  const station = raw.station ? toStation(raw.station) : null;

  return {
    station: station || ({} as StationData),
    overview: toMetricMap(raw.overview, (v) => v),
    uonzu: toMetricMap(raw.uonzu, (v) => v),
    table: toMetricMap(raw.table, (v) => v),
    ratio: toMetricMap(raw.ratio, (v) => v),
    similarAll: Array.isArray(raw.similarAll)
      ? raw.similarAll.map(toStation).filter((s): s is StationData => s !== null)
      : [],
    similarMeteo: Array.isArray(raw.similarMeteo)
      ? raw.similarMeteo.map(toStation).filter((s): s is StationData => s !== null)
      : [],
    sameStations: Array.isArray(raw.sameStations)
      ? raw.sameStations.map(toStation).filter((s): s is StationData => s !== null)
      : [],
    meteoStations: Array.isArray(raw.meteoStations)
      ? raw.meteoStations.map(toStation).filter((s): s is StationData => s !== null)
      : [],
    badge: Array.isArray(raw.badge)
      ? raw.badge.map(toBadge).filter((b): b is BadgeData => b !== null)
      : [],
    description: raw.description ?? undefined,
  };
}
