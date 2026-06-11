import React, { useMemo } from "react";
import { MonthlyEntry, RatioInfo } from "../../types/union";
import { MetricMeta, MetricTab } from "../../utils/metric";
import { RankValue } from "../../utils/rank";
import ChartPieSection from "./ChartPieSection";
import ChartTableSection from "./ChartTableSection";
import { prepareChartData } from "./chartUtils";
import { LayeredPieChartProps } from "./types";

const LayeredPieChart: React.FC<
  LayeredPieChartProps & {
    ratioInfo: RatioInfo;
    selectedMonth: number | null;
    rankType: RankValue;
  }
> = ({
  ratioInfo,
  ratioData,
  selectedMonth,
  rankType,
  layout = "horizontal",
}) => {
  const groupedData = useMemo(() => {
    const map = new Map<MetricTab, Map<MetricMeta, MonthlyEntry[]>>();
    if (ratioData && ratioData instanceof Map) {
      for (const [meta, entries] of ratioData.entries()) {
        if (!meta.tab.endsWith("日数")) continue;
        if (!map.has(meta.tab)) {
          map.set(meta.tab, new Map());
        }
        map.get(meta.tab)!.set(meta, entries);
      }
    }
    return map;
  }, [ratioData]);

  const data = useMemo(
    () => {
      if (!ratioInfo?.metricTab) return null;
      return prepareChartData(
        groupedData.get(ratioInfo.metricTab) || null,
        ratioInfo,
        selectedMonth,
        rankType
      );
    },
    [groupedData, ratioInfo, selectedMonth, rankType]
  );

  if (!ratioInfo || !ratioInfo.metricTab) return null;

  const containerClass =
    layout === "vertical"
      ? "flex flex-col w-full items-center gap-2"
      : "sm:flex flex-col w-full sm:flex-row items-center gap-2";

  return (
    <div className="w-full">
      <div className={containerClass}>
        <div className="flex-[2] min-w-0 flex justify-center items-start">
          {data && data.length > 0 ? (
            <ChartPieSection
              data={data}
              size={layout === "vertical" ? 200 : 240}
            />
          ) : (
            <div className="flex justify-center items-center w-full h-60 text-gray-500 text-lg">
              データなし
            </div>
          )}
        </div>
        <div className={layout === "vertical" ? "w-full" : "flex-[3] min-w-0"}>
          {data && data.length > 0 && (
            <ChartTableSection
              data={data}
              selectedMonth={selectedMonth}
              ratioInfo={ratioInfo}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LayeredPieChart;
