import { MonthlyEntry } from "../../../../../types/union";
import { MetricMeta, MetricTab, MetricValue } from "../../../../../setting/metric";
import { RankValue } from "../../../../../setting/rank";
import { RawMonthlyData } from "../../../../../types/raw";

export interface ChartDataItem {
  name: string;
  value: number;
  key: MetricValue;
  rawValue: number;
  originValue: number;
  rank: number | null;
  color: string;
  [key: string]: any;
}

export type ChartType = MetricTab;

export interface RatioWidgetProps {
  ratioData: RawMonthlyData;
  regionColor: string;
  isMeteo: boolean;
  isIsland: boolean;
  stationId: string;
}
