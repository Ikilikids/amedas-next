import React, { useMemo, useState } from "react";
import CustomSelect from "../UI/CustomSelect";
import HyouTable from "./HyouTable";
import { MetricMeta } from "../../setting/metric";
import { RankKey, RankValue } from "../../setting/rank";
import { SectionWithDescription } from "../../utils/colorUtils";
import { CiViewTable } from "react-icons/ci";

import { TableData } from "../../types/all";

interface TableSectionProps {
  tableData: TableData;
  regionColor: string;
  isMeteo: boolean;
  isIsland: boolean;
}

const BASE_RANK_VALUES: RankValue[] = ["top", "bot", "region", "pre"];

export const TableSection: React.FC<TableSectionProps> = ({
  tableData,
  regionColor,
  isMeteo,
  isIsland,
}) => {
  // Table State
  const [tableRankValue, setTableRankValue] = useState<RankValue>(
    RankKey.top.key
  );

  const tableRankOptions = useMemo(() => {
    const rankValues = new Set<RankValue>(BASE_RANK_VALUES);

    if (isMeteo) rankValues.add("meteo");
    if (
      !isIsland &&
      Array.from(tableData.keys()).some((meta) => meta.key === "av_avtemp")
    )
      rankValues.add("island");

    return Array.from(rankValues);
  }, [tableData, isMeteo, isIsland]);

  return (
    <>
      <div className="pb-3 border-b border-slate-200 mb-4 space-y-3">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: regionColor }}></span>
          3. 月別気候データ一覧表
        </h2>
        <div>
          <CustomSelect
            value={tableRankValue}
            onChange={(v) => setTableRankValue(v)}
            options={tableRankOptions.map((opt) => ({
              value: opt,
              label: RankKey[opt].ratioLabel,
            }))}
          />
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        各月の平年値数値と、全国・地方・都道府県内における順位です。
      </p>
      <HyouTable tableData={tableData} rankValue={tableRankValue} />
    </>
  );
};

export default TableSection;
