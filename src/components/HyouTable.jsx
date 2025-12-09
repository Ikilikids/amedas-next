// src/components/HyouTable.jsx
import { useState } from "react";
import { CiViewTable } from "react-icons/ci";
import { slugMonthMap } from "../utils/colorUtils";

// 🟢 2色間の補間
function mixColor(c1, c2, t) {
  const rgb1 = c1.match(/\d+/g).map(Number);
  const rgb2 = c2.match(/\d+/g).map(Number);
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
  return `rgb(${r},${g},${b})`;
}

// 🟢 値に応じた背景色
function getColor(type, val, isAnnual = false) {
  if (val === "--" || isNaN(val)) return "white";
  const v = Number(val);

  let min, mid, max;
  let colors;

  switch (type) {
    case "temp":
      min = -15;
      mid = 10;
      max = 35;

      colors = ["rgb(100,180,255)", "rgb(255,255,255)", "rgb(255,70,70)"];
      break;
    case "rain":
      if (isAnnual) {
        min = 0;
        mid = 1600;
        max = 4600;
      } else {
        min = 0;
        mid = 200;
        max = 1000;
      }
      colors = ["rgb(255,255,255)", "rgb(120,180,255)", "rgb(100,80,255)"];
      break;
    case "snow":
      if (isAnnual) {
        min = 0;
        mid = 450;
        max = 1700;
      } else {
        min = 0;
        mid = 50;
        max = 450;
      }
      colors = ["rgb(255,255,255)", "rgb(120,230,245)", "rgb(30,255,150)"];
      break;
    case "sun":
      if (isAnnual) {
        min = 0;
        mid = 1800;
        max = 2800;
      } else {
        min = 0;
        mid = 150;
        max = 300;
      }
      colors = ["rgb(220,220,220)", "rgb(255,255,130)", "rgb(255,180,50)"];
      break;
    case "wind":
      min = 0;
      mid = 3;
      max = 10;
      colors = ["rgb(255,255,255)", "rgb(175,255,200)", "rgb(50,255,75)"];
      break;
    default:
      return "white";
  }

  let t;
  if (v <= mid) {
    t = (v - min) / (mid - min);
    return mixColor(colors[0], colors[1], t);
  } else {
    t = (v - mid) / (max - mid);
    return mixColor(colors[1], colors[2], t);
  }
}

