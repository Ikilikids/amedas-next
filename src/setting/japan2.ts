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

import {
  REGION_UONZU_STATIONS,
  PREF_UONZU_STATIONS,
  AREA_UONZU_STATIONS,
} from "./uonzu";

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
        const list = REGION_UONZU_STATIONS[regKey];
        if (list) {
          uonzuStationIds.push(...list);
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
      const uonzuStationIds: StationId[] = [
        ...(REGION_UONZU_STATIONS[regionKey] || []),
      ];
      prefsInRegion.forEach((pMeta) => {
        const pList = PREF_UONZU_STATIONS[pMeta.key];
        if (pList) {
          uonzuStationIds.push(...pList);
        }
      });

      // 概要（集計・一覧）地点: その地方に属する全都道府県コードの地点
      const targetPrefCodes = new Set(prefsInRegion.map((p) => p.code));
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
      const areasInPref = getAreasInPref(prefKey);

      // 配下の各エリア記事
      const childArticles: Record<string, ClimateArticleData> = {};
      areasInPref.forEach((area) => {
        if (AreaClimateArticles[area.key]) {
          childArticles[area.key] = AreaClimateArticles[area.key];
        }
      });

      // 雨温図地点: 県自体の雨温図 + 配下各エリアの雨温図
      const uonzuStationIds: StationId[] = [
        ...(PREF_UONZU_STATIONS[prefKey] || []),
      ];
      areasInPref.forEach((area) => {
        const aList = AREA_UONZU_STATIONS[area.key];
        if (aList && aList.length > 0) {
          uonzuStationIds.push(...aList);
        }
      });

      // 概要（集計・一覧）地点: その県のコードに属する地点
      const targetPrefCodes = new Set(prefMeta?.code ? [prefMeta.code] : []);
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
