import Link from "next/link";
import React, { useMemo } from "react";
import { RawStationData } from "../../../../../../types/raw";
import { FaMapMarkerAlt, FaGlobeAsia } from "react-icons/fa";
import { resolveCategory, resolvePref } from "../../../../../../utils/masterUtils";
import { sortMeteoStations, sortSamePrefStations } from "./function";

export interface PrefecturePartProps {
  sameStations: RawStationData[];
  meteoStations: RawStationData[];
}

interface StationGridProps {
  title: string;
  list: RawStationData[];
  icon: React.ReactNode;
  showIcon?: boolean;
  showPrefIcon?: boolean;
  hoverColorMode?: "category" | "region";
}

const StationGrid: React.FC<StationGridProps> = ({
  title,
  list,
  icon,
  showIcon = true,
  showPrefIcon = false,
  hoverColorMode = "category",
}) => (
  <div className="mb-6 last:mb-0">
    <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
      <span className="text-slate-500 text-sm">{icon}</span>
      <h3 className="font-black text-xs text-slate-800 tracking-tight">
        {title}
      </h3>
    </div>

    <div className="grid grid-cols-2 gap-2 mt-2">
      {list.map((s) => {
        const category = s.category ? resolveCategory(s.category) : undefined;
        const pref = s.pref ? resolvePref(s.pref) : undefined;

        const hColor =
          hoverColorMode === "category"
            ? category?.colorFull
            : pref?.region?.colorStrong;
        const hBorder =
          hoverColorMode === "category"
            ? category?.colorBorder
            : pref?.region?.colorBase;
        const hBg =
          hoverColorMode === "category"
            ? category?.colorBase
            : pref?.region?.colorBase;

        return (
          <Link
            key={s.id}
            href={`/station/${s.id}`}
            prefetch={false}
            className="group relative bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 shadow-none hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex items-center gap-2"
            style={
              {
                "--h-color": hColor,
                "--h-border": hBorder,
                "--h-bg": hBg,
              } as React.CSSProperties
            }
          >
            {showPrefIcon && pref?.icon && (
              <span
                className="text-sm shrink-0"
                style={{ color: pref.region?.colorStrong }}
              >
                {pref.icon}
              </span>
            )}

            {showIcon && category && (
              <span
                className="text-base shrink-0"
                style={{ color: category.colorFull }}
              >
                {category.icon}
              </span>
            )}

            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors truncate">
              {s.station_name}
            </span>
          </Link>
        );
      })}
    </div>
  </div>
);

export const PrefecturePart: React.FC<PrefecturePartProps> = ({
  sameStations,
  meteoStations,
}) => {
  const sortedSamePref = useMemo(() => sortSamePrefStations(sameStations), [sameStations]);
  const sortedMeteo = useMemo(() => sortMeteoStations(meteoStations), [meteoStations]);

  return (
    <div className="flex flex-col">
      {sortedSamePref.length > 0 && (
        <StationGrid
          title="同じ県の観測所"
          list={sortedSamePref}
          icon={<FaMapMarkerAlt />}
          hoverColorMode="category"
        />
      )}

      {sortedMeteo.length > 0 && (
        <StationGrid
          title="全国の主要拠点"
          list={sortedMeteo}
          icon={<FaGlobeAsia />}
          showIcon={false}
          showPrefIcon={true}
          hoverColorMode="region"
        />
      )}
    </div>
  );
};

export default PrefecturePart;
