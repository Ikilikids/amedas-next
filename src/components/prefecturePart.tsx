import Link from "next/link";
import React from "react";
import { StationData } from "../types/all";
import { FaMapMarkerAlt, FaGlobeAsia } from "react-icons/fa";
import { SectionWithDescription } from "../utils/colorUtils";

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
  <div className="mb-10 last:mb-0">
    <SectionWithDescription
      icon={icon}
      title={title}
      bgColor="rgb(30, 41, 59)"
    />

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
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
            className="group relative bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center"
            style={
              {
                "--h-color": hColor,
                "--h-border": hBorder,
                "--h-bg": hBg,
              } as React.CSSProperties
            }
          >
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--h-border)] transition-colors pointer-events-none" />

            {showIcon && (
              <div
                className="p-2 rounded-xl bg-slate-50 group-hover:bg-[var(--h-bg)] transition-colors flex items-center justify-center"
                style={{ color: s.category.colorFull }}
              >
                <span className="text-xl">{s.category.icon}</span>
              </div>
            )}

            <span className="text-xs font-black text-slate-800 group-hover:text-[var(--h-color)] transition-colors truncate w-full">
              {s.station_name}
            </span>
          </Link>
        );
      })}
    </div>
  </div>
);

const PrefecturePart: React.FC<PrefecturePartProps> = ({
  sameStations = [],
  meteoStations = [],
}) => {
  // 同じ県の観測所を category順 -> id順にソート
  const sortedSamePref = [...(sameStations || [])].sort((a, b) => {
    const catA = a?.category?.value ?? 999;
    const catB = b?.category?.value ?? 999;
    const idA = a?.id ?? "";
    const idB = b?.id ?? "";
    return catA - catB || idA.localeCompare(idB);
  });

  // 気象台リストを id順にソート
  const sortedMeteo = [...(meteoStations || [])].sort((a, b) => {
    const idA = a?.id ?? "";
    const idB = b?.id ?? "";
    return idA.localeCompare(idB);
  });

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
