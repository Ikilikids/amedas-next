import { MonthlyEntry, RatioInfo } from "../../../../../types/union";
import { MetricKey, MetricMeta, MetricTab } from "../../../../../setting/metric";
import { RankValue } from "../../../../../setting/rank";
import { RawMonthlyData } from "../../../../../types/raw";
import { CHART_METRICS, MONTH_DAYS } from "./constants";
import { ChartDataItem, ChartType } from "./types";

const BASE_RANK_VALUES: RankValue[] = ["top", "bot", "region", "pre"];

export interface RatioTypeOption {
  key: ChartType;
  label: string;
  color: string;
}

export function colorWithAlpha(color: string, alpha: number = 0.8): string {
  const hexAlpha = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return color.slice(0, 7) + hexAlpha;
}

function computeLayeredValues(
  rawValues: (number | null)[],
  type: ChartType,
  monthDays: number = 365
): number[] {
  const layered: number[] = [];
  const v = rawValues.map((val) => val ?? 0);

  if (type === "気温日数") {
    layered.push(v[0]); // 猛暑日
    layered.push(v[1] - v[0]); // 真夏日
    layered.push(v[2] - v[1]); // 夏日
    layered.push(monthDays - v[2] - v[4]); // その他
    layered.push(v[4] - v[5]); // 冬日
    layered.push(v[5]); // 真冬日
  } else {
    layered.push(v[0]);
    for (let i = 1; i < v.length - 1; i++) {
      layered.push(v[i] - v[i - 1]);
    }
    layered.push(monthDays - v[v.length - 2]);
  }
  return layered;
}

export function prepareChartData(
  tabRecords: RawMonthlyData | null,
  ratioInfo: RatioInfo,
  month: number | null = null,
  rankType: RankValue = "top"
): ChartDataItem[] | null {
  const schema = CHART_METRICS[ratioInfo.metricTab];
  if (!tabRecords || !schema) return null;

  const currentRankKey = rankType;
  let targetIdx = month !== null ? month - 1 : 12;

  const raw = schema.map((s) => {
    const meta = s.metric as MetricMeta;
    const isVirtual =
      meta.key === "temp_other" ||
      (meta.key.endsWith("_0") &&
        meta.key !== "lwtemp_0" &&
        meta.key !== "hitemp_0");

    const entries = isVirtual ? null : tabRecords[meta.key];

    if (entries && entries.length === 1) {
      targetIdx = 0;
    }
    const entry = entries ? entries[targetIdx] : null;

    return {
      label: s.chartLabel,
      color: s.color,
      value: entry?.value ?? (isVirtual ? null : 0),
      rank: entry
        ? (entry[currentRankKey as keyof MonthlyEntry] as number)
        : null,
      key: meta.key,
    };
  });

  const monthDays = month ? MONTH_DAYS[month - 1] : 365;
  const layeredValues = computeLayeredValues(
    raw.map((r) => r.value),
    ratioInfo.metricTab,
    monthDays
  );

  const total = layeredValues.reduce((a, b) => a + b, 0);

  return layeredValues.map((v, i) => {
    const r = raw[i];
    return {
      name: r.label,
      value: (v / total) * 100,
      key: r.key,
      rawValue: v,
      originValue: r.value ?? v,
      rank: r.rank,
      color: r.color,
    };
  });
}

export function getRatioTypeOptions(ratioData: RawMonthlyData): RatioTypeOption[] {
  const tabs = new Set(
    Object.keys(ratioData)
      .map((k) => MetricKey[k]?.tab)
      .filter(Boolean)
  );
  return Object.keys(CHART_METRICS)
    .filter((p) => tabs.has(p as MetricTab))
    .map((tab) => {
      const label = tab.replace("日数", "");
      const schema = CHART_METRICS[tab];
      const baseMetric = schema?.[tab === "気温日数" ? 0 : 2]?.metric as MetricMeta;
      const baseColor = baseMetric?.color;

      return {
        key: tab as ChartType,
        label,
        color: baseColor,
      };
    });
}

export function getRatioRankOptions(
  ratioData: RawMonthlyData,
  isMeteo: boolean,
  isIsland: boolean
): RankValue[] {
  const rankValues = new Set<RankValue>(BASE_RANK_VALUES);
  if (isMeteo) rankValues.add("meteo");
  if (!isIsland && ratioData?.av_avtemp) {
    rankValues.add("island");
  }
  return Array.from(rankValues);
}
