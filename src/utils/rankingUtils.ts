import { RawRankingData } from "../components/Ranking/types";
import { PrefKey, PrefMeta } from "./pref";
import { RankKey, RankMeta } from "./rank";
import { RegionMeta } from "./region";

/**
 * 島嶼部（小笠原、大東島など）のID判定
 */
export const ISLAND_PREFIXES = [
  "886",
  "887",
  "888",
  "889",
  "4417",
  "442",
  "443",
  "9",
];

export const isIslandId = (id: string): boolean =>
  ISLAND_PREFIXES.some((p) => id.startsWith(p));

/**
 * ランキングデータのフィルタリング、ソート、順位付けを行う純粋関数
 */
export function processRankingData(
  list: RawRankingData[],
  rankMeta: RankMeta,
  selectedRegion: RegionMeta,
  selectedPref: PrefMeta
): RawRankingData[] {
  let filtered = [...list];
  const rankType = rankMeta.key;

  // 1. フィルタリング
  if (rankType === RankKey.pre.key) {
    filtered = filtered.filter((s) => s.pref === selectedPref.code);
  } else if (rankType === RankKey.region.key) {
    filtered = filtered.filter((s) => {
      const pref = Object.values(PrefKey).find((p) => p.code === s.pref);
      return pref?.region.label === selectedRegion.label;
    });
  } else if (rankType === RankKey.meteo.key) {
    filtered = filtered.filter((s) => s.category === "meteo");
  } else if (rankType === RankKey.island.key) {
    filtered = filtered.filter((s) => !isIslandId(s.id));
  }

  // 2. ソート
  const isBot = rankType === RankKey.bot.key;
  filtered.sort((a, b) => (isBot ? a.value - b.value : b.value - a.value));

  // 3. 上位100件などの制限
  if (
    rankType === RankKey.top.key ||
    rankType === RankKey.bot.key ||
    rankType === RankKey.island.key ||
    rankType === RankKey.meteo.key
  ) {
    filtered = filtered.slice(0, 100);
  }

  // 4. 同順位を考慮した順位付け
  let currentRank = 0;
  let lastValue: number | null = null;
  return filtered.map((s, idx) => {
    if (s.value !== lastValue) {
      currentRank = idx + 1;
      lastValue = s.value;
    }
    return { ...s, rank: currentRank };
  });
}
