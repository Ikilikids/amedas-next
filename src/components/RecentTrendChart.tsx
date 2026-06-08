import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RecentTrendChartProps {
  history: { date: string; temp: number }[];
  stats?: { extremeHotDays: number; maxTempYear: number };
  color: string;
}

const RecentTrendChart: React.FC<RecentTrendChartProps> = ({
  history,
  stats,
  color,
}) => {
  // 日付順に並び替え（昇順）
  const data = [...history]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({
      ...item,
      // 表示用に日付を整形 (MM/DD)
      displayDate: item.date.split("-").slice(1).join("/"),
    }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-2">
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4">
        {stats && (
          <div className="flex gap-4">
            <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
              <span className="text-xs text-orange-600 font-bold block">
                今年の猛暑日
              </span>
              <span className="text-xl font-black text-orange-700">
                {stats.extremeHotDays}
                <small className="text-xs ml-1">日</small>
              </span>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-100">
              <span className="text-xs text-red-600 font-bold block">
                今年の最高気温
              </span>
              <span className="text-xl font-black text-red-700">
                {stats.maxTempYear === -99 ? "---" : stats.maxTempYear}
                <small className="text-xs ml-1">℃</small>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#999" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#999" }}
              domain={["auto", "auto"]}
              unit="℃"
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`${value}℃`, "最高気温"]}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke={color}
              strokeWidth={3}
              dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RecentTrendChart;
