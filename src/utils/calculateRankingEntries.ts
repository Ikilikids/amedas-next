import { RawStationData } from "../types/raw";
import { MonthlyEntry, StationId } from "../types/union";
import { isIslandId } from "../setting/rank";
import { PrefKey } from "../setting/pref";

type RankCalcItem = RawStationData & {
  value: number;
};

const rankingEntriesCache: Record<string, Record<StationId, MonthlyEntry[]>> = {};

/**
 * 任意の生データ（rawData: 地点ごとの数値配列）を受け取り、
 * 全国・地方・都道府県・気象台・島除外などの全順位を計算して返す
 *
 * ランキング画面（clim_ranking, daily_ranking, recent_ranking）および
 * 地点カルテ（climateDownload）から共通で呼び出される統一エントリーポイントです。
 */
export function calculateRankingEntries(
  rawData: Record<StationId, number[]>,
  masterData: Record<string, RawStationData>,
  cacheKey: string
): Record<StationId, MonthlyEntry[]> {
  if (rankingEntriesCache[cacheKey]) {
    return rankingEntriesCache[cacheKey];
  }

  const master = masterData as Record<StationId, RawStationData>;

  const result: Record<StationId, MonthlyEntry[]> = {};

  // 初期化 (元データにある地点のみを対象にする)
  Object.keys(rawData).forEach((id) => {
    result[id as StationId] = [];
  });

  for (let monthIdx = 0; monthIdx <= 12; monthIdx++) {
    const rawList = buildRawRankingList(rawData, master, monthIdx);
    if (rawList.length === 0) continue;

    // 1. 各地点のエントリ枠を初期化
    rawList.forEach((s) => {
      result[s.id][monthIdx] = {
        value: s.value,
        top: 0,
        bot: 0,
        pre: 0,
        region: 0,
        meteo: null,
        island: null,
      };
    });

    // 2. 全国系の順位付け
    assignRankToEntries(rawList, result, monthIdx, "top", (s) => true, false);
    assignRankToEntries(rawList, result, monthIdx, "bot", (s) => true, true);
    assignRankToEntries(rawList, result, monthIdx, "meteo", (s) => s.category === "meteo", false);
    assignRankToEntries(rawList, result, monthIdx, "island", (s) => !isIslandId(s.id), false);

    // 3. 都道府県別の順位付け（県ごとにグループ化して高速ソート）
    const prefGroups = new Map<string, RankCalcItem[]>();
    for (const s of rawList) {
      if (!prefGroups.has(s.pref)) prefGroups.set(s.pref, []);
      prefGroups.get(s.pref)!.push(s);
    }
    for (const group of prefGroups.values()) {
      assignRankToEntries(group, result, monthIdx, "pre", () => true, false);
    }

    // 4. 地方別の順位付け（地方ごとにグループ化して高速ソート）
    const regionGroups = new Map<string, RankCalcItem[]>();
    for (const s of rawList) {
      const prefMeta = Object.values(PrefKey).find((p) => p.code.includes(s.pref));
      const regionLabel = prefMeta?.region.label ?? "その他";
      if (!regionGroups.has(regionLabel)) regionGroups.set(regionLabel, []);
      regionGroups.get(regionLabel)!.push(s);
    }
    for (const group of regionGroups.values()) {
      assignRankToEntries(group, result, monthIdx, "region", () => true, false);
    }
  }

  if (cacheKey) {
    rankingEntriesCache[cacheKey] = result;
  }

  return result;
}

/**
 * 生の月別数値配列から、特定月（monthIdx）の地点一覧リストを構築する
 */
function buildRawRankingList(
  data: Record<StationId, number[]>,
  stationsMaster: Record<StationId, RawStationData>,
  monthIdx: number
): RankCalcItem[] {
  return Object.entries(data)
    .map(([id, values]) => {
      const master = stationsMaster[id as StationId];
      if (!master) return null;
      const value = values[monthIdx];
      return { ...master, value } as RankCalcItem;
    })
    .filter((s): s is RankCalcItem => s !== null);
}

/**
 * 対象地点リストをフィルタ・ソートし、同順位（同着）を考慮して直接結果エントリに順位を書き込む
 */
function assignRankToEntries(
  list: RankCalcItem[],
  result: Record<StationId, MonthlyEntry[]>,
  monthIdx: number,
  field: keyof MonthlyEntry,
  filterFn: (s: RankCalcItem) => boolean,
  isAscending: boolean
) {
  const filtered = list.filter(filterFn);
  filtered.sort((a, b) => (isAscending ? a.value - b.value : b.value - a.value));

  let currentRank = 0;
  let lastValue: number | null = null;
  for (let idx = 0; idx < filtered.length; idx++) {
    const s = filtered[idx];
    if (s.value !== lastValue) {
      currentRank = idx + 1;
      lastValue = s.value;
    }
    (result[s.id][monthIdx] as any)[field] = currentRank;
  }
}

