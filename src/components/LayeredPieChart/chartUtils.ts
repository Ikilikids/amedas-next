import { MonthlyEntry, RatioInfo } from "../../types/union";
import { MetricMeta } from "../../utils/metric";
import { RankValue } from "../../utils/rank";
import { CHART_METRICS, MONTH_DAYS } from "./constants";
import { ChartDataItem, ChartType } from "./types";

export function colorWithAlpha(color: string, alpha: number = 0.8): string {
  if (color.startsWith("rgba")) return color.replace(/[^,]+(?=\))/, `${alpha}`);
  const bigint = parseInt(color.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
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
  tabRecords: Map<MetricMeta, MonthlyEntry[]> | null,
  ratioInfo: RatioInfo,
  month: number | null = null,
  rankType: RankValue = "top"
): ChartDataItem[] | null {
  const schema = CHART_METRICS[ratioInfo.metricTab];
  if (!tabRecords || !schema) return null;

  const currentRankKey = rankType;
  let targetIdx = month !== null ? month - 1 : 12;

  // Resolve raw data based on schema
  const raw = schema.map((s) => {
    const isVirtual = !!s.key;
    const meta = isVirtual ? null : (s.metric as MetricMeta);
    const entries = meta ? tabRecords.get(meta) : null;

    // データが1つしかない場合（SSG最適化時など）は、それを選択する
    if (entries && entries.length === 1) {
      targetIdx = 0;
    }
    const entry = entries ? entries[targetIdx] : null;

    return {
      label: s.chartLabel,
      color: s.color,
      value: entry?.value ?? (meta ? 0 : null),
      rank: entry
        ? (entry[currentRankKey as keyof MonthlyEntry] as number)
        : null,
      key: isVirtual ? s.key : meta?.key,
    };
  });

  const hasAnyData = raw.some((x) => x.value !== null && x.value > 0);
  if (!hasAnyData && ratioInfo.metricTab !== "気温日数") return null;

  const monthDays = month ? MONTH_DAYS[month - 1] : 365;
  const layeredValues = computeLayeredValues(
    raw.map((r) => r.value),
    ratioInfo.metricTab,
    monthDays
  );

  const total = layeredValues.reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  return layeredValues.map((v, i) => {
    const r = raw[i];
    return {
      name: r.label,
      value: (v / total) * 100,
      key: r.key,
      rawValue: v, // Use the calculated slice value
      originValue: r.value ?? v, // 引き算する前の元の値（存在しない場合は計算値を設定）
      rank: r.rank,
      color: r.color,
    };
  });
}
