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
import React, { useMemo } from "react";
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

// ==============================
// Types
// ==============================
interface MonthlyValue {
  value: number | null;
}

interface MonthlyData {
  [month: string]: MonthlyValue;
}

interface ChartData {
  data: {
    av_avtemp: MonthlyData;
    av_lwtemp: MonthlyData;
    av_hitemp: MonthlyData;
    sm_rain: MonthlyData;
    sm_snowing?: MonthlyData;
    sm_sun?: MonthlyData;
  };
}

interface UonzuChartProps {
  station?: ChartData;
  temp?: (number | null)[];
  rain?: (number | null)[];
  lwtemp?: (number | null)[];
  hitemp?: (number | null)[];
  snowing?: (number | null)[];
  sun?: (number | null)[];
  selectedBar: "rain" | "snowing" | "sun";
  height?: string;
}

// Helper to convert array to MonthlyData format for consistency
const arrayToMonthlyData = (arr: (number | null)[]): MonthlyData => {
  return arr.reduce((acc, v, i) => {
    if (v !== null) {
      acc[(i + 1).toString()] = { value: v };
    }
    return acc;
  }, {} as MonthlyData);
};

// ==============================
// Component
// ==============================
const UonzuChart: React.FC<UonzuChartProps> = ({
  station,
  temp,
  rain,
  lwtemp,
  hitemp,
  snowing,
  sun,
  selectedBar,
  height = "350px",
}) => {
  const dataObj = useMemo(() => {
    if (temp && rain && lwtemp && hitemp) {
      return {
        data: {
          av_avtemp: arrayToMonthlyData(temp),
          av_lwtemp: arrayToMonthlyData(lwtemp),
          av_hitemp: arrayToMonthlyData(hitemp),
          sm_rain: arrayToMonthlyData(rain),
          sm_snowing: snowing ? arrayToMonthlyData(snowing) : {},
          sm_sun: sun ? arrayToMonthlyData(sun) : {},
        },
      };
    }
    if (typeof station === "object" && station !== null) {
      return station;
    }
    return null;
  }, [station, temp, rain, lwtemp, hitemp, snowing, sun]);

  if (!dataObj) return <div>データなし</div>;

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const getBarData = () => {
    switch (selectedBar) {
      case "rain": {
        const rains = months.map(
          (m) => dataObj.data.sm_rain[m]?.value ?? 0
        );
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
          data: months.map(
            (m) => dataObj.data.sm_snowing?.[m]?.value ?? 0
          ),
          backgroundColor: "rgba(75,192,75,0.6)",
        };
      case "sun":
        return {
          label: "日照時間 (h)",
          data: months.map((m) => dataObj.data.sm_sun?.[m]?.value ?? 0),
          backgroundColor: "rgba(255,175,0,0.6)",
        };
      default:
        return { label: "", data: [], backgroundColor: "transparent" };
    }
  };

  const monthlyTemp = dataObj.data.av_avtemp;
  const monthlyLow = dataObj.data.av_lwtemp;
  const monthlyHigh = dataObj.data.av_hitemp;

  const temps = months.map((m) => monthlyTemp[m]?.value ?? null);
  const lows = months.map((m) => monthlyLow[m]?.value ?? null);
  const highs = months.map((m) => monthlyHigh[m]?.value ?? null);

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
        fill: false,
      },
      {
        label: "最低気温 (℃)",
        data: lows,
        yAxisID: "temp",
        type: "line" as const,
        borderColor: "rgba(75, 75, 255, 0.9)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "最高気温 (℃)",
        data: highs,
        yAxisID: "temp",
        type: "line" as const,
        borderColor: "rgba(255, 75, 75, 0.9)",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index" as const, intersect: false },
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 } },
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
