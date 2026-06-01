import { StationData } from "../../types/all";
import { RawStationData } from "../../types/raw";

export interface RankingItem {
  id?: string;
  value: number;
  rank?: number;
  time?: string | null;
}

// ISR/Propsでも渡せる「純粋なデータ」型
export type RawRankingData = RawStationData & RankingItem;

// コンポーネント内でアイコン等を復元した「リッチな」型
export type RankingData = StationData & RankingItem;
