import Link from "next/link";
import React from "react";
import { sanitizeCityName, sanitizePrefLabel } from "../utils/masterUtils";

interface StationListItemProps {
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

const StationListItem: React.FC<StationListItemProps> = ({
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
      {/* Rank badge */}
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
            style={{ "--hover-color": prefColor } as React.CSSProperties}
          >
            {officialName || name}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            {prefLabel && (
              <span
                className="px-1.5 py-0.5 rounded-md text-white shadow-sm"
                style={{ backgroundColor: prefColor }}
              >
                {sanitizePrefLabel(prefLabel)}
              </span>
            )}
            {city && (
              <span className="text-slate-400">{sanitizeCityName(city)}</span>
            )}
          </div>

          <div className="flex items-baseline gap-0.5">
            {valueLabel && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {valueLabel}
              </span>
            )}
            <span className="text-xl font-black text-slate-700">
              {value}
              {unit && <span className="text-[10px] ml-0.5">{unit}</span>}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const className = `group block bg-white border border-slate-100 rounded-2xl p-2 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 relative overflow-hidden w-full text-left`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
};

export default StationListItem;
