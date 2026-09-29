import { useEffect, useState } from "react";
import { BadgeData, OverviewData, RatioData, StationData, TableData, UonzuData } from "../../types/all";
import { RawStationData } from "../../types/raw";
import { MonthlyEntry, RankedValue, StationId } from "../../types/union";
import { toBadge, toMetricMap, toStation } from "../../utils/masterUtils";
import { BadgeLogic } from "../../utils/badgeLogic";
import { MetricMeta, MetricValue } from "../../setting/metric";
import { PrefMeta } from "../../setting/pref";
import { RankMeta, isIslandId } from "../../setting/rank";
import { RegionMeta } from "../../setting/region";
import { RawRankingData } from "./types";

import {
  loadSingleMetric,
  getStationMetrics,
} from "../../utils/climateDataManager";
import { processRankingData } from "../../utils/rankingUtils";

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
        const integrated = await loadSingleMetric(metric, masterData);
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
  const [uonzuData, setUonzuData] = useState<UonzuData | null>(null);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!stationId) {
      setStationData(null);
      setUonzuData(null);
      setOverviewData(null);
      setTableData(null);
      setBadges([]);
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

        const metricsMap = await getStationMetrics(
          [stationId],
          ["overview", "uonzu", "badge"],
          master
        );
        const item = metricsMap[stationId];
        if (!item) return;

        const { overview, table, ratio, uonzu, badge } = item;

        const result = {
          uonzuData: toMetricMap<(number | null)[], (number | null)[]>(
            uonzu,
            (v) => v
          ),
          overviewData: toMetricMap<RankedValue, RankedValue>(
            overview,
            (v) => v
          ),
          tableData: toMetricMap<(MonthlyEntry | null)[], (MonthlyEntry | null)[]>(
            table,
            (v) => v
          ),
        };

        const resolvedBadges = (badge || []).map(toBadge);

        setUonzuData(result.uonzuData);
        setOverviewData(result.overviewData);
        setTableData(result.tableData);
        setBadges(resolvedBadges);
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
    uonzuData,
    overviewData,
    tableData,
    badges,
    loading,
  };
};
