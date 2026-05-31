import { StationData } from "../../types/all";
import { RankValue } from "../../utils/rank";

export type { RankValue as RankType };

interface RawRankingData {
  value: number;
  rank: number;
}
export type RankingData = StationData & RawRankingData;
