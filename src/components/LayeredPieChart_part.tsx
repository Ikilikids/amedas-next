import React from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { COLOR_MAP } from "../utils/colorUtils"; // カラーマップ

// ==============================
// Types
// ==============================
interface ChartDataEntry {
  name: string;
  value: number; // percentage
  rawValue: number; // actual value
  [key: string]: any; // Add index signature
}

interface LayeredPieChartPartProps {
  values: (number | null)[]; // values can be null
  type: string;
  month: number | "all"; // month can be a number or "all"
}

// ==============================
// Constants and Helpers
// ==============================
const MONTH_DAYS = [
  31, 28.2, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
]; // month-1 index

function colorWithAlpha(color: string, alpha: number = 0.7): string {
  if (color.startsWith("rgba")) return color.replace(/1\)$/, `${alpha})`);
  const bigint = parseInt(color.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function computeLayeredValues(
  values: (number | null)[],
  type: string,
  monthDays: number = 365
): number[] | null {
  if (!values || values.some((v) => v === null)) return null;
  const numericValues = values as number[]; // Asserting that all values are numbers here
  const layered: number[] = [];

  if (type.includes("temp")) {
    const [h35, h30, h25, lw0, h0] = numericValues;
    layered.push(h35); // 猛暑日
    layered.push(h30 - h35); // 真夏日
    layered.push(h25 - h30); // 夏日
    layered.push(monthDays - h25 - lw0); // その他
    layered.push(lw0 - h0); // 冬日
    layered.push(h0); // 真冬日
  } else {
    layered.unshift(monthDays - numericValues[numericValues.length - 1]);
    for (let i = numericValues.length - 1; i > 0; i--) {
      layered.unshift(numericValues[i] - numericValues[i - 1]);
    }
    layered.unshift(numericValues[0]);
  }

  return layered;
}

function getNames(type: string): string[] {
  if (type.includes("temp"))
    return ["1.猛暑日", "2.真夏日", "3.夏日", "4.その他", "5.冬日", "6.真冬日"];
  if (type === "wind")
    return [
      "1.~10m/s",
      "2.10~15m/s",
      "3.15~20m/s",
      "4.20~30m/s",
      "5.30m/s~",
    ].reverse();
  if (type === "rain")
    return [
      "1.~1mm",
      "2.1~10mm",
      "3.10~30mm",
      "4.30~50mm",
      "5.50~70mm",
      "6.70~100mm",
      "7.100mm~",
    ].reverse();
  if (type.startsWith("snowed"))
    return [
      "1.~5cm",
      "2.5~10cm",
      "3.10~20cm",
      "4.20~50cm",
      "5.50~100cm",
      "6.100cm~",
    ].reverse();
  if (type.startsWith("snowing"))
    return [
      "1.~3cm",
      "2.3~5cm",
      "3.5~10cm",
      "4.10~20cm",
      "5.20~50cm",
      "6.50cm~",
    ].reverse();
  return [];
}

function prepareChartData(
  values: (number | null)[],
  type: string,
  month: number | "all" | null = null
): ChartDataEntry[] | null {
  if (!values || values.length === 0) return null;

  const monthDays =
    month && month !== "all" ? MONTH_DAYS[month - 1] : 365;
  const layered = computeLayeredValues(values, type, monthDays);
  if (!layered) return null;

  const total = layered.reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const names = getNames(type);
  return layered.map((v, i) => ({
    name: names[i] || `extra_${i}`,
    value: (v / total) * 100,
    rawValue: v,
  }));
}

// ==============================
// Component
// ==============================
const LayeredPieChartPart: React.FC<LayeredPieChartPartProps> = ({
  values,
  type,
  month,
}) => {
  const data = prepareChartData(values, type, month);
  const monthDays = month !== "all" && month !== null ? MONTH_DAYS[month - 1] : 365;

  let Labels: string[] = [];
  let tempValues: number[] = [];
  let Colors: string[] = [];

  if (type === "temp") {
    Labels = ["猛暑日", "真夏日", "夏日", "その他", "冬日", "真冬日"];
    Colors = [
      "1.猛暑日",
      "2.真夏日",
      "3.夏日",
      "4.その他",
      "5.冬日",
      "6.真冬日",
    ];
    if (values.every(v => v !== null)) {
      const numericValues = values as number[];
      tempValues = [
        numericValues[0], // hitemp_35
        numericValues[1], // hitemp_30
        numericValues[2], // hitemp_25
        monthDays - numericValues[2] - numericValues[3], // other, assuming values[3] is lwtemp_0 and values[2] is hitemp_25
        numericValues[3], // lwtemp_0
        numericValues[4], // hitemp_0
      ];
    }
  } else if (type === "hitemp") {
    Labels = ["猛暑日", "真夏日", "夏日"];
    Colors = ["1.猛暑日", "2.真夏日", "3.夏日"];
    if (values.every(v => v !== null)) {
      const numericValues = values as number[];
      tempValues = [numericValues[0], numericValues[1], numericValues[2]];
    }
  } else if (type === "lwtemp") {
    Labels = ["その他", "冬日", "真冬日"];
    Colors = ["4.その他", "5.冬日", "6.真冬日"];
    if (values.every(v => v !== null)) {
      const numericValues = values as number[];
      tempValues = [
        monthDays - numericValues[2] - numericValues[3], // other
        numericValues[3], // lwtemp_0
        numericValues[4], // hitemp_0
      ];
    }
  } else if (type === "rain") {
    Labels = ["降水日数", "強い降水日数"];
    Colors = ["2.1~10mm", "4.30~50mm"];
    if (values.every(v => v !== null)) {
      const numericValues = values as number[];
      tempValues = [numericValues[5], numericValues[3]];
    }
  } else if (type === "snowing") {
    Labels = ["降雪日数", "強い降雪日数"];
    Colors = ["2.3~5cm", "5.20~50cm"];
    if (values.every(v => v !== null)) {
      const numericValues = values as number[];
      tempValues = [numericValues[4], numericValues[1]];
    }
  } else if (type === "snowed") {
    Labels = ["積雪日数", "深い積雪日数"];
    Colors = ["2.5~10cm", "5.50~100cm"];
    if (values.every(v => v !== null)) {
      const numericValues = values as number[];
      tempValues = [numericValues[4], numericValues[1]];
    }
  }

  const size = tempValues.length === 6 ? 200 : 260;

  return (
    <div>
      {data ? (
        <div className="flex flex-col items-center gap-2 h-[350px]">
          <PieChart width={size} height={size}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx={size / 2}
              cy={size / 2}
              outerRadius={size / 2.2}
              startAngle={90}
              endAngle={450}
              isAnimationActive={true}
              animationDuration={700}
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
          <div className="w-full px-4">
            {tempValues.length > 0 && (
              <>
                {tempValues.length === 6 ? (
                  [0, 1].map((blockIndex) => {
                    const start = blockIndex * 3;
                    const end = start + 3;
                    const labelsPart = Labels.slice(start, end);
                    const valuesPart = tempValues.slice(start, end);
                    const colorsPart = Colors.slice(start, end);

                    return (
                      <div
                        key={blockIndex}
                        className="w-full h-16 grid grid-rows-[1fr_2fr] border border-gray-500 mb-2"
                      >
                        <div
                          className={`grid border-b border-gray-500 grid-cols-3`}
                        >
                          {labelsPart.map((label, i) => (
                            <div
                              key={label}
                              className="px-2 text-gray-100 border-l border-gray-400 first:border-l-0 text-center text-sm"
                              style={{
                                backgroundColor: COLOR_MAP[colorsPart[i]],
                              }}
                            >
                              {label}
                            </div>
                          ))}
                        </div>

                        <div
                          className={`grid grid-cols-3 place-items-center text-lg text-center`}
                        >
                          {valuesPart.map((v, i) => (
                            <div
                              key={i}
                              className="border-l first:border-l-0 w-full border-gray-300"
                            >
                              {v.toFixed(1)}日
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full min-h-20 grid grid-rows-[1fr_2fr] border border-gray-500">
                    <div
                      className={`grid border-b border-gray-500 grid-cols-${Labels.length}`}
                    >
                      {Labels.map((label, i) => (
                        <div
                          key={label}
                          className="px-2 text-gray-100 border-l border-gray-400 first:border-l-0 text-center"
                          style={{ backgroundColor: COLOR_MAP[Colors[i]] }}
                        >
                          {label}
                        </div>
                      ))}
                    </div>

                    <div
                      className={`grid grid-cols-${Labels.length} place-items-center text-xl text-center`}
                    >
                      {tempValues.map((v, i) => (
                        <div
                          key={i}
                          className="border-l first:border-l-0 w-full border-gray-300"
                        >
                          {v.toFixed(1)}日
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center w-full h-60 flex items-center justify-center text-gray-500">
          データなし
        </div>
      )}
    </div>
  );
};

export default LayeredPieChartPart;
