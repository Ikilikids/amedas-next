import { useEffect, useState } from "react";
import { OverviewData, StationData, UonzuData } from "../../types/all";
import { RawStationData } from "../../types/raw";
import { RankedValue } from "../../types/union";
import { toMetricMap, toStation } from "../../utils/masterUtils";
import { MetricMeta } from "../../utils/metric";
import { PrefMeta } from "../../utils/pref";
import { RankMeta } from "../../utils/rank";
import { RegionMeta } from "../../utils/region";
import { RawRankingData } from "./types";

// =============================================================================
// Centralized Cache Mechanism
// =============================================================================

// Basic station info (from stations.json)
let stationsMasterCache: Record<string, RawStationData> | null = null;

// Ranking data for each metric (from ranking2/${metric}.json)
let rankingCache: Record<string, Record<string, (number | null)[]>> = {};

// Detailed data for individual stations (overview, uonzu)
let stationDetailCache: Record<
  string,
  { uonzuData: UonzuData; overviewData: OverviewData }
> = {};

// Helper to ensure stations master is loaded
const fetchStationsMaster = async (): Promise<
  Record<string, RawStationData>
> => {
  if (stationsMasterCache) return stationsMasterCache;
  const res = await fetch("/stations.json");
  if (!res.ok) throw new Error("Failed to load stations master");

  const rawData: Record<string, RawStationData> = await res.json();
  stationsMasterCache = rawData;
  return rawData;
};

// =============================================================================
// Hook: useRankingData
// =============================================================================

import { processRankingData } from "../../utils/rankingUtils";

export const useRankingData = (
  sortKey: MetricMeta,
  rankMeta: RankMeta,
  selectedRegion: RegionMeta,
  selectedPref: PrefMeta,
  selectedMonth: string
) => {
  const [stations, setStations] = useState<RawRankingData[]>([]);
  const [stationsMaster, setStationsMaster] = useState<Record<
    string,
    RawStationData
  > | null>(stationsMasterCache);

  // 1. Fetch stations master on mount if not already cached
  useEffect(() => {
    fetchStationsMaster().then(setStationsMaster).catch(console.error);
  }, []);

  // 2. Fetch and process ranking data
  useEffect(() => {
    if (!stationsMaster) return;

    const metric = sortKey.key.toLowerCase();
    const monthIdx = selectedMonth === "all" ? 12 : parseInt(selectedMonth) - 1;

    const getRankingData = async () => {
      try {
        if (!rankingCache[metric]) {
          const res = await fetch(`/rank2_${metric}.json`);
          if (!res.ok) throw new Error(`Ranking data not found for ${metric}`);
          rankingCache[metric] = await res.json();
        }

        const data = rankingCache[metric];

        // Map stations
        let stationList: RawRankingData[] = Object.entries(data)
          .map(([id, values]) => {
            const master = stationsMaster[id];
            if (!master) return null;

            const value = values[monthIdx];
            if (value === null) return null;

            return {
              ...master,
              value,
              rank: 0, // Will be calculated by processRankingData
            } as RawRankingData;
          })
          .filter((s): s is RawRankingData => s !== null);

        const processed = processRankingData(
          stationList,
          rankMeta,
          selectedRegion,
          selectedPref
        );

        setStations(processed);
      } catch (e) {
        console.error("fetch error:", e);
        setStations([]);
      }
    };

    getRankingData();
  }, [
    sortKey,
    rankMeta,
    selectedRegion,
    selectedPref,
    selectedMonth,
    stationsMaster,
  ]);

  return { stations };
};

// =============================================================================
// Hook: useStationDetail (Replacement for useStationData)
// =============================================================================

export const useStationDetail = (stationId: string | null) => {
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [uonzuData, setUonzuData] = useState<UonzuData | null>(null);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!stationId) {
      setStationData(null);
      setUonzuData(null);
      setOverviewData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const masterRaw = await fetchStationsMaster();
        const raw = masterRaw[stationId];

        if (raw) {
          setStationData(toStation(raw));
        }

        if (stationDetailCache[stationId]) {
          setUonzuData(stationDetailCache[stationId].uonzuData);
          setOverviewData(stationDetailCache[stationId].overviewData);
          return;
        }

        const [resOverview, resUonzu] = await Promise.all([
          fetch(`/infotable/overview/${stationId}.json`),
          fetch(`/infotable/uonzu/${stationId}.json`),
        ]);

        const overviewJson: Record<string, RankedValue> =
          await resOverview.json();
        const uonzuJson: Record<string, number[]> = await resUonzu.json();

        const result = {
          uonzuData: toMetricMap(uonzuJson, (v) => v),
          overviewData: toMetricMap(overviewJson, (v) => v),
        };
        stationDetailCache[stationId] = result;
        setUonzuData(result.uonzuData);
        setOverviewData(result.overviewData);
      } catch (e) {
        console.error("fetch error:", e);
        setStationData(null);
        setUonzuData(null);
        setOverviewData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stationId]);

  return { stationData, uonzuData, overviewData, loading };
};
