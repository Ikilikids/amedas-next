import React from "react";
import { RankKey, RankValue } from "../../utils/rank";
import CustomSelect from "../UI/CustomSelect";
import SegmentedControl from "../UI/SegmentedControl";
import { ChartType } from "./types";

interface ChartControlsProps {
  type: ChartType;
  setType: (type: ChartType) => void;
  selectedMonth: number | null;
  setSelectedMonth: (month: number | null) => void;
  rankType: RankValue;
  setRankType: (rank: RankValue) => void;
  rankOptions: RankValue[];
  typeOptions: { key: ChartType; label: string; activeClassName?: string }[];
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
      {/* Type Selector */}
      <SegmentedControl
        value={type}
        onChange={setType}
        options={typeOptions}
      />

      {/* Select inputs */}
      <div className="flex items-center gap-2">
        <CustomSelect
          value={selectedMonth ?? "all"}
          onChange={(val) => setSelectedMonth(val === "all" ? null : (val as number))}
          options={[
            { value: "all", label: "通年" },
            ...months.map((m) => ({ value: m, label: `${m}月` })),
          ]}
        />

        <CustomSelect
          value={rankType}
          onChange={(v) => setRankType(v)}
          options={rankOptions.map((opt) => ({
            value: opt,
            label: RankKey[opt].ratioLabel,
          }))}
        />
      </div>
    </div>
  );
};

export default ChartControls;
