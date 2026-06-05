import { RawRankingData } from "../components/Ranking/types";
import {
  RawOverviewData,
  RawRatioData,
  RawStationData,
  RawTableData,
  RawUonzuData,
} from "../types/raw";
import { MonthlyEntry, StationId } from "../types/union";
import { MetricKey, MetricValue } from "./metric";
import { PrefKey, PrefMeta } from "./pref";
import { RankKey, RankMeta, isIslandId } from "./rank";
import { RegionMeta } from "./region";

/**
 * 1. 【共通】材料組み立て関数（Assembler）
 */
export function buildRawRankingList(
  data: Record<StationId, number[]>,
  stationsMaster: Record<StationId, RawStationData>,
  monthIdx: number
): RawRankingData[] {
  return Object.entries(data)
    .map(([id, values]) => {
      const master = stationsMaster[id as StationId];
      if (!master) return null;
      const value = values[monthIdx];
      return { ...master, value, rank: 0 } as RawRankingData;
    })
    .filter((s): s is RawRankingData => s !== null);
}

/**
 * 2. 【共通】順位計算・フィルタリング関数（Ranker）
 */
export function processRankingData(
  list: RawRankingData[],
  rankMeta: RankMeta,
  selectedRegion?: RegionMeta,
  selectedPref?: PrefMeta,
  limit?: number
): RawRankingData[] {
  let filtered = [...list];
  const rankType = rankMeta.key;

  if (rankType === RankKey.pre.key && selectedPref) {
    filtered = filtered.filter((s) => s.pref === selectedPref.code);
  } else if (rankType === RankKey.region.key && selectedRegion) {
    filtered = filtered.filter((s) => {
      const pref = Object.values(PrefKey).find((p) => p.code === s.pref);
      return pref?.region.label === selectedRegion.label;
    });
  } else if (rankType === RankKey.meteo.key) {
    filtered = filtered.filter((s) => s.category === "meteo");
  } else if (rankType === RankKey.island.key) {
    filtered = filtered.filter((s) => !isIslandId(s.id));
  }

  const isBot = rankType === RankKey.bot.key;
  filtered.sort((a, b) => (isBot ? a.value - b.value : b.value - a.value));

  let currentRank = 0;
  let lastValue: number | null = null;
  const ranked = filtered.map((s, idx) => {
    if (s.value !== lastValue) {
      currentRank = idx + 1;
      lastValue = s.value;
    }
    return { ...s, rank: currentRank };
  });

  return limit ? ranked.slice(0, limit) : ranked;
}

/**
 * 【Single Integrator】1つの項目について、全地点・全月のデータを一括計算する
 */
export function integrateSingleMetric(
  metric: MetricValue,
  rawData: Record<StationId, number[]>,
  stationsMaster: Record<StationId, RawStationData>
): Record<StationId, MonthlyEntry[]> {
  const result: Record<StationId, MonthlyEntry[]> = {};

  // 初期化 (元データにある地点のみを対象にする)
  Object.keys(rawData).forEach((id) => {
    result[id as StationId] = [];
  });

  for (let monthIdx = 0; monthIdx <= 12; monthIdx++) {
    const rawList = buildRawRankingList(rawData, stationsMaster, monthIdx);
    if (rawList.length === 0) continue;

    // この月の全パターンの順位を事前に計算
    const topRanks = processRankingData(rawList, RankKey.top);
    const botRanks = processRankingData(rawList, RankKey.bot);
    const meteoRanks = processRankingData(rawList, RankKey.meteo);
    const islandRanks = processRankingData(rawList, RankKey.island);

    // マップ化
    const topMap = new Map(topRanks.map((s) => [s.id, s.rank]));
    const botMap = new Map(botRanks.map((s) => [s.id, s.rank]));
    const meteoMap = new Map(meteoRanks.map((s) => [s.id, s.rank]));
    const islandMap = new Map(islandRanks.map((s) => [s.id, s.rank]));

    const prefRanksMap = new Map<string, Map<StationId, number>>();
    const regionRanksMap = new Map<string, Map<StationId, number>>();

    // 地点ごとに結果を格納
    rawList.forEach((s) => {
      // 県内順位
      if (!prefRanksMap.has(s.pref)) {
        const pMeta = Object.values(PrefKey).find((p) => p.code === s.pref);
        const pRanks = processRankingData(
          rawList,
          RankKey.pre,
          undefined,
          pMeta
        );
        prefRanksMap.set(s.pref, new Map(pRanks.map((r) => [r.id, r.rank])));
      }

      // 地方順位
      const regionLabel = Object.values(PrefKey).find((p) => p.code === s.pref)
        ?.region.label;
      if (regionLabel && !regionRanksMap.has(regionLabel)) {
        const rMeta = { label: regionLabel } as RegionMeta;
        const rRanks = processRankingData(rawList, RankKey.region, rMeta);
        regionRanksMap.set(
          regionLabel,
          new Map(rRanks.map((r) => [r.id, r.rank]))
        );
      }

      const entry: MonthlyEntry = {
        value: s.value,
        top: topMap.get(s.id) || 0,
        bot: botMap.get(s.id) || 0,
        pre: prefRanksMap.get(s.pref)?.get(s.id) || 0,
        region: regionLabel
          ? regionRanksMap.get(regionLabel)?.get(s.id) || 0
          : 0,
        meteo: s.category === "meteo" ? meteoMap.get(s.id) || null : null,
        island: !isIslandId(s.id) ? islandMap.get(s.id) || null : null,
      };

      result[s.id][monthIdx] = entry;
    });
  }

  return result;
}

/**
 * 【Assembler】特定地点の統合データを表示用に変換する
 */
export function assembleDisplayData(
  integratedData: Record<MetricValue, MonthlyEntry[]>
) {
  const overview: RawOverviewData = {};
  const table: RawTableData = {};
  const ratio: RawRatioData = {};
  const uonzu: RawUonzuData = {};

  (Object.entries(integratedData) as [MetricValue, MonthlyEntry[]][]).forEach(
    ([m, fullEntries]) => {
      table[m] = fullEntries;
      const annualEntry = fullEntries[12];
      if (annualEntry) {
        const metricMeta = MetricKey[m];
        if (metricMeta?.tab === "主要" || metricMeta?.tab === "平均") {
          overview[m] = { value: annualEntry.value, rank: annualEntry.top };
        } else {
          ratio[m] = fullEntries;
        }
      }
      if (
        [
          "av_avtemp",
          "sm_rain",
          "av_hitemp",
          "av_lwtemp",
          "sm_sun",
          "sm_snowing",
        ].includes(m)
      ) {
        uonzu[m as MetricValue] = fullEntries.slice(0, 12).map((e) => e.value);
      }
    }
  );

  return { overview, table, ratio, uonzu };
}
