import Link from "next/link";
import React, { useMemo, useState } from "react";
import { FaChartLine, FaCity, FaMapPin } from "react-icons/fa6";
import { LiaMountainSolid } from "react-icons/lia";
import { AllData } from "../../types/all";
import { RatioInfo } from "../../types/union";
import { MetricKey, MetricMeta } from "../../setting/metric";
import LayeredPieChart from "../LayeredPieChart";
import StationMap from "../StationMap";
import UonzuChart from "../UonzuChart";
import Description from "./Description";

import CustomSelect from "../UI/CustomSelect";
import SegmentedControl from "../UI/SegmentedControl";

interface StationFeatureCardProps {
  allData: AllData;
  ratioInfo: RatioInfo[];
  uonzuInfo: MetricMeta[];
}

const StationFeatureCard: React.FC<StationFeatureCardProps> = ({
  allData,
  ratioInfo,
  uonzuInfo,
}) => {
  if (!allData) return null;
  const {
    station,
    uonzu: uonzuMap,
    ratio: ratioMap,
    description: descriptionData,
  } = allData;

  // 表示オプションを動的に生成
  const visualOptions = useMemo(() => {
    const options = [];
    uonzuInfo.forEach((info) => {
      options.push({
        key: info.key,
        label: info.label,
      });
    });
    ratioInfo.forEach((info) => {
      options.push({
        key: `ratio_${info.metricTab}`,
        label: info.metricTab.replace("日数", "割合"),
      });
    });
    options.push({ key: "map", label: "地図" });
    return options;
  }, [ratioInfo, uonzuInfo]);

  const [selectedBar, setSelectedBar] = useState<string>(
    visualOptions[0]?.key || "sm_rain"
  );

  // CustomSelect用のオプション形式に変換
  const selectOptions = useMemo(() => {
    return visualOptions.map((opt) => ({
      value: opt.key,
      label: opt.label,
    }));
  }, [visualOptions]);

  const regionColor = station.pref.region.colorStrong;
  const category = station.category;

  return (
    <div className="w-full flex flex-col rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8 bg-white transition-all hover:shadow-md relative">
      {/* Top Accent Bar (InfoPanel style) */}
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: regionColor }}
      />

      {/* Header Section (Exactly following InfoPanel style) */}
      <div className="px-6 pt-5 pb-5 border-b border-slate-50">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: regionColor }}
              >
                {station.pref.label}
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-bold tracking-tight">
                #{station.id}
              </span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center gap-2">
              {category && (
                <span className="text-xl" style={{ color: category.colorFull }}>
                  {category.icon}
                </span>
              )}
              <Link
                href={`/station/${station.id}`}
                className="group flex items-center gap-0 transition-colors"
              >
                <h2
                  className="text-2xl font-black text-slate-800 group-hover:text-[var(--name-hover)] transition-colors"
                  style={{ "--name-hover": regionColor } as React.CSSProperties}
                >
                  {station.station_name}
                </h2>
              </Link>
            </div>

            {/* Official Name (Sub-label) */}
            <p className="text-xs text-slate-400 font-bold ml-7 mb-3">
              {station.official_name}
            </p>

            {/* Metadata Row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 ml-7 text-[11px] font-bold text-slate-500">
              <div className="flex items-center gap-1">
                <FaCity className="text-slate-300" />
                <span>{station.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaMapPin className="text-slate-300" />
                <span>
                  {station.lat.toFixed(1)}N, {station.lon.toFixed(1)}E
                </span>
              </div>
              <div className="flex items-center gap-1">
                <LiaMountainSolid className="text-slate-300" />
                <span>{station.height.toFixed(1)} m</span>
              </div>
            </div>
          </div>

          {/* Visual Controls */}
          <div className="flex-shrink-0">
            {/* Desktop: SegmentedControl */}
            <div className="hidden sm:block">
              <SegmentedControl<string>
                value={selectedBar}
                onChange={(val) => setSelectedBar(val)}
                options={visualOptions}
                color={regionColor}
                className="w-fit"
              />
            </div>
            {/* Mobile: CustomSelect */}
            <div className="block sm:hidden w-full">
              <CustomSelect<string>
                value={selectedBar}
                onChange={(val) => setSelectedBar(val)}
                options={selectOptions}
                activeColor={regionColor}
                leftIcon={<FaChartLine className="text-slate-400" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row min-h-[420px]">
        {/* Description Section */}
        <div className="flex-[5] p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-50 bg-white flex flex-col">
          <div className="flex-1">
            <Description description={descriptionData} />
          </div>
        </div>

        {/* Visual Section */}
        <div className="flex-[6] bg-slate-50/20 relative flex items-center justify-center py-2 px-4">
          <div className="w-full h-[420px] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex items-center justify-center relative">
            {(() => {
              if (selectedBar === "map") {
                return (
                  <div className="w-full h-full p-2">
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
                  <div className="w-full h-full flex items-center justify-center p-6">
                    {ratioMap ? (
                      <LayeredPieChart
                        ratioInfo={currentRatioInfo}
                        ratioData={ratioMap}
                        selectedMonth={null} // 通年
                        rankType={currentRatioInfo.ranking}
                        layout="vertical"
                      />
                    ) : (
                      <div className="text-slate-400 font-bold">
                        データがありません
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div className="w-full h-full p-4">
                  <UonzuChart
                    uonzuData={uonzuMap}
                    selectedBar={MetricKey[selectedBar]}
                    height="100%"
                  />
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationFeatureCard;
