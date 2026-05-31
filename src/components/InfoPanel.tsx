import Link from "next/link";
import React from "react";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { OverviewData, StationData } from "../types/all";
import { MetricKey } from "../utils/metric";

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
        <div className="text-lg font-bold animate-pulse">読み込み中…</div>
      </div>
    );
  }

  const exclude = new Set([MetricKey.av_lwtemp, MetricKey.av_hitemp]);

  return (
    <div className="p-2 rounded-md w-full h-full flex flex-col gap-1.5">
      {isTitle ? (
        <h3 className="station-name font-bold text-2xl">
          {stationData ? (
            <Link
              href={`/station/${stationData.id}`}
              className="group inline-block relative"
            >
              <span className="flex items-center gap-2">
                {stationData.category.icon}
                {stationData.official_name}
              </span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-current transition-all duration-200 group-hover:w-full" />
            </Link>
          ) : (
            <span className="flex items-center gap-2">
              <BsFillQuestionCircleFill />
              地点を選択してください!!
            </span>
          )}
        </h3>
      ) : null}
      <div>都道府県：{stationData?.pref?.label}</div>
      <div>市町村：{stationData?.city}</div>
      <div>観測所名：{stationData?.station_name}</div>
      <div>
        緯度・経度：(
        {showValue(stationData?.lat)}, {showValue(stationData?.lon)})
      </div>
      <div>標高：{showValue(stationData?.height)} m</div>
      {Array.from(overViewData?.entries() ?? [])
        .filter(([key]) => !exclude.has(key))
        .map(([key, d]) => (
          <div key={key.label}>
            {key.label}：{showValue(d?.value)} {key.unit}（全国{" "}
            {showValue(d?.rank, true)} 位）
          </div>
        ))}
    </div>
  );
};
export default InfoPanel;
