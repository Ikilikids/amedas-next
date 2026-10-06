import { StationId } from "../types/union";
import { RawStationData } from "../types/raw";
import { ClimateArticleData } from "../data/types";
import { JAPAN_CLIMATE_ARTICLE } from "../data/japan";
import { RegionClimateArticles } from "../data/regions";
import { PrefClimateArticles } from "../data/prefs";
import { AreaClimateArticles } from "../data/area";
import { REGION_LIST, RegionKey, RegionValue } from "./region";
import { PrefKey, PrefValue, getPrefsInRegion } from "./pref";
import { getAreasInPref } from "./area";

export type ClimateScopeValue = "national" | "region" | "pref";

export interface ScopeContext {
  regionKey?: RegionValue | null;
  prefKey?: PrefValue | null;
  master?: Record<string, RawStationData>;
}

export interface ScopeDataLoaderResult {
  article: ClimateArticleData;
  childArticles: Record<string, ClimateArticleData>;
  uonzuStationIds: StationId[];
  overviewStationIds: StationId[];
}

export interface ClimateScopeDataLoader {
  getData: (ctx: ScopeContext) => ScopeDataLoaderResult;
}

export const ClimateScopeDataLoaders: Record<ClimateScopeValue, ClimateScopeDataLoader> = {
  // ==========================================
  // 1. 全国 (national)
  // ==========================================
  national: {
    getData: () => {
      const article = JAPAN_CLIMATE_ARTICLE;
      const childArticles: Record<string, ClimateArticleData> = { ...RegionClimateArticles };

      // 各地方の代表雨温図地点
      const uonzuStationIds: StationId[] = [];
      REGION_LIST.forEach((regKey) => {
        const regArticle = RegionClimateArticles[regKey];
        if (regArticle?.uonzuList) {
          uonzuStationIds.push(...regArticle.uonzuList);
        }
      });

      // 全国ページはランキング・一覧用の overview 地点取得は不要
      return {
        article,
        childArticles,
        uonzuStationIds,
        overviewStationIds: [],
      };
    },
  },

  // ==========================================
  // 2. 地方 (region)
  // ==========================================
  region: {
    getData: ({ regionKey, master = {} }) => {
      if (!regionKey) throw new Error("regionKey is required for region scope");

      const article = RegionClimateArticles[regionKey];
      const prefsInRegion = getPrefsInRegion(regionKey);

      // 配下の各県記事
      const childArticles: Record<string, ClimateArticleData> = {};
      prefsInRegion.forEach((pMeta) => {
        if (PrefClimateArticles[pMeta.key]) {
          childArticles[pMeta.key] = PrefClimateArticles[pMeta.key];
        }
      });

      // 雨温図地点: 地方自体の雨温図 + 配下各県の雨温図
      const uonzuStationIds: StationId[] = [...(article?.uonzuList || [])];
      Object.values(childArticles).forEach((cArticle) => {
        if (cArticle?.uonzuList) {
          uonzuStationIds.push(...cArticle.uonzuList);
        }
      });

      // 概要（集計・一覧）地点: その地方に属する全都道府県コードの地点
      const targetPrefCodes = new Set(prefsInRegion.flatMap((p) => p.code));
      const overviewStationIds = Object.values(master)
        .filter((s) => s.pref && targetPrefCodes.has(s.pref))
        .map((s) => s.id)
        .filter((id): id is StationId => !!id);

      return {
        article,
        childArticles,
        uonzuStationIds,
        overviewStationIds,
      };
    },
  },

  // ==========================================
  // 3. 都道府県 (pref)
  // ==========================================
  pref: {
    getData: ({ prefKey, master = {} }) => {
      if (!prefKey) throw new Error("prefKey is required for pref scope");

      const article = PrefClimateArticles[prefKey];
      const prefMeta = PrefKey[prefKey];

      // 配下の各エリア記事
      const childArticles: Record<string, ClimateArticleData> = {};
      getAreasInPref(prefKey).forEach((area) => {
        if (AreaClimateArticles[area.key]) {
          childArticles[area.key] = AreaClimateArticles[area.key];
        }
      });

      // 雨温図地点: 県自体の雨温図 + 配下各エリアの雨温図
      const uonzuStationIds: StationId[] = [...(article?.uonzuList || [])];
      Object.values(childArticles).forEach((cArticle) => {
        if (cArticle?.uonzuList) {
          uonzuStationIds.push(...cArticle.uonzuList);
        }
      });

      // 概要（集計・一覧）地点: その県のコードに属する地点
      const targetPrefCodes = new Set(prefMeta?.code || []);
      const overviewStationIds = Object.values(master)
        .filter((s) => s.pref && targetPrefCodes.has(s.pref))
        .map((s) => s.id)
        .filter((id): id is StationId => !!id);

      return {
        article,
        childArticles,
        uonzuStationIds,
        overviewStationIds,
      };
    },
  },
};
