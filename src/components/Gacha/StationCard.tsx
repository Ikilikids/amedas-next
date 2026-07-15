// src/components/Gacha/StationCard.tsx
import React from "react";
import Link from "next/link";
import { FaChevronRight, FaCity, FaTrophy } from "react-icons/fa";
import { FaMapPin } from "react-icons/fa6";
import { LiaMountainSolid } from "react-icons/lia";
import {
  StationRaw,
  Rarity,
  RARITY_META,
  getPrefLabel,
  getPrefRegionColor,
  getCategoryIcon,
  getCategoryLabel,
  getCategoryBadgeClass,
} from "./gachaUtils";

import { RawOverviewData } from "../../types/raw";
import { MetricKey, MetricValue } from "../../setting/metric";
import RankBadge from "../../svg/RankBadge";
import { BadgeLogic } from "../../utils/badgeLogic";

interface CardProps {
  station: StationRaw;
  rarity: Rarity;
  isNew: boolean;
  count: number;
  overview?: RawOverviewData;
}

export const StationCard: React.FC<CardProps> = ({ station, rarity, isNew, count, overview }) => {
  const meta = RARITY_META[rarity];

  // Calculate badges if overview is present
  const badges = React.useMemo(() => {
    if (!overview) return [];
    const rawBadges = BadgeLogic.getBadges(overview, {});
    return rawBadges
      .map((b) => ({
        metric: MetricKey[b.metric as MetricValue],
        rank: b.rank,
        isHigh: b.isHigh,
      }))
      .filter((b) => b.metric !== undefined);
  }, [overview]);

  return (
    <div className={`w-80 rounded-3xl overflow-hidden shadow-2xl relative border-2 ${meta.cardBg} transition-all duration-300`}>
      
      {/* Sparkles or overlay elements for UR */}
      {rarity === "UR" && (
        <div className="absolute inset-0 rainbow-gradient opacity-10 pointer-events-none" />
      )}
      {rarity === "SSR" && (
        <div className="absolute inset-0 shimmer-sweep opacity-20 pointer-events-none" />
      )}

      {/* Rarity Ribbon Header */}
      <div className={`w-full text-center py-2 font-black text-xs uppercase tracking-widest ${meta.bgClass}`}>
        {rarity} CARD
      </div>

      <div className="p-6 flex flex-col justify-between min-h-[26rem] gap-6">
        <div>
          {/* Card Meta row */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-black pb-0.5 text-slate-400"
                style={{ borderBottom: `2px solid ${getPrefRegionColor(station.pref)}` }}
              >
                {getPrefLabel(station.pref)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                #{station.id}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              {isNew && (
                <span className="bg-red-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full animate-bounce leading-none">
                  NEW!
                </span>
              )}
              <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-full leading-none">
                所持数: {count}
              </span>
            </div>
          </div>

          {/* Station Name with Category Icon on the left and Badges on the right */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">
              {getCategoryIcon(station.category)}
            </span>
            <h3 className="text-2xl font-black tracking-tight text-slate-800 line-clamp-1">
              {station.station_name}
            </h3>
            {badges.length > 0 && (
              <div className="flex gap-0.5 items-center ml-1">
                {badges.map((b, i) => (
                  <div key={i} className="scale-75 origin-left -mx-0.5 flex-shrink-0">
                    <RankBadge {...b} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Official Name */}
          <p className="text-xs text-slate-500 font-bold ml-7 mb-3 line-clamp-1">
            {station.official_name || `${station.station_name}アメダス`}
          </p>

          {/* Metadata Row (City, Lat/Lon, Elevation grouped) */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 ml-7 text-[10px] font-bold text-slate-500 mb-4">
            <div className="flex items-center gap-1">
              <FaCity className="text-slate-500" />
              <span>{station.city || "その他"}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaMapPin className="text-slate-500" />
              <span>
                {station.lat != null ? `${station.lat.toFixed(1)}N` : "--"}, {station.lon != null ? `${station.lon.toFixed(1)}E` : "--"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <LiaMountainSolid className="text-slate-500" />
              <span>{station.height != null ? `${station.height}m` : "--"}</span>
            </div>
          </div>

          {/* Climate Stats details (InfoPanel-like Grid) */}
          {overview && (
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
              {[
                MetricKey.av_avtemp,
                MetricKey.av_hitemp,
                MetricKey.av_lwtemp,
                MetricKey.sm_rain,
                MetricKey.sm_sun,
                MetricKey.av_wind,
              ].map((m) => {
                const data = overview[m.key];
                return (
                  <div
                    key={m.key}
                    className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between"
                  >
                    <p className="text-[9px] font-bold text-slate-500 tracking-wider mb-1 flex items-center gap-1">
                      {m.highIcon && (
                        <span
                          className="scale-110 origin-left"
                          style={{ color: m.color }}
                        >
                          {m.highIcon}
                        </span>
                      )}
                      {m.label}
                    </p>
                    <div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-sm font-black text-slate-700">
                          {data ? data.value.toFixed(1) : "--"}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500">
                          {m.unit}
                        </span>
                      </div>
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mt-0.5">
                        RANK {data ? data.rank : "--"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Link button */}
        <div className="mt-auto">
          <Link
            href={`/station/${station.id}`}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs text-white transition-all shadow-md hover:brightness-105 active:scale-95 cursor-pointer ${meta.bgClass}`}
          >
            <span>観測データ・平年値を見る</span>
            <FaChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
};
