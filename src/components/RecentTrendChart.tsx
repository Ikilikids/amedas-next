import React, { useState } from "react";
import { UonzuData } from "../types/all";
import { MetricKey } from "../utils/metric";
import SegmentedControl from "./UI/SegmentedControl";
import UonzuChart from "./UonzuChart";

interface HistoryEntry {
  date: string;
  hi: number | null;
  lw: number | null;
  rain: number | null;
}

interface StatsData {
  hitemp_40?: number;
  hitemp_35?: number;
  hitemp_30?: number;
  hitemp_25?: number;
  hitemp_0?: number;
  max_hitemp?: number;
  max_hitemp_date?: string;
  lwtemp_25?: number;
  lwtemp_0?: number;
  min_lwtemp?: number;
  min_lwtemp_date?: string;
  sm_rain?: number;
  rain_7d?: number;
  rain_15d?: number;
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
  color,
  bgColor,
  borderColor,
}: {
  label: string;
  value: number | string | undefined;
  unit: string;
  color: string;
  bgColor: string;
  borderColor: string;
  date?: string;
}) => (
  <div
    className="px-3 py-1.5 rounded-lg border min-w-[80px] text-center"
    style={{ backgroundColor: bgColor, borderColor: borderColor }}
  >
    <span className="text-[10px] font-bold block" style={{ color: color }}>
      {label}
    </span>
    <span
      className="text-lg font-black block leading-tight"
      style={{ color: color }}
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
  const [activeTab, setActiveTab] = useState<"high" | "low" | "rain">("high");

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

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-2">
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 mb-8">
        <SegmentedControl
          value={activeTab}
          onChange={(v) => setActiveTab(v as any)}
          options={[
            { key: "high", label: "暑さ" },
            { key: "low", label: "寒さ" },
            { key: "rain", label: "降水" },
          ]}
        />
        <div className="flex flex-wrap gap-2 justify-end">
          {stats && (
            <>
              {activeTab === "high" && (
                <>
                  <StatBox
                    label="年間最高気温"
                    value={stats.max_hitemp}
                    unit="℃"
                    color="rgba(255, 75, 75, 1)"
                    bgColor="rgba(255, 75, 75, 0.05)"
                    borderColor="rgba(255, 75, 75, 0.1)"
                    date={stats.max_hitemp_date}
                  />
                  <StatBox
                    label="酷暑日"
                    value={stats.hitemp_40}
                    unit="日"
                    color="#db2777"
                    bgColor="#fdf2f8"
                    borderColor="#fce7f3"
                  />
                  <StatBox
                    label="猛暑日"
                    value={stats.hitemp_35}
                    unit="日"
                    color="rgba(230,40,70,1)"
                    bgColor="rgba(230,40,70,0.05)"
                    borderColor="rgba(230,40,70,0.1)"
                  />
                  <StatBox
                    label="真夏日"
                    value={stats.hitemp_30}
                    unit="日"
                    color="rgba(230,100,40,1)"
                    bgColor="rgba(230,100,40,0.05)"
                    borderColor="rgba(230,100,40,0.1)"
                  />
                  <StatBox
                    label="夏日"
                    value={stats.hitemp_25}
                    unit="日"
                    color="rgba(230,180,40,1)"
                    bgColor="rgba(230,180,40,0.05)"
                    borderColor="rgba(230,180,40,0.1)"
                  />
                  <StatBox
                    label="熱帯夜"
                    value={stats.lwtemp_25}
                    unit="日"
                    color="rgba(0,150,100,1)"
                    bgColor="rgba(0,150,100,0.05)"
                    borderColor="rgba(0,150,100,0.1)"
                  />
                </>
              )}
              {activeTab === "low" && (
                <>
                  <StatBox
                    label="年間最低気温"
                    value={stats.min_lwtemp}
                    unit="℃"
                    color="rgba(75, 75, 255, 1)"
                    bgColor="rgba(75, 75, 255, 0.05)"
                    borderColor="rgba(75, 75, 255, 0.1)"
                    date={stats.min_lwtemp_date}
                  />

                  <StatBox
                    label="冬日"
                    value={stats.lwtemp_0}
                    unit="日"
                    color="rgba(0,100,218,1)"
                    bgColor="rgba(0,100,218,0.05)"
                    borderColor="rgba(0,100,218,0.1)"
                  />
                  <StatBox
                    label="真冬日"
                    value={stats.hitemp_0}
                    unit="日"
                    color="rgba(140,50,140,1)"
                    bgColor="rgba(140,50,140,0.05)"
                    borderColor="rgba(140,50,140,0.1)"
                  />
                </>
              )}
              {activeTab === "rain" && (
                <>
                  <StatBox
                    label="過去7日"
                    value={stats.rain_7d}
                    unit="mm"
                    color="#0ea5e9"
                    bgColor="#f0f9ff"
                    borderColor="#e0f2fe"
                  />
                  <StatBox
                    label="過去15日"
                    value={stats.rain_15d}
                    unit="mm"
                    color="#0284c7"
                    bgColor="#f0f9ff"
                    borderColor="#e0f2fe"
                  />{" "}
                  <StatBox
                    label="累計降水"
                    value={
                      stats.sm_rain !== undefined
                        ? Math.round(stats.sm_rain)
                        : undefined
                    }
                    unit="mm"
                    color="#0369a1"
                    bgColor="#f0f9ff"
                    borderColor="#e0f2fe"
                  />
                </>
              )}
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
