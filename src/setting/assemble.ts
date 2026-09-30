import { METRIC_LIST, MetricKey, MetricValue } from "./metric";

export type AssembleTarget = "overview" | "table" | "ratio" | "uonzu";
export type RankDepth = "none" | "topBot" | "full";

export interface AssembleMeta {
  key: AssembleTarget;
  label: string;
  isAnnualOnly: boolean;
  rankDepth: RankDepth;
  getMetrics: () => MetricValue[];
}

export const AssembleKey: Record<AssembleTarget, AssembleMeta> = {
  uonzu: {
    key: "uonzu",
    label: "雨温図",
    isAnnualOnly: false,
    rankDepth: "none",
    getMetrics: () => [
      "av_avtemp",
      "sm_rain",
      "av_hitemp",
      "av_lwtemp",
      "sm_sun",
      "sm_snowing",
    ],
  },
  table: {
    key: "table",
    label: "気候表",
    isAnnualOnly: false,
    rankDepth: "full",
    getMetrics: () => [
      "av_avtemp",
      "sm_rain",
      "av_hitemp",
      "av_lwtemp",
      "sm_sun",
      "sm_snowing",
      "av_wind",
    ],
  },
  ratio: {
    key: "ratio",
    label: "割合・日数データ",
    isAnnualOnly: false,
    rankDepth: "full",
    getMetrics: () =>
      METRIC_LIST.filter((m) => {
        const tab = MetricKey[m]?.tab;
        const isDaysTab =
          tab &&
          [
            "気温日数",
            "降水日数",
            "降雪日数",
            "積雪日数",
            "風速日数",
          ].includes(tab);
        return !!isDaysTab;
      }),
  },
  overview: {
    key: "overview",
    label: "概況・看板",
    isAnnualOnly: true,
    rankDepth: "topBot",
    getMetrics: () =>
      METRIC_LIST.filter((m) => {
        const tab = MetricKey[m]?.tab;
        return tab === "主要" || tab === "平均" || m === "hitemp_35";
      }),
  },
};
