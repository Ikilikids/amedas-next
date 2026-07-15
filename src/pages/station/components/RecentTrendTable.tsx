import React from "react";
import {
  BsFillCloudLightningRainFill,
  BsFillCloudRainFill,
  BsFillCloudRainHeavyFill,
} from "react-icons/bs";
import { MetricKey } from "../../../setting/metric";

interface HistoryEntry {
  date: string;
  hi: number | null;
  lw: number | null;
  rain: number | null;
}

interface RecentTrendTableProps {
  history: HistoryEntry[];
}

// ==============================
// Daily Temperature Color Helper (Categorized Solid Colors, no smooth gradient)
// ==============================
const getDailyTempColor = (val: number | null, isHi: boolean): string => {
  if (val === null) return "white";
  if (isHi) {
    if (val >= 35) return `${MetricKey.hitemp_35.color}33`; // 猛暑日 (20% opacity)
    if (val >= 30) return `${MetricKey.hitemp_30.color}33`; // 真夏日
    if (val >= 25) return `${MetricKey.hitemp_25.color}33`; // 夏日
    if (val < 0) return `${MetricKey.hitemp_0.color}33`; // 真冬日
  } else {
    if (val >= 25) return `${MetricKey.lwtemp_25.color}33`; // 熱帯夜
    if (val < 0) return `${MetricKey.lwtemp_0.color}33`; // 冬日
  }
  return "white";
};

// ==============================
// Daily Precipitation Color Helper (Categorized Solid Colors)
// ==============================
const getDailyRainColor = (val: number | null): string => {
  if (val === null || val === 0) return "white";
  if (val >= 100) return "#1e3a8a33"; // 紺 (20% opacity)
  if (val >= 50) return "#2563eb33";  // 青 (20% opacity)
  return "#38bdf833";                 // 水色 (20% opacity)
};

// ==============================
// Temperature Icon Condition Helper
// ==============================
const getDayConditionIcons = (hi: number | null, lw: number | null) => {
  let hiIcon = null;
  let hiColor = "";
  let hiLabel = "";
  let lwIcon = null;
  let lwColor = "";
  let lwLabel = "";

  if (hi !== null) {
    if (hi >= 35) {
      hiIcon = MetricKey.hitemp_35.highIcon;
      hiColor = MetricKey.hitemp_35.color;
      hiLabel = MetricKey.hitemp_35.label;
    } else if (hi >= 30) {
      hiIcon = MetricKey.hitemp_30.highIcon;
      hiColor = MetricKey.hitemp_30.color;
      hiLabel = MetricKey.hitemp_30.label;
    } else if (hi >= 25) {
      hiIcon = MetricKey.hitemp_25.highIcon;
      hiColor = MetricKey.hitemp_25.color;
      hiLabel = MetricKey.hitemp_25.label;
    } else if (hi < 0) {
      hiIcon = MetricKey.hitemp_0.highIcon;
      hiColor = MetricKey.hitemp_0.color;
      hiLabel = MetricKey.hitemp_0.label;
    }
  }

  if (lw !== null) {
    if (lw >= 25) {
      lwIcon = MetricKey.lwtemp_25.highIcon;
      lwColor = MetricKey.lwtemp_25.color;
      lwLabel = MetricKey.lwtemp_25.label;
    } else if (lw < 0) {
      lwIcon = MetricKey.lwtemp_0.highIcon;
      lwColor = MetricKey.lwtemp_0.color;
      lwLabel = MetricKey.lwtemp_0.label;
    }
  }

  return { hiIcon, hiColor, hiLabel, lwIcon, lwColor, lwLabel };
};

// ==============================
// Precipitation Icon Condition Helper
// ==============================
const getRainCondition = (val: number | null) => {
  let rainIcon = null;
  let rainColor = "";
  let rainLabel = "";

  if (val !== null && val > 0) {
    if (val >= 100) {
      rainIcon = <BsFillCloudLightningRainFill />;
      rainColor = "#1e3a8a"; // 紺色
      rainLabel = "豪雨 (≥100mm)";
    } else if (val >= 50) {
      rainIcon = <BsFillCloudRainHeavyFill />;
      rainColor = "#2563eb"; // 青色
      rainLabel = "非常に激しい雨 (≥50mm)";
    } else {
      rainIcon = <BsFillCloudRainFill />;
      rainColor = "#38bdf8"; // 水色
      rainLabel = "雨";
    }
  }

  return { rainIcon, rainColor, rainLabel };
};

