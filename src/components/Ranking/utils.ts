import { MetricCategory, MetricKey, MetricTab, metrics } from "../../utils/colorUtils";
import { RankType } from "./types";

export const isCombinationValid = (rank: RankType, key: MetricKey): boolean => {
  const config = metrics[key];

  if (rank === RankType.Island) {
    if (config.category !== MetricCategory.Temp) return false;
  }

  if (rank === RankType.Bot) {
    if (config.tab !== MetricTab.Avg && config.tab !== MetricTab.Main)
      return false;
    if (key === MetricKey.Sm_Snowing) return false;
  }

  return true;
};

export const ISLAND_PREFIXES = ["886", "887", "888", "889", "4417", "442", "443", "9"];

export const isIslandId = (id: string): boolean =>
  ISLAND_PREFIXES.some((p) => id.startsWith(p));
