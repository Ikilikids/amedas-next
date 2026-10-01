import React from "react";
import { getDayConditionMetrics, HistoryEntry } from "./function";

interface TrendTableProps {
  history: HistoryEntry[];
}

export const TrendTable: React.FC<TrendTableProps> = ({ history }) => {
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

            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm border-r border-slate-200 w-24 min-w-[104px] py-2.5 text-center font-bold text-xs shadow-[2px_0_4px_-2px_#0000001a] text-slate-800">
                降水量 (mm)
              </td>
              {sortedData.map((item, i) => {
                const { rainMetric } = getDayConditionMetrics(null, null, item.rain);
                return (
                  <td
                    key={i}
                    className="border-r border-slate-100 min-w-[64px] py-2.5 text-center align-middle font-bold text-xs text-slate-900"
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

export default TrendTable;
