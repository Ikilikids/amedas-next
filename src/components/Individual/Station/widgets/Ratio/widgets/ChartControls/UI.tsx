import React from "react";
import { RankKey, RankValue } from "../../../../../../../setting/rank";
import { MonthKey, MonthValue } from "../../../../../../../setting/month";
import CustomSelect from "../../../../../../common/CustomSelect";
import { ChartType } from "../../types";
import { RatioTypeOption } from "../../function";

export interface ChartControlsProps {
  type: ChartType;
  setType: (type: ChartType) => void;
  selectedMonth: number | null;
  setSelectedMonth: (month: number | null) => void;
  rankType: RankValue;
  setRankType: (rank: RankValue) => void;
  rankOptions: RankValue[];
  typeOptions: RatioTypeOption[];
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  type,
  setType,
  selectedMonth,
  setSelectedMonth,
  rankType,
  setRankType,
  rankOptions,
  typeOptions,
}) => {
  const currentMonthKey = (selectedMonth !== null ? String(selectedMonth) : "all") as MonthValue;
  const currentMonthMeta = MonthKey[currentMonthKey];
  const currentTypeOpt = typeOptions.find((opt) => opt.key === type);

  return (
    <div className="grid grid-cols-3 gap-2 w-full p-1">
      <div className="min-w-0">
        <CustomSelect
          value={type}
          onChange={setType}
          activeColor={currentTypeOpt?.color}
          options={typeOptions.map((opt) => ({
            value: opt.key,
            label: opt.label,
            icon: opt.icon,
            color: opt.color,
          }))}
        />
      </div>

      <div className="min-w-0">
        <CustomSelect
          value={selectedMonth ?? "all"}
          onChange={(val) => setSelectedMonth(val === "all" ? null : (val as number))}
          activeColor={currentMonthMeta?.color}
          options={Object.values(MonthKey).map((m) => ({
            value: m.key === "all" ? "all" : Number(m.key),
            label: m.label,
            icon: m.icon,
            color: m.color,
          }))}
        />
      </div>

      <div className="min-w-0">
        <CustomSelect
          value={rankType}
          onChange={(v) => setRankType(v)}
          activeColor={RankKey[rankType]?.color}
          options={rankOptions.map((opt) => ({
            value: opt,
            label: RankKey[opt].ratioLabel,
            icon: RankKey[opt].icon,
            color: RankKey[opt].color,
          }))}
        />
      </div>
    </div>
  );
};

export default ChartControls;
