import Link from "next/link";
import { useState } from "react";
import { getFullRegionColor } from "../utils/colorUtils";

export default function RankingPart({ rankingList }) {
  // 今選択されているランキング（0番目を初期value）
  const [selectedIndex, setSelectedIndex] = useState(0);

  const StationList = ({ title, list }) => (
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

  return (
    <div className="min-h-screen p-2">
      {/* ▼ カテゴリ切り替えセレクト */}
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

      {/* ▼ 選ばれたランキングだけ表示 */}
      <StationList
        title={rankingList[selectedIndex].title}
        list={rankingList[selectedIndex].stations}
      />
    </div>
  );
}
