import Link from "next/link";
import React, { useState } from "react";
import { getFullRegionColor } from "../utils/colorUtils";

// ==============================
// Types
// ==============================
interface RankingStation {
  number: string;
  station_name: string;
  pref: string;
  city?: string; // city is optional here
  rank: number;
  value: string | null;
}

interface RankingCategory {
  title: string;
  stations: RankingStation[];
}

interface RankingPartProps {
  rankingList: RankingCategory[];
}

interface StationListProps {
  title: string;
  list: RankingStation[];
}

// ==============================
// Component
// ==============================
const StationList: React.FC<StationListProps> = ({ title, list }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <ul className="flex flex-col gap-2">
      {list.map((station, index) => (
        <li key={index} className="group">
          <Link
            href={`/station/${station.number}`}
            className="border rounded-lg p-2 shadow hover:shadow-lg transition flex items-center justify-between"
          >
            {/* 左端：順位 */}
            <span className="font-semibold w-8 text-left pl-3">
              {station.rank}
            </span>

            {/* 中央：station_name＋pref・city */}
            <div className="flex-1 flex flex-col ml-2 truncate">
              <span className="font-semibold truncate">
                {station.station_name}
              </span>
              <div className="flex gap-1 items-end text-sm">
                {station.pref && (
                  <span
                    className="font-semibold"
                    style={{ color: getFullRegionColor(station.pref) }}
                  >
                    {station.pref}
                  </span>
                )}
                {station.city && (
                  <span className="font-normal text-gray-700 text-xs">
                    {station.city}
                  </span>
                )}
              </div>
            </div>

            {/* 右端：value */}
            {station.value && (
              <span className="ml-2 text-sm text-gray-500 whitespace-nowrap">
                {station.value}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const RankingPart: React.FC<RankingPartProps> = ({ rankingList }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <div className="min-h-screen p-2">
      <div className="mb-4">
        <label className="mr-2 font-semibold">ランキング：</label>
        <select
          className="border p-2 rounded"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
        >
          {rankingList.map((item, idx) => (
            <option value={idx} key={idx}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      <StationList
        title={rankingList[selectedIndex].title}
        list={rankingList[selectedIndex].stations}
      />
    </div>
  );
};

export default RankingPart;
