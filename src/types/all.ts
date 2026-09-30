import { CategoryMeta } from "../setting/category";
import { MetricMeta } from "../setting/metric";
import { PrefMeta } from "../setting/pref";
import { AreaMeta } from "../setting/area";
import { MonthlyEntry, StationId } from "./union";
import { StationSort } from "./raw";

export type SimilarStationData = StationData & {
  similar?: number;
};

export type OtherStations = Partial<Record<StationSort, SimilarStationData[]>>;

export type AllData = {
  station: StationData;
  climateData?: MonthlyData;
  otherStations?: OtherStations;
};

export type StationData = {
  id: StationId;
  category: CategoryMeta;
  pref: PrefMeta;
  station_name: string;
  official_name?: string;
  city?: string;
  area?: AreaMeta;
  height?: number;
  lon?: number;
  lat?: number;
};

export type MonthlyData = Map<MetricMeta, (MonthlyEntry | null)[]>;
