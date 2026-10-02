import { RegionMeta, RegionKey, RegionValue } from "../../../../setting/region";
import { PrefMeta, PrefKey, PrefValue, getPrefsInRegion } from "../../../../setting/pref";
import { getAreasInPref } from "../../../../setting/area";
import { ClimateArticleData } from "../../../../data/types";
import { resolveStationNames, loadMaster } from "../../../../utils/ssgLoader";
import { RawData } from "../../../../types/raw";
import { StationId } from "../../../../types/union";
import { climateDownload } from "../../../../utils/downloader";

/**
 * 地方・都道府県の気候解説ページ共通のProps
 * SSGからは純粋な RawData (stationsMap) と静的メタのみを渡す
 */
export interface ClimateDetailPageProps {
  regionKey: RegionValue;
  prefKey: PrefValue | null;
  article: ClimateArticleData;
  stationsMap: Record<StationId, RawData>;
  siblings: {
    key: string;
    label: string;
  }[] | null;
}

/**
 * 地方ページ（prefKeyなし）および 都道府県ページ（prefKeyあり）のデータを一元生成する統合ローダー
 */
export async function loadClimateDetailPageData(
  regionKey: RegionValue,
  prefKey?: PrefValue
): Promise<ClimateDetailPageProps | null> {
  const regionMeta = RegionKey[regionKey];
  if (!regionMeta) return null;

  const prefMeta = prefKey ? PrefKey[prefKey] : undefined;
  if (prefKey && (!prefMeta || prefMeta.region.label !== regionMeta.label)) {
    return null;
  }

  // 1. スコープ対象の都道府県コード群
  const prefsInRegion = getPrefsInRegion(regionKey);
  const targetPrefCodes: readonly string[] = prefMeta
    ? prefMeta.code
    : prefsInRegion.flatMap((p) => p.code);
  const targetCodeSet = new Set(targetPrefCodes);
  const master = loadMaster();

  // 2. 静的解説データ（article）
  const article: ClimateArticleData = (prefMeta?.detail ?? regionMeta.detail)!;

  // 3. 全雨温図対象地点の抽出（本文 + 子階層エリア/県）
  const uonzuNames: string[] = [...(article.uonzuList || [])];
  if (prefKey) {
    getAreasInPref(prefKey).forEach((area) => {
      if (area.detail.uonzuList) uonzuNames.push(...area.detail.uonzuList);
    });
  } else {
    prefsInRegion.forEach((pMeta) => {
      if (pMeta.detail?.uonzuList) uonzuNames.push(...pMeta.detail.uonzuList);
    });
  }
  const uonzuStationIdSet = new Set(resolveStationNames(uonzuNames));

  // 4. スコープ対象全地点の config を構築
  const regionStationIds = Object.values(master)
    .filter((s) => s.pref && targetCodeSet.has(s.pref))
    .map((s) => s.id)
    .filter((id): id is StationId => !!id);

  const targetConfig: Record<StationId, ("uonzu" | "overview")[]> = {};
  for (const id of regionStationIds) {
    targetConfig[id] = uonzuStationIdSet.has(id) ? ["uonzu", "overview"] : ["overview"];
  }

  // 5. 1回の climateDownload で全地点データを一括取得！
  const stationsMap = await climateDownload(targetConfig, master);

  // 6. ナビゲーション（同地方内の都道府県リンク）
  const siblings = prefKey
    ? prefsInRegion.map((p) => ({
      key: p.key,
      label: p.label,
    }))
    : null;

  return {
    regionKey,
    prefKey: prefKey ?? null,
    article,
    stationsMap,
    siblings,
  };
}
