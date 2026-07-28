import React from "react";
import RecentTrendChart from "./RecentTrendChart";
import RecentTrendTable from "./RecentTrendTable";
import { SectionWithDescription } from "../../utils/colorUtils";
import { LuChartNoAxesCombined } from "react-icons/lu";

interface RecentSectionProps {
  history: any[];
  stats: any;
  regionColor: string;
}

export const RecentSection: React.FC<RecentSectionProps> = ({
  history,
  stats,
  regionColor,
}) => {
  if (!history || history.length === 0) return null;

  return (
    <>
      <SectionWithDescription
        icon={<LuChartNoAxesCombined />}
        title="最近のデータ"
        bgColor={regionColor}
        description={[
          "気象庁から取得した直近15日間の最高・最低気温と降水量の推移を表示しています。",
          "上部の数値は今年の累計・極値データ（1月1日〜）です。",
        ]}
      />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-2 flex flex-col gap-6">
        <RecentTrendChart
          history={history}
          stats={stats}
          color={regionColor}
        />
        <RecentTrendTable history={history} />
      </div>
    </>
  );
};

export default RecentSection;
