import { useEffect, useState } from "react";
import { OverviewData, StationData, UonzuData } from "../../types/all";
import { RawStationData } from "../../types/raw";
import { MonthlyEntry, StationId } from "../../types/union";
import { toMetricMap, toStation } from "../../utils/masterUtils";
import { MetricMeta, MetricValue } from "../../utils/metric";
import { PrefMeta } from "../../utils/pref";
import { RankMeta } from "../../utils/rank";
import { RegionMeta } from "../../utils/region";
import { RawRankingData } from "./types";

import {
  getClimate,
  getMaster,
  getStation,
  hasMetric,
  setMaster,
} from "../../utils/climateCache";

const fetchStationsMaster = async (): Promise<
  Record<StationId, RawStationData>
> => {
  const cached = getMaster();
  if (cached) return cached;

  const res = await fetch("/stations.json");
  if (!res.ok) throw new Error("Failed to load stations master");
  const rawData: Record<StationId, RawStationData> = await res.json();
  setMaster(rawData);
  return rawData;
};

// =============================================================================
// Hook: useRankingData
// =============================================================================

import {
  assembleDisplayData,
  processRankingData,
} from "../../utils/rankingUtils";

export const useRankingData = (
  sortKey: MetricMeta,
  rankMeta: RankMeta,
  selectedRegion: RegionMeta,
  selectedPref: PrefMeta,
  selectedMonth: string
) => {
  const [stations, setStations] = useState<RawRankingData[]>([]);
  const [stationsMaster, setStationsMaster] = useState<Record<
    StationId,
    RawStationData
  > | null>(getMaster());

  useEffect(() => {
    fetchStationsMaster().then(setStationsMaster).catch(console.error);
  }, []);

  useEffect(() => {
    if (!stationsMaster) return;

    const metric = sortKey.key.toLowerCase() as MetricValue;
    const monthIdx = selectedMonth === "all" ? 12 : parseInt(selectedMonth) - 1;

    const getRankingData = async () => {
      try {
        let integrated: Record<StationId, MonthlyEntry[]>;

        if (hasMetric(metric)) {
          // すでにキャッシュがあればそれを使う
          integrated = getClimate(metric, stationsMaster, {});
        } else {
          // なければフェッチしてキャッシュする
          const res = await fetch(`/ranking_not_null/${metric}.json`);
          if (!res.ok) throw new Error(`Ranking data not found for ${metric}`);
          const rawData = await res.json();
          integrated = getClimate(metric, stationsMaster, rawData);
        }

        // 3. 表示用に変換してフィルタリング
        const stationList = Object.entries(integrated)
          .map(([id, entries]) => {
            const master = stationsMaster[id as StationId];
            if (!master) return null;
            const entry = entries[monthIdx];
            if (!entry) return null; // データがない月は除外
            return { ...master, value: entry.value, rank: 0 } as RawRankingData;
          })
          .filter((s): s is RawRankingData => s !== null);

        const processed = processRankingData(
          stationList,
          rankMeta,
          selectedRegion,
          selectedPref,
          100
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
// Hook: useStationDetail
// =============================================================================

export const useStationDetail = (stationId: StationId | null) => {
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [uonzuData, setUonzuData] = useState<UonzuData | null>(null);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!stationId) {
      setStationData(null);
      setUonzuData(null);
      setOverviewData(null);
      setTableData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const masterRaw = await fetchStationsMaster();
        const raw = masterRaw[stationId];
        if (raw) setStationData(toStation(raw));

        // 主要な項目をロード
        const metricsToFetch: MetricValue[] = [
          "av_avtemp",
          "sm_rain",
          "av_hitemp",
          "av_lwtemp",
          "sm_sun",
          "sm_snowing",
          "av_wind",
          "hitemp_35",
          "hitemp_30",
          "hitemp_25",
          "lwtemp_0",
          "hitemp_0",
          "lwtemp_25",
          "rain_1",
        ];

        await Promise.all(
          metricsToFetch.map(async (m) => {
            if (hasMetric(m)) return; // すでにキャッシュがあればスキップ

            const res = await fetch(`/ranking_not_null/${m}.json`);
            if (res.ok) {
              const rawData = await res.json();
              getClimate(m, masterRaw, rawData);
            }
          })
        );

        // キャッシュからこの地点の統合済みデータをガサッと引く
        const integratedData = getStation(stationId);
        const { overview, table, ratio, uonzu } = assembleDisplayData(
          integratedData as any
        );

        const result = {
          uonzuData: toMetricMap(uonzu, (v) => v),
          overviewData: toMetricMap(overview, (v) => v),
          tableData: toMetricMap(table, (v) => v),
        };

        setUonzuData(result.uonzuData);
        setOverviewData(result.overviewData);
        setTableData(result.tableData);
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
    loading,
  };
};
