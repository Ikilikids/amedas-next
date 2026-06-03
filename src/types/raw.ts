import { CategoryValue } from "../utils/category";
import { MetricValue } from "../utils/metric";
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
}

export type RawStationData = {
  id: StationId;
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

export type RawOverviewData = Record<string, RankedValue>;
export type RawUonzuData = Record<string, number[]>;
export type RawTableData = Record<string, MonthlyEntry[]>;
export type RawRatioData = Record<string, MonthlyEntry[]>;

export interface RawBadgeData {
  metric: string;
  rank: BadgeRank;
  isHigh: boolean;
}

export type BadgeRank = "rainbow" | "gold" | "silver" | "bronze";
