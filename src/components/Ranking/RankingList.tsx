import React, { useMemo } from "react";
import { MetricCategory, MetricKey, getFullRegionColor, getIcon, metrics } from "../../utils/colorUtils";
import { Station } from "./types";
import { isIslandId } from "./utils";

interface RankingListProps {
  stations: Station[];
  sortKey: MetricKey;
  onStationClick: (station: Station) => void;
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
          sortKey === MetricKey.Sm_Snowing
            ? s.value
            : Number(s.value).toFixed(1);

        const icon = getIcon(s.official_name || "");
        const color = getFullRegionColor(s.pref || "");

        return (
          <div
            key={s.id}
            className="flex items-center justify-between p-3 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            onClick={() => onStationClick(s)}
          >
            <div className="w-12 text-center font-bold text-lg flex flex-col items-center">
              <span>
                {isIslandId(s.id) &&
                metrics[sortKey].category === MetricCategory.Temp
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
                  {s.pref}
                </span>
                <span className="text-gray-700 text-xs">{s.city}</span>
              </div>
            </div>

            <div className="text-right font-extrabold">
              {val} {metrics[sortKey].unit}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RankingList;
