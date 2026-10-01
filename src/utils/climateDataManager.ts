import { RawStationData } from "../types/raw";
import { MonthlyEntry, StationId } from "../types/union";
import { MetricValue } from "../setting/metric";

// ==========================================
// キャッシュ本体 (メモリ上に常駐)
// ==========================================
export let masterCache: Record<StationId, RawStationData> | null = null;

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