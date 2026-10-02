import React from "react";
import { RawMonthlyData } from "../../../../../../types/raw";
import { MetricKey, MetricMeta } from "../../../../../../setting/metric";
import { RankValue } from "../../../../../../setting/rank";
import { getColor, mapValueRank, MONTH_OPTIONS } from "./function";

export interface HyouTableProps {
  tableData?: RawMonthlyData;
  rankValue: RankValue;
}

export const HyouTable: React.FC<HyouTableProps> = ({ tableData, rankValue }) => {
  const months = MONTH_OPTIONS;

  const renderRow = (meta: MetricMeta) => {
    const dataArray = mapValueRank(meta, tableData, rankValue);
    const icon = meta.icon || meta.high?.icon || meta.low?.icon;

    return (
      <tr
        key={meta.key}
        className="group hover:bg-slate-50/30 transition-colors"
      >
        <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm border-r border-slate-200 min-w-[90px] h-10 text-center align-middle font-bold text-xs shadow-[2px_0_4px_-2px_#0000001a] group-hover:bg-slate-50 transition-colors">
          <div className="flex flex-col items-center justify-center leading-tight px-1 gap-0.5">
            <div className="flex items-center gap-1">
              <span className="text-slate-800 whitespace-nowrap">
                {meta.label.replace("平均最", "最")}
              </span>
              {icon && (
                <span
                  className="text-sm opacity-80"
                  style={{ color: meta.color }}
                >
                  {icon}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-normal">
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
              className={`border-r border-slate-100 min-w-[56px] h-10 text-center align-middle transition-colors ${isAnnual ? "ring-1 ring-inset ring-slate-200/50" : ""
                }`}
              style={{ backgroundColor: bgColor }}
            >
              <div className="flex flex-col justify-center items-center -space-y-0.5">
                <span className="font-bold text-xs text-slate-900 tracking-tighter">
                  {d.val}
                </span>
                <span className="text-[9px] text-slate-600/80 font-medium">
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
            <tr className="bg-slate-50 text-xs">
              <th className="sticky left-0 top-0 z-20 bg-slate-100 border-r border-b border-slate-200 min-w-[90px] h-10 font-bold text-slate-600 shadow-[2px_0_4px_-2px_#0000001a]">
                項目
              </th>
              {months.map((m) => (
                <th
                  key={m.slug}
                  className={`border-b border-r border-slate-200 min-w-[56px] h-10 font-bold ${m.slug === "all"
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
