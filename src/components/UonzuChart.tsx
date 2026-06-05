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
import { METRIC_CATEGORY_KEYS, MetricKey, MetricMeta } from "../utils/metric";

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
  height?: string;
  hideLegend?: boolean;
}

// ==============================
// Component
// ==============================
const UonzuChart: React.FC<UonzuChartProps> = ({
  uonzuData,
  selectedBar,
  height = "350px",
  hideLegend = false,
}) => {
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  // ===== データ取得 =====
  const temps = uonzuData.get(MetricKey.av_avtemp) ?? [];
  const lows = uonzuData.get(MetricKey.av_lwtemp) ?? [];
  const highs = uonzuData.get(MetricKey.av_hitemp) ?? [];
  const bars = uonzuData.get(selectedBar) ?? [];

  // ===== 棒グラフ切り替え =====
  const getBarData = () => {
    const maxBar = Math.max(...bars);
    const category = METRIC_CATEGORY_KEYS[selectedBar.category];

    let backgroundColor = category.color + "99"; // Add transparency

    // 特殊ルール: 降水量が多すぎる場合は色を濃くする (既存ロジックの継承)
    if (selectedBar.key === "sm_rain" && maxBar > 500) {
      backgroundColor = "rgba(100,100,255,0.6)";
    }

    return {
      label: `${selectedBar.label} (${
        selectedBar.unit === "時間" ? "h" : selectedBar.unit
      })`,
      data: bars,
      backgroundColor,
    };
  };

  const barData = getBarData();
  const maxBarValue = Math.max(...barData.data);

  const chartData = {
    labels: months,
    datasets: [
      {
        ...barData,
        yAxisID: "bar",
        type: "bar" as const,
        borderWidth: 1,
      },
      {
        label: "平均気温 (℃)",
        data: temps,
        yAxisID: "temp",
        type: "line" as const,
        borderColor: "rgba(255, 175, 0, 0.9)",
        tension: 0.3,
      },
      {
        label: "最低気温 (℃)",
        data: lows,
        yAxisID: "temp",
        type: "line" as const,
        borderColor: "rgba(75, 75, 255, 0.9)",
        tension: 0.3,
      },
      {
        label: "最高気温 (℃)",
        data: highs,
        yAxisID: "temp",
        type: "line" as const,
        borderColor: "rgba(255, 75, 75, 0.9)",
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
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      bar: {
        type: "linear" as const,
        position: "left" as const,
        min: 0,
        max: maxBarValue > 500 ? 1000 : 500,
        ticks: {
          stepSize: maxBarValue > 500 ? 100 : 50,
        },
      },
      temp: {
        type: "linear" as const,
        position: "right" as const,
        min: -15,
        max: 35,
        grid: { drawOnChartArea: false },
        ticks: {
          stepSize: 5,
        },
      },
    },
    plugins: {
      legend: {
        display: !hideLegend,
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 20,
        },
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
