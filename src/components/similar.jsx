import Link from "next/link";
import { getFullRegionColor } from "../utils/colorUtils";

export default function SimilarPage({ similarStations, similarCutStations }) {
  const StationList = ({ title, list }) => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <ul className="flex flex-col gap-2">
        {list.map(([id, station], index) => (
          <li key={id} className="group">
            {/* li 全体を Link に */}
            <Link
              href={`/station/${id}`}
              className="border rounded-lg p-2 shadow hover:shadow-lg transition flex items-center justify-between"
            >
              {/* 左端：順位 */}
              <span className="font-semibold w-8 text-left pl-3">
                {index + 1}
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
                      style={{
                        color: getFullRegionColor(station.pref || ""),
                      }}
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

              {/* 右端：類似度 */}
              {station.similar !== undefined && (
                <span className="ml-2 text-sm text-gray-500 whitespace-nowrap">
                  類似度 {(station.similar * 100).toFixed(1)}%
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
      {similarStations && Object.keys(similarStations).length > 0 && (
        <StationList
          title="類似する地点"
          list={Object.entries(similarStations).sort(
            ([, a], [, b]) => b.similar - a.similar
          )}
        />
      )}
      {similarCutStations && Object.keys(similarCutStations).length > 0 && (
        <StationList
          title="類似する気象台"
          list={Object.entries(similarCutStations).sort(
            ([, a], [, b]) => b.similar - a.similar
          )}
        />
      )}
    </div>
  );
}
