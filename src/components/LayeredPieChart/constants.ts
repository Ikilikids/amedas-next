import { MetricKey } from "../../setting/metric";
import { RankKey, RankValue } from "../../setting/rank";

export const MONTH_DAYS = [31, 28.2, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const RANK_OPTIONS_ALL: RankValue[] = Object.keys(
  RankKey
) as RankValue[];

// Derive chart schemas from MetricKey using chartOrder
const allMetrics = Object.values(MetricKey);

const getChartSchema = (tabName: string) =>
  allMetrics
    .filter((m) => m.tab === tabName && m.chartOrder !== undefined)
    .sort((a, b) => (a.chartOrder ?? 0) - (b.chartOrder ?? 0))
    .map((m, i) => ({
      metric: m,
      chartLabel: m.label,
      color: m.color,
    }));

export const CHART_METRICS: Record<string, any[]> = {
  気温日数: getChartSchema("気温日数"),
  降水日数: getChartSchema("降水日数"),
  風速日数: getChartSchema("風速日数"),
  降雪日数: getChartSchema("降雪日数"),
  積雪日数: getChartSchema("積雪日数"),
};
