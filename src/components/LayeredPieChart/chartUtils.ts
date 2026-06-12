import { MonthlyEntry, RatioInfo } from "../../types/union";
import { MetricMeta } from "../../utils/metric";
import { RankValue } from "../../utils/rank";
import { CHART_METRICS, MONTH_DAYS } from "./constants";
import { ChartDataItem, ChartType } from "./types";

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
    // 6つのデータが必要: 猛暑日, 真夏日, 夏日, その他, 冬日, 真冬日
    // 不足している場合は 0 で埋める
    const safeV = [
      v[0] ?? 0,
      v[1] ?? 0,
      v[2] ?? 0,
      v[3] ?? 0,
      v[4] ?? 0,
      v[5] ?? 0,
    ];
    layered.push(safeV[0]); // 猛暑日
    layered.push(Math.max(0, safeV[1] - safeV[0])); // 真夏日
    layered.push(Math.max(0, safeV[2] - safeV[1])); // 夏日
    layered.push(Math.max(0, monthDays - safeV[2] - safeV[4])); // その他
    layered.push(Math.max(0, safeV[4] - safeV[5])); // 冬日
    layered.push(safeV[5]); // 真冬日
  } else {
    if (v.length === 0) return [];
    layered.push(v[0]);
    for (let i = 1; i < v.length - 1; i++) {
      layered.push(Math.max(0, v[i] - v[i - 1]));
    }
    // 最後のスライス (例: ~1mm)
    if (v.length > 1) {
      layered.push(Math.max(0, monthDays - v[v.length - 2]));
    } else {
      layered.push(Math.max(0, monthDays - v[0]));
    }
  }
  return layered;
}

export function prepareChartData(
  tabRecords: Map<MetricMeta, MonthlyEntry[]> | null,
  ratioInfo: RatioInfo,
  month: number | null = null,
  rankType: RankValue = "top"
): ChartDataItem[] | null {
  if (!ratioInfo || !ratioInfo.metricTab) return null;
  const schema = CHART_METRICS[ratioInfo.metricTab];
  if (!schema || !Array.isArray(schema) || schema.length === 0) return null;

  const currentRankKey = rankType;
  let targetIdx = month !== null ? month - 1 : 12;

  // Resolve raw data based on schema
  const raw = schema.map((s) => {
    if (!s || !s.metric) return null;
    const meta = s.metric as MetricMeta;
    if (!meta || !meta.key) return null;

    // 仮想メトリクス（その他、〜1mmなどデータファイルがないもの）の判定
    const isVirtual =
      meta.key === "temp_other" ||
      (meta.key.endsWith("_0") &&
        meta.key !== "lwtemp_0" &&
        meta.key !== "hitemp_0");

    const entries = isVirtual ? null : tabRecords?.get(meta);

    // データが1つしかない場合（SSG最適化時など）は、それを選択する
    if (entries && entries.length === 1) {
      targetIdx = 0;
    }
    const entry = entries && entries[targetIdx] ? entries[targetIdx] : null;

    return {
      label: s.chartLabel || meta.label || "不明",
      color: s.color || meta.color || "#cccccc",
      value: entry?.value ?? (isVirtual ? null : 0),
      rank: entry && currentRankKey
        ? (entry[currentRankKey as keyof MonthlyEntry] as number)
        : null,
      key: meta.key,
    };
  }).filter((r): r is NonNullable<typeof r> => r !== null);

  if (raw.length === 0) return null;

  const monthDays = month && month >= 1 && month <= 12 ? MONTH_DAYS[month - 1] : 365;
  const layeredValues = computeLayeredValues(
    raw.map((r) => r.value),
    ratioInfo.metricTab,
    monthDays
  );

  // layeredValues と raw の長さが一致しない場合に備えて、短い方に合わせる
  const resultLen = Math.min(raw.length, layeredValues.length);
  const total = layeredValues.reduce((a, b) => a + b, 0) || 1;

  return layeredValues.slice(0, resultLen).map((v, i) => {
    const r = raw[i];
    if (!r) return null;
    
    return {
      name: r.label,
      value: (v / total) * 100,
      key: r.key,
      rawValue: v, // Use the calculated slice value
      originValue: r.value ?? v, // 引き算する前の元の値（存在しない場合は計算値を設定）
      rank: r.rank,
      color: r.color,
    };
  }).filter((r): r is NonNullable<typeof r> => r !== null);
}
