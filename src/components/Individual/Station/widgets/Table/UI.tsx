import React, { useMemo, useState } from "react";
import CustomSelect from "../../../../common/CustomSelect";
import HyouTable from "./HyouTable/UI";
import { RankKey, RankValue } from "../../../../../setting/rank";
import { RawMonthlyData } from "../../../../../types/raw";
import { getTableRankOptions } from "./function";

export interface TableWidgetProps {
  tableData: RawMonthlyData;
  regionColor: string;
  isMeteo: boolean;
  isIsland: boolean;
}

export const TableWidget: React.FC<TableWidgetProps> = ({
  tableData,
  regionColor,
  isMeteo,
  isIsland,
}) => {
  const [tableRankValue, setTableRankValue] = useState<RankValue>(
    RankKey.top.key
  );

  const tableRankOptions = useMemo(
    () => getTableRankOptions(tableData, isMeteo, isIsland),
    [tableData, isMeteo, isIsland]
  );

  return (
    <>
      <div className="pb-3 border-b border-slate-200 mb-4">
        <CustomSelect
          value={tableRankValue}
          onChange={(v) => setTableRankValue(v)}
          options={tableRankOptions.map((opt) => ({
            value: opt,
            label: RankKey[opt].ratioLabel,
          }))}
        />
      </div>

      <p className="text-xs text-slate-500 mb-4">
        各気象要素の月別平年値および順位です。
      </p>

      <HyouTable tableData={tableData} rankValue={tableRankValue} />
    </>
  );
};

export default TableWidget;
