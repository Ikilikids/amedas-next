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
import { UonzuData } from "../../types/all";
import { MetricKey, MetricMeta } from "../../setting/metric";

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
interface CompareUonzuChartProps {
  uonzuData1: UonzuData;
  uonzuData2: UonzuData;
  name1: string;
  name2: string;
  selectedBar: MetricMeta;
  height?: string;
  hideLegend?: boolean;
}

// ==============================
// Component
// ==============================
const CompareUonzuChart: React.FC<CompareUonzuChartProps> = ({
  uonzuData1,
  uonzuData2,
  name1,
  name2,
  selectedBar,
  height = "350px",
  hideLegend = false,
}) => {
  const labels = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  // ===== データ取得 1 =====
  const temps1 = uonzuData1.get(MetricKey.av_avtemp);
  const lows1 = uonzuData1.get(MetricKey.av_lwtemp);
  const highs1 = uonzuData1.get(MetricKey.av_hitemp);
  const bars1 = uonzuData1.get(selectedBar) ?? [];

  // ===== データ取得 2 =====
  const temps2 = uonzuData2.get(MetricKey.av_avtemp);
  const lows2 = uonzuData2.get(MetricKey.av_lwtemp);
  const highs2 = uonzuData2.get(MetricKey.av_hitemp);
  const bars2 = uonzuData2.get(selectedBar) ?? [];

  // ===== スケール計算 =====
  const allBars = [...bars1, ...bars2].filter((v): v is number => v !== null);
  const maxBarValue = allBars.length > 0 ? Math.max(...allBars) : 0;

  // 1000mm以上の対応
  let barMax = 500;
  if (maxBarValue > 500) barMax = 1000;
  else if (maxBarValue > 250) barMax = 500;
  else barMax = 250;

  const barStepSize = barMax / 10;

  const datasets: any[] = [
    // Station 1: Bar (Left)
    {
      label: `${name1} - ${selectedBar.label}`,
      data: bars1,
      yAxisID: "bar",
      type: "bar" as const,
      backgroundColor: selectedBar.color.slice(0, 7) + "cc",
      borderWidth: 0,
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      order: 1,
    },
    // Station 2: Bar (Right)
    {
      label: `${name2} - ${selectedBar.label}`,
      data: bars2,
      yAxisID: "bar",
      type: "bar" as const,
      backgroundColor: "#94a3b8cc", // Slate 400 with alpha
      borderWidth: 0,
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      order: 1,
    },
    // Station 1: Temps (Solid)
    {
      label: `${name1} - 平均気温`,
      data: temps1,
      yAxisID: "temp",
      type: "line" as const,
      borderColor: "#ffaf00e6",
      backgroundColor: "#ffaf00e6",
      borderWidth: 3,
      pointRadius: 2,
      pointBackgroundColor: "#ffaf00e6",
      pointBorderWidth: 1,
      tension: 0.3,
      order: 0,
    },
    // Station 2: Temps (Dashed)
    {
      label: `${name2} - 平均気温`,
      data: temps2,
      yAxisID: "temp",
      type: "line" as const,
      borderColor: "#ffaf00e6",
      backgroundColor: "#ffaf00e6",
      borderWidth: 2,
      borderDash: [5, 5],
      pointRadius: 2,
      pointBackgroundColor: "#ffffff",
      pointBorderWidth: 1,
      tension: 0.3,
      order: 0,
    },
  ];

  // 最高・最低気温も追加
  if (highs1) {
    datasets.push({
      label: `${name1} - 最高気温`,
      data: highs1,
      yAxisID: "temp",
      type: "line" as const,
      borderColor: "#ff4b4be6",
      borderWidth: 1.5,
      pointRadius: 2,
      pointBackgroundColor: "#ff4b4be6",
      pointBorderWidth: 1,
      tension: 0.3,
      order: 0,
    });
  }
  if (highs2) {
    datasets.push({
      label: `${name2} - 最高気温`,
      data: highs2,
      yAxisID: "temp",
      type: "line" as const,
      borderColor: "#ff4b4be6",
      borderWidth: 1.5,
      borderDash: [3, 3],
      pointRadius: 2,
      pointBackgroundColor: "#ffffff",
      pointBorderWidth: 1,
      tension: 0.3,
      order: 0,
    });
  }
  if (lows1) {
    datasets.push({
      label: `${name1} - 最低気温`,
      data: lows1,
      yAxisID: "temp",
      type: "line" as const,
      borderColor: "#4b4be6e6",
      borderWidth: 1.5,
      pointRadius: 2,
      pointBackgroundColor: "#4b4be6e6",
      pointBorderWidth: 1,
      tension: 0.3,
      order: 0,
    });
  }
  if (lows2) {
    datasets.push({
      label: `${name2} - 最低気温`,
      data: lows2,
      yAxisID: "temp",
      type: "line" as const,
      borderColor: "#4b4be6e6",
      borderWidth: 1.5,
      borderDash: [3, 3],
      pointRadius: 2,
      pointBackgroundColor: "#ffffff",
      pointBorderWidth: 1,
      tension: 0.3,
      order: 0,
    });
  }

  const chartData = {
    labels,
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
        },
      },
      temp: {
        type: "linear" as const,
        position: "right" as const,
        min: -15,
        max: 35,
        grid: { color: "#f1f5f9" },
        ticks: {
          stepSize: 5,
          color: "#64748b",
          font: { size: 10 },
        },
      },
    },
    plugins: {
      legend: {
        display: !hideLegend,
        position: "bottom" as const,
        labels: {
          boxWidth: 8,
          padding: 10,
          font: { size: 9 },
          usePointStyle: true,
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

export default CompareUonzuChart;
