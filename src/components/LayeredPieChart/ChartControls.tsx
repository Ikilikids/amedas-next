import React from "react";
import { RankKey, RankValue } from "../../utils/rank";
import { ChartType } from "./types";

interface ChartControlsProps {
  type: ChartType;
  setType: (type: ChartType) => void;
  selectedMonth: number | null;
  setSelectedMonth: (month: number | null) => void;
  rankType: RankValue;
  setRankType: (rank: RankValue) => void;
  rankOptions: RankValue[];
  typeOptions: { key: ChartType; label: string }[];
}

const ChartControls: React.FC<ChartControlsProps> = ({
  type,
  setType,
  selectedMonth,
  setSelectedMonth,
  rankType,
  setRankType,
  rankOptions,
  typeOptions,
}) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-1">
      {/* Type Selector (Segmented Control style) */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
        {typeOptions.map((t) => (
          <button
            key={t.key}
            onClick={() => setType(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-tighter transition-all duration-200 ${
              type === t.key
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Select inputs with modern styling */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-1.5 pr-8 text-xs font-black text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all cursor-pointer"
            value={selectedMonth ?? "all"}
            onChange={(e) =>
              setSelectedMonth(
                e.target.value === "all" ? null : Number(e.target.value)
              )
            }
          >
            <option value="all">通年</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">
            ▼
          </div>
        </div>

        <div className="relative">
          <select
            value={rankType}
            onChange={(e) => setRankType(e.target.value as RankValue)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-1.5 pr-8 text-xs font-black text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all cursor-pointer"
          >
            {rankOptions.map((opt) => (
              <option key={opt} value={opt}>
                {RankKey[opt].ratioLabel}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">
            ▼
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartControls;
