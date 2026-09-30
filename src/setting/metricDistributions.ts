import { MetricValue } from "./metric";

export type MetricDistribution = {
  min: number;
  max: number;
  binWidth: number;
  bins: readonly number[];
  totalCount: number;
};

export const METRIC_DISTRIBUTIONS: Partial<Record<MetricValue, MetricDistribution>> = {
  av_avtemp: {
    min: 4, max: 25, binWidth: 0.88, totalCount: 904,
    bins: [23, 52, 77, 62, 50, 51, 61, 77, 74, 65, 80, 84, 92, 100, 81, 52, 32, 17, 10, 17, 23, 27, 33, 21],
  },
  sm_rain: {
    min: 700, max: 4000, binWidth: 137.5, totalCount: 1230,
    bins: [35, 51, 75, 97, 100, 91, 93, 84, 77, 81, 78, 64, 57, 51, 42, 49, 38, 35, 38, 21, 19, 15, 9, 21],
  },
  sm_sun: {
    min: 1100, max: 2400, binWidth: 54.17, totalCount: 827,
    bins: [12, 0, 27, 34, 51, 70, 74, 92, 79, 80, 82, 100, 93, 91, 83, 99, 97, 88, 77, 65, 51, 38, 17, 12],
  },
  sm_snowing: {
    min: 0, max: 1400, binWidth: 58.33, totalCount: 320,
    bins: [100, 63, 78, 71, 73, 76, 71, 67, 76, 74, 76, 58, 56, 58, 51, 54, 43, 16, 32, 16, 23, 36, 16, 23],
  },
  av_wind: {
    min: 0, max: 7, binWidth: 0.29, totalCount: 874,
    bins: [0, 15, 39, 65, 86, 99, 96, 100, 76, 52, 56, 60, 52, 37, 44, 29, 38, 28, 27, 22, 18, 13, 13, 20],
  },
  hitemp_35: {
    min: 0, max: 20, binWidth: 0.83, totalCount: 904,
    bins: [100, 44, 40, 33, 29, 29, 29, 22, 24, 19, 21, 18, 17, 12, 12, 10, 12, 14, 15, 14, 8, 7, 5, 11],
  },
};
