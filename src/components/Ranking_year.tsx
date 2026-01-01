import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getFullRegionColor } from "../utils/colorUtils";

// ==============================
// Types
// ==============================
interface RankingStation {
  number: string;
  station_name: string;
  pref: string;
  city?: string;
  rank: number;
  value: string | null;
}

interface RankingCategory {
  title: string;
  stations: RankingStation[];
}

interface RankingPartProps {
  rankingList: RankingCategory[];
  year: string;
  years: string[];
  type: string;
}

interface StationListProps {
  list: RankingStation[];
}

// ==============================
// layout判定
// ==============================
type LayoutType = "mobile" | "tablet" | "desktop";

function useLayout(): LayoutType {
  const [layout, setLayout] = useState<LayoutType>("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setLayout("mobile"); // sm
      } else if (w < 1024) {
        setLayout("tablet"); // md
      } else {
        setLayout("desktop"); // lg
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
}

// ==============================
// データ分割
// ==============================
function splitStations(
  list: RankingStation[],
  layout: LayoutType
): RankingStation[][] {
  switch (layout) {
    case "mobile":
      // 1列：1〜100
      return [list.slice(0, 100)];

    case "tablet":
      // 2列：1〜40 / 41〜100
      return [list.slice(0, 40), list.slice(40, 100)];

    case "desktop":
    default:
      // 3列：1〜20 / 21〜60 / 61〜100
      return [list.slice(0, 20), list.slice(20, 60), list.slice(60, 100)];
  }
}

// ==============================
// StationList
// ==============================
const StationList: React.FC<StationListProps> = ({ list }) => {
  const layout = useLayout();
  const columns = splitStations(list, layout);

  return (
    <div className="mb-6">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns:
            layout === "mobile"
              ? "1fr"
              : layout === "tablet"
              ? "3fr 2fr"
              : "3fr 2fr 2fr",
        }}
      >
        {columns.map((col, colIndex) => (
          <ul key={colIndex} className="flex flex-col gap-2">
            {col.map((station) => (
              <li key={station.number}>
                <Link
                  href={`/station/${station.number}`}
                  className="border rounded-lg p-2 shadow hover:shadow-lg transition flex items-center justify-between"
                >
                  {/* 順位 */}
                  <span
                    className={`w-8 pl-3 font-semibold ${
                      colIndex === 0 ? "text-xl" : "text-base"
                    }`}
                  >
                    {isIslandId(station.number)
                      ? `${station.rank}*`
                      : station.rank}
                  </span>

                  {/* 中央情報 */}
                  <div className="flex-1 flex flex-col ml-2 truncate">
                    <span
                      className={`font-semibold truncate ${
                        colIndex === 0 ? "text-xl ml-1" : "text-base"
                      }`}
                      style={
                        colIndex !== 0
                          ? { color: getFullRegionColor(station.pref) }
                          : undefined
                      }
                    >
                      {station.station_name}
                    </span>

                    {/* 左列のみ 都道府県・市町村 */}
                    {colIndex === 0 && (
                      <div className="flex gap-1 text-sm ml-1.5">
                        <span
                          className="font-semibold"
                          style={{
                            color: getFullRegionColor(station.pref),
                          }}
                        >
                          {station.pref}
                        </span>
                        {station.city && (
                          <span className="text-gray-600 text-xs">
                            {station.city}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 値 */}
                  {station.value && (
                    <span
                      className={`ml-2 whitespace-nowrap ${
                        colIndex === 0
                          ? "text-lg font-semibold"
                          : "text-sm text-gray-500"
                      }`}
                    >
                      {station.value}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

// ==============================
// RankingPart35
// ==============================
const RankingYear: React.FC<RankingPartProps> = ({
  rankingList,
  year,
  years,
  type,
}) => {
  const router = useRouter();

  return (
    <div className="p-2">
      {/* 年セレクタ */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">年：</label>
        <select
          className="border p-2 rounded"
          value={year}
          onChange={(e) => router.push(`/ranking_y/${type}/${e.target.value}`)}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}年
            </option>
          ))}
        </select>
      </div>

      <StationList list={rankingList[0].stations} />
    </div>
  );
};
const islandPrefixes = ["886", "887", "888", "889", "4417", "442", "443", "9"];
const isIslandId = (id: string): boolean =>
  id && islandPrefixes.some((p) => id.startsWith(p));

export default RankingYear;
