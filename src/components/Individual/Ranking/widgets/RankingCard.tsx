import React from "react";
import Link from "next/link";
import { RankingData } from "../types";
import { colorWithAlpha } from "../../Station/widgets/Ratio/function";
import { getMetricColor } from "../../../../utils/colorUtils";
import { resolveCategory, resolvePref } from "../../../../utils/masterUtils";

interface RankingCardProps {
  station: RankingData;
  unit: string;
  minBound: number;
  maxBound: number;
  subText?: string | null;
  fractionDigits?: number;
}

export const RankingCard: React.FC<RankingCardProps> = ({
  station: s,
  unit,
  minBound,
  maxBound,
  subText,
  fractionDigits = 1,
}) => {
  const isTemperature = unit === "℃";
  const formattedValue =
    s.value !== null && s.value !== undefined
      ? `${fractionDigits === 0 ? Math.round(s.value) : s.value.toFixed(fractionDigits)}${unit}`
      : "---";

  const pref = s.pref ? resolvePref(s.pref) : undefined;
  const category = s.category ? resolveCategory(s.category) : undefined;

  return (
    <Link
      href={`/station/${s.id}`}
      prefetch={false}
      className="block transition-transform hover:-translate-y-0.5 group"
    >
      <div
        className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 relative overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md"
        style={{
          backgroundColor: colorWithAlpha(pref?.region?.colorBase, 0.08),
          borderColor: colorWithAlpha(pref?.region?.colorBase, 0.25),
        }}
      >
        {/* 順位バッジ */}
        <div
          className="absolute top-0 right-0 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg"
          style={{
            backgroundColor: pref?.region?.colorStrong,
            color: "white",
          }}
        >
          {s.rank}位
        </div>

        {/* 観測所名とアイコン・県名 */}
        <div className="mb-2 pr-6">
          <div className="flex items-center gap-1 overflow-hidden">
            {category?.value !== 4 && (
              <span
                className="transform group-hover:scale-110 transition-transform shrink-0"
                style={{
                  color: category?.colorFull,
                }}
              >
                {category?.icon}
              </span>
            )}
            <span className="text-sm font-bold text-slate-800 truncate">
              {s.station_name}
            </span>
            <span className="text-[9px] text-slate-400 font-mono shrink-0">
              #{s.id}
            </span>
          </div>
          {pref?.label && (
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className="text-[10px] font-bold px-1.5 py-0.2 rounded text-white inline-flex items-center gap-1 shadow-xs"
                style={{ backgroundColor: pref.region?.colorStrong || "#64748b" }}
              >
                {pref.icon && <span className="text-[10px] shrink-0">{pref.icon}</span>}
                <span>{pref.label}</span>
              </span>
            </div>
          )}
        </div>

        {/* 数値表示 */}
        <div className="flex-1 flex flex-col justify-end">
          <div
            className={`text-2xl font-mono font-bold ${getMetricColor(
              s.value,
              minBound,
              maxBound,
              !isTemperature
            )}`}
          >
            {formattedValue}
          </div>
          {subText && (
            <div className="text-[10px] text-slate-500 font-medium mt-1">
              {subText}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RankingCard;
