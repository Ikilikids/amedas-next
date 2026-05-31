import { MetricKey, MetricMeta } from "../../utils/metric";
import { RankKey, RankMeta } from "../../utils/rank";

export const isCombinationValid = (rank: RankMeta, key: MetricMeta): boolean => {
  const config = key;

  if (rank.key === RankKey.island.key) {
    if (config.category !== "気温") return false;
  }

  if (rank.key === RankKey.bot.key) {
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
