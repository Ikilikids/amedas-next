import Link from "next/link";
import React from "react";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { FaCity } from "react-icons/fa";
import { FaMapPin } from "react-icons/fa6";
import { LiaMountainSolid } from "react-icons/lia";
import { OverviewData, StationData } from "../types/all";
import { MetricKey } from "../setting/metric";

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
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-[350px] flex flex-col items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full mb-4"></div>
        <p className="text-slate-400 font-bold">読み込み中...</p>
      </div>
    );
  }

  if (!stationData) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-[350px] flex items-center justify-center text-slate-400 font-bold">
        <div className="flex flex-col items-center gap-2">
          <BsFillQuestionCircleFill className="text-3xl" />
          <p>地点を選択してください</p>
        </div>
      </div>
    );
  }

  const region = stationData.pref?.region;
  const category = stationData.category;

  const displayMetrics = [
    MetricKey.av_avtemp,
    MetricKey.av_hitemp,
    MetricKey.av_lwtemp,
    MetricKey.sm_rain,
    MetricKey.sm_sun,
    MetricKey.av_wind,
  ];

  return (
    <div
      className={`rounded-3xl px-5 py-4 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden transition-all`}
    >
      {/* Background Accent */}
      {
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: region?.colorStrong || "#3b82f6" }}
        />
      }

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: region?.colorStrong }}
          >
            {stationData.pref?.label}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            #{stationData.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {category && (
            <span className="text-xl" style={{ color: category.colorFull }}>
              {category.icon}
            </span>
          )}
          {isTitle ? (
            <Link
              href={`/station/${stationData.id}`}
              className="group flex items-center gap-0 transition-colors"
            >
              <h2
                className="text-2xl font-black text-slate-800 group-hover:text-[var(--name-hover)] transition-colors"
                style={
                  { "--name-hover": region?.colorStrong } as React.CSSProperties
                }
              >
                {stationData.station_name}
              </h2>
            </Link>
          ) : (
            <h2 className="text-2xl font-black text-slate-800">
              {stationData.station_name}
            </h2>
          )}
        </div>

        <p className="text-xs text-slate-400 font-bold ml-7 mb-3">
          {stationData.official_name}
        </p>

        {/* Metadata Row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 ml-7 text-[11px] font-bold text-slate-500">
          <div className="flex items-center gap-1">
            <FaCity className="text-slate-400" />
            <span>{stationData.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaMapPin className="text-slate-400" />
            <span>
              {showValue(stationData.lat)}N, {showValue(stationData.lon)}E
            </span>
          </div>
          <div className="flex items-center gap-1">
            <LiaMountainSolid className="text-slate-400" />
            <span>{showValue(stationData.height)} m</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {displayMetrics.map((m) => {
          const data = overViewData?.get(m);

          return (
            <div
              key={m.key}
              className="bg-white/60 backdrop-blur-sm p-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                {m.highIcon && (
                  <span
                    className="scale-125 origin-left"
                    style={{ color: m.color }}
                  >
                    {m.highIcon}
                  </span>
                )}
                {m.label}
              </p>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-700">
                    {data ? showValue(data.value) : "--"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {m.unit}
                  </span>
                </div>
                {
                  <div className="mt-1 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                    RANK {data ? data.rank : "--"}
                  </div>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InfoPanel;
