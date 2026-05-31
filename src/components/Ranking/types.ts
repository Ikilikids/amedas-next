import { StationData } from "../../types/all";

export const RankType = {
  Top: "top",
  Bot: "bot",
  Island: "island",
  Region: "region",
  Pre: "pre",
  Meteo: "meteo",
} as const;

export type RankType = (typeof RankType)[keyof typeof RankType];

export const rankTypes = {
  [RankType.Top]: { label: "上位100地点" },
  [RankType.Bot]: { label: "下位100地点" },
  [RankType.Island]: { label: "島嶼部を除く" },
  [RankType.Region]: { label: "地域別" },
  [RankType.Pre]: { label: "県別" },
  [RankType.Meteo]: { label: "気象台のみ" },
} as const;

interface RawRankingData {
  value: number;
  rank: number;
}
export type RankingData = StationData & RawRankingData;
