import React from "react";
import { TableData } from "../types/all";
import { MonthMap } from "../utils/colorUtils";
import { MetricKey, MetricMeta } from "../utils/metric";

interface CompareMonthlyTableProps {
  tableData1: TableData | null;
  tableData2: TableData | null;
  name1: string;
  name2: string;
}

const CompareMonthlyTable: React.FC<CompareMonthlyTableProps> = ({
  tableData1,
  tableData2,
  name1,
  name2,
}) => {
  const months = Object.entries(MonthMap).map(([slug, label]) => ({
    slug,
    label,
  }));

  const displayMetrics = [
    MetricKey.av_avtemp,
    MetricKey.av_hitemp,
    MetricKey.av_lwtemp,
    MetricKey.sm_rain,
    MetricKey.sm_snowing,
    MetricKey.sm_sun,
    MetricKey.av_wind,
  ];

  const getIndexFromSlug = (slug: string): number => {
    if (slug === "all") return 12;
    return parseInt(slug) - 1;
  };

  const renderMetricRows = (meta: MetricMeta) => {
    const isSnow = meta.unit === "cm";
    const entries1 = tableData1?.get(meta) || [];
    const entries2 = tableData2?.get(meta) || [];

    const formatVal = (v: number | undefined | null) => {
      if (v === undefined || v === null) return "--";
      return isSnow ? v : v.toFixed(1);
    };

    return (
      <React.Fragment key={meta.key}>
        {/* Station 1 Row */}
        <tr className="hover:bg-slate-50/50 transition-colors">
          <td
            rowSpan={2}
            className="sticky left-0 z-10 bg-white px-2 py-3 w-[104px] min-w-[104px] text-center align-middle font-bold text-xs border-t-2 border-slate-300"
          >
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1">
                <span className="text-slate-700">{meta.label}</span>
                <span className="text-xs" style={{ color: meta.color }}>
                  {meta.highIcon || meta.lowIcon}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-normal">
                ({meta.unit})
              </span>
            </div>
          </td>
          <td className="sticky left-[104px] z-10 bg-white border-r border-slate-200 px-2 py-1 w-[60px] min-w-[60px] text-[10px] font-black text-blue-600 text-center whitespace-nowrap shadow-[2px_0_4px_-2px_#0000001a] border-t-2">
            {name1}
          </td>
          {months.map((m) => {
            const idx = getIndexFromSlug(m.slug);
            const val1 = entries1[idx]?.value;
            const val2 = entries2[idx]?.value;
            const isLarger =
              val1 !== undefined && val2 !== undefined && val1 > val2;

            return (
              <td
                key={m.slug}
                className={`px-2 py-1 text-center text-xs font-mono font-bold border-t-2 border-slate-300 ${
                  m.slug === "all" ? "bg-blue-50/30" : ""
                } ${isLarger ? "text-rose-600" : "text-slate-800"}`}
              >
                {formatVal(val1)}
              </td>
            );
          })}
        </tr>
        {/* Station 2 Row */}
        <tr className="hover:bg-slate-50/50 transition-colors">
          <td className="sticky left-[104px] z-10 bg-white border-r border-slate-200 px-2 py-1 w-[60px] min-w-[60px] text-[10px] font-black text-slate-400 text-center whitespace-nowrap shadow-[2px_0_4px_-2px_#0000001a] border-t">
            {name2}
          </td>
          {months.map((m) => {
            const idx = getIndexFromSlug(m.slug);
            const val1 = entries1[idx]?.value;
            const val2 = entries2[idx]?.value;
            const isLarger =
              val1 !== undefined && val2 !== undefined && val2 > val1;

            return (
              <td
                key={m.slug}
                className={`px-2 py-1 text-center text-xs font-mono font-bold border-t border-slate-200 ${
                  m.slug === "all" ? "bg-blue-50/30" : ""
                } ${isLarger ? "text-rose-600" : "text-slate-800"}`}
              >
                {formatVal(val2)}
              </td>
            );
          })}
        </tr>
      </React.Fragment>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <th className="sticky left-0 top-0 z-20 bg-slate-100 border-b border-slate-200 p-2 w-[104px] min-w-[104px]">
              項目
            </th>
            <th className="sticky left-[104px] top-0 z-20 bg-slate-100 border-r border-b border-slate-200 p-2 w-[60px] min-w-[60px] shadow-[2px_0_4px_-2px_#0000001a]">
              地点
            </th>
            {months.map((m) => (
              <th
                key={m.slug}
                className={`border-b border-slate-200 p-2 min-w-[60px] ${
                  m.slug === "all" ? "text-blue-600 bg-blue-50/50" : ""
                }`}
              >
                {m.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {displayMetrics.map((meta) => renderMetricRows(meta))}
        </tbody>
      </table>
    </div>
  );
};

export default CompareMonthlyTable;
