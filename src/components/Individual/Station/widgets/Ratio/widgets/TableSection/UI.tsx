import React from "react";
import { RatioInfo } from "../../../../../../../types/union";
import { MetricKey, MetricValue } from "../../../../../../../setting/metric";
import { ChartDataItem } from "../../types";

const tempList: MetricValue[] = ["hitemp_35", "hitemp_30", "hitemp_25"];
const rainList: MetricValue[] = ["rain_30", "rain_1"];

export interface ChartTableSectionProps {
  data: ChartDataItem[];
  selectedMonth: number | null;
  ratioInfo: RatioInfo;
}

export const ChartTableSection: React.FC<ChartTableSectionProps> = ({
  data,
  selectedMonth,
  ratioInfo,
}) => {
  const renderGrid = (items: ChartDataItem[], cols: number) => (
    <div
      className="grid border border-gray-500 mb-2 overflow-hidden rounded"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      <div className="contents">
        {items.map((entry) => {
          const icon = MetricKey[entry.key]?.icon;
          return (
            <div
              key={`label-${entry.name}`}
              className="px-1 py-0.5 text-gray-100 border-l border-gray-400 first:border-l-0 text-center text-[10px] font-bold whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1"
              style={{ backgroundColor: entry.color }}
            >
              {icon && <span className="text-xs shrink-0">{icon}</span>}
              <span className="truncate">{entry.name}</span>
            </div>
          );
        })}
      </div>

      <div className="contents">
        {items.map((entry) => {
          const days = entry.originValue.toFixed(1);
          return (
            <div
              key={`value-${entry.name}`}
              className="px-1 py-1 border-l first:border-l-0 border-t border-gray-300 flex flex-col items-center justify-center bg-white"
            >
              <div className="text-sm font-semibold">{days}日</div>
              <div className="text-[10px] text-gray-500">
                {entry.rank ?? "--"}位
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  let displayData = data;
  if (ratioInfo.metricTab === "気温日数" && ratioInfo.isCut) {
    displayData = displayData.filter((d) => tempList.includes(d.key));
  }
  if (ratioInfo.metricTab === "降水日数" && ratioInfo.isCut) {
    displayData = displayData.filter((d) => rainList.includes(d.key));
  }

  return (
    <div className="w-full min-w-0 px-2">
      {displayData.length === 7 ? (
        <>
          {renderGrid(displayData.slice(0, 3), 3)}
          {renderGrid(displayData.slice(3, 7), 4)}
        </>
      ) : displayData.length === 6 ? (
        <>
          {renderGrid(displayData.slice(0, 3), 3)}
          {renderGrid(displayData.slice(3, 6), 3)}
        </>
      ) : displayData.length === 5 ? (
        <>
          {renderGrid(displayData.slice(0, 2), 2)}
          {renderGrid(displayData.slice(2, 5), 3)}
        </>
      ) : (
        renderGrid(displayData, displayData.length)
      )}
    </div>
  );
};

export default ChartTableSection;
