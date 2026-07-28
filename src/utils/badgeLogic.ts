import {
  BadgeRank,
  RawBadgeData,
  RawOverviewData,
  RawRatioData,
} from "../types/raw";
import { MetricValue } from "../setting/metric";

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
  const topRainbow = 3;
  const topGold = 10;
  const topSilver = 50;
  const topBronze = 100;

  const bottomRainbow = total - 3 + 1;
  const bottomGold = total - 10 + 1;
  const bottomSilver = total - 50 + 1;
  const bottomBronze = total - 100 + 1;

  // 上位
  if (rank <= topRainbow) return { rank: "rainbow", isHigh: true };
  if (rank <= topGold) return { rank: "gold", isHigh: true };
  if (rank <= topSilver) return { rank: "silver", isHigh: true };
  if (rank <= topBronze) return { rank: "bronze", isHigh: true };

  // 下位
  if (rank >= bottomRainbow) return { rank: "rainbow", isHigh: false };
  if (rank >= bottomGold) return { rank: "gold", isHigh: false };
  if (rank >= bottomSilver) return { rank: "silver", isHigh: false };
  if (rank >= bottomBronze) return { rank: "bronze", isHigh: false };

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
