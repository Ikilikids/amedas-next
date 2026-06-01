import Link from "next/link";
import React from "react";
import { StationData } from "../types/all";

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
}

// ==============================
// Components
// ==============================

const StationGrid: React.FC<StationGridProps> = ({ title, list }) => (
  <div className="mb-6">
    <h2 className="text-sm font-bold text-gray-500 mb-2 border-b pb-1">
      {title}
    </h2>
    <div className="grid grid-cols-3 gap-2">
      {list.map((s) => {
        return (
          <Link
            key={s.id}
            href={`/station/${s.id}`}
            className={`group border rounded-lg p-2 transition-all text-center flex items-center justify-center gap-1 hover:shadow-md`}
            style={{
              backgroundColor: s.category.colorBase,
              borderColor: s.category.colorBorder,
            }}
          >
            {s.category.label !== "アメダス" && (
              <span
                className="text-xs shrink-0"
                style={{ color: s.category.colorFull }}
              >
                {(() => {
                  const Icon = s.category.icon;
                  return <Icon />;
                })()}
              </span>
            )}
            <span
              className="text-xs truncate font-bold"
              style={{ color: s.category.colorFull }}
            >
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
    <div className="flex flex-col bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      {sortedSamePref.length > 0 && (
        <StationGrid title="同じ県の観測所" list={sortedSamePref} />
      )}

      {sortedMeteo.length > 0 && (
        <StationGrid title="全国の主要気象台" list={sortedMeteo} />
      )}
    </div>
  );
};

export default PrefecturePart;
