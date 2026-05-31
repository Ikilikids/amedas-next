import { MetricKey, MetricMeta } from "../../utils/metric";
import { RankType } from "./types";

export const isCombinationValid = (rank: RankType, key: MetricMeta): boolean => {
  const config = key;

  if (rank === RankType.Island) {
    if (config.category !== "気温") return false;
  }

  if (rank === RankType.Bot) {
    if (config.tab !== "平均" && config.tab !== "主要") return false;
    if (config === MetricKey.sm_snowing) return false;
  }

  return true;
};

export const ISLAND_PREFIXES = [
  "886",
  "887",
  "888",
  "889",
  "4417",
  "442",
  "443",
  "9",
];

export const isIslandId = (id: string): boolean =>
  ISLAND_PREFIXES.some((p) => id.startsWith(p));
