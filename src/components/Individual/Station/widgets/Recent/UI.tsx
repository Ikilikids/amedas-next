import React from "react";
import TrendChart from "./TrendChart/UI";
import TrendTable from "./TrendTable/UI";
import { isRecentAvailable } from "./function";

export interface RecentWidgetProps {
  history: any[];
  stats: any;
  regionColor: string;
}

export const RecentWidget: React.FC<RecentWidgetProps> = ({
  history,
  stats,
  regionColor,
}) => {
  if (!isRecentAvailable(history)) return null;

  return (
    <>
      <p className="text-xs text-slate-500 mb-4">
        気象庁リアルタイム観測データによる直近15日間の日最高・最低気温と降水量の推移です。
      </p>

      <div className="bg-white rounded-xl flex flex-col gap-6">
        <TrendChart
          history={history}
          stats={stats}
          color={regionColor}
        />
        <TrendTable history={history} />
      </div>
    </>
  );
};

export default RecentWidget;
