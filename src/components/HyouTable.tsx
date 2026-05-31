import React, { useState } from "react";
import { TableData } from "../types/all";
import { MonthlyEntry } from "../types/union";
import { MonthMap } from "../utils/colorUtils";
import { MetricKey, MetricMeta } from "../utils/metric";
import { RankKey, RankValue } from "../utils/rank";

// ==============================
// Types
// ==============================
interface HyouTableProps {
  tableData?: TableData;
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
  type: string,
  val: string | number,
  isAnnual: boolean = false
): string {
  if (val === "--" || isNaN(Number(val))) return "white";
  const v = Number(val);

  let min, mid, max;
  let colors: string[];

  switch (type) {
    case "temp":
      min = -15;
      mid = 10;
      max = 35;
      colors = ["rgb(100,180,255)", "rgb(255,255,255)", "rgb(255,70,70)"];
      break;
    case "rain":
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
      break;
    case "snow":
      if (isAnnual) {
        min = 0;
        mid = 450;
        max = 1700;
      } else {
        min = 0;
        mid = 50;
        max = 450;
      }
      colors = ["rgb(255,255,255)", "rgb(120,230,245)", "rgb(30,255,150)"];
      break;
    case "sun":
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
      break;
    case "wind":
      min = 0;
      mid = 3;
      max = 10;
      colors = ["rgb(255,255,255)", "rgb(175,255,200)", "rgb(50,255,75)"];
      break;
    default:
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
const HyouTable: React.FC<HyouTableProps> = ({ tableData }) => {
  const [rankValue, setRankValue] = useState<RankValue>(RankKey.top.key);

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

  const mapValueRank = (
    key: MetricMeta,
    isSnow: boolean = false
  ): HyouRowData[] => {
    if (!tableData) return emptyMonthlyData();

    const entries = tableData.get(key) || [];
    return months.map((m) => {
      const idx = getIndexFromSlug(m.slug);
      const entry: MonthlyEntry | undefined = entries[idx];
      let val: string | number = entry?.value ?? "--";
      if (typeof val === "number" && !isSnow) val = val.toFixed(1);

      let rank: string | number = entry ? (entry[rankValue] ?? "--") : "--";

      return { val, rank };
    });
  };

  const avTemps = mapValueRank(MetricKey.av_avtemp);
  const hiTemps = mapValueRank(MetricKey.av_hitemp);
  const lwTemps = mapValueRank(MetricKey.av_lwtemp);
  const rains = mapValueRank(MetricKey.sm_rain);
  const snows = mapValueRank(MetricKey.sm_snowing, true);
  const suns = mapValueRank(MetricKey.sm_sun);
  const winds = mapValueRank(MetricKey.av_wind);

  const renderRow = (
    label: string,
    dataArray: HyouRowData[],
    unit: string,
    type: string
  ) => (
    <tr key={label}>
      <td className="border border-gray-300 w-16 h-7 sm:h-10 text-center align-middle font-bold text-xs sm:text-sm">
        {label}
        <br />
        <span className="text-[10px] sm:text-xs">({unit})</span>
      </td>
      {dataArray.map((d, i) => {
        const isAnnual = months[i].slug === "all";
        const bgColor = getColor(type, d.val, isAnnual);
        return (
          <td
            key={i}
            className="border border-gray-300 w-12 h-7 sm:h-10 text-center align-middle text-xs sm:text-sm"
            style={{ backgroundColor: bgColor }}
          >
            <div className="flex flex-col justify-center items-center">
              <span>{d.val}</span>
              <small className="text-gray-700">
                {d.rank !== "--" ? `(${d.rank})` : "(--)"}
              </small>
            </div>
          </td>
        );
      })}
    </tr>
  );

  const availableRankValues = new Set<RankValue>();

  const targetKeys: MetricMeta[] = [MetricKey.av_avtemp, MetricKey.sm_rain];

  if (tableData) {
    targetKeys.forEach((key) => {
      const entries = tableData.get(key) || [];
      entries.forEach((entry) => {
        if (entry.top !== undefined) availableRankValues.add("top");
        if (entry.bot !== undefined) availableRankValues.add("bot");
        if (entry.region !== undefined) availableRankValues.add("region");
        if (entry.pre !== undefined) availableRankValues.add("pre");
        if (entry.island !== undefined) availableRankValues.add("island");
        if (entry.meteo !== undefined) availableRankValues.add("meteo");
      });
    });
  }

  const rankOptions = (Object.values(RankKey)).filter((meta) =>
    availableRankValues.has(meta.key)
  );

  return (
    <div className="w-full h-full flex flex-col items-left">
      <div className="flex justify-end mb-2">
        <div className="flex items-center">
          <label className="text-sm sm:text-base mr-2">絞り込み:</label>
          <select
            value={rankValue}
            onChange={(e) => setRankValue(e.target.value as RankValue)}
            className="border rounded px-1 py-0.5 text-sm sm:text-base bg-white"
          >
            {rankOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.ratioLabel}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-max flex justify-center">
          <table className="border-collapse table-fixed text-center shadow-md">
            <thead>
              <tr className="bg-gray-100 text-xs sm:text-sm">
                <th className="border border-gray-300 w-19 h-7 sm:h-10">
                  項目
                </th>
                {months.map((m) => (
                  <th
                    key={m.slug}
                    className="border border-gray-300 w-16 h-7 sm:h-10"
                  >
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderRow("平均気温", avTemps, "℃", "temp")}
              {renderRow("最高気温", hiTemps, "℃", "temp")}
              {renderRow("最低気温", lwTemps, "℃", "temp")}
              {renderRow("降水量", rains, "mm", "rain")}
              {renderRow("積雪量", snows, "cm", "snow")}
              {renderRow("日照時間", suns, "h", "sun")}
              {renderRow("平均風速", winds, "m/s", "wind")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HyouTable;
