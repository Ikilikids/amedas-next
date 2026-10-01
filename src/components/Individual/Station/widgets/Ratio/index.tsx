import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { RankKey, RankValue } from "../../../../../setting/rank";
import { RawMonthlyData } from "../../../../../types/raw";
import ChartControls from "./widgets/ChartControls/UI";
import ChartTableSection from "./widgets/TableSection/UI";
import {
  getRatioRankOptions,
  getRatioTypeOptions,
  prepareChartData,
} from "./function";
import { ChartType, RatioWidgetProps } from "./types";

const ChartPieSection = dynamic(() => import("./widgets/PieSection/UI"), {
  ssr: false,
});

export const RatioWidget: React.FC<RatioWidgetProps> = ({
  ratioData,
  regionColor,
  isMeteo,
  isIsland,
  stationId,
}) => {
  const [ratioMonth, setRatioMonth] = useState<number | null>(null);
  const [ratioRankValue, setRatioRankValue] = useState<RankValue>(
    RankKey.top.key
  );

  const typeOptions = useMemo(() => getRatioTypeOptions(ratioData), [ratioData]);

  const [ratioType, setRatioType] = useState<ChartType>(
    typeOptions[0]?.key || "降水日数"
  );

  const [prevRatioData, setPrevRatioData] = useState(ratioData);
  if (ratioData !== prevRatioData) {
    setPrevRatioData(ratioData);
    if (!typeOptions.some((opt) => opt.key === ratioType)) {
      if (typeOptions.length > 0) {
        setRatioType(typeOptions[0].key);
      }
    }
  }

  const rankOptions = useMemo(
    () => getRatioRankOptions(ratioData, isMeteo, isIsland),
    [ratioData, isMeteo, isIsland]
  );

  const ratioInfo = useMemo(
    () => ({
      metricTab: ratioType,
      ranking: ratioRankValue,
      isCut: false,
    }),
    [ratioType, ratioRankValue]
  );

  const data = useMemo(
    () => prepareChartData(ratioData, ratioInfo, ratioMonth, ratioRankValue),
    [ratioData, ratioInfo, ratioMonth, ratioRankValue]
  );

  return (
    <>
      <div className="pb-3 border-b border-slate-200 mb-4">
        <ChartControls
          type={ratioType}
          setType={setRatioType}
          selectedMonth={ratioMonth}
          setSelectedMonth={setRatioMonth}
          rankType={ratioRankValue}
          setRankType={setRatioRankValue}
          rankOptions={rankOptions}
          typeOptions={typeOptions}
        />
      </div>

      <p className="text-xs text-slate-500 mb-4">
        降水量や気温階級、日照時間などの年間・月別バランスを可視化した多重円グラフです。
      </p>

      {ratioType && (
        <div className="w-full">
          <div className="flex flex-col xl:flex-row w-full items-center gap-4">
            <div className="flex-[2] min-w-0 flex justify-center items-start">
              {data && data.length > 0 ? (
                <ChartPieSection data={data} size={240} />
              ) : (
                <div className="flex justify-center items-center w-full h-60 text-gray-500 text-lg">
                  データなし
                </div>
              )}
            </div>
            <div className="flex-[3] min-w-0 w-full">
              {data && data.length > 0 && (
                <ChartTableSection
                  data={data}
                  selectedMonth={ratioMonth}
                  ratioInfo={ratioInfo}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RatioWidget;
