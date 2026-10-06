import { RegionValue } from "../../../../setting/region";
import { PrefValue } from "../../../../setting/pref";
import { ClimateArticleData } from "../../../../data/types";
import { loadMaster } from "../../Ranking/ssg_function";
import { RawData } from "../../../../types/raw";
import { StationId } from "../../../../types/union";
import { climateDownload } from "../../../../utils/loading/1_downloader";
import {
  ClimateScopeDataLoaders,
  ClimateScopeValue,
} from "../../../../setting/japan2";

/**
 * 全国・地方・都道府県の気候解説ページ共通のProps
 */
export interface ClimateDetailPageProps {
  regionKey: RegionValue | null;
  prefKey: PrefValue | null;
  article: ClimateArticleData;
  childArticles: Record<string, ClimateArticleData>;
  stationsMap: Record<StationId, RawData>;
}

/**
 * 全国（引数なし）・地方（prefKeyなし）・都道府県（prefKeyあり）のデータを一元生成する統合ローダー
 */
export async function loadClimateDetailPageData(
  regionKey?: RegionValue,
  prefKey?: PrefValue
): Promise<ClimateDetailPageProps | null> {
  const master = loadMaster();

  // 1. スコープ判定
  const scopeType: ClimateScopeValue = prefKey
    ? "pref"
    : regionKey
    ? "region"
    : "national";

  const loader = ClimateScopeDataLoaders[scopeType];
  if (!loader) return null;

  // 2. 記事2種 + 地点2種の収集（japan2.tsのローダーを使用）
  const { article, childArticles, uonzuStationIds, overviewStationIds } =
    loader.getData({ regionKey, prefKey, master });

  // 3. ダウンロード対象 config の構築
  const uonzuSet = new Set(uonzuStationIds);
  const targetConfig: Record<StationId, ("uonzu" | "overview")[]> = {};

  for (const id of uonzuStationIds) {
    targetConfig[id] = ["uonzu"];
  }

  for (const id of overviewStationIds) {
    targetConfig[id] = uonzuSet.has(id)
      ? ["uonzu", "overview"]
      : ["overview"];
  }

  // 4. 気象データのダウンロード
  const stationsMap = await climateDownload(targetConfig, master, [
    "id",
    "station_name",
    "pref",
    "area",
    "category",
  ]);

  return {
    regionKey: regionKey ?? null,
    prefKey: prefKey ?? null,
    article,
    childArticles,
    stationsMap,
  };
}
