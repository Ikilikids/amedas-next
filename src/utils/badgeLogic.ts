import {
  BadgeRank,
  RawBadgeData,
  RawOverviewData,
  RawRatioData,
} from "../types/raw";
import { MetricValue } from "./metric";

const TOTAL_STATIONS: Record<string, number> = {
  av_avtemp: 904,
  hitemp_35: 904,
  sm_rain: 1230,
  sm_sun: 827,
  sm_snowing: 320,
  av_wind: 874,
};

function calculateRank(
  rank: number,
  total: number
): { rank: BadgeRank; isHigh: boolean } | null {
  const top1 = 10;
  const top5 = total * 0.05;
  const top10 = total * 0.1;
  const top20 = total * 0.2;

  const bottom1 = total - 10;
  const bottom5 = total * 0.95;
  const bottom10 = total * 0.9;

  // 上位
  if (rank <= top1) return { rank: "rainbow", isHigh: true };
  if (rank <= top5) return { rank: "gold", isHigh: true };
  if (rank <= top10) return { rank: "silver", isHigh: true };
  if (rank <= top20) return { rank: "bronze", isHigh: true };

  // 下位
  if (rank >= bottom1) return { rank: "rainbow", isHigh: false };
  if (rank >= bottom5) return { rank: "gold", isHigh: false };
  if (rank >= bottom10) return { rank: "silver", isHigh: false };

  return null;
}

export const BadgeLogic = {
  getBadges(
    overviewData: RawOverviewData,
    ratioData: RawRatioData
  ): RawBadgeData[] {
    const badges: RawBadgeData[] = [];

    const targets: MetricValue[] = [
      "av_avtemp",
      "hitemp_35",
      "sm_rain",
      "sm_sun",
      "sm_snowing",
      "av_wind",
    ];

    const allowBottom = new Set<MetricValue>([
      "av_avtemp",
      "sm_rain",
      "sm_sun",
    ]);

    targets.forEach((key) => {
      const data = overviewData[key]?.rank ?? ratioData[key]?.[12]?.top;

      if (data == null) return;

      const total = TOTAL_STATIONS[key]; // ← ここが修正

      const result = calculateRank(data, total);
      if (!result) return;

      if (!result.isHigh && !allowBottom.has(key)) return;

      badges.push({
        metric: key, // ← stringになる
        rank: result.rank,
        isHigh: result.isHigh,
      });
    });

    return badges.sort((a, b) => Badgevalue[a.rank] - Badgevalue[b.rank]);
  },
};

const Badgevalue: Record<BadgeRank, number> = {
  rainbow: 1,
  gold: 2,
  silver: 3,
  bronze: 4,
};
