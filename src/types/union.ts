import { IconType } from "react-icons";
import { FaBuilding } from "react-icons/fa";
import { PiThermometerHotFill } from "react-icons/pi";
import { RankType } from "../components/LayeredPieChart/types";
import { MetricTab } from "../utils/metric";

export interface RankedValue {
  value: number;
  rank: number;
}

export interface MonthlyEntry {
  value: number;
  top: number;
  bot: number;
  island?: number;
  region: number;
  pre: number;
  meteo?: number;
}

export interface OriginSimilarItem {
  id: string;
  similar: number;
}

export type DescriptionData = Record<string, string>;

export type FeatureName = "meteo" | "hot";

export interface RatioInfo {
  metricTab: MetricTab;
  ranking: RankType;
  isCut: boolean;
}

// 特徴ごとに必要な割合タブや表示設定を定義
export interface FeatureConfig {
  title: string;
  subTitle: string;
  description: string;
  gradient: string;
  Icon: IconType;
  ratioTabs: RatioInfo[];
}

export const FEATURE_CONFIGS: Record<FeatureName, FeatureConfig> = {
  meteo: {
    title: "気象台まとめ",
    subTitle: "気象台",
    description: "都道府県の代表気象台を比較できます。",
    gradient: "from-blue-600 to-indigo-700",
    Icon: FaBuilding,
    ratioTabs: [
      { metricTab: "気温日数", ranking: "気象台", isCut: false },
      { metricTab: "降水日数", ranking: "気象台", isCut: true },
    ],
  },
  hot: {
    title: "暑い地点まとめ",
    subTitle: "暑い地点",
    description: "夏季に良くニュースになる、暑さで有名な地点をまとめました。",
    gradient: "from-red-600 to-rose-700",
    Icon: PiThermometerHotFill,
    ratioTabs: [{ metricTab: "気温日数", ranking: "島除く", isCut: true }],
  },
};
