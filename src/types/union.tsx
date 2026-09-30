import { FaBuilding } from "react-icons/fa";
import { PiThermometerHotFill } from "react-icons/pi";
import { MetricKey, MetricMeta, MetricTab } from "../setting/metric";
import { RankKey, RankMeta, RankValue } from "../setting/rank";

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

