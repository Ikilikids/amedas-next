import { CategoryValue } from "../setting/category";
import { MetricValue } from "../setting/metric";
import { MonthlyEntry, StationId } from "./union";

// jsonから読み込むデータ型
export type RawData = {
  station: RawStationData; // A. アメダス地点の基本情報
  climateData?: RawMonthlyData; // B. 月別気候データ
  otherStations?: RawOtherStations; // C. 類似地点データ
};

// A. 基本情報
export type RawStationData = {
  id?: StationId;
  category?: CategoryValue;
  pref?: string;
  station_name?: string;
  official_name?: string;
  city?: string;
  area?: string;
  height?: number;
  lon?: number;
  lat?: number;
}

// B. 月別気候データ
export type RawMonthlyData = Partial<Record<MetricValue, MonthlyEntry[]>>;

// C. 類似地点データ
export type RawOtherStations = Partial<Record<StationSort, RawSimilarStationData[]>>;

export type StationSort =
  | "similarAll"
  | "similarMeteo"
  | "sameStations"
  | "meteoStations";

export type RawSimilarStationData = RawStationData & {
  similar?: number;
};





export type StationLiveData = {
  history: RawHistoryData[];
  stats: RawStatusData | null;
  lastUpdate?: string;
};





export interface RawHistoryData {
  date: string;
  hi: number | null;
  lw: number | null;
  rain: number | null;
}

export interface RawStatusData {
  hitemp_40?: number;
  hitemp_35?: number;
  hitemp_30?: number;
  hitemp_25?: number;
  hitemp_0?: number;
  max_hitemp?: number;
  lwtemp_25?: number;
  lwtemp_0?: number;
  min_lwtemp?: number;
  sm_rain?: number;
}

export type BadgeRank = "rainbow" | "gold" | "silver" | "bronze";
