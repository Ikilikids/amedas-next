import { useState, useEffect } from "react";
import { MetricKey } from "../../utils/colorUtils";
import { RankType, Station, StationMaster } from "./types";

export const useRankingData = (
  sortKey: MetricKey,
  rankType: RankType,
  selectedRegion: string,
  selectedPref: string,
  selectedMonth: string
) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [stationsMaster, setStationsMaster] = useState<Record<
    string,
    StationMaster
  > | null>(null);

  // ==============================
  // fetch stations master
  // ==============================
  useEffect(() => {
    fetch("/stations.json")
      .then((res) => res.json())
      .then((data) => setStationsMaster(data));
  }, []);

  // ==============================
  // fetch ranking
  // ==============================
  useEffect(() => {
    if (!stationsMaster) return;

    const stringKey = sortKey.toLowerCase();

    const url =
      rankType === RankType.Pre
        ? `/ranking/${stringKey}/${rankType}/${selectedPref}/${selectedMonth}.json`
        : rankType === RankType.Region
        ? `/ranking/${stringKey}/${rankType}/${selectedRegion}/${selectedMonth}.json`
        : `/ranking/${stringKey}/${rankType}/${selectedMonth}.json`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const data: Record<string, { value: number; rank: number }> = json;

        const stationList: Station[] = Object.entries(data).map(([id, d]) => {
          const master = stationsMaster[id];

          return {
            id,
            station_name: master?.station_name ?? "",
            official_name: master?.official_name ?? "",
            pref: master?.pref ?? "",
            city: master?.city ?? "",
            value: d.value,
            rank: d.rank,
          };
        });

        setStations(stationList);
      })
      .catch(() => setStations([]));
  }, [
    sortKey,
    rankType,
    selectedRegion,
    selectedPref,
    selectedMonth,
    stationsMaster,
  ]);

  return { stations };
};
