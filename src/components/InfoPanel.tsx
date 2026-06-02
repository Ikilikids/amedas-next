import Link from "next/link";
import React from "react";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import {
  FaArrowUp,
  FaArrowsAltH,
  FaCity,
  FaMap,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { OverviewData, StationData } from "../types/all";
import { MetricKey, MetricMeta } from "../utils/metric";

interface InfoPanelProps {
  stationData: StationData | null;
  overViewData: OverviewData | null;
  loading: boolean;
  isTitle: boolean;
}

// ==============================
// Helpers
// ==============================
function showValue(
  v: number | null | undefined,
  isRank: boolean = false
): string {
  if (v === null || v === undefined) return "--";
  if (isRank) return String(v);
  return v.toFixed(1);
}

// ==============================
// Component
// ==============================
const InfoPanel: React.FC<InfoPanelProps> = ({
  stationData,
  overViewData,
  loading,
  isTitle,
}) => {
  if (loading) {
    return (
      <div className="p-4 w-full h-full flex items-center justify-center">
        <div className="text-lg font-bold animate-pulse text-slate-400">
          読み込み中…
        </div>
      </div>
    );
  }

  const exclude = new Set<MetricMeta>([
    MetricKey.av_lwtemp,
    MetricKey.av_hitemp,
  ]);

  const locationItems = [
    {
      label: "都道府県",
      value: stationData?.pref?.label,
      icon: FaMapMarkerAlt,
    },
    { label: "市町村", value: stationData?.city, icon: FaCity },
    { label: "観測所名", value: stationData?.station_name, icon: FaMap },
    {
      label: "緯度・経度",
      value: stationData
        ? `(${showValue(stationData.lat)}, ${showValue(stationData.lon)})`
        : null,
      icon: FaArrowsAltH,
    },
    {
      label: "標高",
      value: stationData ? `${showValue(stationData.height)} m` : null,
      icon: FaArrowUp,
    },
  ];

  const rankingItems = Array.from(overViewData?.entries() ?? []).filter(
    ([key]) => !exclude.has(key)
  );

  return (
    <div className="w-full flex flex-col gap-0">
      {isTitle && (
        <div className="mb-2">
          <h3 className="font-black text-3xl text-slate-800 tracking-tighter">
            {stationData ? (
              <Link
                href={`/station/${stationData.id}`}
                className="group flex items-center gap-3 hover:text-blue-600 transition-colors"
              >
                <span className="p-2 bg-slate-100 rounded-2xl group-hover:bg-blue-50 transition-colors text-3xl">
                  {stationData.category.icon}
                </span>
                <span className="relative">
                  {stationData.official_name}
                  <span className="absolute left-0 -bottom-1 w-0 h-1 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            ) : (
              <span className="flex items-center gap-3 text-slate-400">
                <BsFillQuestionCircleFill className="w-8 h-8" />
                地点を選択してください
              </span>
            )}
          </h3>
        </div>
      )}

      {/* 統合された地点情報カード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
        {/* メタデータ項目 */}
        {locationItems.map((item, idx) => (
          <div key={`loc-${idx}`} className="flex items-center gap-4">
            <div className="p-2.5 bg-white rounded-xl shadow-sm text-slate-400 border border-slate-50">
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                {item.label}
              </span>
              <span className="text-sm font-black text-slate-700 leading-none">
                {item.value || "--"}
              </span>
            </div>
          </div>
        ))}

        {/* 気候ランキング項目 */}
        {!isTitle &&
          rankingItems.map(([key, d], idx) => {
            let colorClass = "text-slate-400";
            if (key.category === "気温") colorClass = "text-red-500";
            else if (key.category === "風") colorClass = "text-green-500";
            else if (key.category === "降水") colorClass = "text-blue-700";
            else if (key.category === "降雪" || key.category === "積雪")
              colorClass = "text-sky-400";
            else if (key.category === "日照") colorClass = "text-orange-500";

            return (
              <div key={`rank-${idx}`} className="flex items-center gap-4">
                <div
                  className={`p-2.5 bg-white rounded-xl shadow-sm border border-slate-50 flex items-center justify-center ${colorClass}`}
                >
                  {key.highIcon ? (
                    <span className="text-base">{key.highIcon}</span>
                  ) : (
                    <div className="w-4 h-4 bg-slate-200 rounded-full animate-pulse" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                    {key.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-slate-900 leading-none">
                      {showValue(d?.value)} {key.unit}
                    </span>
                    <span className="text-[10px] font-bold  text-slate-600 leading-none mt-0.5">
                      ({showValue(d?.rank, true)}位)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default InfoPanel;
