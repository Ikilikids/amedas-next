import fs from "fs";
import path from "path";
import { RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import { getClimate, getMaster, setMaster } from "./climateCache";
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
  const master = loadMaster();

  const rankingDir = path.join(process.cwd(), "public/ranking_not_null");
  METRIC_KEYS.forEach((m) => {
    const p = path.join(rankingDir, `${m}.json`);
    if (fs.existsSync(p)) {
      const rawData = JSON.parse(fs.readFileSync(p, "utf-8"));
      // キャッシュ管理と計算を唯一の関数 getClimate で行う
      getClimate(m, master, rawData);
    }
  });
}
