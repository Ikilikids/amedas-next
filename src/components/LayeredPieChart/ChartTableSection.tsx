import React from "react";
import { RatioInfo } from "../../types/union";
import { MetricValue } from "../../utils/metric";
import { ChartDataItem } from "./types";

interface ChartTableSectionProps {
  data: ChartDataItem[];
  selectedMonth: number | null;
  ratioInfo: RatioInfo;
}

const ChartTableSection: React.FC<ChartTableSectionProps> = ({
  data,
  selectedMonth,
  ratioInfo,
}) => {
  const renderGrid = (items: ChartDataItem[], cols: number) => (
    <div
      className={`grid border border-gray-500 mb-2 overflow-hidden rounded`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {/* Header Row: Labels */}
      <div className="contents">
        {items.map((entry) => (
          <div
            key={`label-${entry.name}`}
            className="px-1 py-0.5 text-gray-100 border-l border-gray-400 first:border-l-0 text-center text-[10px] sm:text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ backgroundColor: entry.color }}
          >
            {entry.name}
          </div>
        ))}
      </div>

      {/* Value Row: Days and Ranks */}
      <div className="contents">
        {items.map((entry) => {
          const days = entry.originValue.toFixed(1);
          return (
            <div
              key={`value-${entry.name}`}
              className="px-1 py-1 border-l first:border-l-0 border-t border-gray-300 flex flex-col items-center justify-center bg-white"
            >
              <div className="text-sm sm:text-lg font-semibold">{days}日</div>
              <div className="text-[10px] sm:text-xs text-gray-500">
                {entry.rank ?? "--"}位
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  if (ratioInfo.metricTab === "気温日数" && ratioInfo.isCut) {
    data = data.filter((d) => tempList.includes(d.key));
  }
  if (ratioInfo.metricTab === "降水日数" && ratioInfo.isCut) {
    data = data.filter((d) => rainList.includes(d.key));
  }
  return (
    <div className="flex-1 min-w-0 px-2 sm:px-4">
      {data.length === 7 ? (
        <>
          {renderGrid(data.slice(0, 3), 3)}
          {renderGrid(data.slice(3, 7), 4)}
        </>
      ) : data.length === 6 ? (
        <>
          {renderGrid(data.slice(0, 3), 3)}
          {renderGrid(data.slice(3, 6), 3)}
        </>
      ) : data.length === 5 ? (
        <>
          {renderGrid(data.slice(0, 2), 2)}
          {renderGrid(data.slice(2, 5), 3)}
        </>
      ) : (
        renderGrid(data, data.length)
      )}
    </div>
  );
};

export default ChartTableSection;

const tempList: MetricValue[] = ["hitemp_35", "hitemp_30", "hitemp_25"];
const rainList: MetricValue[] = ["rain_30", "rain_1"];
