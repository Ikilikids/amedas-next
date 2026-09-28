import fs from "fs";
import path from "path";
import { RawStationData, RawUonzuData } from "../types/raw";
import { StationId } from "../types/union";
import { getClimate, getMaster, hasMetric, setMaster } from "./climateCache";
import { METRIC_LIST, MetricKey, MetricValue } from "../setting/metric";
import { isIslandId } from "../setting/rank";
import { resolvePref } from "./masterUtils";

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
  identifiers?: string[],
  prefCodes?: readonly string[]
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
  const prefCodeSet = prefCodes ? new Set(prefCodes) : null;

  identifiers.forEach((idOrName) => {
    let targetId = idOrName;
    let targetStation = master[targetId as StationId];

    if (!targetStation) {
      const candidates = Object.entries(master).filter(
        ([_, s]) => s.station_name === idOrName
      );

      if (candidates.length > 0) {
        // prefCodesが指定されている場合、その都道府県/地域に属する地点を最優先する
        let matched = prefCodeSet
          ? candidates.find(([_, s]) => s.pref && prefCodeSet.has(s.pref))
          : undefined;

        if (!matched) {
          matched = candidates[0];
        }

        targetId = matched[0];
        targetStation = matched[1];
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

export interface RegionRainbowStationItem {
  id: string;
  stationName: string;
  prefName: string;
  city: string;
  category: string;
  badges: {
    metric: string;
    isHigh: boolean;
    rank: "rainbow";
    place: number;
    value: number;
  }[];
}

const TOTAL_STATIONS_MAP: Record<string, number> = {
  av_avtemp: 904,
  hitemp_35: 904,
  sm_rain: 1230,
  sm_sun: 827,
  sm_snowing: 320,
  av_wind: 874,
};

const TARGET_BADGE_METRICS = METRIC_LIST.filter(
  (m) => MetricKey[m].high || MetricKey[m].low
);

let cachedMetricRanks: Record<
  string,
  Record<string, { rank: number; value: number }>
> | null = null;

function getMetricRanks(): Record<
  string,
  Record<string, { rank: number; value: number }>
> {
  if (cachedMetricRanks) return cachedMetricRanks;

  const rankingDir = path.join(process.cwd(), "public/ranking_not_null");
  const ranks: Record<
    string,
    Record<string, { rank: number; value: number }>
  > = {};

  TARGET_BADGE_METRICS.forEach((m) => {
    const p = path.join(rankingDir, `${m}.json`);
    if (!fs.existsSync(p)) {
      ranks[m] = {};
      return;
    }
    const data: Record<string, number[]> = JSON.parse(
      fs.readFileSync(p, "utf-8")
    );
    const list: { id: string; val: number }[] = [];
    for (const [id, vals] of Object.entries(data)) {
      const val = vals[12]; // 年間値
      if (val != null) {
        list.push({ id, val });
      }
    }
    list.sort((a, b) => b.val - a.val);

    ranks[m] = {};
    list.forEach((item, idx) => {
      ranks[m][item.id] = { rank: idx + 1, value: item.val };
    });

    // 年平均気温（av_avtemp）は島しょ部除外ランキングも算出
    if (m === "av_avtemp") {
      const nonIslandList = list.filter((item) => !isIslandId(item.id));
      ranks["av_avtemp_island"] = {};
      nonIslandList.forEach((item, idx) => {
        ranks["av_avtemp_island"][item.id] = { rank: idx + 1, value: item.val };
      });
    }
  });

  cachedMetricRanks = ranks;
  return ranks;
}

/**
 * 地方内の都道府県コードに属するアメダス観測所の中から、
 * 虹バッジ（全国TOP3またはWORST3）を保持する地点を抽出する
 */
export function loadRainbowStationsForRegion(
  prefCodes: readonly string[]
): RegionRainbowStationItem[] {
  const master = loadMaster();
  const metricRanks = getMetricRanks();
  const prefCodeSet = new Set(prefCodes);

  const matchedStations = Object.values(master).filter(
    (s) => s.pref && prefCodeSet.has(s.pref)
  );

  const results: RegionRainbowStationItem[] = [];

  matchedStations.forEach((s) => {
    if (!s.id) return;
    const badges: RegionRainbowStationItem["badges"] = [];

    TARGET_BADGE_METRICS.forEach((m) => {
      const info = metricRanks[m]?.[s.id!];
      if (!info) return;

      const meta = MetricKey[m];
      if (!meta) return;

      if (meta.high) {
        let bestRank = info.rank;
        if (m === "av_avtemp") {
          const islandInfo = metricRanks["av_avtemp_island"]?.[s.id!];
          if (islandInfo && islandInfo.rank < bestRank) {
            bestRank = islandInfo.rank;
          }
        }

        if (bestRank <= 10) {
          badges.push({
            metric: m,
            isHigh: true,
            rank: "rainbow",
            place: bestRank,
            value: info.value,
          });
        }
      }

      if (meta.low) {
        const total = TOTAL_STATIONS_MAP[m] || 1000;
        const botPlace = Math.max(1, total - info.rank + 1);
        if (botPlace <= 10) {
          badges.push({
            metric: m,
            isHigh: false,
            rank: "rainbow",
            place: botPlace,
            value: info.value,
          });
        }
      }
    });

    if (badges.length > 0) {
      results.push({
        id: s.id,
        stationName: s.station_name || "",
        prefName: resolvePref(s.pref || "")?.label || "",
        city: s.city || "",
        category: s.category || "amedas",
        badges,
      });
    }
  });

  // バッジ数の多い順、同数なら地点名順にソート
  return results.sort((a, b) => {
    if (b.badges.length !== a.badges.length) {
      return b.badges.length - a.badges.length;
    }
    return a.stationName.localeCompare(b.stationName, "ja");
  });
}

export interface RegionTop1Item {
  metric: string;
  isHigh: boolean;
  label: string;
  station: {
    id: string;
    stationName: string;
    prefName: string;
    city: string;
    category: string;
  };
  value: number;
  nationalRank: number; // 全国順位
}

/**
 * 対象地域（地方または都道府県）におけるバッジ対象9区分のNo.1地点を抽出する
 */
export function loadTop1StationsForRegion(
  prefCodes: readonly string[]
): RegionTop1Item[] {
  const master = loadMaster();
  const metricRanks = getMetricRanks();
  const prefCodeSet = new Set(prefCodes);

  // 地域内の観測所
  const regionStations = Object.values(master).filter(
    (s) => s.id && s.pref && prefCodeSet.has(s.pref)
  );

  const TOP1_METRIC_CONFIGS = METRIC_LIST.flatMap((m) => {
    const meta = MetricKey[m];
    const items: { metric: MetricValue; isHigh: boolean; label: string }[] = [];
    if (meta.high) {
      items.push({ metric: m, isHigh: true, label: meta.high.label });
    }
    if (meta.low) {
      items.push({ metric: m, isHigh: false, label: meta.low.label });
    }
    return items;
  });

  const results: RegionTop1Item[] = [];

  TOP1_METRIC_CONFIGS.forEach((cfg) => {
    const ranks = metricRanks[cfg.metric];
    if (!ranks) return;

    // 地域内でこの項目のデータを持つ地点を抽出
    const candidates: {
      station: (typeof regionStations)[0];
      val: number;
      nationalRank: number;
    }[] = [];

    regionStations.forEach((s) => {
      const info = ranks[s.id];
      if (info && info.value != null) {
        let nationalRank = info.rank;
        if (!cfg.isHigh) {
          const total = TOTAL_STATIONS_MAP[cfg.metric] || 1000;
          nationalRank = Math.max(1, total - info.rank + 1);
        }
        candidates.push({
          station: s,
          val: info.value,
          nationalRank,
        });
      }
    });

    if (candidates.length === 0) return;

    // isHighなら値が大きい順、!isHighなら値が小さい順にソート
    candidates.sort((a, b) =>
      cfg.isHigh ? b.val - a.val : a.val - b.val
    );

    const top = candidates[0];
    results.push({
      metric: cfg.metric,
      isHigh: cfg.isHigh,
      label: cfg.label,
      station: {
        id: top.station.id,
        stationName: top.station.station_name || "",
        prefName: resolvePref(top.station.pref || "")?.label || "",
        city: top.station.city || "",
        category: top.station.category || "amedas",
      },
      value: top.val,
      nationalRank: top.nationalRank,
    });
  });

  return results;
}

