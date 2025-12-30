import React, { useMemo, useState } from "react";
import { FaChartPie } from "react-icons/fa";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { COLOR_MAP } from "../utils/colorUtils"; // カラーマップ

// ==============================
// Types
// ==============================
interface MonthlyDataValue {
  value: number;
  rank?: {
    top?: number;
    bot?: number;
    island?: number;
    region?: number;
    pre?: number;
    meteo?: number;
  };
}

interface MonthlyDataSource {
  [month: string]: MonthlyDataValue; // "all", "1", "2", etc.
}

interface StationData {
  data: {
    [key: string]: MonthlyDataSource; // e.g., hitemp_35, av_avtemp
  };
}

interface ChartDataItem {
  name: string;
  value: number; // percentage for pie chart
  key: string;
  rawValue: number | null; // actual day count
  rank: number | null; // rank for the rawValue
  [key: string]: any; // Add index signature
}

interface LayeredPieChartProps {
  station: StationData;
  regionColor: string;
}

// ==============================
// Constants and Helpers
// ==============================
const MONTH_DAYS = [31, 28.2, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function colorWithAlpha(color: string, alpha: number = 0.7): string {
  if (color.startsWith("rgba")) return color.replace(/1\)$/, `${alpha})`);
  const bigint = parseInt(color.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

const TYPE_KEYS: { [key: string]: string[] } = {
  temp: ["hitemp_35", "hitemp_30", "hitemp_25", "hitemp_0", "lwtemp_0"],
  wind: ["wind_30", "wind_20", "wind_15", "wind_10"],
  rain: ["rain_100", "rain_70", "rain_50", "rain_30", "rain_10", "rain_1"],
  snowed: ["snowed_100", "snowed_50", "snowed_20", "snowed_10", "snowed_5"],
  snowing: ["snowing_50", "snowing_20", "snowing_10", "snowing_5", "snowing_3"],
};

function computeLayeredValues(
  values: (number | null)[],
  type: string,
  monthDays: number = 365
): number[] | null {
  if (!values || values.some(v => v === null)) return null; // Ensure all values are numbers

  const layered: number[] = [];
  if (type === "temp") {
    const [h35, h30, h25, h0, lw0] = values as number[]; // Cast to number[] after null check
    layered.push(h35);
    layered.push(h30 - h35);
    layered.push(h25 - h30);
    layered.push(monthDays - h25 - lw0);
    layered.push(lw0 - h0);
    layered.push(h0);
  } else {
    const numericValues = values as number[]; // Cast to number[]
    layered.unshift(monthDays - numericValues[numericValues.length - 1]);
    for (let i = numericValues.length - 1; i > 0; i--) {
      layered.unshift(numericValues[i] - numericValues[i - 1]);
    }
    layered.unshift(numericValues[0]);
  }
  return layered;
}

function prepareChartData(
  stationData: StationData["data"],
  type: string,
  month: number | null = null,
  rankType: string = "top"
): ChartDataItem[] | null {
  const rankKeyMap: { [key: string]: keyof MonthlyDataValue["rank"] } = {
    降順: "top",
    昇順: "bot",
    島除く: "island",
    地方別: "region",
    県別: "pre",
    気象台: "meteo",
  };
  const currentRankKey = rankKeyMap[rankType] || "top";

  if (!stationData || !TYPE_KEYS[type]) return null;

  const keys = TYPE_KEYS[type];
  const target = month ? month.toString() : "all";

  let raw = keys.map((key) => {
    const obj = stationData[key]?.[target];
    return {
      value: obj?.value ?? null,
      rank: obj?.rank ?? null,
    };
  });

  const hasAnyData = raw.some((x) => x.value != null);
  if (!hasAnyData) return null;

  const rawValues = raw.map((x) => x.value);
  const monthDays = month ? MONTH_DAYS[month - 1] : 365;
  const layered = computeLayeredValues(rawValues, type, monthDays);

  if (!layered) return null;
  const total = layered.reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  let mapIndices: (number | null)[] = [];
  if (type === "temp") {
    mapIndices = [0, 1, 2, null, 4, 3];
  } else {
    mapIndices = Array.from({ length: layered.length }, (_, i) =>
      i < keys.length ? i : null
    );
  }

  return layered.map((v, i) => {
    const mappedIdx = mapIndices[i];

    const tableValue = mappedIdx != null ? raw[mappedIdx].value : null;
    const tableRank =
      mappedIdx != null && raw[mappedIdx].rank
        ? raw[mappedIdx].rank[currentRankKey]
        : null;

    let name: string;
    if (type === "temp") {
      name = [
        "1.猛暑日",
        "2.真夏日",
        "3.夏日",
        "4.その他",
        "5.冬日",
        "6.真冬日",
      ][i];
    } else if (type === "wind") {
      name = [
        "1.~10m/s",
        "2.10~15m/s",
        "3.15~20m/s",
        "4.20~30m/s",
        "5.30m/s~",
      ].reverse()[i];
    } else if (type === "rain") {
      name = [
        "1.~1mm",
        "2.1~10mm",
        "3.10~30mm",
        "4.30~50mm",
        "5.50~70mm",
        "6.70~100mm",
        "7.100mm~",
      ].reverse()[i];
    } else if (type.startsWith("snowed")) {
      name = [
        "1.~5cm",
        "2.5~10cm",
        "3.10~20cm",
        "4.20~50cm",
        "5.50~100cm",
        "6.100cm~",
      ].reverse()[i];
    } else if (type.startsWith("snowing")) {
      name = [
        "1.~3cm",
        "2.3~5cm",
        "3.5~10cm",
        "4.10~20cm",
        "5.20~50cm",
        "6.50cm~",
      ].reverse()[i];
    } else {
      name = keys[i] ?? `extra_${i}`;
    }

    return {
      name,
      value: (v / total) * 100,
      key: mappedIdx != null ? keys[mappedIdx] : `extra_${i}`,
      rawValue: tableValue,
      rank: tableRank,
    };
  });
}

// ==============================
// Component
// ==============================
const LayeredPieChart: React.FC<LayeredPieChartProps> = ({
  station,
  regionColor,
}) => {
  const [rankType, setRankType] = useState<string>("降順");
  const availableRankTypes = useMemo(() => {
    const types = new Set<string>();
    if (station && station.data) {
      Object.values(station.data).forEach(fieldData => {
        Object.values(fieldData).forEach(monthData => {
          if (monthData.rank) {
            Object.keys(monthData.rank).forEach((key) => {
              switch (key) {
                case "top":
                  types.add("降順");
                  break;
                case "bot":
                  types.add("昇順");
                  break;
                case "island":
                  types.add("島除く");
                  break;
                case "region":
                  types.add("地方別");
                  break;
                case "pre":
                  types.add("県別");
                  break;
                case "meteo":
                  types.add("気象台");
                  break;
              }
            });
          }
        });
      });
    }
    return types;
  }, [station]);

  const rankOptions = [
    "降順",
    "昇順",
    "島除く",
    "地方別",
    "県別",
    "気象台",
  ].filter((opt) => availableRankTypes.has(opt));

  const [type, setType] = useState<string>("temp");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const data = useMemo(
    () => prepareChartData(station.data, type, selectedMonth, rankType),
    [station.data, type, selectedMonth, rankType]
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const typesOption = [
    { key: "temp", label: "気温" },
    { key: "wind", label: "風速" },
    { key: "rain", label: "降水" },
    { key: "snowing", label: "降雪" },
    { key: "snowed", label: "積雪" },
  ];
  const size = 240;
  return (
    <div>
      <div>
        <div
          className="flex flex-row items-center justify-between w-full z-10 p-1 rounded"
          style={{ backgroundColor: regionColor }}
        >
          <h2 className="flex items-center font-bold text-base sm:text-xl text-left gap-1">
            <FaChartPie />
            割合データ
          </h2>

          <div className="flex sm:gap-4 gap-1 flex-wrap">
            <div>
              <label className="text-xs sm:text-base mr-2">種別:</label>
              <select
                className="border rounded sm:px-1 py-0.5 text-xs sm:text-base"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {typesOption.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs mr-2 sm:text-base">月:</label>
              <select
                className="border rounded sm:px-1 py-0.5 text-xs sm:text-base"
                value={selectedMonth ?? "all"}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value === "all" ? null : Number(e.target.value)
                  )
                }
              >
                <option value="all">通年</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}月
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs sm:text-base mr-2">順位:</label>
              <select
                value={rankType}
                onChange={(e) => setRankType(e.target.value)}
                className="border rounded sm:px-1 py-0.5 text-xs sm:text-base"
              >
                {rankOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm mb-2">
        <div>
          ・気温、降水、風速、降雪、積雪について割合データをまとめました。
        </div>
        <div>・メニューからデータ種別と月を選ぶことができます。</div>
      </div>
      <div className={`sm:flex flex-col w-full sm:flex-row items-start gap-2`}>
        {data && data.length > 0 ? (
          <>
            <div className="flex-1 min-w-0 flex justify-center items-center">
              <PieChart width={size} height={size}>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx={size / 2}
                  cy={size / 2}
                  outerRadius={size / 2.3}
                  startAngle={90}
                  endAngle={450}
                  isAnimationActive={true}
                  animationDuration={700}
                  animationBegin={0}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={colorWithAlpha(COLOR_MAP[entry.name])}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
              </PieChart>
            </div>

            <div className="flex-1 min-w-0 px-4 pt-2 sm:pt-0">
              <table className="w-full border border-gray-300 table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-2 py-1 text-sm">
                      項目
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-sm">
                      日数
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-sm">
                      割合
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-sm">
                      順位
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((entry, i) => {
                    const totalDays = selectedMonth
                      ? MONTH_DAYS[selectedMonth - 1]
                      : 365;

                    const days =
                      entry.rawValue != null
                        ? entry.rawValue.toFixed(1)
                        : ((entry.value / 100) * totalDays).toFixed(1);

                    const percent =
                      entry.rawValue != null
                        ? ((entry.rawValue / totalDays) * 100).toFixed(1) + "%"
                        : entry.value.toFixed(1) + "%";

                    const bgColor = colorWithAlpha(COLOR_MAP[entry.name]);
                    const rank = entry.rank;

                    return (
                      <tr key={entry.name}>
                        <td
                          className="border border-gray-300 px-2 py-1 text-sm "
                          style={{ backgroundColor: bgColor }}
                        >
                          {entry.name.replace(/^\d+\./, "")}
                        </td>

                        <td className="border border-gray-300 px-2 py-1 text-sm">
                          {days}
                        </td>

                        <td className="border border-gray-300 px-2 py-1 text-sm">
                          {percent}
                        </td>

                        <td className="border border-gray-300 px-2 py-1 text-sm">
                          {rank ?? "--"}位
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center w-full h-60 text-gray-500 text-lg">
            データなし
          </div>
        )}
      </div>
    </div>
  );
};

export default LayeredPieChart;
