import React from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { colorWithAlpha } from "./chartUtils";
import { ChartDataItem } from "./types";

interface ChartPieSectionProps {
  data: ChartDataItem[];
  size?: number;
}

const ChartPieSection: React.FC<ChartPieSectionProps> = ({
  data,
  size = 240,
}) => {
  return (
    <div className="flex-1 min-w-0 flex justify-center items-start sm:mt-[-16px]">
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
            <Cell key={entry.name} fill={colorWithAlpha(entry.color)} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
      </PieChart>
    </div>
  );
};

export default ChartPieSection;