const RecentTrendTable: React.FC<RecentTrendTableProps> = ({ history }) => {
  // 日付順に並び替え（昇順）
  const sortedData = [...history].sort((a, b) => a.date.localeCompare(b.date));

  if (sortedData.length === 0) return null;

  return (
    <div className="mt-8 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h4 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
          <span>日別データ一覧</span>
          <span className="text-[10px] sm:text-xs font-normal text-slate-500">
            (直近 {sortedData.length} 日間)
          </span>
        </h4>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="sticky left-0 z-10 bg-slate-50 border-r border-slate-200 w-24 min-w-[104px] text-center font-bold text-xs sm:text-sm shadow-[2px_0_4px_-2px_#0000001a] py-3 text-slate-800">
                日付
              </th>
              {sortedData.map((item, i) => {
                const dateStr = item.date.split("-").slice(1).join("/");
                const { hiIcon, hiColor, hiLabel, lwIcon, lwColor, lwLabel } = getDayConditionIcons(item.hi, item.lw);
                const { rainIcon, rainColor, rainLabel } = getRainCondition(item.rain);
                return (
                  <th
                    key={i}
                    className="px-2 py-2 border-r border-slate-100 min-w-[64px] text-center font-bold text-xs bg-slate-50/30"
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span className="text-slate-600 whitespace-nowrap">{dateStr}</span>
                      <div className="flex items-center gap-0.5 min-h-[16px] justify-center mt-0.5">
                        {hiIcon && (
                          <span style={{ color: hiColor }} className="text-xs sm:text-sm" title={hiLabel}>
                            {hiIcon}
                          </span>
                        )}
                        {lwIcon && (
                          <span style={{ color: lwColor }} className="text-xs sm:text-sm" title={lwLabel}>
                            {lwIcon}
                          </span>
                        )}
                        {rainIcon && (
                          <span style={{ color: rainColor }} className="text-xs sm:text-sm" title={rainLabel}>
                            {rainIcon}
                          </span>
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* 最高気温行 */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
              <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm border-r border-slate-200 w-24 min-w-[104px] py-2.5 text-center font-bold text-xs sm:text-sm shadow-[2px_0_4px_-2px_#0000001a] text-slate-800">
                最高気温 (℃)
              </td>
              {sortedData.map((item, i) => {
                const tempColor = getDailyTempColor(item.hi, true);
                return (
                  <td
                    key={i}
                    className="border-r border-slate-100 min-w-[64px] py-2.5 text-center align-middle font-bold text-xs sm:text-sm text-slate-900"
                    style={{ backgroundColor: tempColor }}
                  >
                    {item.hi !== null ? item.hi.toFixed(1) : "--"}
                  </td>
                );
              })}
            </tr>

            {/* 最低気温行 */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
              <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm border-r border-slate-200 w-24 min-w-[104px] py-2.5 text-center font-bold text-xs sm:text-sm shadow-[2px_0_4px_-2px_#0000001a] text-slate-800">
                最低気温 (℃)
              </td>
              {sortedData.map((item, i) => {
                const tempColor = getDailyTempColor(item.lw, false);
                return (
                  <td
                    key={i}
                    className="border-r border-slate-100 min-w-[64px] py-2.5 text-center align-middle font-bold text-xs sm:text-sm text-slate-900"
                    style={{ backgroundColor: tempColor }}
                  >
                    {item.lw !== null ? item.lw.toFixed(1) : "--"}
                  </td>
                );
              })}
            </tr>

            {/* 降水量行 */}
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm border-r border-slate-200 w-24 min-w-[104px] py-2.5 text-center font-bold text-xs sm:text-sm shadow-[2px_0_4px_-2px_#0000001a] text-slate-800">
                降水量 (mm)
              </td>
              {sortedData.map((item, i) => {
                const rainBgColor = getDailyRainColor(item.rain);
                return (
                  <td
                    key={i}
                    className="border-r border-slate-100 min-w-[64px] py-2.5 text-center align-middle font-bold text-xs sm:text-sm text-slate-900"
                    style={{ backgroundColor: rainBgColor }}
                  >
                    {item.rain !== null ? item.rain.toFixed(1) : "--"}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTrendTable;
