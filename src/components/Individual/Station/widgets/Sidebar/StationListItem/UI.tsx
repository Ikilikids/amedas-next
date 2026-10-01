import Link from "next/link";
import React from "react";
import { sanitizeCityName, sanitizePrefLabel } from "../../../../../../utils/masterUtils";

export interface StationListItemProps {
  id: string;
  rank: string | number;
  rankSuffix?: string;
  name: string;
  officialName?: string;
  prefLabel?: string;
  prefColor?: string;
  city?: string;
  value: string | number;
  unit?: string;
  valueLabel?: string;
  icon?: React.ReactNode;
  categoryColor?: string;
  onClick?: () => void;
  href?: string;
  isSimple?: boolean;
}

export const StationListItem: React.FC<StationListItemProps> = ({
  rank,
  rankSuffix = "",
  name,
  officialName,
  prefLabel,
  prefColor,
  city,
  value,
  unit,
  valueLabel,
  icon,
  categoryColor,
  onClick,
  href,
  isSimple = false,
}) => {
  const content = (
    <>
      <div className="absolute top-0 right-0 bg-slate-50 border-bl border-slate-100 px-3 py-1 rounded-bl-xl text-[10px] font-black text-slate-400 group-hover:bg-slate-800 group-hover:text-white transition-colors">
        RANK {rank}
        {rankSuffix}
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
          {officialName && officialName !== name && (
            <span className="text-[10px] text-slate-400 truncate">
              ({officialName})
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {prefLabel && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                style={{ backgroundColor: prefColor || "#64748b" }}
              >
                {sanitizePrefLabel(prefLabel)}
              </span>
            )}
            {city && (
              <span className="text-xs text-slate-500 truncate max-w-[100px]">
                {sanitizeCityName(city)}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1">
            {valueLabel && (
              <span className="text-[10px] text-slate-400 font-bold">
                {valueLabel}
              </span>
            )}
            <span className="text-sm font-black text-slate-800 tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-[10px] font-bold text-slate-500">
                {unit}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const containerClasses =
    "group relative block p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden text-left w-full";

  if (href) {
    return (
      <Link href={href} className={containerClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={containerClasses} type="button">
      {content}
    </button>
  );
};

export default StationListItem;
