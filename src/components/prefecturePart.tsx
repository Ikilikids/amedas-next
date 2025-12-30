import Link from "next/link";
import React from "react";

// ==============================
// Types
// ==============================
interface StationData {
  official_name: string;
  station_name: string;
  // Add any other properties that might be present in the station object
  // from samePrefecture or rank1Stations
}

interface PrefecturePartProps {
  samePrefecture: { [id: string]: StationData };
  rank1Stations: { [id: string]: StationData };
}

interface StationGridProps {
  title: string;
  list: [string, StationData][];
  useRankColor?: boolean;
}

// ==============================
// Helper Functions
// ==============================

// 名前から擬似ランクを決定
function getRank(name: string): number {
  if (name.includes("航空")) return 3;
  if (["測候所", "観測", "高層"].some((k) => name.includes(k))) return 2;
  if (!name) return 4;
  if (name.includes("気象台")) return 1; // 全国の主要気象台

  return 4;
}

// rank に応じて背景色
const getBgColor = (station: StationData): string => {
  const rank = getRank(station.official_name);
  if (rank === 1) return "bg-red-200";
  if (rank === 2) return "bg-orange-200";
  return "bg-white";
};

// ==============================
// Components
// ==============================

const StationGrid: React.FC<StationGridProps> = ({
  title,
  list,
  useRankColor = false,
}) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-2">
      {list.map(([id, station]) => (
        <Link
          key={id}
          href={`/station/${id}`}
          className={`border rounded-lg p-1 shadow hover:shadow-lg transition text-center flex items-center justify-center gap-1 ${
            useRankColor ? getBgColor(station) : "bg-white"
          }`}
        >
          <span className="truncate w-[4rem] xl:text-sm">
            {station.station_name}
          </span>
        </Link>
      ))}
    </div>
  </div>
);

const PrefecturePart: React.FC<PrefecturePartProps> = ({
  samePrefecture,
  rank1Stations,
}) => {
  // 同じ県の観測所を rank順にソート
  const sortedSamePref = Object.entries(samePrefecture).sort(
    ([idA, sA], [idB, sB]) => {
      const rankA = getRank(sA.official_name);
      const rankB = getRank(sB.official_name);

      if (rankA !== rankB) return rankA - rankB;
      return idA.localeCompare(idB); // rankが同じ場合は id順
    }
  );

  return (
    <div className="min-h-screen p-2">
      {sortedSamePref.length > 0 && (
        <StationGrid
          title="同じ県の観測所"
          list={sortedSamePref}
          useRankColor
        />
      )}

      {Object.keys(rank1Stations).length > 0 && (
        <StationGrid
          title="気象台"
          list={Object.entries(rank1Stations)}
          useRankColor={false}
        />
      )}
    </div>
  );
};

export default PrefecturePart;
