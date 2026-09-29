import { METRIC_LIST, MetricKey, MetricValue } from "./metric";

// ==============================
// 1. 型定義
// ==============================
export type AssembleTarget =
  | "overview"
  | "table"
  | "ratio"
  | "uonzu"
  | "stars"
  | "badge";

export type AssembleMeta = {
  key: AssembleTarget;
  label: string;
  description: string;
  metrics: readonly MetricValue[] | MetricValue[];
};

// ==============================
// 2. 定義（本体）
// ==============================
export const AssembleKey: Record<AssembleTarget, AssembleMeta> = {
  uonzu: {
    key: "uonzu",
    label: "雨温図",
    description: "気温・降水・日照・降雪の平年値グラフ",
    metrics: [
      "av_avtemp",
      "sm_rain",
      "av_hitemp",
      "av_lwtemp",
      "sm_sun",
      "sm_snowing",
    ],
  },
  stars: {
    key: "stars",
    label: "気候星評価",
    description: "6大気候指標の★1〜5評価",
    metrics: [
      "av_avtemp",
      "sm_sun",
      "sm_rain",
      "sm_snowing",
      "av_wind",
      "hitemp_35",
    ],
  },
  badge: {
    key: "badge",
    label: "気候バッジ",
    description: "極値・希少性に応じた金銀銅・虹バッジ",
    metrics: [
      "av_avtemp",
      "hitemp_35",
      "sm_rain",
      "sm_sun",
      "sm_snowing",
      "av_wind",
    ],
  },
  overview: {
    key: "overview",
    label: "概況データ",
    description: "主要・平均タブの平年値と全国順位",
    metrics: [
      "av_avtemp",
      "sm_sun",
      "sm_rain",
      "sm_snowing",
      "av_wind",
      "hitemp_35",
    ],
  },
  ratio: {
    key: "ratio",
    label: "割合・日数データ",
    description: "主要・平均以外の月別日数・割合データ",
    metrics: METRIC_LIST.filter((m) => {
      const tab = MetricKey[m]?.tab;
      return tab !== "主要" && tab !== "平均";
    }),
  },
  table: {
    key: "table",
    label: "全項目テーブル",
    description: "全67項目の月別詳細エントリ",
    metrics: METRIC_LIST,
  },
};


/**
 * AssembleTargets で指定されたターゲットに必要な全メトリックを重複なく抽出する
 */
export function resolveRequiredMetrics(targets?: AssembleTarget[]): MetricValue[] {
  // オプションが一切指定されていない場合は全項目
  if (!targets || targets.length === 0) {
    return METRIC_LIST;
  }

  const metricSet = new Set<MetricValue>();

  targets.forEach((target) => {
    AssembleKey[target]?.metrics.forEach((m) => metricSet.add(m));
  });

  return Array.from(metricSet);
}
