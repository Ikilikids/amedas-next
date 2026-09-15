import fs from "fs";
import path from "path";
import { RawStationData, RawUonzuData } from "../types/raw";
import { StationId } from "../types/union";
import { getClimate, getMaster, hasMetric, setMaster } from "./climateCache";
import { METRIC_LIST } from "../setting/metric";

/**
 * JSONファイルを安全に読み込む (ビルド時専用)
 */
export function readJson<T>(...paths: string[]): T | null {
  const p = path.join(process.cwd(), ...paths);
  if (!fs.existsSync(p)) return null;
  const content = fs.readFileSync(p, "utf-8");
  if (!content || content.trim() === "") return null;
  return JSON.parse(content);
}

/**
 * マスターデータを一度だけロードしてキャッシュする
 */
export function loadMaster(): Record<StationId, RawStationData> {
  const cached = getMaster();
  if (cached) {
    console.log("[ISR] loadMaster: Cache Hit (In-memory)");
    return cached as Record<StationId, RawStationData>;
  }

  const start = Date.now();
  console.log("[ISR] loadMaster: Cache Miss - Reading stations.json from disk...");
  const p = path.join(process.cwd(), "public", "stations.json");
  const content = fs.readFileSync(p, "utf-8");
  if (!content || content.trim() === "") {
    throw new Error(`Master file is empty: ${p}`);
  }
  const master: Record<StationId, RawStationData> = JSON.parse(content);
  setMaster(master);
  console.log(`[ISR] loadMaster: Disk Read & Parse took ${Date.now() - start}ms`);
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

  METRIC_LIST.forEach((m) => {
    // すでにキャッシュにあれば読み込みをスキップ (ISR時の最重要最適化)
    if (hasMetric(m)) return;

    const p = path.join(rankingDir, `${m}.json`);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      if (content && content.trim() !== "") {
        const rawData = JSON.parse(content);
        getClimate(m, master, rawData);
        loadedCount++;
      }
    }
  });
}

/**
 * 地点名または地点IDのリストから、雨温図に必要な生データを抽出する (SSG用)
 */
export interface ArticleUonzuItem {
  id: string;
  name: string;
  rawUonzu: RawUonzuData;
}

export function loadUonzuItemsForList(
  identifiers?: string[]
): ArticleUonzuItem[] {
  if (!identifiers || identifiers.length === 0) return [];

  const master = loadMaster();
  const rankingDir = path.join(process.cwd(), "public/ranking_not_null");

  // 雨温図に必要な4項目 (降水量、平均気温、最高気温、最低気温)
  const metrics = ["sm_rain", "av_avtemp", "av_hitemp", "av_lwtemp"];
  const rawMetricData: Record<string, Record<string, number[]>> = {};

  metrics.forEach((m) => {
    const p = path.join(rankingDir, `${m}.json`);
    if (fs.existsSync(p)) {
      rawMetricData[m] = JSON.parse(fs.readFileSync(p, "utf-8"));
    } else {
      rawMetricData[m] = {};
    }
  });

  const results: ArticleUonzuItem[] = [];

  identifiers.forEach((idOrName) => {
    let targetId = idOrName;
    let targetStation = master[targetId as StationId];

    if (!targetStation) {
      const entry = Object.entries(master).find(
        ([_, s]) => s.station_name === idOrName
      );
      if (entry) {
        targetId = entry[0];
        targetStation = entry[1];
      }
    }

    if (targetStation) {
      const rawUonzu: RawUonzuData = {};
      metrics.forEach((m) => {
        const stationValues = rawMetricData[m]?.[targetId];
        if (stationValues) {
          rawUonzu[m] = stationValues.slice(0, 12);
        }
      });

      results.push({
        id: targetId,
        name: targetStation.station_name,
        rawUonzu,
      });
    }
  });

  return results;
}
