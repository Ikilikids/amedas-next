import { RawStationData } from "../../../types/raw";

export interface RankingItem {
  id?: string;
  value: number;
  rank?: number;
  time?: string | null;
}

export type RawRankingData = RawStationData & RankingItem;
export type RankingData = RawRankingData;
