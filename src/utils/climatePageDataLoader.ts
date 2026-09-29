import { RegionValue, RegionKey, RegionMeta } from "../setting/region";
import { PrefValue, PrefKey, PrefMeta, getPrefsInRegion } from "../setting/pref";
import { getAreasInPref } from "../setting/area";
import { CategoryKey, CategoryValue } from "../setting/category";
import { ClimateArticleData } from "../data/types";
import {
  resolveStationNames,
  extractRainbowStations,
  RegionRainbowStationItem,
  extractTop1Stations,
  RegionTop1Item,
  ArticleUonzuItem,
} from "./ssgLoader";
import { getStationMetrics, loadMaster } from "./climateDataManager";
import { RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import { ClimateChildSectionItem } from "../components/ArticleTemplate/Climate/part/ChildSections";
import {
  calculateClimateStarsForStations,
  ClimateStarsResult,
} from "./climateStarCalculator";

/**
 * 地方・都道府県の気候解説ページ共通のProps
 */
export interface ClimateDetailPageProps {
  region: RegionMeta;
  pref: PrefMeta | null;
  article: ClimateArticleData;
  climateStars?: ClimateStarsResult | null;
  uonzuItems: ArticleUonzuItem[];
  rainbowStations: RegionRainbowStationItem[];
  top1Stations: RegionTop1Item[];
  childSections: ClimateChildSectionItem[];
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

  // 3. 星評価（代表地点名＋星辞書）
  const climateStars = calculateClimateStarsForStations(
    (s) => !!s.pref && targetCodeSet.has(s.pref),
    prefMeta?.representativeStationId ?? regionMeta.representativeStationId
  );

  // 4. アメダス観測データ・ランキング（雨温図・バッジ・概況をオンデマンド取得）
  const regionStationIds = Object.values(master)
    .filter((s) => s.pref && targetCodeSet.has(s.pref))
    .map((s) => s.id)
    .filter((id): id is StationId => !!id);

  const regionMetricsMap = await getStationMetrics(regionStationIds, ["uonzu", "badge", "overview"]);

  const uonzuStationIds = new Set(resolveStationNames(article.uonzuList || []));
  const uonzuItems: ArticleUonzuItem[] = Object.values(regionMetricsMap)
    .filter((st) => uonzuStationIds.has(st.id))
    .map((st) => ({
      id: st.id,
      name: st.station.station_name || "",
      rawUonzu: st.uonzu || {},
    }));

  const rainbowStations = extractRainbowStations(regionMetricsMap, targetPrefCodes);
  const top1Stations = extractTop1Stations(regionMetricsMap, targetPrefCodes);

  // 5. 下位セクション（都道府県ならArea一覧、地方ならPref一覧）

  const childSections: ClimateChildSectionItem[] = await Promise.all(
    prefKey
      ? getAreasInPref(prefKey).map(async (area) => {
        const areaStations = Object.values(master)
          .filter((s) => s.area === area.key)
          .sort((a, b) => {
            const catA = a.category ? CategoryKey[a.category as CategoryValue]?.value ?? 99 : 99;
            const catB = b.category ? CategoryKey[b.category as CategoryValue]?.value ?? 99 : 99;
            return catA - catB || a.id.localeCompare(b.id);
          });
        const areaStars = calculateClimateStarsForStations(
          (s) => s.area === area.key,
          area.representativeStationId
        );
        const stationLinks = areaStations.map((st) => ({
          id: st.id,
          name: st.station_name,
          category: st.category,
        }));

        const areaMetricsMap = area.detail.uonzuList?.length
          ? await getStationMetrics(resolveStationNames(area.detail.uonzuList), ["uonzu"])
          : {};
        const areaUonzu: ArticleUonzuItem[] = Object.values(areaMetricsMap).map((st) => ({
          id: st.id,
          name: st.station.station_name || "",
          rawUonzu: st.uonzu || {},
        }));

        return {
          key: area.key,
          name: area.label,
          ...area.detail,
          climateStars: areaStars,
          repStationName: areaStars.repStationName,
          uonzuItems: areaUonzu,
          stationLinks,
        };
      })
      : prefsInRegion
        .filter((pMeta) => !!pMeta.detail)
        .map(async (pMeta) => {
          const pCodeSet = new Set(pMeta.code);
          const pStars = calculateClimateStarsForStations(
            (s) => !!s.pref && pCodeSet.has(s.pref),
            pMeta.representativeStationId
          );
          const pDetail = pMeta.detail!;

          const prefMetricsMap = pDetail.uonzuList?.length
            ? await getStationMetrics(resolveStationNames(pDetail.uonzuList), ["uonzu"])
            : {};
          const prefUonzu: ArticleUonzuItem[] = Object.values(prefMetricsMap).map((st) => ({
            id: st.id,
            name: st.station.station_name || "",
            rawUonzu: st.uonzu || {},
          }));

          return {
            key: pMeta.key,
            name: pMeta.label,
            ...pDetail,
            climateStars: pStars,
            repStationName: pStars.repStationName,
            uonzuItems: prefUonzu,
            linkHref: `/japan/${regionKey}/${pMeta.key}`,
            linkLabel: `${pMeta.label}の詳しい気候解説・アメダス観測データへ`,
          };
        })
  );

  // 6. ナビゲーション（同地方内の都道府県リンク）
  const siblings = prefKey
    ? prefsInRegion.map((p) => ({
      key: p.key,
      label: p.label,
    }))
    : null;

  return {
    region: regionMeta,
    pref: prefMeta ?? null,
    article,
    climateStars,
    uonzuItems,
    rainbowStations,
    top1Stations,
    childSections,
    siblings,
  };
}

