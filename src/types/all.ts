import { CategoryMeta } from "../utils/category";
import { MetricMeta } from "../utils/metric";
import { PrefMeta } from "../utils/pref";
import { BadgeRank } from "./raw";
import { DescriptionData, MonthlyEntry, RankedValue } from "./union";

export interface AllData {
  station: StationData;
  overview?: OverviewData;
  uonzu?: UonzuData;
  table?: TableData;
  ratio?: RatioData;
  similarAll?: StationData[];
  similarMeteo?: StationData[];
  sameStations?: StationData[];
  meteoStations?: StationData[];
  badge?: BadgeData[];
  description?: DescriptionData;
}

export type StationData = {
  id: string;
  category: CategoryMeta;
  pref: PrefMeta;
  station_name: string;
} & {
  official_name?: string;
  city?: string;
  height?: number;
  lon?: number;
  lat?: number;
} & { similar?: number };

export type OverviewData = Map<MetricMeta, RankedValue>;
export type UonzuData = Map<MetricMeta, number[]>;
export type TableData = Map<MetricMeta, MonthlyEntry[]>;
export type RatioData = Map<MetricMeta, MonthlyEntry[]>;

export interface BadgeData {
  metric: MetricMeta;
  rank: BadgeRank;
  isHigh: boolean;
}
