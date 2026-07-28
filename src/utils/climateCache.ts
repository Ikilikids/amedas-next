import { RawStationData } from "../types/raw";
import { MonthlyEntry, StationId } from "../types/union";
import { MetricValue } from "../setting/metric";
import { integrateSingleMetric } from "./rankingUtils";

/**
 * 全体から参照できる変数 (キャッシュ)
 */
let climateCache: Partial<
  Record<MetricValue, Record<StationId, MonthlyEntry[]>>
> | null = null;
let stationsMaster: Record<StationId, RawStationData> | null = null;

/**
 * 地点マスターをセットする
 */
export function setMaster(master: Record<StationId, RawStationData>) {
  stationsMaster = master;
}

/**
 * 地点マスターを取得する
 */
export function getMaster(): Record<StationId, RawStationData> | null {
  return stationsMaster;
}

/**
 * 特定の項目がすでにキャッシュされているか確認する
 */
export function hasMetric(metric: MetricValue): boolean {
  return !!(climateCache && climateCache[metric]);
}

/**
 * 統合済みデータ（順位入り）を取得する唯一の関数
 * キャッシュになければ計算して格納し、あれば即座に返す
 */
export function getClimate(
  metric: MetricValue,
  master: Record<StationId, RawStationData>,
  rawData: Record<StationId, number[]>
): Record<StationId, MonthlyEntry[]> {
  // 初期化
  if (!climateCache) {
    climateCache = {};
  }

  // 1. キャッシュがあればそれを返す
  const cached = climateCache[metric];
  if (cached) {
    return cached;
  }

  // 2. 順位計算を実行
  const result: Record<StationId, MonthlyEntry[]> = integrateSingleMetric(
    metric,
    rawData,
    master
  );

  // 3. キャッシュに格納して返す
  climateCache[metric] = result;
  return result;
}

/**
 * 地点IDから、ロード済みの全データを取得する
 */
export function getStation(
  stationId: StationId
): Record<string, MonthlyEntry[]> {
  const result: Record<string, MonthlyEntry[]> = {};

  if (!climateCache) return result;

  (Object.keys(climateCache) as MetricValue[]).forEach((m) => {
    const metricData = climateCache![m];
    if (metricData && metricData[stationId]) {
      result[m] = metricData[stationId];
    }
  });
  return result;
}
