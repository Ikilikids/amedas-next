import { FaBuilding } from "react-icons/fa";
import { PiThermometerHotFill } from "react-icons/pi";
import { MetricKey, MetricMeta, MetricTab } from "../setting/metric";
import { RankKey, RankMeta, RankValue } from "../setting/rank";

export type StationId = string;

export interface RankedValue {
  value: number;
  rank: number;
}

export interface MonthlyEntry {
  value: number;
  top?: number;
  bot?: number;
  island?: number | null;
  region?: number;
  pre?: number;
  meteo?: number | null;
}

export interface RatioInfo {
  metricTab: MetricTab;
  ranking: RankValue;
  isCut: boolean;
}



