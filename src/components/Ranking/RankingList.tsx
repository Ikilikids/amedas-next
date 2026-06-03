import React, { useMemo } from "react";
import { toStation } from "../../utils/masterUtils";
import { MetricMeta } from "../../utils/metric";
import { isIslandId } from "../../utils/rank";
import StationListItem from "../StationListItem";
import { RankingData, RawRankingData } from "./types";

interface RankingListProps {
  stations: RawRankingData[];
  sortKey: MetricMeta;
  onStationClick: (station: RawRankingData) => void;
  isSimple?: boolean;
}

const RankingList: React.FC<RankingListProps> = ({
  stations,
  sortKey,
  onStationClick,
  isSimple = false,
}) => {
  const rankingData: RankingData[] = useMemo(() => {
    return stations.map((s) => ({
      ...toStation(s),
      value: s.value,
      rank: s.rank,
      time: s.time,
    }));
  }, [stations]);

  const filteredRankingData: RankingData[] = useMemo(() => {
    return rankingData
      .filter((s) => s.value != null)
      .sort((a, b) => a.rank - b.rank);
  }, [rankingData]);

  return (
    <div className={`flex flex-col ${isSimple ? "gap-1" : "gap-3"} p-1`}>
      {filteredRankingData.map((s) => {
        const val =
          sortKey.key === ("sm_snowing" as any)
            ? s.value
            : Number(s.value).toFixed(1);

        const icon = s.category?.icon;
        const categoryColor = s.category?.colorFull;
        const color = s.pref?.region?.colorStrong;

        // originalRawを探す（onStationClick用）
        const originalRaw = stations.find((raw) => raw.id === s.id);

        return (
          <StationListItem
            key={s.id}
            id={s.id}
            rank={s.rank}
            rankSuffix={
              isIslandId(s.id) && sortKey.category === "気温" ? "*" : ""
            }
            name={s.station_name}
            officialName={s.official_name}
            prefLabel={s.pref?.label}
            prefColor={color}
            city={s.city}
            value={val}
            unit={sortKey.unit}
            icon={icon}
            categoryColor={categoryColor}
            onClick={() => originalRaw && onStationClick(originalRaw)}
            isSimple={isSimple}
          />
        );
      })}
    </div>
  );
};

export default RankingList;
