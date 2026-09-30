import { CategoryValue } from "../setting/category";
import { MetricValue } from "../setting/metric";
import { MonthlyEntry, RankedValue, StationId } from "./union";

export type StationSort =
  | "similarAll"
  | "similarMeteo"
  | "sameStations"
  | "meteoStations";

export type RawSimilarStationData = RawStationData & {
  similar?: number;
};

export type RawOtherStations = Partial<Record<StationSort, RawSimilarStationData[]>>;

export type RawData = {
  station: RawStationData;
  climateData?: RawMonthlyData;
  otherStations?: RawOtherStations;
};

export type StationLiveData = {
  history: RawHistoryData[];
  stats: RawStatusData | null;
  lastUpdate?: string;
};

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



export type RawMonthlyData = Partial<Record<MetricValue, MonthlyEntry[]>>;
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
