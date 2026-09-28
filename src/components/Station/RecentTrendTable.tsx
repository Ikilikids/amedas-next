import React from "react";
import { MetricKey, MetricMeta } from "../../setting/metric";

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
// Day Condition Metrics Helper (Temperature & Rain)
// ==============================
const getDayConditionMetrics = (
  hi: number | null,
  lw: number | null,
  rain: number | null
): {
  hiMetric: MetricMeta | null;
  lwMetric: MetricMeta | null;
  rainMetric: MetricMeta | null;
} => {
  let hiMetric: MetricMeta | null = null;
  let lwMetric: MetricMeta | null = null;
  let rainMetric: MetricMeta | null = null;

  if (hi !== null) {
    if (hi >= 35) hiMetric = MetricKey.hitemp_35;
    else if (hi >= 30) hiMetric = MetricKey.hitemp_30;
    else if (hi >= 25) hiMetric = MetricKey.hitemp_25;
    else if (hi < 0) hiMetric = MetricKey.hitemp_0;
  }

  if (lw !== null) {
    if (lw >= 25) lwMetric = MetricKey.lwtemp_25;
    else if (lw < 0) lwMetric = MetricKey.lwtemp_0;
  }

  if (rain !== null && rain > 0) {
    if (rain >= 100) rainMetric = MetricKey.rain_100;
    else if (rain >= 50) rainMetric = MetricKey.rain_50;
    else rainMetric = MetricKey.rain_1;
  }

  return { hiMetric, lwMetric, rainMetric };
};

const RecentTrendTable: React.FC<RecentTrendTableProps> = ({ history }) => {
  // 日付順に並び替え（昇順）
  const sortedData = [...history].sort((a, b) => a.date.localeCompare(b.date));

  if (sortedData.length === 0) return null;

  return (
    <div className="mt-8 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
          <span>日別データ一覧</span>
          <span className="text-[10px] font-normal text-slate-500">
            (直近 {sortedData.length} 日間)
          </span>
        </h4>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="sticky left-0 z-10 bg-slate-50 border-r border-slate-200 w-24 min-w-[104px] text-center font-bold text-xs shadow-[2px_0_4px_-2px_#0000001a] py-3 text-slate-800">
                日付
              </th>
              {sortedData.map((item, i) => {
                const dateStr = item.date.split("-").slice(1).join("/");
                const { hiMetric, lwMetric, rainMetric } = getDayConditionMetrics(
                  item.hi,
                  item.lw,
                  item.rain
                );
                return (
                  <th
                    key={i}
                    className="px-2 py-2 border-r border-slate-100 min-w-[64px] text-center font-bold text-xs bg-slate-50/30"
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span className="text-slate-600 whitespace-nowrap">{dateStr}</span>
                      <div className="flex items-center gap-0.5 min-h-[16px] justify-center mt-0.5">
                        {hiMetric && (
                          <span style={{ color: hiMetric.color }} className="text-xs" title={hiMetric.label}>
                            {hiMetric.icon}
                          </span>
                        )}
                        {lwMetric && (
                          <span style={{ color: lwMetric.color }} className="text-xs" title={lwMetric.label}>
                            {lwMetric.icon}
                          </span>
                        )}
                        {rainMetric && (
                          <span style={{ color: rainMetric.color }} className="text-xs" title={rainMetric.label}>
                            {rainMetric.icon}
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
              <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm border-r border-slate-200 w-24 min-w-[104px] py-2.5 text-center font-bold text-xs shadow-[2px_0_4px_-2px_#0000001a] text-slate-800">
                最高気温 (℃)
              </td>
              {sortedData.map((item, i) => {
                const { hiMetric } = getDayConditionMetrics(item.hi, null, null);
                return (
                  <td
                    key={i}
                    className="border-r border-slate-100 min-w-[64px] py-2.5 text-center align-middle font-bold text-xs text-slate-900"
                    style={{ backgroundColor: hiMetric ? `${hiMetric.color}33` : "white" }}
                  >
                    {item.hi !== null ? item.hi.toFixed(1) : "--"}
                  </td>
                );
              })}
            </tr>

            {/* 最低気温行 */}
            <tr className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
              <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm border-r border-slate-200 w-24 min-w-[104px] py-2.5 text-center font-bold text-xs shadow-[2px_0_4px_-2px_#0000001a] text-slate-800">
                最低気温 (℃)
              </td>
              {sortedData.map((item, i) => {
                const { lwMetric } = getDayConditionMetrics(null, item.lw, null);
                return (
                  <td
                    key={i}
                    className="border-r border-slate-100 min-w-[64px] py-2.5 text-center align-middle font-bold text-xs text-slate-900"
                    style={{ backgroundColor: lwMetric ? `${lwMetric.color}33` : "white" }}
                  >
                    {item.lw !== null ? item.lw.toFixed(1) : "--"}
                  </td>
                );
              })}
            </tr>

            {/* 降水量行 */}
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm border-r border-slate-200 w-24 min-w-[104px] py-2.5 text-center font-bold text-xs shadow-[2px_0_4px_-2px_#0000001a] text-slate-800">
                降水量 (mm)
              </td>
              {sortedData.map((item, i) => {
                const { rainMetric } = getDayConditionMetrics(null, null, item.rain);
                return (
                  <td
                    key={i}
                    className="border-r border-slate-100 min-w-[64px] py-2.5 text-center align-middle font-bold text-xs  text-slate-900"
                    style={{ backgroundColor: rainMetric ? `${rainMetric.color}33` : "white" }}
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
