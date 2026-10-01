import React from "react";
import RecentTrendChart from "./RecentTrendChart";
import RecentTrendTable from "./RecentTrendTable";

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
      <p className="text-xs text-slate-500 mb-4">
        気象庁リアルタイム観測データによる直近15日間の日最高・最低気温と降水量の推移です。
      </p>

      <div className="bg-white rounded-xl flex flex-col gap-6">
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
