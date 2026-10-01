import { MetricKey, MetricMeta } from "../../../../../../setting/metric";

export interface HistoryEntry {
  date: string;
  hi: number | null;
  lw: number | null;
  rain: number | null;
}

export const getDayConditionMetrics = (
  hi: number | null,
  lw: number | null,
  rain: number | null
): {
  hiMetric: MetricMeta | null;
  lwMetric: MetricMeta | null;
  rainMetric: MetricMeta | null;
} => {
  let hiMetric: MetricMeta | null = null;
  let lwMetric: MetricMeta | null = null;
  let rainMetric: MetricMeta | null = null;

  if (hi !== null) {
    if (hi >= 35) hiMetric = MetricKey.hitemp_35;
    else if (hi >= 30) hiMetric = MetricKey.hitemp_30;
    else if (hi >= 25) hiMetric = MetricKey.hitemp_25;
    else if (hi < 0) hiMetric = MetricKey.hitemp_0;
  }

  if (lw !== null) {
    if (lw >= 25) lwMetric = MetricKey.lwtemp_25;
    else if (lw < 0) lwMetric = MetricKey.lwtemp_0;
  }

  if (rain !== null && rain > 0) {
    if (rain >= 100) rainMetric = MetricKey.rain_100;
    else if (rain >= 50) rainMetric = MetricKey.rain_50;
    else rainMetric = MetricKey.rain_1;
  }

  return { hiMetric, lwMetric, rainMetric };
};
