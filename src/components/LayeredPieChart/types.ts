import { MonthlyEntry } from "../../types/union";
import { MetricMeta, MetricTab, MetricValue } from "../../utils/metric";

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
}

export type RankType =
  | "降順"
  | "昇順"
  | "島除く"
  | "地方別"
  | "県別"
  | "気象台";

export type ChartType = MetricTab;
