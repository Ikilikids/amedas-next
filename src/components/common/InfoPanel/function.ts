import { MetricKey, MetricMeta } from "../../../setting/metric";
import { isIslandId } from "../../../setting/rank";
import { RawMonthlyData, RawStationData } from "../../../types/raw";

export const DISPLAY_METRICS: MetricMeta[] = [
  MetricKey.av_avtemp,
  MetricKey.sm_sun,
  MetricKey.sm_rain,
  MetricKey.sm_snowing,
  MetricKey.av_wind,
  MetricKey.hitemp_35,
];

export function showValue(
  v: number | null | undefined,
  isRank: boolean = false
): string {
  if (v === null || v === undefined) return "--";
  if (isRank) return String(v);
  return v.toFixed(1);
}

export type BadgeRank = "rainbow" | "gold" | "silver" | "bronze";

export interface StationBadgeItem {
  rank: BadgeRank;
  isHigh: boolean;
  isIsland: boolean;
  metric: MetricMeta;
}

const evaluateRank = (rank?: number | null): BadgeRank | null => {
  if (!rank || rank <= 0) return null;
  if (rank <= 10) return "rainbow";
  if (rank <= 25) return "gold";
  if (rank <= 50) return "silver";
  if (rank <= 100) return "bronze";
  return null;
};

export function computeStationBadges(
  stationData: RawStationData,
  climateData: RawMonthlyData | null
): StationBadgeItem[] {
  if (!climateData) return [];
  const isIslandStation = stationData.id ? isIslandId(stationData.id) : false;

  return DISPLAY_METRICS.flatMap((m) => {
    const entries = climateData[m.key];
    const annual = entries && entries.length > 12 ? entries[12] : entries?.[0];
    if (!annual) return [];

    let topRank = annual.top;
    const botRank = annual.bot;

    if (m.key === "av_avtemp" && annual.island != null && annual.island > 0) {
      topRank =
        topRank != null && topRank > 0
          ? Math.min(topRank, annual.island)
          : annual.island;
    }

    const badges: StationBadgeItem[] = [];

    if (m.high) {
      const highRank = evaluateRank(topRank);
      if (highRank) {
        badges.push({
          rank: highRank,
          isHigh: true,
          isIsland: isIslandStation,
          metric: m,
        });
      }
    }

    if (m.low) {
      const lowRank = evaluateRank(botRank);
      if (lowRank) {
        badges.push({
          rank: lowRank,
          isHigh: false,
          isIsland: isIslandStation,
          metric: m,
        });
      }
    }

    return badges;
  });
}
