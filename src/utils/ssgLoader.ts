import fs from "fs";
import path from "path";
import { RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import { getClimate, getMaster, hasMetric, setMaster } from "./climateCache";
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
    fs.readFileSync(path.join(process.cwd(), "public", "stations.json"), "utf-8")
  );
  setMaster(master);
  return master;
}

/**
 * ビルド時に全ランキングデータをキャッシュに埋める
 */
export function ensureAllDataLoaded() {
  const start = Date.now();
  const master = loadMaster();

  const rankingDir = path.join(process.cwd(), "public/ranking_not_null");
  let loadedCount = 0;

  METRIC_KEYS.forEach((m) => {
    // すでにキャッシュにあれば読み込みをスキップ (ISR時の最重要最適化)
    if (hasMetric(m)) return;

    const p = path.join(rankingDir, `${m}.json`);
    if (fs.existsSync(p)) {
      const rawData = JSON.parse(fs.readFileSync(p, "utf-8"));
      getClimate(m, master, rawData);
      loadedCount++;
    }
  });

  if (loadedCount > 0) {
    console.log(`[ISR_OPTIMIZER] Loaded ${loadedCount} metrics in ${Date.now() - start}ms`);
  }
}
