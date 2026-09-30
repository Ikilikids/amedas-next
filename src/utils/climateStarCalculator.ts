import fs from "fs";
import path from "path";
import { MetricKey, MetricMeta, MetricValue } from "../setting/metric";
import { RawStationData } from "../types/raw";
import { loadMaster } from "./ssgLoader";

export const TARGET_STAR_METRICS: MetricValue[] = [
  "av_avtemp",
  "sm_sun",
  "sm_rain",
  "sm_snowing",
  "av_wind",
  "hitemp_35",
];

let cachedAnnualValues: Record<string, Record<string, number>> | null = null;

/**
 * 6指標の年間値をキャッシュして読み込む (SSG用)
 */
function loadAllAnnualValues(): Record<string, Record<string, number>> {
  if (cachedAnnualValues) return cachedAnnualValues;

  const rankingDir = path.join(process.cwd(), "public/ranking_not_null");
  const values: Record<string, Record<string, number>> = {};

  TARGET_STAR_METRICS.forEach((m) => {
    values[m] = {};
    const p = path.join(rankingDir, `${m}.json`);
    if (!fs.existsSync(p)) return;

    try {
      const data: Record<string, number[]> = JSON.parse(
        fs.readFileSync(p, "utf-8")
      );
      for (const [id, vals] of Object.entries(data)) {
        const annualVal = vals[12]; // 年間値 (インデックス12)
        if (annualVal != null && !isNaN(annualVal)) {
          values[m][id] = annualVal;
        }
      }
    } catch (e) {
      console.error(`Failed to read ranking json for ${m}:`, e);
    }
  });

  cachedAnnualValues = values;
  return values;
}

/**
 * 指標の閾値から単一の星数(1〜maxStars)を計算
 */
export function calculateStar(
  val: number,
  starMeta?: MetricMeta["star"]
): number {
  if (!starMeta) return 5;
  const { levels } = starMeta;

  if (levels.length === 0 || val < levels[0].threshold) {
    return 1;
  }

  for (let i = levels.length - 1; i >= 0; i--) {
    if (val >= levels[i].threshold) {
      return i + 2;
    }
  }

  return 1;
}

/**
 * 条件に合致するステーション群から、各指標の星評価 [rep, min, max] を自動計算する
 * repStationId が渡された場合はその地点の星を rep とする（未指定時は min を代入）
 */
export function calculateClimateStarsForStations(
  matcher: (station: RawStationData) => boolean,
  repStationId?: string
): ClimateStarsResult {
  const master = loadMaster();
  const annualValues = loadAllAnnualValues();

  // 条件に合う地点を抽出
  const matchedStationIds = Object.values(master)
    .filter(matcher)
    .map((s) => s.id)
    .filter((id): id is string => !!id);

  // 指定された代表地点ID、または合致地点群の中の "meteo" 地点を代表値とする
  const targetRepId =
    repStationId ||
    matchedStationIds.find((id) => master[id]?.category === "meteo");

  const result: Record<string, [number, number, number]> = {};

  TARGET_STAR_METRICS.forEach((metricKey) => {
    const meta = MetricKey[metricKey];
    const metricVals = annualValues[metricKey] || {};

    let minStar = Infinity;
    let maxStar = -Infinity;

    matchedStationIds.forEach((id) => {
      const val = metricVals[id];
      if (val != null) {
        const star = calculateStar(val, meta.star);
        if (star < minStar) minStar = star;
        if (star > maxStar) maxStar = star;
      }
    });

    let repStar = minStar;
    if (targetRepId && metricVals[targetRepId] != null) {
      repStar = calculateStar(metricVals[targetRepId], meta.star);
    }

    if (minStar !== Infinity && maxStar !== -Infinity) {
      const finalRep = repStar !== Infinity ? repStar : minStar;
      result[metricKey] = [finalRep, minStar, maxStar];
    } else {
      result[metricKey] = [5, 5, 5];
    }
  });

  const repStationName =
    targetRepId && master[targetRepId]
      ? master[targetRepId]?.station_name || master[targetRepId]?.official_name || null
      : null;

  return {
    repStationName,
    stars: result,
  };
}

export type ClimateStarsResult = {
  repStationName?: string | null;
  stars: Record<string, [number, number, number]>;
};

/**
 * 代表地点の名称（station_name または official_name）を取得する
 */
export function getRepresentativeStationName(
  matcher: (station: RawStationData) => boolean,
  repStationId?: string
): string | undefined {
  const master = loadMaster();
  const matchedStationIds = Object.values(master)
    .filter(matcher)
    .map((s) => s.id)
    .filter((id): id is string => !!id);

  const targetRepId =
    repStationId ||
    matchedStationIds.find((id) => master[id]?.category === "meteo");

  if (!targetRepId || !master[targetRepId]) return undefined;
  return master[targetRepId]?.station_name || master[targetRepId]?.official_name;
}
