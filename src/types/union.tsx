import { FaBuilding } from "react-icons/fa";
import { PiThermometerHotFill } from "react-icons/pi";
import { MetricKey, MetricMeta, MetricTab } from "../utils/metric";
import { RankKey, RankMeta, RankValue } from "../utils/rank";

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
  uonzuTabs: MetricMeta[]; // 追加: 気温図で選択可能なタブ
  sideRankings: RankingSidebarConfig[];
}

export const FEATURE_CONFIGS: Record<FeatureName, FeatureConfig> = {
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
    uonzuTabs: [MetricKey.sm_rain, MetricKey.sm_snowing, MetricKey.sm_sun],
    sideRankings: (
      [
        MetricKey.av_avtemp,
        MetricKey.av_hitemp,
        MetricKey.sm_rain,
        MetricKey.sm_snowing,
        MetricKey.sm_sun,
        MetricKey.av_wind,
        MetricKey.hitemp_35,
        MetricKey.hitemp_30,
        MetricKey.hitemp_25,
        MetricKey.lwtemp_0,
        MetricKey.hitemp_0,
        MetricKey.lwtemp_25,
        MetricKey.rain_1,
        MetricKey.rain_30,
      ] as const
    ).map((metric) => ({
      metric,
      rank: RankKey.meteo,
      month: "all" as const,
    })),
  },

  hot: {
    title: "暑い地点まとめ",
    subTitle: "暑い地点",
    description: "夏季に良くニュースになる、暑さで有名な地点をまとめました。",
    gradient: "bg-gradient-to-r from-red-600 to-rose-500",
    Icon: <PiThermometerHotFill />,
    ratioTabs: [{ metricTab: "気温日数", ranking: "island", isCut: true }],
    uonzuTabs: [],
    sideRankings: [
      ...(
        [
          MetricKey.hitemp_35,
          MetricKey.hitemp_30,
          MetricKey.hitemp_25,
          MetricKey.lwtemp_25,
        ] as const
      ).map((metric) => ({
        metric,
        rank: RankKey.island,
        month: "all" as const,
      })),

      ...(["6", "7", "8", "9"] as const).map((month) => ({
        metric: MetricKey.av_hitemp,
        rank: RankKey.island,
        month,
      })),
    ],
  },
};
