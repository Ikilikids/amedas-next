import React, { useState } from "react";
import { UonzuData } from "../../../types/all";
import { MetricGroup, MetricKey, RANKING_GROUP_META } from "../../../setting/metric";
import SegmentedControl from "../../../components/UI/SegmentedControl";
import UonzuChart from "../../../components/UonzuChart";


interface HistoryEntry {
  date: string;
  hi: number | null;
  lw: number | null;
  rain: number | null;
}

interface StatsData {
  [key: string]: any;
}

interface RecentTrendChartProps {
  history: HistoryEntry[];
  stats?: StatsData;
  color: string;
}

const StatBox = ({
  label,
  value,
  unit,
  accentColor,
}: {
  label: string;
  value: number | string | undefined;
  unit: string;
  accentColor?: string;
}) => (
  <div
    className={`px-3 py-1.5 rounded-lg border min-w-[80px] text-center border-slate-100 bg-slate-50`}
  >
    <span className={`text-[10px] font-bold block text-slate-500`}>
      {label}
    </span>
    <span
      className={`text-lg font-black block leading-tight`}
      style={{ color: accentColor || "#334155" }}
    >
      {value === -99 || value === 99 || value === undefined ? "---" : value}
      <small className="text-[10px] ml-0.5">{unit}</small>
    </span>
  </div>
);

const RecentTrendChart: React.FC<RecentTrendChartProps> = ({
  history,
  stats,
}) => {
  const [activeTab, setActiveTab] = useState<MetricGroup>("heat");

  // 日付順に並び替え（昇順）
  const sortedData = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const labels = sortedData.map((item) =>
    item.date.split("-").slice(1).join("/")
  );

  if (sortedData.length === 0) return null;

  // 雨温図形式に変換
  const uonzuMap: UonzuData = new Map();
  const hiValues = sortedData.map((d) => d.hi);
  const lwValues = sortedData.map((d) => d.lw);
  const rainValues = sortedData.map((d) => d.rain);

  if (hiValues.some((v) => v !== null)) {
    uonzuMap.set(MetricKey.av_hitemp, hiValues);
  }
  if (lwValues.some((v) => v !== null)) {
    uonzuMap.set(MetricKey.av_lwtemp, lwValues);
  }
  if (rainValues.some((v) => v !== null)) {
    uonzuMap.set(MetricKey.sm_rain, rainValues);
  }

  // アクティブなタブ（グループ）に属するメトリクスを抽出
  const displayMetrics = Object.values(MetricKey).filter(
    (m) => m.detail?.group === activeTab
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 mb-6">
        <SegmentedControl
          value={activeTab}
          onChange={(v) => setActiveTab(v as any)}
          options={Object.entries(RANKING_GROUP_META).map(([key, meta]) => ({
            key: key as MetricGroup,
            label: meta.label,
            color: meta.color,
          }))}
        />
        <div className="flex flex-wrap gap-2 justify-end">
          {stats && (
            <>
              {displayMetrics.map((m) => {
                let val = stats[m.key];
                if (m.key === "sm_rain" && val !== undefined)
                  val = Math.round(val);
                return (
                  <StatBox
                    key={m.key}
                    label={m.label}
                    value={val}
                    unit={m.unit}
                    accentColor={m.color}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="h-[350px] w-full">
        <UonzuChart
          uonzuData={uonzuMap}
          selectedBar={MetricKey.sm_rain}
          labels={labels}
          height="100%"
        />
      </div>


    </div>
  );
};

export default RecentTrendChart;
