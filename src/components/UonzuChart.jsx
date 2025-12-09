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
import { useEffect, useState } from "react";
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

export default function UonzuChart({
  station,
  temp,
  rain,
  lwtemp,
  hitemp,
  snowing,
  sun,
  selectedBar, // ←追加
}) {
  // useState は削除
  const [dataObj, setDataObj] = useState(null);

  useEffect(() => {
    if (temp && rain && lwtemp && hitemp) {
      setDataObj({
        data: {
          av_avtemp: temp.reduce(
            (acc, v, i) => ((acc[i + 1] = { value: v }), acc),
            {}
          ),
          av_lwtemp: lwtemp.reduce(
            (acc, v, i) => ((acc[i + 1] = { value: v }), acc),
            {}
          ),
          av_hitemp: hitemp.reduce(
            (acc, v, i) => ((acc[i + 1] = { value: v }), acc),
            {}
          ),
          sm_rain: rain.reduce(
            (acc, v, i) => ((acc[i + 1] = { value: v }), acc),
            {}
          ),
          sm_snowing:
            snowing?.reduce(
              (acc, v, i) => ((acc[i + 1] = { value: v }), acc),
              {}
            ) || {},
          sm_sun:
            sun?.reduce(
              (acc, v, i) => ((acc[i + 1] = { value: v }), acc),
              {}
            ) || {},
        },
      });
      return;
    }

    if (typeof station === "object") {
      setDataObj(station);
      return;
    }

    setDataObj(null);
  }, [station, temp, rain, lwtemp, hitemp, snowing, sun]);

  if (!dataObj) return <div>データなし</div>;

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const getBarData = () => {
    switch (selectedBar) {
      case "rain": {
        const rains = months.map(
          (_, i) => dataObj.data.sm_rain[i + 1]?.value ?? 0
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
            (_, i) => dataObj.data.sm_snowing[i + 1]?.value ?? 0
          ),
          backgroundColor: "rgba(75,192,75,0.6)",
        };
      case "sun":
        return {
          label: "日照時間 (h)",
          data: months.map((_, i) => dataObj.data.sm_sun[i + 1]?.value ?? 0),
          backgroundColor: "rgba(255,175,0,0.6)",
        };
      default:
        return { label: "", data: [], backgroundColor: "transparent" };
    }
  };

  const monthlyTemp = dataObj.data.av_avtemp;
  const monthlyLow = dataObj.data.av_lwtemp;
  const monthlyHigh = dataObj.data.av_hitemp;

  const temps = months.map((_, i) => monthlyTemp[i + 1]?.value ?? null);
  const lows = months.map((_, i) => monthlyLow[i + 1]?.value ?? null);
  const highs = months.map((_, i) => monthlyHigh[i + 1]?.value ?? null);

  const barData = getBarData();
  const maxBarValue = Math.max(...barData.data);

  const chartData = {
    labels: months,
    datasets: [
      {
        ...barData,
        yAxisID: "bar",
        type: "bar",
        borderWidth: 1,
      },
      {
        label: "平均気温 (℃)",
        data: temps,
        yAxisID: "temp",
        type: "line",
        borderColor: "rgba(255, 175, 0, 0.9)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "平均最低気温 (℃)",
        data: lows,
        yAxisID: "temp",
        type: "line",
        borderColor: "rgba(75, 75, 255, 0.9)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "平均最高気温 (℃)",
        data: highs,
        yAxisID: "temp",
        type: "line",
        borderColor: "rgba(255, 75, 75, 0.9)",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 } },
      bar: {
        type: "linear",
        position: "left",
        min: 0,
        max: maxBarValue > 500 ? 1000 : 500,
      },
      temp: {
        type: "linear",
        position: "right",
        min: -15,
        max: 35,
        grid: { drawOnChartArea: false },
      },
    },
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center h-[350px]">
      <Chart data={chartData} options={options} />
    </div>
  );
}
