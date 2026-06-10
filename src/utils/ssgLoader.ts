import fs from "fs";
import path from "path";
import { RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import { getClimate, getMaster, setMaster, hasMetric } from "./climateCache";
import { METRIC_KEYS } from "./metric";

/**
 * JSONファイルを安全に読み込む (ビルド時専用)
 */
export function readJson<T>(...paths: string[]): T | null {
  const p = path.join(process.cwd(), ...paths);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

/**
 * マスターデータを一度だけロードしてキャッシュする
 */
export function loadMaster(): Record<StationId, RawStationData> {
  const cached = getMaster();
  if (cached) return cached as Record<StationId, RawStationData>;

  const master: Record<StationId, RawStationData> = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "public", "stations.json"),
      "utf-8"
    )
  );
  setMaster(master);
  return master;
}

/**
 * ビルド時またはISR実行時に全ランキングデータをキャッシュに埋める
 */
export function ensureAllDataLoaded() {
  const master = loadMaster();

  const rankingDir = path.join(process.cwd(), "public/ranking_not_null");
  
  // すべてのメトリクスがすでにキャッシュされているかチェック
  const allLoaded = METRIC_KEYS.every(m => hasMetric(m));
  if (allLoaded) {
    return;
  }

  METRIC_KEYS.forEach((m) => {
    // 個別にキャッシュチェック（すでにメモリにあればディスクを読み込まない）
    if (hasMetric(m)) return;

    const p = path.join(rankingDir, `${m}.json`);
    if (fs.existsSync(p)) {
      try {
        const rawData: Record<StationId, number[]> = JSON.parse(
          fs.readFileSync(p, "utf-8")
        );
        getClimate(m, master, rawData);
      } catch (e) {
        console.error(`[ISR_SYSTEM_MONITOR] Failed to load ranking JSON for ${m}:`, e);
      }
    }
  });
}
