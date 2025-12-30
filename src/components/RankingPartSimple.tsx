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
  rank: number;
  value: string | null;
}

interface RankingCategory {
  title: string;
  stations: RankingStation[];
}

interface RankingPartSimpleProps {
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
    <ul className="flex flex-col gap-1">
      {list.map((station, index) => (
        <li key={index} className="group">
          <Link
            href={`/station/${station.number}`}
            className="border rounded-lg px-2 py-0.5 shadow hover:shadow-lg transition flex items-center justify-between"
          >
            <span className="font-semibold w-8 text-left pl-3">
              {station.rank}
            </span>

            <div className="flex-1 flex flex-col ml-2 truncate">
              <span
                className="font-semibold truncate"
                style={{ color: getFullRegionColor(station.pref) }}
              >
                {station.station_name}
              </span>
            </div>

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

const RankingPartSimple: React.FC<RankingPartSimpleProps> = ({
  rankingList,
}) => {
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
            <option key={idx} value={idx}>
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

export default RankingPartSimple;
