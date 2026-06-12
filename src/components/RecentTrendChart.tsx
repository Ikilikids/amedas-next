import React, { useState } from "react";
import { UonzuData } from "../types/all";
import { MetricKey, MetricValue, RANKING_GROUP_META, MetricGroup } from "../utils/metric";
import SegmentedControl from "./UI/SegmentedControl";
import UonzuChart from "./UonzuChart";

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
  const sortedData = [...(history || [])]
    .filter((item) => item && item.date)
    .sort((a, b) => a.date.localeCompare(b.date));
  const labels = sortedData.map((item) =>
    (item.date || "0-0-0").split("-").slice(1).join("/")
  );

  if (sortedData.length === 0) return null;

  // 雨温図形式に変換
  const uonzuMap: UonzuData = new Map();
  const hiValues = sortedData.map((d) => d.hi);
  const lwValues = sortedData.map((d) => d.lw);
  const rainValues = sortedData.map((d) => d.rain);

  if (hiValues.some((v) => v !== null)) {
    const meta = MetricKey.av_hitemp;
    if (meta) uonzuMap.set(meta, hiValues);
  }
  if (lwValues.some((v) => v !== null)) {
    const meta = MetricKey.av_lwtemp;
    if (meta) uonzuMap.set(meta, lwValues);
  }
  if (rainValues.some((v) => v !== null)) {
    const meta = MetricKey.sm_rain;
    if (meta) uonzuMap.set(meta, rainValues);
  }

  // アクティブなタブ（グループ）に属するメトリクスを抽出
  const displayMetrics = Object.values(MetricKey).filter(
    (m) => m && m.detail?.group === activeTab
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-2">
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 mb-8">
        <SegmentedControl
          value={activeTab}
          onChange={(v) => setActiveTab(v as any)}
          options={Object.entries(RANKING_GROUP_META).map(([key, meta]) => ({
            key: key as MetricGroup,
            label: meta.label || "不明",
            color: meta.color || "#ccc",
          }))}
        />
        <div className="flex flex-wrap gap-2 justify-end">
          {stats && typeof stats === "object" && (
            <>
              {displayMetrics.map((m) => {
                if (!m || !m.key) return null;
                let val = stats[m.key as keyof typeof stats];
                if (m.key === "sm_rain" && val !== undefined && val !== null)
                  val = Math.round(Number(val));
                return (
                  <StatBox
                    key={m.key}
                    label={m.label || "不明"}
                    value={val as any}
                    unit={m.unit || ""}
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
