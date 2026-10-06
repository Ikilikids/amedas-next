import Link from "next/link";
import React from "react";
import { FaCity } from "react-icons/fa";
import { FaMapPin } from "react-icons/fa6";
import { LiaMountainSolid } from "react-icons/lia";
import { RawData } from "../../../../../types/raw";
import RankBadge from "../../../../../svg/RankBadge";
import { resolveArea, resolveCategory, resolvePref } from "../../../../../utils/masterUtils";
import { computeStationBadges } from "../../../../../utils/badgeLogic";
import { showValue } from "../../function";

export const InfoHeader: React.FC<{
  rawData: RawData;
  isTitle: boolean;
}> = ({ rawData, isTitle }) => {
  const stationData = rawData.station;
  const pref = stationData.pref ? resolvePref(stationData.pref) : undefined;
  const region = pref?.region;
  const category = stationData.category ? resolveCategory(stationData.category) : undefined;
  const badges = computeStationBadges(rawData);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: region?.colorStrong }}
        >
          {pref?.icon && <span className="text-[11px] shrink-0">{pref.icon}</span>}
          <span>{pref?.label}</span>
        </span>
        {stationData.area && (
          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
            {resolveArea(stationData.area)?.label || stationData.area}
          </span>
        )}
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

        {badges.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap ml-1">
            {badges.map((b, i) => (
              <RankBadge
                key={i}
                rank={b.rank}
                icon={b.icon}
                size={26}
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 font-bold ml-7 mb-3">
        {stationData.official_name}
      </p>

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
  );
};

export default InfoHeader;
