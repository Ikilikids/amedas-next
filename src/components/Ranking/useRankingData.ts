import { useEffect, useState } from "react";
import { MonthlyData, StationData } from "../../types/all";
import { RawStationData } from "../../types/raw";
import { MonthlyEntry, StationId } from "../../types/union";
import { toMetricMap, toStation } from "../../utils/masterUtils";
import { MetricMeta, MetricValue } from "../../setting/metric";
import { PrefMeta } from "../../setting/pref";
import { RankMeta, isIslandId } from "../../setting/rank";
import { RegionMeta } from "../../setting/region";
import { RawRankingData } from "./types";

import { loadSingleMetric } from "../../utils/climateDataManager";
import { processRankingData, assembleDisplayData } from "../../utils/rankingUtils";

// =============================================================================
// Hook: useRankingData
// =============================================================================

export const useRankingData = (
  sortKey: MetricMeta,
  rankMeta: RankMeta,
  selectedRegion: RegionMeta,
  selectedPref: PrefMeta,
  selectedMonth: string,
  masterData?: Record<StationId, RawStationData>
) => {
  const [stations, setStations] = useState<RawRankingData[]>([]);

  useEffect(() => {
    let isMounted = true;
    const metric = sortKey.key.toLowerCase() as MetricValue;
    const monthIdx = selectedMonth === "all" ? 12 : parseInt(selectedMonth) - 1;

    const getRankingData = async () => {
      try {
        const integrated = await loadSingleMetric(metric);
        if (!integrated || !isMounted) return;

        const master = masterData;
        if (!master) return;
        const stationList = Object.entries(integrated)
          .map(([id, entries]) => {
            const st = master[id as StationId];
            if (!st) return null;
            const entry = entries[monthIdx];
            if (!entry) return null;
            return { ...st, value: entry.value, rank: 0 } as RawRankingData;
          })
          .filter((s): s is RawRankingData => s !== null);

        const processed = processRankingData(
          stationList,
          rankMeta,
          selectedRegion,
          selectedPref,
          100
        );

        if (isMounted) setStations(processed);
      } catch (e) {
        console.error("fetch error:", e);
        if (isMounted) setStations([]);
      }
    };

    getRankingData();

    return () => {
      isMounted = false;
    };
  }, [sortKey, rankMeta, selectedRegion, selectedPref, selectedMonth]);

  return { stations };
};

// ==========================================
// Hook: useStationDetail
// ==========================================

export const useStationDetail = (
  stationId: StationId | null,
  initialMaster?: Record<StationId, RawStationData>
) => {
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [climateData, setClimateData] = useState<MonthlyData | null>(null);
  const [uonzuData, setUonzuData] = useState<MonthlyData | null>(null);
  const [tableData, setTableData] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!stationId) {
      setStationData(null);
      setClimateData(null);
      setUonzuData(null);
      setTableData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const master = initialMaster;
        if (!master) {
          throw new Error("useStationDetail: initialMaster (from SSG) is required.");
        }

        const raw = master[stationId];
        if (raw) setStationData(toStation(raw));

        const metricsMap = await assembleDisplayData({
          [stationId]: ["overview", "uonzu", "table"],
        });
        const item = metricsMap[stationId];
        if (!item) return;

        const { climateData: rawClimate } = item;
        const climateMap = toMetricMap(rawClimate, (v) => v);

        setClimateData(climateMap);
        setUonzuData(climateMap);
        setTableData(climateMap);
      } catch (e) {
        console.error("fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stationId]);

  return {
    stationData,
    climateData,
    uonzuData,
    tableData,
    loading,
  };
};
