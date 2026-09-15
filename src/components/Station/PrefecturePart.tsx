import Link from "next/link";
import React from "react";
import { StationData } from "../../types/all";
import { FaMapMarkerAlt, FaGlobeAsia } from "react-icons/fa";
import { SectionWithDescription } from "../../utils/colorUtils";

// ==============================
// Types
// ==============================
interface PrefecturePartProps {
  sameStations: StationData[];
  meteoStations: StationData[];
}

interface StationGridProps {
  title: string;
  list: StationData[];
  icon: React.ReactNode;
  showIcon?: boolean;
  hoverColorMode?: "category" | "region";
}

// ==============================
// Components
// ==============================

const StationGrid: React.FC<StationGridProps> = ({
  title,
  list,
  icon,
  showIcon = true,
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
        const hColor =
          hoverColorMode === "category"
            ? s.category.colorFull
            : s.pref.region.colorStrong;
        const hBorder =
          hoverColorMode === "category"
            ? s.category.colorBorder
            : s.pref.region.colorBase;
        const hBg =
          hoverColorMode === "category"
            ? s.category.colorBase
            : s.pref.region.colorBase;

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
            {showIcon && (
              <span
                className="text-base shrink-0"
                style={{ color: s.category.colorFull }}
              >
                {s.category.icon}
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

const PrefecturePart: React.FC<PrefecturePartProps> = ({
  sameStations,
  meteoStations,
}) => {
  // 同じ県の観測所を category順 -> id順にソート
  const sortedSamePref = [...sameStations].sort(
    (a, b) => a.category.value - b.category.value || a.id.localeCompare(b.id)
  );

  // 気象台リストを id順にソート
  const sortedMeteo = [...meteoStations].sort((a, b) =>
    a.id.localeCompare(b.id)
  );

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
          hoverColorMode="region"
        />
      )}
    </div>
  );
};

export default PrefecturePart;
