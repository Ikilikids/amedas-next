import { MetricValue } from "../../setting/metric";
import { StationId } from "../../types/union";

const rawDataCache: Partial<Record<MetricValue, Record<StationId, number[]>>> = {};

/**
 * 1つの平年値気象項目（例: 気温、降水量）の生データを読み込む
 */
export async function loadJsonSingleMetric(
  metric: MetricValue
): Promise<Record<StationId, number[]> | null> {
  if (rawDataCache[metric]) return rawDataCache[metric]!;

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

  rawDataCache[metric] = rawData;
  return rawData;
}
