import { FaBuilding } from "react-icons/fa";
import { FaSatelliteDish } from "react-icons/fa6";
import { PiThermometerHotFill } from "react-icons/pi";
import { TbTemperaturePlus } from "react-icons/tb";
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
  special?: number | null;
}

export interface OriginSimilarItem {
  id: StationId;
  similar: number;
}

export type DescriptionData = Record<string, string>;

export type FeatureName = "meteo" | "special" | "hot" | "warm";

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
    title: "47都道府県まとめ",
    subTitle: "47都道府県",
    description: "都道府県の代表気象台をまとめました。",
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
  special: {
    title: "特別観測所など",
    subTitle: "特別観測所など",
    description: "都道府県代表以外の気象台や特別観測所をまとめました",
    gradient: "bg-gradient-to-r from-orange-600 to-yellow-600",
    Icon: <FaSatelliteDish />,
    ratioTabs: [
      { metricTab: "気温日数", ranking: "special", isCut: false },
      { metricTab: "降水日数", ranking: "special", isCut: true },
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
      rank: RankKey.special,
      month: "all" as const,
    })),
  },

  warm: {
    title: "暖かい地点まとめ",
    subTitle: "暖かい地点",
    description: "暖かい地点をまとめました。主に島嶼部です。",
    gradient: "bg-gradient-to-r from-orange-600 to-amber-500",
    Icon: <TbTemperaturePlus />,
    ratioTabs: [{ metricTab: "気温日数", ranking: "top", isCut: true }],
    uonzuTabs: [MetricKey.sm_rain],
    sideRankings: [
      ...(
        [MetricKey.av_hitemp, MetricKey.hitemp_30, MetricKey.hitemp_25] as const
      ).flatMap((metric) =>
        ([RankKey.top, RankKey.island] as const).map((rank) => ({
          metric,
          rank,
          month: "all" as const,
        }))
      ),
    ],
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
