import { RawMonthlyData } from "../../../../../../types/raw";
import { MonthlyEntry } from "../../../../../../types/union";
import { MonthKey } from "../../../../../../setting/month";
import { MetricMeta } from "../../../../../../setting/metric";
import { RankValue } from "../../../../../../setting/rank";

export interface HyouRowData {
  val: string | number;
  rank: string | number;
}

export interface MonthOption {
  slug: string;
  label: string;
}

export const MONTH_OPTIONS: MonthOption[] = Object.values(MonthKey).map((m) => ({
  slug: m.key,
  label: m.label,
}));

function mixColor(c1: string, c2: string, t: number): string {
  const rgb1 = c1.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const rgb2 = c2.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
  return `rgb(${r},${g},${b})`;
}

export function getColor(
  label: string,
  val: string | number,
  isAnnual: boolean = false
): string {
  if (val === "--" || isNaN(Number(val))) return "white";
  const v = Number(val);

  let min: number, mid: number, max: number;
  let colors: string[];

  if (label.includes("気温")) {
    min = -15;
    mid = 10;
    max = 35;
    colors = ["rgb(100,180,255)", "rgb(255,255,255)", "rgb(255,70,70)"];
  } else if (label.includes("降水")) {
    if (isAnnual) {
      min = 0;
      mid = 1600;
      max = 4600;
    } else {
      min = 0;
      mid = 200;
      max = 1000;
    }
    colors = ["rgb(255,255,255)", "rgb(120,180,255)", "rgb(100,80,255)"];
  } else if (label.includes("降雪") || label.includes("積雪")) {
    if (isAnnual) {
      min = 0;
      mid = 450;
      max = 1700;
    } else {
      min = 0;
      mid = 50;
      max = 450;
    }
    colors = ["rgb(255,255,255)", "rgb(200,160,255)", "rgb(234,80,147)"];
  } else if (label.includes("日照")) {
    if (isAnnual) {
      min = 0;
      mid = 1800;
      max = 2800;
    } else {
      min = 0;
      mid = 150;
      max = 300;
    }
    colors = ["rgb(220,220,220)", "rgb(255,255,130)", "rgb(255,180,50)"];
  } else if (label.includes("風速")) {
    min = 0;
    mid = 3;
    max = 10;
    colors = ["rgb(255,255,255)", "rgb(175,255,200)", "rgb(50,255,75)"];
  } else {
    return "white";
  }

  let t;
  if (v <= mid) {
    t = (v - min) / (mid - min);
    return mixColor(colors[0], colors[1], t);
  } else {
    t = (v - mid) / (max - mid);
    return mixColor(colors[1], colors[2], t);
  }
}

const getIndexFromSlug = (slug: string): number => {
  if (slug === "all") return 12;
  return parseInt(slug) - 1;
};

export const mapValueRank = (
  meta: MetricMeta,
  tableData: RawMonthlyData | undefined,
  rankValue: RankValue
): HyouRowData[] => {
  if (!tableData) return MONTH_OPTIONS.map(() => ({ val: "--", rank: "--" }));

  const isSnow = meta.unit === "cm";
  const entries = tableData[meta.key] || [];
  return MONTH_OPTIONS.map((m) => {
    const idx = getIndexFromSlug(m.slug);
    const entry: MonthlyEntry | undefined = entries[idx];
    let val: string | number = entry?.value ?? "--";
    if (typeof val === "number" && !isSnow) val = val.toFixed(1);

    let rank: string | number = entry ? entry[rankValue] ?? "--" : "--";

    return { val, rank };
  });
};
