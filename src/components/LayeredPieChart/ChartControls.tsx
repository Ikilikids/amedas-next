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
    <div className="flex items-center">
      <select
        className="ml-2 border rounded text-sm sm:text-base"
        value={type}
        onChange={(e) => setType(e.target.value as ChartType)}
      >
        {typeOptions.map((t) => (
          <option key={t.key} value={t.key}>
            {t.label}
          </option>
        ))}
      </select>

      <select
        className="ml-2 border rounded text-sm sm:text-base"
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

      <select
        value={rankType}
        onChange={(e) => setRankType(e.target.value as RankValue)}
        className="ml-2 border rounded text-sm sm:text-base"
      >
        {rankOptions.map((opt) => (
          <option key={opt} value={opt}>
            {RankKey[opt].ratioLabel}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChartControls;
