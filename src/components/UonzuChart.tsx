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
import { MetricKey } from "../utils/metric";

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
// Props（シンプル化）
// ==============================
interface UonzuChartProps {
  uonzuData: UonzuData; // 必須にする
  selectedBar: "rain" | "snowing" | "sun";
  height?: string;
}

// ==============================
// Component
// ==============================
const UonzuChart: React.FC<UonzuChartProps> = ({
  uonzuData,
  selectedBar,
  height = "350px",
}) => {
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  // ===== データ取得（全部ここで統一） =====
  const temps = uonzuData.get(MetricKey.av_avtemp) ?? [];
  const lows = uonzuData.get(MetricKey.av_lwtemp) ?? [];
  const highs = uonzuData.get(MetricKey.av_hitemp) ?? [];
  const rains = uonzuData.get(MetricKey.sm_rain) ?? [];
  const snowings = uonzuData.get(MetricKey.sm_snowing) ?? [];
  const suns = uonzuData.get(MetricKey.sm_sun) ?? [];

  // ===== 棒グラフ切り替え =====
  const getBarData = () => {
    switch (selectedBar) {
      case "rain": {
        const maxRain = Math.max(...rains);
        return {
          label: "降水量 (mm)",
          data: rains,
          backgroundColor:
            maxRain > 500 ? "rgba(100,100,255,0.6)" : "rgba(54,162,235,0.6)",
        };
      }
      case "snowing":
        return {
          label: "降雪量 (cm)",
          data: snowings,
          backgroundColor: "rgba(75,192,75,0.6)",
        };
      case "sun":
        return {
          label: "日照時間 (h)",
          data: suns,
          backgroundColor: "rgba(255,175,0,0.6)",
        };
      default:
        return { label: "", data: [], backgroundColor: "transparent" };
    }
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
      x: { ticks: { autoSkip: false } },
      bar: {
        type: "linear" as const,
        position: "left" as const,
        min: 0,
        max: maxBarValue > 500 ? 1000 : 500,
      },
      temp: {
        type: "linear" as const,
        position: "right" as const,
        min: -15,
        max: 35,
        grid: { drawOnChartArea: false },
      },
    },
    plugins: { legend: { position: "bottom" as const } },
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center"
      style={{ height }}
    >
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
};

export default UonzuChart;
