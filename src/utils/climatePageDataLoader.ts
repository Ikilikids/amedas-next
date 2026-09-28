import { RegionValue, RegionKey, RegionMeta } from "../setting/region";
import { PrefValue, PrefKey, PrefMeta, getPrefsInRegion } from "../setting/pref";
import { getAreasInPref } from "../setting/area";
import { CategoryKey, CategoryValue } from "../setting/category";
import { ClimateArticleData } from "../data/types";
import {
  ArticleUonzuItem,
  loadMaster,
  loadUonzuItemsForList,
  loadRainbowStationsForRegion,
  RegionRainbowStationItem,
  loadTop1StationsForRegion,
  RegionTop1Item,
} from "./ssgLoader";
import { ClimateChildSectionItem } from "../components/Article/ClimateChildSections";
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
export function loadClimateDetailPageData(
  regionKey: RegionValue,
  prefKey?: PrefValue
): ClimateDetailPageProps | null {
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

  // 2. 静的解説データ（article）
  const article: ClimateArticleData = (prefMeta?.detail ?? regionMeta.detail)!;

  // 3. 星評価（代表地点名＋星辞書）
  const climateStars = calculateClimateStarsForStations(
    (s) => !!s.pref && targetCodeSet.has(s.pref),
    prefMeta?.representativeStationId ?? regionMeta.representativeStationId
  );

  // 4. アメダス観測データ・ランキング
  const uonzuItems = loadUonzuItemsForList(article.uonzuList, targetPrefCodes);
  const rainbowStations = loadRainbowStationsForRegion(targetPrefCodes);
  const top1Stations = loadTop1StationsForRegion(targetPrefCodes);

  // 5. 下位セクション（都道府県ならArea一覧、地方ならPref一覧）
  const master = loadMaster();
  const childSections: ClimateChildSectionItem[] = prefKey
    ? getAreasInPref(prefKey).map((area) => {
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

        return {
          key: area.key,
          name: area.label,
          ...area.detail,
          climateStars: areaStars,
          repStationName: areaStars.repStationName,
          uonzuItems: loadUonzuItemsForList(area.detail.uonzuList, targetPrefCodes),
          stationLinks,
        };
      })
    : prefsInRegion
        .filter((pMeta) => !!pMeta.detail)
        .map((pMeta) => {
          const pCodeSet = new Set(pMeta.code);
          const pStars = calculateClimateStarsForStations(
            (s) => !!s.pref && pCodeSet.has(s.pref),
            pMeta.representativeStationId
          );
          const pDetail = pMeta.detail!;

          return {
            key: pMeta.key,
            name: pMeta.label,
            ...pDetail,
            climateStars: pStars,
            repStationName: pStars.repStationName,
            uonzuItems: loadUonzuItemsForList(pDetail.uonzuList, pMeta.code),
            linkHref: `/feature/region/${regionKey}/${pMeta.key}`,
            linkLabel: `${pMeta.label}の詳しい気候解説・アメダス観測データへ`,
          };
        });

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

