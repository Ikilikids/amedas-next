import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import React from "react";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  BarController,
  CategoryScale,
  LinearScale,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

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
  lwtemp_25?: number;
  lwtemp_0?: number;
  min_lwtemp?: number;
  sm_rain?: number;
}

interface RecentTrendChartProps {
  history: HistoryEntry[];
  stats?: StatsData;
  color: string;
}

const RecentTrendChart: React.FC<RecentTrendChartProps> = ({
  history,
  stats,
}) => {
  // 日付順に並び替え（昇順）
  const sortedData = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const labels = sortedData.map((item) =>
    item.date.split("-").slice(1).join("/")
  );

  if (sortedData.length === 0) return null;

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
  }) => (
    <div
      className="px-3 py-1.5 rounded-lg border min-w-[80px] text-center"
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
    >
      <span className="text-[10px] font-bold block" style={{ color: color }}>
        {label}
      </span>
      <span className="text-lg font-black" style={{ color: color }}>
        {value === -99 || value === 99 || value === undefined ? "---" : value}
        <small className="text-[10px] ml-0.5">{unit}</small>
      </span>
    </div>
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "降水量 (mm)",
        data: sortedData.map((d) => d.rain),
        yAxisID: "bar",
        type: "bar" as const,
        backgroundColor: "rgba(14, 165, 233, 0.4)",
        borderWidth: 0,
        barThickness: 20,
      },
      {
        label: "最高気温 (℃)",
        data: sortedData.map((d) => d.hi),
        yAxisID: "temp",
        type: "line" as const,
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
      },
      {
        label: "最低気温 (℃)",
        data: sortedData.map((d) => d.lw),
        yAxisID: "temp",
        type: "line" as const,
        borderColor: "#1e3a8a", // 紺色 (Dark Blue)
        backgroundColor: "#1e3a8a",
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index" as const, intersect: false },
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#999", font: { size: 11 } },
      },
      bar: {
        type: "linear" as const,
        position: "left" as const,
        min: 0,
        max: (context: any) => {
          const maxRain = Math.max(...sortedData.map((d) => d.rain || 0));
          return Math.max(maxRain * 2.5, 20);
        },
        display: true,
        grid: { display: false },
        ticks: {
          color: "#999",
          font: { size: 11 },
          callback: (value: any) => `${value}mm`,
        },
      },
      temp: {
        type: "linear" as const,
        position: "right" as const,
        min: -20,
        max: 40,
        ticks: {
          stepSize: 10,
          color: "#999",
          font: { size: 11 },
        },
        grid: {
          color: "#f1f5f9",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        align: "start" as const,
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#334155",
        bodyColor: "#475569",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { weight: "bold" as const },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-2">
      <div className="flex flex-wrap gap-2 justify-end mb-8">
        {stats && (
          <>
            <StatBox
              label="最高気温"
              value={stats.max_hitemp}
              unit="℃"
              color="#ef4444"
              bgColor="#fef2f2"
              borderColor="#fee2e2"
            />
            <StatBox
              label="最低気温"
              value={stats.min_lwtemp}
              unit="℃"
              color="#3b82f6"
              bgColor="#eff6ff"
              borderColor="#dbeafe"
            />
            <StatBox
              label="40℃以上"
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
            <StatBox
              label="累計降水"
              value={
                stats.sm_rain !== undefined
                  ? Math.round(stats.sm_rain)
                  : undefined
              }
              unit="mm"
              color="#0ea5e9"
              bgColor="#f0f9ff"
              borderColor="#e0f2fe"
            />
          </>
        )}
      </div>

      <div className="h-[350px] w-full">
        <Chart
          type="bar"
          data={chartData}
          options={options as any}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default RecentTrendChart;
