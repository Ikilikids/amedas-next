import { MetricKey } from "../../utils/metric";
import { RankKey, RankValue } from "../../utils/rank";

export const MONTH_DAYS = [31, 28.2, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// MonthlyEntryのプロパティ名と一致するように定義
export const RANK_KEY_MAP: Record<RankValue, string> = {
  top: "top",
  bot: "bot",
  island: "island",
  region: "region",
  pre: "pre",
  meteo: "meteo",
};

export const RANK_OPTIONS_ALL: RankValue[] = Object.keys(RankKey) as RankValue[];

export const CHART_METRICS: Record<string, any[]> = {
  気温日数: [
    {
      metric: MetricKey.hitemp_35,
      chartLabel: "猛暑日",
      color: "rgba(230,40,70,0.8)",
    },
    {
      metric: MetricKey.hitemp_30,
      chartLabel: "真夏日",
      color: "rgba(230,100,40,0.8)",
    },
    {
      metric: MetricKey.hitemp_25,
      chartLabel: "夏日",
      color: "rgba(230,180,40,0.8)",
    },
    {
      metric: null,
      chartLabel: "その他",
      color: "rgba(0,150,100,0.8)",
    },
    {
      metric: MetricKey.lwtemp_0,
      chartLabel: "冬日",
      color: "rgba(0,100,218,0.8)",
    },
    {
      metric: MetricKey.hitemp_0,
      chartLabel: "真冬日",
      color: "rgba(140,50,140,0.8)",
    },
  ],
  降水日数: [
    {
      metric: MetricKey.rain_100,
      chartLabel: "100mm~",
      color: "rgba(10,20,100,1)",
    },
    {
      metric: MetricKey.rain_70,
      chartLabel: "70mm~",
      color: "rgba(20,40,140,1)",
    },
    {
      metric: MetricKey.rain_50,
      chartLabel: "50mm~",
      color: "rgba(40,80,180,1)",
    },
    {
      metric: MetricKey.rain_30,
      chartLabel: "30mm~",
      color: "rgba(60,120,220,1)",
    },
    {
      metric: MetricKey.rain_10,
      chartLabel: "10mm~",
      color: "rgba(80,160,255,1)",
    },
    {
      metric: MetricKey.rain_1,
      chartLabel: "1mm~",
      color: "rgba(120,200,255,1)",
    },
    { metric: null, chartLabel: "~1mm", color: "rgba(169,169,169,1)" },
  ],
  風速日数: [
    {
      metric: MetricKey.wind_30,
      chartLabel: "30m/s~",
      color: "rgba(25,150,25,1)",
    },
    {
      metric: MetricKey.wind_20,
      chartLabel: "20m/s~",
      color: "rgba(50,200,50,1)",
    },
    {
      metric: MetricKey.wind_15,
      chartLabel: "15m/s~",
      color: "rgba(100,220,100,1)",
    },
    {
      metric: MetricKey.wind_10,
      chartLabel: "10m/s~",
      color: "rgba(144,255,144,1)",
    },
    { metric: null, chartLabel: "~10m/s", color: "rgba(169,169,169,1)" },
  ],
  降雪日数: [
    {
      metric: MetricKey.snowing_50,
      chartLabel: "50cm~",
      color: "rgba(50,20,100,1)",
    },
    {
      metric: MetricKey.snowing_20,
      chartLabel: "20cm~",
      color: "rgba(75,30,150,1)",
    },
    {
      metric: MetricKey.snowing_10,
      chartLabel: "10cm~",
      color: "rgba(100,45,200,1)",
    },
    {
      metric: MetricKey.snowing_5,
      chartLabel: "5cm~",
      color: "rgba(140,70,225,1)",
    },
    {
      metric: MetricKey.snowing_3,
      chartLabel: "3cm~",
      color: "rgba(170,100,255,1)",
    },
    { metric: null, chartLabel: "~3cm", color: "rgba(169,169,169,1)" },
  ],
  積雪日数: [
    {
      metric: MetricKey.snowed_100,
      chartLabel: "100cm~",
      color: "rgba(125,30,75,1)",
    },
    {
      metric: MetricKey.snowed_50,
      chartLabel: "50cm~",
      color: "rgba(160,70,110,1)",
    },
    {
      metric: MetricKey.snowed_20,
      chartLabel: "20cm~",
      color: "rgba(200,110,150,1)",
    },
    {
      metric: MetricKey.snowed_10,
      chartLabel: "10cm~",
      color: "rgba(255,140,180,1)",
    },
    {
      metric: MetricKey.snowed_5,
      chartLabel: "5cm~",
      color: "rgba(255,180,220,1)",
    },
    { metric: null, chartLabel: "~5cm", color: "rgba(169,169,169,1)" },
  ],
};
