import { RawStationData } from "../types/raw";
import { MonthlyEntry, StationId } from "../types/union";
import { MetricValue } from "../setting/metric";
import { integrateSingleMetric } from "./rankingUtils";

// ==========================================
// キャッシュ本体 (メモリ上に常駐)
// ==========================================
export let masterCache: Record<StationId, RawStationData> | null = null;
export const metricsCache: Partial<Record<MetricValue, Record<StationId, MonthlyEntry[]>>> = {};

// ★ SSGで絶対に回す関数、キャッシュがあれば読み込まない
export function loadMaster(): Record<StationId, RawStationData> {
  if (!masterCache) {
    const fs = require("fs");
    const path = require("path");
    const p = path.join(process.cwd(), "public", "stations.json");
    masterCache = JSON.parse(fs.readFileSync(p, "utf-8"));
  }
  return masterCache;
}

// ★ SSGから渡されたデータを登録する関数
export function resisterMaster(data: Record<StationId, RawStationData>) {
  masterCache = data;
}

// ==========================================
// 2. 1項目のデータ・順位を読み込み (サーバーなら fs、ブラウザなら fetch)
// ==========================================
export async function loadSingleMetric(
  metric: MetricValue
): Promise<Record<StationId, MonthlyEntry[]> | null> {
  if (metricsCache[metric]) return metricsCache[metric]!;

  let rawData: Record<StationId, number[]>;

  if (typeof window === "undefined") {
    const fs = require("fs");
    const path = require("path");
    const p = path.join(process.cwd(), "public/ranking_not_null", `${metric}.json`);
    if (!fs.existsSync(p)) return null;
    rawData = JSON.parse(fs.readFileSync(p, "utf-8"));
  } else {
    const res = await fetch(`/ranking_not_null/${metric}.json`);
    if (!res.ok) return null;
    rawData = await res.json();
  }

  const master = masterCache;
  if (!master) {
    throw new Error("loadSingleMetric: master data is required in browser environment.");
  }

  const integrated = integrateSingleMetric(metric, rawData, master);
  metricsCache[metric] = integrated;
  return integrated;
}




export function pickStationData(
  masterData: Record<StationId, RawStationData>,
  fields: (keyof RawStationData)[],
  omit = false,
) {
  return Object.fromEntries(
    Object.entries(masterData).map(([id, station]) => [
      id,
      Object.fromEntries(
        (Object.keys(station) as (keyof RawStationData)[])
          .filter((key) => (omit ? !fields.includes(key) : fields.includes(key)))
          .map((key) => [key, station[key]])
      ),
    ])
  );
}