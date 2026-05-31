import { useEffect, useState } from "react";
import { OverviewData, StationData, UonzuData } from "../../types/all";
import { RawStationData } from "../../types/raw";
import { RankedValue } from "../../types/union";
import { toMetricMap, toStation } from "../../utils/masterUtils";
import { MetricMeta } from "../../utils/metric";
import { PrefMeta } from "../../utils/pref";
import { RegionMeta } from "../../utils/region";
import { RankType, RankingData } from "./types";
import { isIslandId } from "./utils";

// =============================================================================
// Centralized Cache Mechanism
// =============================================================================

// Basic station info (from stations.json)
let stationsMasterCache: Record<string, StationData> | null = null;

// Ranking data for each metric (from ranking2/${metric}.json)
let rankingCache: Record<string, Record<string, (number | null)[]>> = {};

// Detailed data for individual stations (overview, uonzu)
let stationDetailCache: Record<
  string,
  { uonzuData: UonzuData; overviewData: OverviewData }
> = {};

// Helper to ensure stations master is loaded
const fetchStationsMaster = async (): Promise<Record<string, StationData>> => {
  if (stationsMasterCache) return stationsMasterCache;
  const res = await fetch("/stations.json");
  if (!res.ok) throw new Error("Failed to load stations master");

  const rawData: Record<string, RawStationData> = await res.json();
  const stationData: Record<string, StationData> = Object.fromEntries(
    Object.entries(rawData).map(([id, raw]) => [id, toStation(raw)])
  );

  stationsMasterCache = stationData;
  return stationData;
};

// =============================================================================
// Hook: useRankingData
// =============================================================================

export const useRankingData = (
  sortKey: MetricMeta,
  rankType: RankType,
  selectedRegion: RegionMeta,
  selectedPref: PrefMeta,
  selectedMonth: string
) => {
  const [stations, setStations] = useState<RankingData[]>([]);
  const [stationsMaster, setStationsMaster] = useState<Record<
    string,
    StationData
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
          const res = await fetch(`/ranking2/${metric}.json`);
          if (!res.ok) throw new Error(`Ranking data not found for ${metric}`);
          rankingCache[metric] = await res.json();
        }

        const data = rankingCache[metric];

        // Map stations
        let stationList: RankingData[] = Object.entries(data)
          .map(([id, values]) => {
            const master = stationsMaster[id];
            if (!master) return null;

            const value = values[monthIdx];
            if (value === null) return null;

            return {
              ...master,
              value,
            } as RankingData;
          })
          .filter((s): s is RankingData => s !== null && s.pref !== undefined);

        // Filtering logic
        if (rankType === RankType.Pre) {
          stationList = stationList.filter(
            (s) => s.pref.code === selectedPref.code
          );
        } else if (rankType === RankType.Region) {
          stationList = stationList.filter(
            (s) => s.pref.region.label === selectedRegion.label
          );
        } else if (rankType === RankType.Meteo) {
          // meteo, special are meteorology stations
          stationList = stationList.filter(
            (s) =>
              s.category.label === "気象台" ||
              s.category.label === "特別地域気象観測所"
          );
        } else if (rankType === RankType.Island) {
          // Basic island exclusion logic (Ogasawara, Daito, etc.)
          stationList = stationList.filter((s) => isIslandId(s.id) === false);
        }

        // Sorting
        const isBot = rankType === RankType.Bot;
        stationList.sort((a, b) =>
          isBot ? a.value - b.value : b.value - a.value
        );

        // Apply 100 limit for Top/Bot/Meteo if needed
        if (
          rankType === RankType.Top ||
          rankType === RankType.Bot ||
          rankType === RankType.Island
        ) {
          stationList = stationList.slice(0, 100);
        }

        // Calculate ranks with ties
        let currentRank = 0;
        let lastValue: number | null = null;
        const rankedList = stationList.map((s, idx) => {
          if (s.value !== lastValue) {
            currentRank = idx + 1;
            lastValue = s.value;
          }
          return { ...s, rank: currentRank };
        });

        setStations(rankedList);
      } catch (e) {
        console.error("fetch error:", e);
        setStations([]);
      }
    };

    getRankingData();
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
        const master = await fetchStationsMaster();
        const info = master[stationId];

        if (info) {
          setStationData(info);
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
