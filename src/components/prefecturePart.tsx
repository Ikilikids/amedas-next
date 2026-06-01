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
  icon: React.ElementType;
  showIcon?: boolean;
}

// ==============================
// Components
// ==============================

const StationGrid: React.FC<StationGridProps> = ({
  title,
  list,
  icon: Icon,
  showIcon = true,
}) => (
  <div className="mb-10 last:mb-0">
    <SectionWithDescription
      icon={Icon as any}
      title={title}
      bgColor="rgb(30, 41, 59)"
    />

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
      {list.map((s) => {
        const CategoryIcon = s.category.icon;
        return (
          <Link
            key={s.id}
            href={`/station/${s.id}`}
            className="group relative bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center"
          >
            {showIcon && (
              <div
                className="p-2 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors"
                style={{ color: s.category.colorFull }}
              >
                <CategoryIcon className="w-5 h-5" />
              </div>
            )}

            <span className="text-xs font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate w-full">
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
          icon={FaMapMarkerAlt}
        />
      )}

      {sortedMeteo.length > 0 && (
        <StationGrid
          title="全国の主要拠点"
          list={sortedMeteo}
          icon={FaGlobeAsia}
          showIcon={false}
        />
      )}
    </div>
  );
};

export default PrefecturePart;
