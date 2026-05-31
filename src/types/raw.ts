import { CategoryValue } from "../utils/category";
import { MetricValue } from "../utils/metric";
import { MonthlyEntry, RankedValue } from "./union";

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
  description?: Record<string, unknown>;
}

export type RawStationData = {
  id: string;
  category: CategoryValue;
  pref: string;
  station_name: string;
} & {
  official_name?: string;
  city?: string;
  height?: number;
  lon?: number;
  lat?: number;
} & { similar?: number };

export type RawOverviewData = Record<MetricValue, RankedValue>;
export type RawUonzuData = Record<MetricValue, number[]>;
export type RawTableData = Record<MetricValue, MonthlyEntry[]>;
export type RawRatioData = Record<MetricValue, MonthlyEntry[]>;

export interface RawBadgeData {
  metric: MetricValue;
  rank: BadgeRank;
  isHigh: boolean;
}

export type BadgeRank = "rainbow" | "gold" | "silver" | "bronze";
