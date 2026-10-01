import { RankingData } from "../components/Ranking/types";
import { RawStationData } from "../types/raw";
import { MonthlyEntry, StationId } from "../types/union";
import { toStation } from "./masterUtils";
import { PrefKey, PrefMeta } from "../setting/pref";
import { RankMeta } from "../setting/rank";
import { RegionMeta } from "../setting/region";

export interface RankingScopeOptions {
  rankMeta: RankMeta;
  selectedRegion?: RegionMeta;
  selectedPref?: PrefMeta;
}

/**
 * calculateRankingEntries で計算済みのエントリ配列から、
 * 指定されたスコープ（全国/地方/県/気象台/島除外）の順位を取り出し、
 * ソートして上位件数（全国系は100件、地域系は全件）を切り出す共通抽出関数
 */
export function extractRankingList(
  calculatedEntries: Record<StationId, MonthlyEntry[]> | null,
  masterData: Record<string, RawStationData>,
  scope: RankingScopeOptions,
  monthIdx: number = 0,
  timeMap?: Map<string, string | null>
): RankingData[] {
  if (!calculatedEntries || !masterData) return [];

  const { rankMeta, selectedRegion, selectedPref } = scope;
  const rankType = rankMeta.key;
  const results: RankingData[] = [];

  for (const [id, entries] of Object.entries(calculatedEntries)) {
    const master = masterData[id as StationId];
    if (!master) continue;

    const entry = entries[monthIdx];
    if (!entry || entry.value === undefined || entry.value === null) continue;

    let rank: number | null | undefined = null;
    if (rankType === "pre") {
      if (selectedPref && selectedPref.code.includes(master.pref || "")) {
        rank = entry.pre;
      }
    } else if (rankType === "region") {
      if (selectedRegion) {
        const pref = Object.values(PrefKey).find((p) => p.code.includes(master.pref || ""));
        if (pref?.region.label === selectedRegion.label) {
          rank = entry.region;
        }
      }
    } else if (rankType === "meteo") {
      rank = entry.meteo;
    } else if (rankType === "island") {
      rank = entry.island;
    } else if (rankType === "bot") {
      rank = entry.bot;
    } else {
      rank = entry.top;
    }

    if (rank === null || rank === undefined || rank <= 0) continue;

    results.push({
      ...toStation({ ...master, id }),
      value: entry.value,
      rank,
      time: timeMap?.get(id) || undefined,
    });
  }

  results.sort((a, b) => (a.rank || 0) - (b.rank || 0));

  if (rankType === "top" || rankType === "bot" || rankType === "island") {
    return results.slice(0, 100);
  }
  return results;
}
