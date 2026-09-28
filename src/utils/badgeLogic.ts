import {
  BadgeRank,
  RawBadgeData,
  RawOverviewData,
  RawRatioData,
  RawTableData,
} from "../types/raw";
import { MetricKey, MetricValue } from "../setting/metric";

const TARGET_METRICS: MetricValue[] = [
  "av_avtemp",
  "hitemp_35",
  "sm_rain",
  "sm_sun",
  "sm_snowing",
  "av_wind",
];

function evaluateRank(
  topRank?: number | null,
  botRank?: number | null,
  hasHigh: boolean = true,
  hasLow: boolean = true
): { rank: BadgeRank; isHigh: boolean } | null {
  // 上位判定 (TOP 10 -> rainbow, 25 -> gold, 50 -> silver, 100 -> bronze)
  if (hasHigh && topRank != null && topRank > 0) {
    if (topRank <= 10) return { rank: "rainbow", isHigh: true };
    if (topRank <= 25) return { rank: "gold", isHigh: true };
    if (topRank <= 50) return { rank: "silver", isHigh: true };
    if (topRank <= 100) return { rank: "bronze", isHigh: true };
  }

  // 下位判定 (BOTTOM 10 -> rainbow, 25 -> gold, 50 -> silver, 100 -> bronze)
  if (hasLow && botRank != null && botRank > 0) {
    if (botRank <= 10) return { rank: "rainbow", isHigh: false };
    if (botRank <= 25) return { rank: "gold", isHigh: false };
    if (botRank <= 50) return { rank: "silver", isHigh: false };
    if (botRank <= 100) return { rank: "bronze", isHigh: false };
  }

  return null;
}

export const BadgeLogic = {
  getBadges(
    overviewData: RawOverviewData,
    ratioData: RawRatioData,
    tableData?: RawTableData,
    _isIsland: boolean = false
  ): RawBadgeData[] {
    const badges: RawBadgeData[] = [];

    TARGET_METRICS.forEach((key) => {
      const meta = MetricKey[key];
      if (!meta) return;

      const hasHigh = !!meta.high;
      const hasLow = !!meta.low;
      if (!hasHigh && !hasLow) return;

      // 年間エントリ（12番目のインデックス）から top / bot 順位を取得
      const annualTable = tableData?.[key]?.[12];
      const annualRatio = ratioData?.[key]?.[12];
      let topRank = annualTable?.top ?? annualRatio?.top ?? overviewData?.[key]?.rank;
      const botRank = annualTable?.bot ?? annualRatio?.bot;

      // 年平均気温（av_avtemp）のTOPは、島しょ部除外ランキングとの併用（より良い順位を採用）
      if (key === "av_avtemp") {
        const islandRank = annualTable?.island ?? annualRatio?.island;
        if (islandRank != null && islandRank > 0) {
          topRank = topRank != null && topRank > 0 ? Math.min(topRank, islandRank) : islandRank;
        }
      }

      const result = evaluateRank(topRank, botRank, hasHigh, hasLow);
      if (!result) return;

      badges.push({
        metric: key,
        rank: result.rank,
        isHigh: result.isHigh,
        isIsland: _isIsland,
      });
    });

    return badges.sort((a, b) => BadgeValue[a.rank] - BadgeValue[b.rank]);
  },
};

const BadgeValue: Record<BadgeRank, number> = {
  rainbow: 1,
  gold: 2,
  silver: 3,
  bronze: 4,
};
