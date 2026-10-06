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
import { RawData } from "../../types/raw";
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
interface UonzuChartProps {
  rawData: RawData;
  rawData2?: RawData | null;
  selectedBar: MetricMeta;
  labels?: string[]; // Optional: defaults to 1..12
  tooltipLabels?: string[]; // Optional: label to show in tooltip (e.g. MM/DD)
  height?: string;
  hideLegend?: boolean;
}

// ==============================
// Component
// ==============================
const UonzuChart: React.FC<UonzuChartProps> = ({
  rawData,
  rawData2,
  selectedBar,
  labels,
  tooltipLabels,
  height = "350px",
  hideLegend = false,
}) => {
  const isDaily = !!labels;
  const isCompare = Boolean(rawData2);
  const defaultMonths = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString()
  );
  const displayLabels = labels || defaultMonths;

  const name1 = rawData.station?.station_name || "地点1";
  const name2 = rawData2?.station?.station_name || "地点2";

  // ===== データ取得 (日別なら全件、月別なら 0..11 の12ヶ月分) =====
  const getValues = (climateData: RawData["climateData"], meta: MetricMeta) => {
    if (!climateData) return null;
    const list = climateData[meta.key];
    if (!list) return null;
    const targetList = isDaily ? list : list.slice(0, 12);
    return targetList.map((e) => e?.value ?? null);
  };

  const temps1 = getValues(rawData.climateData, MetricKey.av_avtemp);
  const lows1 = getValues(rawData.climateData, MetricKey.av_lwtemp);
  const highs1 = getValues(rawData.climateData, MetricKey.av_hitemp);
  const bars1 = getValues(rawData.climateData, selectedBar) ?? [];

  const temps2 = isCompare ? getValues(rawData2!.climateData, MetricKey.av_avtemp) : null;
  const lows2 = isCompare ? getValues(rawData2!.climateData, MetricKey.av_lwtemp) : null;
  const highs2 = isCompare ? getValues(rawData2!.climateData, MetricKey.av_hitemp) : null;
  const bars2 = isCompare ? (getValues(rawData2!.climateData, selectedBar) ?? []) : [];

  // ===== スケール計算 (250 / 500 / 1000 の3段階) =====
  const allBars = isCompare ? [...bars1, ...bars2] : bars1;
  const maxBarValue =
    allBars.length > 0 ? Math.max(...allBars.map((v) => v || 0)) : 0;

  const barMax =
    maxBarValue > 500 ? 1000 : maxBarValue > 250 ? 500 : 250;
  const barStepSize = barMax / 10;

  // ===== データセット構築 =====
  const datasets: any[] = [];

  // --- 棒グラフの色 (降水量はスケールに応じて3段階で水色〜濃い青に変化) ---
  const barAlpha = "bb";
  let barBaseColor = selectedBar.color.slice(0, 7);
  if (selectedBar.key === "sm_rain") {
    if (barMax <= 250) {
      barBaseColor = "#38bdf8"; // 250以下: 明るい水色 (Sky 400)
    } else if (barMax <= 500) {
      barBaseColor = "#0284c7"; // 250〜500: 中間の水色・青 (Sky 600)
    } else {
      barBaseColor = "#1d4ed8"; // 500超: 濃い青 (Blue 700)
    }
  }
  const barColor1 = `${barBaseColor}${barAlpha}`;

  const barUnitLabel = selectedBar.unit === "h" ? "h" : selectedBar.unit;
  const barLabel1 = isCompare
    ? `${name1} - ${selectedBar.label}`
    : `${selectedBar.label} (${barUnitLabel})`;

  datasets.push({
    label: barLabel1,
    data: bars1,
    yAxisID: "bar",
    type: "bar" as const,
    backgroundColor: barColor1,
    borderWidth: 0,
    order: 1, // 折れ線グラフより奥に描画
    ...(isCompare
      ? { categoryPercentage: 0.8, barPercentage: 0.9 }
      : { borderWidth: 1 }),
  });

  if (isCompare) {
    datasets.push({
      label: `${name2} - ${selectedBar.label}`,
      data: bars2,
      yAxisID: "bar",
      type: "bar" as const,
      backgroundColor: "#94a3b8cc",
      borderWidth: 0,
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      order: 1, // 折れ線グラフより奥に描画
    });
  }

  // --- 気温折れ線グラフ (常に前面: order: 0、太さ・点線は一律統一) ---
  const lineConfigs = [
    { meta: MetricKey.av_avtemp, val1: temps1, val2: temps2 },
    { meta: MetricKey.av_lwtemp, val1: lows1, val2: lows2 },
    { meta: MetricKey.av_hitemp, val1: highs1, val2: highs2 },
  ];

  lineConfigs.forEach(({ meta, val1, val2 }) => {
    const color = `${meta.color}e6`;
    if (val1) {
      datasets.push({
        label: isCompare ? `${name1} - ${meta.label}` : `${meta.label} (℃)`,
        data: val1,
        yAxisID: "temp",
        type: "line" as const,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        pointRadius: 2,
        pointBackgroundColor: color,
        pointBorderWidth: 1,
        tension: 0.3,
        order: 0,
      });
    }
    if (isCompare && val2) {
      datasets.push({
        label: `${name2} - ${meta.label}`,
        data: val2,
        yAxisID: "temp",
        type: "line" as const,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 2,
        pointBackgroundColor: "#ffffff",
        pointBorderWidth: 1,
        tension: 0.3,
        order: 0,
      });
    }
  });

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
        callbacks: {
          title: (tooltipItems: any[]) => {
            if (!tooltipItems.length) return "";
            const index = tooltipItems[0].dataIndex;
            if (tooltipLabels && tooltipLabels[index] !== undefined) {
              return tooltipLabels[index];
            }
            return tooltipItems[0].label;
          },
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
