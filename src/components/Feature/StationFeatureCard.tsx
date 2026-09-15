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

interface StationFeatureCardProps {
  allData: AllData;
  ratioInfo: RatioInfo[];
  uonzuInfo: MetricMeta[];
  index?: number;
}

const StationFeatureCard: React.FC<StationFeatureCardProps> = ({
  allData,
  ratioInfo,
  uonzuInfo,
  index,
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
    <section
      id={`station-${station.id}`}
      className="scroll-mt-24 pb-12 mb-12 border-b border-slate-200 last:border-b-0 last:pb-0 last:mb-0"
    >
      {/* Column-style H2 Heading with accent bar, number, and visual tabs on right */}
      <div className="pb-3 border-b border-slate-200 flex flex-col justify-between gap-3 mb-4">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <span
            className="w-1.5 h-6 rounded-full"
            style={{ backgroundColor: regionColor }}
          />
          <span>
            {index != null ? `${index}. ` : ""}{station.station_name}（{station.pref.label}）
          </span>
        </h2>

        {/* コントロール（タブ切り替え）を地点名ヘッダーの右側に配置 */}
        <div className="shrink-0">
          <div>
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

      {/* 地点メタ情報（自治体・標高・緯度経度） */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-bold mb-5">
        <span
          className="px-2.5 py-0.5 rounded-full text-white text-[11px] font-black"
          style={{ backgroundColor: regionColor }}
        >
          {station.pref.label}
        </span>
        <span className="text-slate-600 font-bold flex items-center gap-1">
          <FaCity className="text-slate-400" />
          <span>{station.city}</span>
        </span>
        <span className="text-slate-500 font-mono">
          標高 {station.height.toFixed(1)}m / 北緯{station.lat.toFixed(1)}° 東経{station.lon.toFixed(1)}°
        </span>
      </div>

      {/* 本文エリア: 左側＝解説テキスト、右側＝グラフ/地図 */}
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center">
        {/* 解説テキスト（コラムと同じ地の文スタイル） */}
        <div className="flex-1 min-w-0 space-y-4">
          <Description description={descriptionData} />
          <div className="pt-2">
            <Link
              href={`/station/${station.id}`}
              className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              <span>{station.station_name}の気候・詳細データを見る</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* グラフ／ビジュアル枠 */}
        <div className="w-full xl:w-[380px] shrink-0">
          <div className="w-full h-[340px] flex items-center justify-center">
            {(() => {
              if (selectedBar === "map") {
                return (
                  <div className="w-full h-full">
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
                  <div className="w-full h-full flex items-center justify-center p-2">
                    {ratioMap ? (
                      <LayeredPieChart
                        ratioInfo={currentRatioInfo}
                        ratioData={ratioMap}
                        selectedMonth={null} // 通年
                        rankType={currentRatioInfo.ranking}
                        layout="vertical"
                      />
                    ) : (
                      <div className="text-slate-400 font-bold text-xs">
                        データがありません
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div className="w-full h-full">
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
    </section>
  );
};

export default StationFeatureCard;
