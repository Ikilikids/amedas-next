import { RawRankingData } from "../components/Ranking/types";
import {
  RawData,
  RawMonthlyData,
  RawStationData,
} from "../types/raw";
import { MonthlyEntry, StationId } from "../types/union";
import { AssembleKey, AssembleTarget, RankDepth } from "../setting/assemble";
import { METRIC_LIST, MetricKey, MetricValue } from "../setting/metric";
import { PrefKey, PrefMeta } from "../setting/pref";
import { RankKey, RankMeta, isIslandId } from "../setting/rank";
import { RegionMeta } from "../setting/region";
import { loadSingleMetric, masterCache } from "./climateDataManager";

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
    filtered = filtered.filter((s) => selectedPref.code.includes(s.pref));
  } else if (rankType === RankKey.region.key && selectedRegion) {
    filtered = filtered.filter((s) => {
      const pref = Object.values(PrefKey).find((p) => p.code.includes(s.pref));
      return pref?.region.label === selectedRegion.label;
    });
  } else if (rankType === RankKey.meteo.key) {
    filtered = filtered.filter((s) => s.category === "meteo");
  } else if (rankType === RankKey.special.key) {
    filtered = filtered.filter((s) =>
      ["meteo", "submeteo", "special"].includes(s.category)
    );
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

  return limit &&
    (rankType === RankKey.bot.key ||
      rankType === RankKey.top.key ||
      rankType === RankKey.island.key)
    ? ranked.slice(0, limit)
    : ranked;
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

    const topRanks = processRankingData(rawList, RankKey.top);
    const botRanks = processRankingData(rawList, RankKey.bot);
    const meteoRanks = processRankingData(rawList, RankKey.meteo);
    const specialRanks = processRankingData(rawList, RankKey.special);
    const islandRanks = processRankingData(rawList, RankKey.island);

    const topMap = new Map(topRanks.map((s) => [s.id, s.rank]));
    const botMap = new Map(botRanks.map((s) => [s.id, s.rank]));
    const meteoMap = new Map(meteoRanks.map((s) => [s.id, s.rank]));
    const specialMap = new Map(specialRanks.map((s) => [s.id, s.rank]));
    const islandMap = new Map(islandRanks.map((s) => [s.id, s.rank]));

    const prefRanksMap = new Map<string, Map<StationId, number>>();
    const regionRanksMap = new Map<string, Map<StationId, number>>();

    rawList.forEach((s) => {
      // 県内順位
      if (!prefRanksMap.has(s.pref)) {
        const pMeta = Object.values(PrefKey).find((p) => p.code.includes(s.pref));
        const pRanks = processRankingData(rawList, RankKey.pre, undefined, pMeta);
        prefRanksMap.set(s.pref, new Map(pRanks.map((r) => [r.id, r.rank])));
      }

      // 地方順位
      const regionLabel = Object.values(PrefKey).find((p) => p.code.includes(s.pref))?.region.label;
      if (regionLabel && !regionRanksMap.has(regionLabel)) {
        const rMeta = { label: regionLabel } as RegionMeta;
        const rRanks = processRankingData(rawList, RankKey.region, rMeta);
        regionRanksMap.set(regionLabel, new Map(rRanks.map((r) => [r.id, r.rank])));
      }

      result[s.id][monthIdx] = {
        value: s.value,
        top: topMap.get(s.id) || 0,
        bot: botMap.get(s.id) || 0,
        pre: prefRanksMap.get(s.pref)?.get(s.id) || 0,
        region: regionLabel ? regionRanksMap.get(regionLabel)?.get(s.id) || 0 : 0,
        meteo: s.category === "meteo" ? meteoMap.get(s.id) || null : null,
        special: ["meteo", "submeteo", "special"].includes(s.category) ? specialMap.get(s.id) || null : null,
        island: !isIslandId(s.id) ? islandMap.get(s.id) || null : null,
      };
    });
  }

  return result;
}

export type AssembleConfig = Record<StationId, AssembleTarget[]>;

/**
 * 【Assembler】地点別オプション設定を受け取り、表示用データを返す
 *
 * @param targetConfig - 地点IDごとのオプション設定 Record<StationId, AssembleTarget[]>
 */
export async function assembleDisplayData(
  targetConfig: Record<StationId, AssembleTarget[]>
): Promise<Record<StationId, RawData>> {
  const master = masterCache;
  if (!master) {
    throw new Error("assembleDisplayData: masterCache is not loaded. Call loadMaster() or resisterMaster() first.");
  }

  const result: Record<StationId, RawData> = {};

  for (const [id, options] of Object.entries(targetConfig)) {
    const station = master[id];
    if (!station) continue;

    // options が空配列の場合はマスタ（基本情報）のみ即返却（気象計算・JSON読み込みを全スキップ）
    if (!options || options.length === 0) {
      result[id] = { station };
      continue;
    }

    const climateData: RawMonthlyData = {};

    // 1. 各メトリックについて、要求されている target から必要な要件（rankDepth, isAnnualOnly）を集約
    const metricReqs = new Map<
      MetricValue,
      { rankDepth: RankDepth; isAnnualOnly: boolean }
    >();

    const depthPriority: Record<RankDepth, number> = {
      full: 3,
      topBot: 2,
      none: 1,
    };

    for (const target of options) {
      const meta = AssembleKey[target];
      if (!meta) continue;

      for (const m of meta.getMetrics()) {
        const current = metricReqs.get(m);
        if (!current) {
          metricReqs.set(m, {
            rankDepth: meta.rankDepth,
            isAnnualOnly: meta.isAnnualOnly,
          });
        } else {
          // 優先度マージ: full > topBot > none
          const mergedDepth =
            depthPriority[meta.rankDepth] > depthPriority[current.rankDepth]
              ? meta.rankDepth
              : current.rankDepth;
          // 月範囲マージ: 1つでも全月要求(false)があれば false (12か月+通年)
          const mergedAnnualOnly = current.isAnnualOnly && meta.isAnnualOnly;

          metricReqs.set(m, {
            rankDepth: mergedDepth,
            isAnnualOnly: mergedAnnualOnly,
          });
        }
      }
    }

    // 2. メトリックごとにロードし、要件に基づいてデータをカット
    for (const [m, req] of metricReqs.entries()) {
      const integrated = await loadSingleMetric(m);
      const entries = integrated?.[id as StationId];
      if (!entries) continue;

      // 月範囲のカット (通年のみの場合は entries[12] を保持)
      const targetEntries = req.isAnnualOnly
        ? entries.length > 12 ? [entries[12]] : [entries[0]]
        : entries;

      // フィールドのカット (rankDepth に応じてプロパティを精選)
      const trimmedEntries: MonthlyEntry[] = targetEntries.map((e) => {
        if (req.rankDepth === "none") {
          return { value: e.value };
        }
        if (req.rankDepth === "topBot") {
          return {
            value: e.value,
            top: e.top,
            bot: e.bot,
            island: e.island,
          };
        }
        // full: 全フィールド保持
        return { ...e };
      });

      climateData[m] = trimmedEntries;
    }

    result[id] = {
      station,
      ...(Object.keys(climateData).length > 0 ? { climateData } : {}),
    };
  }

  return result;
}

