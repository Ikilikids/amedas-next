import React from "react";
import { GiIsland } from "react-icons/gi";
import { BadgeRank, RawData } from "../types/raw";
import { MetricKey, MetricMeta, MetricValue } from "../setting/metric";
import { isIslandId } from "../setting/rank";

export interface EvaluatedBadge {
  rank: BadgeRank;
  icon: React.ReactNode;
  title: string;
}

const TARGET_METRICS: MetricValue[] = [
  "av_avtemp",
  "hitemp_35",
  "sm_rain",
  "sm_sun",
  "sm_snowing",
  "av_wind",
];

const rankLabelMap: Record<BadgeRank, string> = {
  rainbow: "上位10位",
  gold: "上位25位",
  silver: "上位50位",
  bronze: "上位100位",
};

const BadgeValue: Record<BadgeRank, number> = {
  rainbow: 1,
  gold: 2,
  silver: 3,
  bronze: 4,
};

function evaluateRank(
  topRank?: number | null,
  botRank?: number | null,
  hasHigh: boolean = true,
  hasLow: boolean = true
): { rank: BadgeRank; isHigh: boolean } | null {
  if (hasHigh && topRank != null && topRank > 0) {
    if (topRank <= 10) return { rank: "rainbow", isHigh: true };
    if (topRank <= 25) return { rank: "gold", isHigh: true };
    if (topRank <= 50) return { rank: "silver", isHigh: true };
    if (topRank <= 100) return { rank: "bronze", isHigh: true };
  }

  if (hasLow && botRank != null && botRank > 0) {
    if (botRank <= 10) return { rank: "rainbow", isHigh: false };
    if (botRank <= 25) return { rank: "gold", isHigh: false };
    if (botRank <= 50) return { rank: "silver", isHigh: false };
    if (botRank <= 100) return { rank: "bronze", isHigh: false };
  }

  return null;
}

export function computeStationBadges(rawData: RawData): EvaluatedBadge[] {
  const { station, climateData } = rawData;
  if (!climateData) return [];

  const isIsland = station?.id ? isIslandId(station.id) : false;
  const badges: EvaluatedBadge[] = [];

  TARGET_METRICS.forEach((key) => {
    const meta = MetricKey[key];
    if (!meta) return;

    const hasHigh = !!meta.high;
    const hasLow = !!meta.low;
    if (!hasHigh && !hasLow) return;

    const entries = climateData[key];
    const annual = entries && entries.length > 12 ? entries[12] : entries?.[0];
    let topRank = annual?.top;
    const botRank = annual?.bot;

    if (key === "av_avtemp") {
      const islandRank = annual?.island;
      if (islandRank != null && islandRank > 0) {
        topRank = topRank != null && topRank > 0 ? Math.min(topRank, islandRank) : islandRank;
      }
    }

    const result = evaluateRank(topRank, botRank, hasHigh, hasLow);
    if (!result) return;

    const dir = result.isHigh ? meta.high : meta.low;
    const isIslandTemp = isIsland && meta.key === "av_avtemp";
    const notIsIslandTemp = !isIsland && meta.key === "av_avtemp";
    const icon = isIslandTemp ? React.createElement(GiIsland) : (dir?.icon || meta.icon);

    const tierText = result.isHigh
      ? rankLabelMap[result.rank]
      : `下位${rankLabelMap[result.rank].replace("上位", "")}`;
    const islandText = isIslandTemp ? "(全国)" : notIsIslandTemp ? "(本土)" : "";
    const title = `${dir?.label || meta.label}：${tierText}${islandText}`;

    badges.push({
      rank: result.rank,
      icon,
      title,
    });
  });

  return badges.sort((a, b) => BadgeValue[a.rank] - BadgeValue[b.rank]);
}
