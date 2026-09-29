import { RawStationData } from "../types/raw";
import { MonthlyEntry, StationId } from "../types/union";
import { METRIC_LIST, MetricValue } from "../setting/metric";
import {
  AssembleTarget,
  resolveRequiredMetrics,
} from "../setting/assemble";
import {
  integrateSingleMetric,
  assembleDisplayData,
} from "./rankingUtils";

// ==========================================
// キャッシュ本体 (メモリ上に常駐)
// ==========================================
let masterCache: Record<StationId, RawStationData> | null = null;
const metricsCache: Partial<Record<MetricValue, Record<StationId, MonthlyEntry[]>>> = {};

export function loadMaster(): Record<StationId, RawStationData> {
  if (masterCache) return masterCache;
  if (typeof window !== "undefined") {
    return {} as Record<StationId, RawStationData>;
  }

  const fs = require("fs");
  const path = require("path");
  const p = path.join(process.cwd(), "public", "stations.json");
  masterCache = JSON.parse(fs.readFileSync(p, "utf-8"));
  return masterCache!;
}

// ==========================================
// 2. 1項目のデータ・順位を読み込み (サーバーなら fs、ブラウザなら fetch)
// ==========================================
export async function loadSingleMetric(
  metric: MetricValue,
  customMaster?: Record<StationId, RawStationData>
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

  const master = customMaster || masterCache || (typeof window === "undefined" ? loadMaster() : null);
  if (customMaster && !masterCache) {
    masterCache = customMaster;
  }
  if (!master) {
    throw new Error("loadSingleMetric: master data is required in browser environment.");
  }

  const integrated = integrateSingleMetric(metric, rawData, master);
  metricsCache[metric] = integrated;
  return integrated;
}


// ==========================================
// 4. 地点ID配列とオプションを受け取り、整形データを返す万能関数
// ==========================================
export type FullStationData = {
  id: StationId;
  station: RawStationData;
} & ReturnType<typeof assembleDisplayData>;

export async function getStationMetrics(
  stationIds?: StationId[],
  options?: AssembleTarget[],
  customMaster?: Record<StationId, RawStationData>
): Promise<Record<StationId, FullStationData>> {
  if (customMaster && !masterCache) {
    masterCache = customMaster;
  }
  const master = masterCache || customMaster || (typeof window === "undefined" ? loadMaster() : null);
  if (!master) {
    throw new Error("getStationMetrics: masterCache is not loaded. Call loadMaster() first.");
  }

  // 1. options に応じて必要な気象項目のみをオンデマンド読み込み（キャッシュ済みなら一瞬でスキップ）
  console.log(options)
  const neededMetrics = resolveRequiredMetrics(options);
  console.log(neededMetrics);
  await Promise.all(neededMetrics.map((m) => loadSingleMetric(m, master)));

  const targetIds = stationIds ?? (Object.keys(master) as StationId[]);
  const result: Record<StationId, FullStationData> = {};

  for (const id of targetIds) {
    const station = master[id];
    if (!station) continue;

    // この地点の全気象項目をキャッシュから引く
    const rawMetrics: Partial<Record<MetricValue, MonthlyEntry[]>> = {};
    neededMetrics.forEach((m) => {
      const data = metricsCache[m];
      if (data && data[id]) {
        rawMetrics[m] = data[id];
      }
    });

    // assembleDisplayData で必要なパーツだけ盛り付ける
    const display = assembleDisplayData(rawMetrics, {
      ...options,
      stationId: id,
    });

    result[id] = {
      id,
      station,
      ...display,
    };
  }
  console.log(result)
  return result;
}
