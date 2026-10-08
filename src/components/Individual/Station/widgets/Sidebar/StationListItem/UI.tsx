import Link from "next/link";
import React from "react";
import { resolveCategory, resolvePref, sanitizeCityName, sanitizePrefLabel } from "../../../../../../utils/masterUtils";
import { RawSimilarStationData } from "../../../../../../types/raw";

export interface StationListItemProps {
  item: RawSimilarStationData;
  rank: number;
}

export const StationListItem: React.FC<StationListItemProps> = ({
  item,
  rank,
}) => {
  const pref = item.pref ? resolvePref(item.pref) : undefined;
  const category = item.category ? resolveCategory(item.category) : undefined;
  const name = item.station_name || "";
  const categoryColor = category?.colorFull;
  const icon = category?.icon;
  const value = item.similar != null ? (item.similar * 100).toFixed(1) : "--";

  const content = (
    <>
      <div className="absolute top-0 right-0 bg-slate-50 border-bl border-slate-100 px-3 py-1 rounded-bl-xl text-[10px] font-black text-slate-400 group-hover:bg-slate-800 group-hover:text-white transition-colors">
        RANK {rank}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          {icon && (
            <span
              className="text-slate-400 group-hover:text-[var(--hover-color)]"
              style={{ "--hover-color": categoryColor } as React.CSSProperties}
            >
              {icon}
            </span>
          )}
          <span
            className="font-black text-slate-800 transition-colors truncate pr-12 leading-tight group-hover:text-[var(--hover-color)]"
            style={{ "--hover-color": categoryColor } as React.CSSProperties}
          >
            {name}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {pref?.label && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white inline-flex items-center gap-1 shadow-xs"
                style={{ backgroundColor: pref.region?.colorStrong || "#64748b" }}
              >
                {pref.icon && <span className="text-[10px] shrink-0">{pref.icon}</span>}
                <span>{sanitizePrefLabel(pref.label)}</span>
              </span>
            )}
            {item.city && (
              <span className="text-xs text-slate-500 truncate max-w-[100px]">
                {sanitizeCityName(item.city)}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-[10px] text-slate-400 font-bold">
              類似度
            </span>
            <span className="text-sm font-black text-slate-800 tracking-tight">
              {value}
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              %
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const containerClasses =
    "group relative block p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden text-left w-full";

  return (
    <Link href={`/station/${item.id}`} className={containerClasses}>
      {content}
    </Link>
  );
};

export default StationListItem;
