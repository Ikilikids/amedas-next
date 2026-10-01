import { RawStationData } from "../types/raw";
import { StationId } from "../types/union";

// SSG（Node.js環境）での重複読み込み防止用キャッシュ
let masterCache: Record<StationId, RawStationData> | null = null;

/**
 * ★ SSG（サーバー）専用：stations.json を読み込んで返す
 */
export function loadMaster(): Record<StationId, RawStationData> {
  if (!masterCache) {
    const fs = require("fs");
    const path = require("path");
    const p = path.join(process.cwd(), "public", "stations.json");
    masterCache = JSON.parse(fs.readFileSync(p, "utf-8"));
  }
  return masterCache!;
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