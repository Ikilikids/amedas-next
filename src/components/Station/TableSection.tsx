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
      <SectionWithDescription
        icon={<CiViewTable />}
        title="月別気候表"
        bgColor={regionColor}
        description={[
          "月ごとの気候データを表形式で表示しています。",
          "下段は順位を示しています。タブで切り替えることができます。",
        ]}
      >
        <div className="flex items-center gap-2 ml-2">
          <CustomSelect
            value={tableRankValue}
            onChange={(v) => setTableRankValue(v)}
            options={tableRankOptions.map((opt) => ({
              value: opt,
              label: RankKey[opt].ratioLabel,
            }))}
          />
        </div>
      </SectionWithDescription>
      <HyouTable tableData={tableData} rankValue={tableRankValue} />
    </>
  );
};

export default TableSection;
