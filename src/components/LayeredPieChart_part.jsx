import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { COLOR_MAP } from "../utils/colorUtils"; // カラーマップ
const MONTH_DAYS = [31, 28.2, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 16進カラーまたは rgba を透過付き rgba に変換
function colorWithAlpha(color, alpha = 0.7) {
  if (color.startsWith("rgba")) return color.replace(/1\)$/, `${alpha})`);
  const bigint = parseInt(color.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// ------------------------
// 元の計算ロジックはそのまま
// ------------------------
function computeLayeredValues(values, type, monthDays = 365) {
  if (!values) return null;
  const layered = [];

  if (type.includes("temp")) {
    const [h35, h30, h25, lw0, h0] = values;
    layered.push(h35); // 猛暑日
    layered.push(h30 - h35); // 真夏日
    layered.push(h25 - h30); // 夏日
    layered.push(monthDays - h25 - lw0); // その他
    layered.push(lw0 - h0); // 冬日
    layered.push(h0); // 真冬日
  } else {
    layered.unshift(monthDays - values[values.length - 1]);
    for (let i = values.length - 1; i > 0; i--) {
      layered.unshift(values[i] - values[i - 1]);
    }
    layered.unshift(values[0]);
  }

  return layered;
}

// type に応じたラベル
function getNames(type) {
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

// ------------------------
// values と type, month からデータを作る
// ------------------------
function prepareChartData(values, type, month = null) {
  if (!values || values.length === 0) return null;

  const monthDays = month ? MONTH_DAYS[month - 1] : 365;
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

// =========================
// LayeredPieChart 本体
// =========================
export default function LayeredPieChart({ values, type, month }) {
  const data = prepareChartData(values, type, month);
  const monthDays = month !== "all" ? MONTH_DAYS[month - 1] : 365;
  // 表示用に猛暑日・真夏日・夏日の元の値を取り出す
  let Labels;
  let tempValues;
  let Colors;
  if (type == "temp") {
    Labels = ["猛暑日", "真夏日", "夏日", "その他", "冬日", "真冬日"];
    Colors = [
      "1.猛暑日",
      "2.真夏日",
      "3.夏日",
      "4.その他",
      "5.冬日",
      "6.真冬日",
    ];
    tempValues = [
      values[0],
      values[1],
      values[2],
      monthDays - values[3] - values[2],
      values[3],
      values[4],
    ];
  } else if (type === "hitemp") {
    Labels = ["猛暑日", "真夏日", "夏日"];
    Colors = ["1.猛暑日", "2.真夏日", "3.夏日"];
    tempValues = [values[0], values[1], values[2]];
  } else if (type === "lwtemp") {
    Labels = ["その他", "冬日", "真冬日"];
    Colors = ["4.その他", "5.冬日", "6.真冬日"];
    tempValues = [monthDays - values[3] - values[2], values[3], values[4]];
  } else if (type === "rain") {
    Labels = ["降水日数", "強い降水日数"];
    Colors = ["2.1~10mm", "4.30~50mm"];
    tempValues = [values[5], values[3]];
  } else if (type === "snowing") {
    Labels = ["降雪日数", "強い降雪日数"];
    Colors = ["2.3~5cm", "5.20~50cm"];
    tempValues = [values[4], values[1]];
  } else if (type === "snowed") {
    Labels = ["積雪日数", "深い積雪日数"];
    Colors = ["2.5~10cm", "5.50~100cm"];
    tempValues = [values[4], values[1]];
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
            <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
          </PieChart>
          <div className="w-full px-4">
            {tempValues.length > 0 && (
              <>
                {tempValues.length === 6 ? (
                  // ★ 6 件 → 3 個ずつに分割して同じ表を 2 個つくる
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
                        {/* ヘッダー */}
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

                        {/* データ行 */}
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
                  // ★ 通常（3 件など）は 1 つだけ
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
}
