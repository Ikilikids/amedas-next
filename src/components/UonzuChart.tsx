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
import { UonzuData } from "../types/all";
import { MetricKey, MetricMeta } from "../utils/metric";

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

// ==============================
// Props
// ==============================
interface UonzuChartProps {
  uonzuData: UonzuData;
  selectedBar: MetricMeta;
  labels?: string[]; // Optional: defaults to 1..12
  height?: string;
  hideLegend?: boolean;
}

// ==============================
// Component
// ==============================
const UonzuChart: React.FC<UonzuChartProps> = ({
  uonzuData,
  selectedBar,
  labels,
  height = "350px",
  hideLegend = false,
}) => {
  const isDaily = !!labels;
  const defaultMonths = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString()
  );
  const displayLabels = labels || defaultMonths;

  // ===== データ取得 =====
  if (!uonzuData || !(uonzuData instanceof Map)) {
    return (
      <div className="flex items-center justify-center text-slate-400" style={{ height }}>
        データがありません
      </div>
    );
  }

  const temps = uonzuData.get(MetricKey.av_avtemp);
  const lows = uonzuData.get(MetricKey.av_lwtemp);
  const highs = uonzuData.get(MetricKey.av_hitemp);
  const bars = selectedBar ? uonzuData.get(selectedBar) ?? [] : [];
  const threshold = isDaily ? 200 : 500;
  // ===== 棒グラフ切り替え =====
  const getBarData = () => {
    if (!selectedBar) return { label: "データなし", data: [], backgroundColor: "#ccc" };

    const maxBar = bars.length > 0 ? Math.max(...bars.map((v) => v || 0)) : 0;

    let backgroundColor = (selectedBar.color || "#cccccc").slice(0, 7) + "99"; // Add transparency

    // 特殊ルール: 降水量が多すぎる場合は色を濃くする (既存ロジックの継承)
    if (selectedBar.key === "sm_rain") {
      backgroundColor = maxBar > threshold ? "#1e60cc99" : "#1eaadd99";
    }

    return {
      label: `${selectedBar.label || "項目"} (${
        selectedBar.unit === "時間" ? "h" : selectedBar.unit || ""
      })`,
      data: bars,
      backgroundColor,
    };
  };

  const barData = getBarData();
  const maxBarValue =
    bars.length > 0 ? Math.max(...bars.map((v) => v || 0)) : 0;

  const barMax = maxBarValue > threshold ? threshold * 2 : threshold;

  const barStepSize = barMax / 10;

  const datasets: any[] = [
    {
      ...barData,
      yAxisID: "bar",
      type: "bar" as const,
      borderWidth: 1,
    },
  ];

  if (temps) {
    datasets.push({
      label: "平均気温 (℃)",
      data: temps,
      yAxisID: "temp",
      type: "line" as const,
      borderColor: "#ffaf00e6",
      backgroundColor: "#ffaf00e6",
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.3,
    });
  }

  if (lows) {
    datasets.push({
      label: "最低気温 (℃)",
      data: lows,
      yAxisID: "temp",
      type: "line" as const,
      borderColor: "#4b4be6e6",
      backgroundColor: "#4b4be6e6",
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.3,
    });
  }

  if (highs) {
    datasets.push({
      label: "最高気温 (℃)",
      data: highs,
      yAxisID: "temp",
      type: "line" as const,
      borderColor: "#ff4b4be6",
      backgroundColor: "#ff4b4be6",
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.3,
    });
  }

  const chartData = {
    labels: displayLabels,
    datasets,
  };

  const options = {
    responsive: true,
    interaction: { mode: "index" as const, intersect: false },
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          color: "#64748b",
          font: { size: 10 },
        },
      },
      bar: {
        type: "linear" as const,
        position: "left" as const,
        min: 0,
        max: barMax,
        grid: { drawOnChartArea: false },

        ticks: {
          stepSize: barStepSize,
          color: "#64748b",
          font: { size: 10 },
          callback: (value: any) => `${value}`,
        },
      },
      temp: {
        type: "linear" as const,
        position: "right" as const,
        min: -20,
        max: 40,
        grid: { color: "#f1f5f9" },
        ticks: {
          stepSize: 5,
          color: "#64748b",
          font: { size: 10 },
          callback: (value: any) => `${value}`,
        },
      },
    },
    plugins: {
      legend: {
        display: !hideLegend,
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "#fffffff2",
        titleColor: "#334155",
        bodyColor: "#475569",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div
      className="w-full relative flex-none p-2"
      style={{ height, minHeight: height, maxHeight: height }}
    >
      <Chart
        type="bar"
        data={chartData}
        options={options}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default UonzuChart;
