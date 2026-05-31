import React, { useMemo } from "react";
import { MetricKey } from "../../utils/metric";
import { RankingData } from "./types";
import { isIslandId } from "./utils";

interface RankingListProps {
  stations: RankingData[];
  sortKey: MetricKey;
  onStationClick: (station: RankingData) => void;
}

const RankingList: React.FC<RankingListProps> = ({
  stations,
  sortKey,
  onStationClick,
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
          sortKey === MetricKey.sm_snowing
            ? s.value
            : Number(s.value).toFixed(1);

        const icon = s.category.icon;
        const color = s.pref.region.colorStrong;

        return (
          <div
            key={s.id}
            className="flex items-center justify-between p-3 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            onClick={() => onStationClick(s)}
          >
            <div className="w-12 text-center font-bold text-lg flex flex-col items-center">
              <span>
                {isIslandId(s.id) && sortKey.category === "気温"
                  ? `${s.rank}*`
                  : s.rank}
              </span>
            </div>

            <div className="flex-1 ml-3">
              <div className="font-bold flex items-center gap-1">
                {icon}
                <span className="block md:hidden">{s.station_name}</span>
                <span className="hidden md:block">{s.official_name}</span>
              </div>

              <div className="flex gap-1 items-end text-sm">
                <span className="font-semibold" style={{ color }}>
                  {s.pref.label}
                </span>
                <span className="text-gray-700 text-xs">{s.city}</span>
              </div>
            </div>

            <div className="text-right font-extrabold">
              {val} {sortKey.unit}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RankingList;