export default function HyouTable({ station, regionColor }) {
  const [rankType, setRankType] = useState("降順");

  const months = Object.entries(slugMonthMap).map(([slug, label]) => ({
    slug,
    label,
  }));

  const emptyMonthlyData = () => months.map(() => ({ val: "--", rank: "--" }));

  const mapValueRank = (monthlyData = {}, isSnow = false) =>
    months.map((m) => {
      const monthEntry = monthlyData[m.slug] || {};
      let val = monthEntry.value ?? "--";
      if (!isSnow && typeof val === "number") val = val.toFixed(1);

      // rankType に応じた順位取得
      let rank;
      switch (rankType) {
        case "降順":
          rank = monthEntry.rank?.top ?? "--";
          break;
        case "昇順":
          rank = monthEntry.rank?.bot ?? "--";
          break;
        case "地方別":
          rank = monthEntry.rank?.region ?? "--";
          break;
        case "県別":
          rank = monthEntry.rank?.pre ?? "--";
          break;
        case "島除く":
          rank = monthEntry.rank?.island ?? "--";
          break;
        case "気象台":
          rank = monthEntry.rank?.meteo ?? "--";
          break;
        default:
          rank = monthEntry.rank?.top ?? "--";
      }

      return { val, rank };
    });

  // station データ
  const avTemps = station
    ? mapValueRank(station.data.av_avtemp || {})
    : emptyMonthlyData();
  const hiTemps = station
    ? mapValueRank(station.data.av_hitemp || {})
    : emptyMonthlyData();
  const lwTemps = station
    ? mapValueRank(station.data.av_lwtemp || {})
    : emptyMonthlyData();
  const rains = station
    ? mapValueRank(station.data.sm_rain || {})
    : emptyMonthlyData();
  const snows = station
    ? mapValueRank(station.data.sm_snowing || {}, true)
    : emptyMonthlyData();
  const suns = station
    ? mapValueRank(station.data.sm_sun || {})
    : emptyMonthlyData();
  const winds = station
    ? mapValueRank(station.data.av_wind || {})
    : emptyMonthlyData();

  const renderRow = (label, dataArray, unit, type) => (
    <tr key={label}>
      <td className="border border-gray-300 w-16 h-7 sm:h-10 text-center align-middle font-bold text-xs sm:text-sm">
        {label}
        <br />
        <span className="text-[10px] sm:text-xs">({unit})</span>
      </td>
      {dataArray.map((d, i) => {
        const isAnnual = months[i].slug === "all"; // ←ここ
        const bgColor = getColor(type, d.val, isAnnual);
        return (
          <td
            key={i}
            className="border border-gray-300 w-12 h-7 sm:h-10 text-center align-middle text-xs sm:text-sm"
            style={{ backgroundColor: bgColor }}
          >
            <div className="flex flex-col justify-center items-center">
              <span>{d.val}</span>
              <small className="text-gray-700">
                {d.rank !== "--" ? `(${d.rank})` : "(--)"}
              </small>
            </div>
          </td>
        );
      })}
    </tr>
  );
  // 利用可能なランキングキーを収集
  const availableRankTypes = new Set();
  if (station) {
    Object.values(station.data.av_avtemp || {}).forEach((monthData) => {
      if (monthData.rank) {
        Object.keys(monthData.rank).forEach((key) => {
          switch (key) {
            case "top":
              availableRankTypes.add("降順");
              break;
            case "bot":
              availableRankTypes.add("昇順");
              break;
            case "island":
              availableRankTypes.add("島除く");
              break;
            case "region":
              availableRankTypes.add("地方別");
              break;
            case "pre":
              availableRankTypes.add("県別");
              break;
            case "pre":
              availableRankTypes.add("気象台");
              break;
          }
        });
      }
    });
  }
  const rankOptions = [
    "降順",
    "昇順",
    "島除く",
    "地方別",
    "県別",
    "気象台",
  ].filter((opt) => availableRankTypes.has(opt));

  return (
    <div className="w-full h-full flex flex-col items-left">
      {/* タイトルとプルダウン横並び */}
      <div
        className="flex flex-row items-center justify-between w-full mb-2 sm:mb-4 sticky top-0 z-10 p-1 rounded"
        style={{ backgroundColor: regionColor }}
      >
        <h2 className="flex items-center font-bold text-base sm:text-xl text-left gap-1">
          <CiViewTable />
          月別気候表
        </h2>
        <div>
          <label className="text-sm sm:text-base mr-2">絞り込み:</label>
          <select
            value={rankType}
            onChange={(e) => setRankType(e.target.value)}
            className="border rounded px-1 py-0.5 text-sm sm:text-base"
          >
            {rankOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-sm mb-2">
        <div>
          ・平均・最高・最低気温、降水、降雪、日照、風速の月別値を表にまとめました。
        </div>
        <div>
          ・下段はランキングを示しており、メニューからランキング範囲を絞り込むことができます。
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-max flex justify-center">
          <table className="border-collapse table-fixed text-center shadow-md">
            <thead>
              <tr className="bg-gray-100 text-xs sm:text-sm">
                <th className="border border-gray-300 w-19 h-7 sm:h-10">
                  項目
                </th>
                {months.map((m) => (
                  <th
                    key={m.slug}
                    className="border border-gray-300 w-16 h-7 sm:h-10"
                  >
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderRow("平均気温", avTemps, "℃", "temp")}
              {renderRow("最高気温", hiTemps, "℃", "temp")}
              {renderRow("最低気温", lwTemps, "℃", "temp")}
              {renderRow("降水量", rains, "mm", "rain")}
              {renderRow("積雪量", snows, "cm", "snow")}
              {renderRow("日照時間", suns, "h", "sun")}
              {renderRow("平均風速", winds, "m/s", "wind")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
