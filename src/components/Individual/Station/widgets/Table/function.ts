import { RankValue } from "../../../../../setting/rank";
import { RawMonthlyData } from "../../../../../types/raw";

const BASE_RANK_VALUES: RankValue[] = ["top", "bot", "region", "pre"];

export function getTableRankOptions(
  tableData: RawMonthlyData,
  isMeteo: boolean,
  isIsland: boolean
): RankValue[] {
  const rankValues = new Set<RankValue>(BASE_RANK_VALUES);

  if (isMeteo) rankValues.add("meteo");
  if (!isIsland && tableData?.av_avtemp) {
    rankValues.add("island");
  }

  return Array.from(rankValues);
}
