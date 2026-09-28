import Link from "next/link";
import React from "react";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { FaCity, FaStar } from "react-icons/fa";
import { FaMapPin } from "react-icons/fa6";
import { LiaMountainSolid } from "react-icons/lia";
import { OverviewData, StationData, BadgeData } from "../types/all";
import { MetricKey, MetricMeta } from "../setting/metric";
import RankBadge from "../svg/RankBadge";
import metricDistributionsRaw from "../data/metricDistributions.json";

interface DistributionItem {
  min: number;
  max: number;
  binWidth: number;
  bins: number[];
  totalCount: number;
}

const metricDistributions: Record<string, DistributionItem> = metricDistributionsRaw;

interface InfoPanelProps {
  stationData: StationData | null;
  overViewData: OverviewData | null;
  loading: boolean;
  isTitle: boolean;
  badges?: BadgeData[];
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

/**
 * 閾値セットから星の数(1〜maxStars)と該当文言を計算する
 */
function evaluateStar(
  value: number | null | undefined,
  starMeta?: MetricMeta["star"]
): { starCount: number; maxStars: number; label: string } {
  if (!starMeta) {
    return { starCount: 0, maxStars: 10, label: "--" };
  }

  const { baseLabel, levels } = starMeta;
  const maxStars = levels.length + 1;

  if (value == null || isNaN(value)) {
    return { starCount: 0, maxStars, label: "--" };
  }

  if (levels.length === 0 || value < levels[0].threshold) {
    return { starCount: 1, maxStars, label: baseLabel };
  }

  for (let i = levels.length - 1; i >= 0; i--) {
    if (value >= levels[i].threshold) {
      return {
        starCount: i + 2,
        maxStars,
        label: levels[i].label,
      };
    }
  }

  return { starCount: 1, maxStars, label: baseLabel };
}

/**
 * 分布ヒストグラムバー + 現在地ポインター
 */
const DistributionHistogram: React.FC<{
  dist?: DistributionItem;
  value: number | null | undefined;
  color: string;
}> = ({ dist, value, color }) => {
  if (!dist || dist.bins.length === 0) {
    return <div className="h-4 bg-slate-100 rounded" />;
  }

  let positionPct = 50;
  if (value != null && !isNaN(value)) {
    const range = dist.max - dist.min;
    if (range > 0) {
      positionPct = Math.max(0, Math.min(100, ((value - dist.min) / range) * 100));
    }
  }

  return (
    <div className="relative w-full flex flex-col justify-end pt-0.5">
      {/* ヒストグラム（山型チャート） */}
      <div className="flex items-end gap-[1px] h-3.5 w-full px-0.5">
        {dist.bins.map((peak, idx) => {
          const heightPct = Math.max(8, peak);
          return (
            <div
              key={idx}
              className="flex-1 rounded-t-[1px] transition-all"
              style={{
                height: `${heightPct}%`,
                backgroundColor: color,
                opacity: 0.28,
              }}
            />
          );
        })}
      </div>

      {/* ベースライン */}
      <div className="w-full h-1 bg-slate-200/90 rounded-full relative">
        {/* 現在地点マーカー */}
        {value != null && !isNaN(value) && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none"
            style={{ left: `${positionPct}%` }}
          >
            <div
              className="w-2 h-2 rounded-full border border-white shadow-xs ring-1.5 ring-slate-800"
              style={{ backgroundColor: color }}
            />
          </div>
        )}
      </div>

      {/* 最小・最大ラベル */}
      <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-400 mt-0.5 px-0.5 leading-none">
        <span>{dist.min}</span>
        <span>{dist.max}</span>
      </div>
    </div>
  );
};

// ==============================
// Component
// ==============================
const InfoPanel: React.FC<InfoPanelProps> = ({
  stationData,
  overViewData,
  loading,
  isTitle,
  badges,
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

  // StarPanelと同じ6指標
  const displayMetrics = [
    MetricKey.av_avtemp,
    MetricKey.sm_sun,
    MetricKey.sm_rain,
    MetricKey.sm_snowing,
    MetricKey.av_wind,
    MetricKey.hitemp_35,
  ];

  return (
    <div
      className="rounded-3xl px-5 py-4 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden transition-all h-full bg-white"
    >
      {/* Background Accent */}
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: region?.colorStrong || "#3b82f6" }}
      />

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

        <div className="flex items-center gap-2 flex-wrap">
          {category && (
            <span className="text-xl shrink-0" style={{ color: category.colorFull }}>
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
          {badges && badges.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap ml-1">
              {badges.map((b: BadgeData, i: number) => (
                <RankBadge key={i} {...b} size={26} />
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 font-bold ml-7 mb-3">
          {stationData.official_name}
        </p>

        {/* Metadata Row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 ml-7 text-[11px] font-bold text-slate-500">
          <div className="flex items-center gap-1">
            <FaCity className="text-slate-400" />
            <span>
              {stationData.city}
              {stationData.area && (
                <span className="ml-1 text-slate-400 font-normal">
                  （{stationData.area.label}）
                </span>
              )}
            </span>
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

      {/* 2x3 グリッド: 各指標カード */}
      <div className="flex-1 grid grid-cols-2 gap-2.5">
        {displayMetrics.map((m) => {
          const data = overViewData?.get(m);
          const val = data?.value;
          const { starCount, maxStars, label: starLabel } = evaluateStar(val, m.star);
          const dist = metricDistributions[m.key];

          return (
            <div
              key={m.key}
              className="bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100/90 shadow-2xs flex flex-col justify-between hover:border-slate-200 transition-colors"
            >
              {/* 上段: 指標名 + 評価ラベル */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1 min-w-0">
                  {(m.icon || m.high?.icon) && (
                    <span
                      className="text-xs shrink-0 p-0.5 rounded bg-white border border-slate-200/60 shadow-2xs"
                      style={{ color: m.color }}
                    >
                      {m.icon || m.high?.icon}
                    </span>
                  )}
                  <span className="text-[11px] font-black text-slate-700 truncate">
                    {m.label}
                  </span>
                </div>
                <span
                  className="text-[9.5px] font-black px-1.5 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs shrink-0"
                  style={{ color: m.color }}
                >
                  {starLabel}
                </span>
              </div>

              {/* 中段: 数値 + 単位（左） / ★スター ＋ RANK の縦並び（右） */}
              <div className="flex items-center justify-between gap-1 my-0.5">
                <div className="flex items-baseline gap-1 min-w-0">
                  <span className="text-lg font-black text-slate-800 leading-none">
                    {data && val != null ? showValue(val) : "--"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    {m.unit}
                  </span>
                </div>

                {/* 右側: 上が★スター、下がRANK */}
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <div className="flex items-center gap-0.5 bg-white/90 px-1 py-0.5 rounded border border-slate-100 shadow-2xs whitespace-nowrap">
                    <FaStar className="text-[9.5px]" style={{ color: m.color }} />
                    <span className="text-[9.5px] font-black font-mono text-slate-600">
                      {starCount}/{maxStars}
                    </span>
                  </div>
                  {data?.rank && (
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight whitespace-nowrap leading-none pr-0.5">
                      RANK {data.rank}
                    </span>
                  )}
                </div>
              </div>

              {/* 下段: 全国度数分布ヒストグラムバー */}
              <div className="mt-1">
                <DistributionHistogram dist={dist} value={val} color={m.color} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InfoPanel;
