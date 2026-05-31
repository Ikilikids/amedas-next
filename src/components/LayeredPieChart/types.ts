import { MonthlyEntry } from "../../types/union";
import { MetricMeta, MetricTab, MetricValue } from "../../utils/metric";
import { RankValue } from "../../utils/rank";

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

export interface LayeredPieChartProps {
  ratioData: Map<MetricMeta, MonthlyEntry[]>;
  layout?: "horizontal" | "vertical";
  rankType?: RankValue;
  selectedMonth?: string | null;
  ratioInfo?: any;
}

export type ChartType = MetricTab;
