import Link from "next/link";
import { useState } from "react";
import { getFullRegionColor } from "../utils/colorUtils";

export default function RankingPartSimple({ rankingList }) {
  // 今選択中のランキング（0を初期値）
  const [selectedIndex, setSelectedIndex] = useState(0);

  const StationList = ({ title, list }) => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <ul className="flex flex-col gap-1">
        {list.map((station, index) => (
          <li key={index} className="group">
            <Link
              href={`/station/${station.number}`}
              className="border rounded-lg px-2 py-0.5 shadow hover:shadow-lg transition flex items-center justify-between"
            >
              {/* 左端：順位 */}
              <span className="font-semibold w-8 text-left pl-3">
                {station.rank}
              </span>

              {/* 中央：観測所名（色つき） */}
              <div className="flex-1 flex flex-col ml-2 truncate">
                <span
                  className="font-semibold truncate"
                  style={{ color: getFullRegionColor(station.pref) }}
                >
                  {station.station_name}
                </span>
              </div>

              {/* 右端：値 */}
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

  return (
    <div className="min-h-screen p-2">
      {/* ▼カテゴリ選択プルダウン */}
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

      {/* ▼選ばれたランキングのみ表示 */}
      <StationList
        title={rankingList[selectedIndex].title}
        list={rankingList[selectedIndex].stations}
      />
    </div>
  );
}
