import React, { useMemo } from "react";
import { MetricMeta } from "../../utils/metric";
import { RankingData } from "./types";
import { isIslandId } from "./utils";

interface RankingListProps {
  stations: RankingData[];
  sortKey: MetricMeta;
  onStationClick: (station: RankingData) => void;
  isSimple?: boolean;
}

const RankingList: React.FC<RankingListProps> = ({
  stations,
  sortKey,
  onStationClick,
  isSimple = false,
}) => {
  const filteredStations = useMemo(() => {
    return stations
      .filter((s) => s.value != null)
      .sort((a, b) => a.rank - b.rank);
  }, [stations]);

  return (
    <>
      {filteredStations.map((s) => {
        const val =
          sortKey.key === ("sm_snowing" as any)
            ? s.value
            : Number(s.value).toFixed(1);

        const icon = s.category?.icon;
        const color = s.pref?.region?.colorStrong;

        return (
          <div
            key={s.id}
            className={`flex items-center justify-between ${
              isSimple ? "p-1" : "p-3"
            } bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition`}
            onClick={() => onStationClick(s)}
          >
            <div className="w-10 text-center font-bold text-lg flex flex-col items-center">
              <span>
                {isIslandId(s.id) && sortKey.category === "気温"
                  ? `${s.rank}*`
                  : s.rank}
              </span>
            </div>

            <div className="flex-1 ml-2">
              <div
                className="font-bold flex items-center gap-1"
                style={isSimple ? { color } : {}}
              >
                {!isSimple && icon}
                <span>{s.station_name}</span>
                {!isSimple && (
                  <span className="hidden md:inline text-xs text-gray-400 font-normal ml-1">
                    ({s.official_name})
                  </span>
                )}
              </div>

              {!isSimple && s.pref && (
                <div className="flex gap-1 items-end text-sm">
                  <span className="font-semibold" style={{ color }}>
                    {s.pref.label}
                  </span>
                  <span className="text-gray-700 text-xs">{s.city}</span>
                </div>
              )}
            </div>

            <div className="text-right font-extrabold ml-2">
              {val}{" "}
              <span className="text-[10px] font-normal">{sortKey.unit}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RankingList;
