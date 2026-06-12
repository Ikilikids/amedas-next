import React from "react";
import { FaBuilding } from "react-icons/fa";
import { PiThermometerHotFill } from "react-icons/pi";
import { MetricKey, MetricMeta, MetricTab } from "../utils/metric";
import { RankKey, RankMeta, RankValue } from "../utils/rank";
import { StationId } from "./ids";

export type { StationId } from "./ids";

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

export interface OriginSimilarItem {
  id: StationId;
  similar: number;
}

export type DescriptionData = Record<string, string>;

export type FeatureName = "meteo" | "hot";

export interface RatioInfo {
  metricTab: MetricTab;
  ranking: RankValue;
  isCut: boolean;
}

export interface RankingSidebarConfig {
  metric: MetricMeta;
  rank: RankMeta;
  month: string;
}

// 特徴ごとに必要な割合タブや表示設定を定義
export interface FeatureConfig {
  title: string;
  subTitle: string;
  description: string;
  gradient: string;
  Icon: React.ReactNode;
  ratioTabs: RatioInfo[];
  sideRankings: RankingSidebarConfig[];
}

export const getFeatureConfigs = (): Record<FeatureName, FeatureConfig> => {
  // Check if constants are available to prevent circular dependency crashes
  if (!MetricKey || !RankKey) {
    return {} as any;
  }

  return {
    meteo: {
      title: "気象台まとめ",
      subTitle: "気象台",
      description: "都道府県の代表気象台を比較できます。",
      gradient: "bg-gradient-to-r from-pink-600 to-rose-600",
      Icon: <FaBuilding />,
      ratioTabs: [
        { metricTab: "気温日数", ranking: "meteo", isCut: false },
        { metricTab: "降水日数", ranking: "meteo", isCut: true },
      ],
      sideRankings: (
        [
          "av_avtemp",
          "av_hitemp",
          "sm_rain",
          "sm_snowing",
          "sm_sun",
          "av_wind",
          "hitemp_35",
          "hitemp_30",
          "hitemp_25",
          "lwtemp_0",
          "hitemp_0",
          "lwtemp_25",
          "rain_1",
          "rain_30",
        ] as const
      ).map((mKey) => ({
        metric: MetricKey[mKey],
        rank: RankKey.meteo,
        month: "all",
      })),
    },

    hot: {
      title: "暑い地点まとめ",
      subTitle: "暑い地点",
      description: "夏季に良くニュースになる、暑さで有名な地点をまとめました。",
      gradient: "bg-gradient-to-r from-red-600 to-rose-500",
      Icon: <PiThermometerHotFill />,
      ratioTabs: [{ metricTab: "気温日数", ranking: "island", isCut: true }],
      sideRankings: [
        ...(
          ["hitemp_35", "hitemp_30", "hitemp_25", "lwtemp_25"] as const
        ).map((mKey) => ({
          metric: MetricKey[mKey],
          rank: RankKey.island,
          month: "all",
        })),

        ...(["6", "7", "8", "9"] as const).map((month) => ({
          metric: MetricKey.av_hitemp,
          rank: RankKey.island,
          month,
        })),
      ],
    },
  };
};

// Lazy-initialized constant to break circular dependency issues at module load time
let _featureConfigs: Record<FeatureName, FeatureConfig> | null = null;
export const FEATURE_CONFIGS: Record<FeatureName, FeatureConfig> = new Proxy({} as any, {
  get: (_, prop: FeatureName) => {
    if (!_featureConfigs) {
      _featureConfigs = getFeatureConfigs();
    }
    return _featureConfigs[prop];
  }
});
