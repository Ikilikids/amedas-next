import React, { useState } from "react";
import RecentTrendChart from "./RecentTrendChart";
import RecentTrendTable from "./RecentTrendTable";
import { MetricGroup } from "../../setting/metric";

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
  const [activeTab, setActiveTab] = useState<MetricGroup>("heat");

  if (!history || history.length === 0) return null;

  return (
    <>
      <div className="pb-3 border-b border-slate-200 mb-4 space-y-3">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: regionColor }}></span>
          5. 直近の観測推移
        </h2>
        <RecentTrendChart
          history={history}
          stats={stats}
          color={regionColor}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          renderSelectOnly
        />
      </div>

      <p className="text-xs text-slate-500 mb-4">
        気象庁リアルタイム観測データによる直近15日間の日最高・最低気温と降水量の推移です。
      </p>

      <div className="bg-white rounded-xl flex flex-col gap-6">
        <RecentTrendChart
          history={history}
          stats={stats}
          color={regionColor}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          renderChartOnly
        />
        <RecentTrendTable history={history} />
      </div>
    </>
  );
};

export default RecentSection;
