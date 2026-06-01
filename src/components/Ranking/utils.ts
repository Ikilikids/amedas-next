import { MetricKey, MetricMeta } from "../../utils/metric";
import { RankKey, RankMeta } from "../../utils/rank";

export const isCombinationValid = (
  rank: RankMeta,
  key: MetricMeta
): boolean => {
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
