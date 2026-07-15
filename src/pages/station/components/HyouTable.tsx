import React from "react";
import { TableData } from "../../../types/all";
import { MonthlyEntry } from "../../../types/union";
import { MonthMap } from "../../../utils/colorUtils";
import { MetricKey, MetricMeta } from "../../../setting/metric";
import { RankValue } from "../../../setting/rank";

// ==============================
// Types
// ==============================
interface HyouTableProps {
  tableData?: TableData;
  rankValue: RankValue;
}

interface HyouRowData {
  val: string | number;
  rank: string | number;
}

interface MonthOption {
  slug: string;
  label: string;
}

// ==============================
// Helpers
// ==============================

function mixColor(c1: string, c2: string, t: number): string {
  const rgb1 = c1.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const rgb2 = c2.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
  return `rgb(${r},${g},${b})`;
}

function getColor(
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

// ==============================
// Component
// ==============================
const HyouTable: React.FC<HyouTableProps> = ({ tableData, rankValue }) => {
  const months: MonthOption[] = Object.entries(MonthMap).map(
    ([slug, label]) => ({
      slug,
      label,
    })
  );

  const emptyMonthlyData = (): HyouRowData[] =>
    months.map(() => ({ val: "--", rank: "--" }));

  const getIndexFromSlug = (slug: string): number => {
    if (slug === "all") return 12;
    return parseInt(slug) - 1;
  };

  const mapValueRank = (meta: MetricMeta): HyouRowData[] => {
    if (!tableData) return emptyMonthlyData();

    const isSnow = meta.unit === "cm";
    const entries = tableData.get(meta) || [];
    return months.map((m) => {
      const idx = getIndexFromSlug(m.slug);
      const entry: MonthlyEntry | undefined = entries[idx];
      let val: string | number = entry?.value ?? "--";
      if (typeof val === "number" && !isSnow) val = val.toFixed(1);

      let rank: string | number = entry ? entry[rankValue] ?? "--" : "--";

      return { val, rank };
    });
  };

  const renderRow = (meta: MetricMeta) => {
    const dataArray = mapValueRank(meta);
    const icon = meta.highIcon || meta.lowIcon;

    return (
      <tr
        key={meta.key}
        className="group hover:bg-slate-50/30 transition-colors"
      >
        <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm border-r border-slate-200 w-24 min-w-[104px] h-10 sm:h-12 text-center align-middle font-bold text-xs sm:text-sm shadow-[2px_0_4px_-2px_#0000001a] group-hover:bg-slate-50 transition-colors">
          <div className="flex flex-col items-center justify-center leading-tight px-1 gap-0.5">
            <div className="flex items-center gap-1">
              <span className="text-slate-800 whitespace-nowrap">
                {meta.label.replace("平均最", "最")}
              </span>
              {icon && (
                <span
                  className="text-sm sm:text-base opacity-80"
                  style={{ color: meta.color }}
                >
                  {icon}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-xs text-slate-400 font-normal">
              ({meta.unit})
            </span>
          </div>
        </td>
        {dataArray.map((d, i) => {
          const isAnnual = months[i].slug === "all";
          const bgColor = getColor(meta.label, d.val, isAnnual);
          return (
            <td
              key={i}
              className={`border-r border-slate-100 min-w-[56px] sm:min-w-[64px] h-10 sm:h-12 text-center align-middle transition-colors ${
                isAnnual ? "ring-1 ring-inset ring-slate-200/50" : ""
              }`}
              style={{ backgroundColor: bgColor }}
            >
              <div className="flex flex-col justify-center items-center -space-y-0.5 sm:space-y-0">
                <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-tighter">
                  {d.val}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-600/80 font-medium">
                  {d.rank !== "--" ? `${d.rank}位` : "-"}
                </span>
              </div>
            </td>
          );
        })}
      </tr>
    );
  };

  const displayMetrics = [
    MetricKey.av_avtemp,
    MetricKey.av_hitemp,
    MetricKey.av_lwtemp,
    MetricKey.sm_rain,
    MetricKey.sm_snowing,
    MetricKey.sm_sun,
    MetricKey.av_wind,
  ];

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full border-collapse text-center table-auto">
          <thead>
            <tr className="bg-slate-50 text-xs sm:text-sm">
              <th className="sticky left-0 top-0 z-20 bg-slate-100 border-r border-b border-slate-200 w-24 min-w-[104px] h-10 sm:h-12 font-bold text-slate-600 shadow-[2px_0_4px_-2px_#0000001a]">
                項目
              </th>
              {months.map((m) => (
                <th
                  key={m.slug}
                  className={`border-b border-r border-slate-200 min-w-[56px] sm:min-w-[64px] h-10 sm:h-12 font-bold ${
                    m.slug === "all"
                      ? "text-blue-700 bg-blue-50/50"
                      : "text-slate-600"
                  }`}
                >
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayMetrics.map((meta) => renderRow(meta))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HyouTable;
