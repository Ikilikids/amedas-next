import Link from "next/link";
import React, { useMemo, useState } from "react";
import { AllData } from "../types/all";
import { RatioInfo } from "../types/union";
import { MetricKey } from "../utils/metric";
import LayeredPieChart from "./LayeredPieChart";
import StationMap from "./StationMap";
import UonzuChart from "./UonzuChart";
import Description from "./description";

interface StationFeatureCardProps {
  allData: AllData;
  showFullDescription?: boolean;
  ratioInfo: RatioInfo[];
}

const StationFeatureCard: React.FC<StationFeatureCardProps> = ({
  allData,
  showFullDescription = true,
  ratioInfo,
}) => {
  const {
    station,
    uonzu: uonzuMap,
    ratio: ratioMap,
    description: descriptionData,
  } = allData;

  // 解説文データからこの地点のものを抽出 (芋の元に戻す)

  // 表示オプションを動的に生成
  const visualOptions = useMemo(() => {
    const options = [
      { value: "rain", label: "降水量" },
      { value: "snowing", label: "降雪量" },
      { value: "sun", label: "日照時間" },
      { value: "map", label: "マップ" },
    ];
    if (ratioInfo && Array.isArray(ratioInfo)) {
      ratioInfo.forEach((info) => {
        if (!info || !info.metricTab) return;
        options.push({
          value: `ratio_${info.metricTab}`,
          label: info.metricTab.replace("日数", "割合"),
        });
      });
    }
    return options;
  }, [ratioInfo]);

  const [selectedBar, setSelectedBar] = useState<string>(
    visualOptions[0]?.value || "rain"
  );

  const regionColor = station.pref.region.colorBase;

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      {/* Header */}
      <div
        className="px-4 py-3 flex flex-wrap items-center justify-between gap-2"
        style={{ backgroundColor: regionColor }}
      >
        <h2 className="flex items-center gap-2 font-black text-slate-800">
          <span className="text-xl">{station.category.icon}</span>
          <Link
            href={`/station/${station.id}`}
            className="text-lg md:text-xl hover:underline text-slate-900"
          >
            {station.official_name}
          </Link>
          <span className="text-xs font-bold px-2 py-0.5 bg-white/50 rounded-full text-slate-700">
            {station.pref.label}
          </span>
        </h2>

        <div className="flex items-center gap-2 bg-white/40 p-1 rounded-lg border border-white/20">
          <span className="text-xs font-bold text-slate-700 ml-1">
            表示切替:
          </span>
          <select
            className="text-xs font-bold bg-white border-none rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-400 text-slate-800"
            value={selectedBar}
            onChange={(e) => setSelectedBar(e.target.value)}
          >
            {visualOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Description Section */}
        <div className="flex-[6] p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-50 bg-white">
          {showFullDescription ? (
            <Description description={descriptionData} />
          ) : (
            <Description description={descriptionData} />
          )}
        </div>

        {/* Visual Section */}
        <div className="flex-[5] h-[400px] lg:h-auto min-h-[400px] relative bg-slate-50 flex items-center justify-center overflow-hidden">
          {(() => {
            if (selectedBar === "map") {
              return (
                <div className="w-full lg:h-full items-center justify-center flex h-[380px]">
                  <StationMap isMini lat={station.lat} lng={station.lon} />
                </div>
              );
            }
            if (selectedBar.startsWith("ratio_")) {
              const tab = selectedBar.replace("ratio_", "");
              const currentRatioInfo = ratioInfo.find(
                (info) => info.metricTab === tab
              );
              if (!currentRatioInfo) return null;

              return (
                <div className="w-full h-full flex items-center justify-center p-4">
                  {ratioMap ? (
                    <LayeredPieChart
                      ratioInfo={currentRatioInfo}
                      ratioData={ratioMap}
                      selectedMonth={null} // 通年
                      rankType={currentRatioInfo.ranking}
                      layout="vertical"
                    />
                  ) : (
                    <div className="text-gray-400">データがありません</div>
                  )}
                </div>
              );
            }
            const barMeta =
              selectedBar === "snowing"
                ? MetricKey.sm_snowing
                : selectedBar === "sun"
                ? MetricKey.sm_sun
                : MetricKey.sm_rain;

            return (
              <div className="w-full h-full p-2">
                <UonzuChart
                  uonzuData={uonzuMap}
                  selectedBar={barMeta}
                  height="380px"
                />
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default StationFeatureCard;
