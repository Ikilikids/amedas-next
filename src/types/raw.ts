import { CategoryValue } from "../utils/category";
import { DescriptionData, MonthlyEntry, RankedValue, StationId } from "./union";

export interface RawData {
  station: RawStationData;
  overview?: RawOverviewData;
  uonzu?: RawUonzuData;
  table?: RawTableData;
  ratio?: RawRatioData;
  similarAll?: RawStationData[];
  similarMeteo?: RawStationData[];
  sameStations?: RawStationData[];
  meteoStations?: RawStationData[];
  badge?: RawBadgeData[];
  description?: DescriptionData;
  history?: RawHistoryData[];
  stats?: RawStatusData;
}

export type RawStationData = {
  id?: StationId;
  category?: CategoryValue;
  pref?: string;
  station_name?: string;
} & {
  official_name?: string;
  city?: string;
  height?: number;
  lon?: number;
  lat?: number;
} & { similar?: number };

export type RawOverviewData = Record<string, RankedValue>;
export type RawUonzuData = Record<string, number[]>;
export type RawTableData = Record<string, MonthlyEntry[]>;
export type RawRatioData = Record<string, MonthlyEntry[]>;
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

export interface RawBadgeData {
  metric: string;
  rank: BadgeRank;
  isHigh: boolean;
}

export type BadgeRank = "rainbow" | "gold" | "silver" | "bronze";
