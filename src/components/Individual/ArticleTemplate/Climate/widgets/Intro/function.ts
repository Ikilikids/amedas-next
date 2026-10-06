import { RawData, RawStationData } from "../../../../../../types/raw";
import { StationId } from "../../../../../../types/union";
import { RegionValue, REGION_LIST, RegionKey } from "../../../../../../setting/region";
import { PrefValue, getPrefsInRegion } from "../../../../../../setting/pref";
import { getAreasInPref } from "../../../../../../setting/area";
import { CategoryKey, CategoryValue } from "../../../../../../setting/category";
import { ClimateArticleData } from "../../../../../../data/types";

export interface ChildSectionItem extends ClimateArticleData {
  key: string;
  name: string;
  color?: string;
  targetPrefCodes: readonly string[];
  representativeStationId?: string;
  linkHref?: string;
  linkLabel?: string;
  stationLinks?: { id: string; name: string; category?: string }[];
  prefLinks?: { key: string; label: string; href: string }[];
}

/**
 * 全国なら各地方、地方なら配下の各県、県なら管轄下の各エリア情報を生成する
 */
export function getChildSectionList(
  regionKey?: RegionValue | null,
  prefKey?: PrefValue | null,
  stationsMap?: Record<StationId, RawData>,
  childArticles?: Record<string, ClimateArticleData>
): ChildSectionItem[] {
  if (prefKey) {
    return getAreasInPref(prefKey).map((area) => {
      let stationLinks: { id: string; name: string; category?: string }[] = [];
      if (stationsMap) {
        const areaStations = Object.values(stationsMap)
          .filter((st) => st.station.area === area.key)
          .map((st) => st.station)
          .sort((a, b) => {
            const catA = a.category ? CategoryKey[a.category as CategoryValue]?.value ?? 99 : 99;
            const catB = b.category ? CategoryKey[b.category as CategoryValue]?.value ?? 99 : 99;
            return catA - catB || (a.id ?? "").localeCompare(b.id ?? "");
          });

        stationLinks = areaStations.map((st) => ({
          id: st.id ?? "",
          name: st.station_name ?? "",
          category: st.category,
        }));
      }

      const article = childArticles?.[area.key];

      return {
        key: area.key,
        name: area.label,
        color: area.pref.region.colorStrong,
        ...(article || ({} as ClimateArticleData)),
        targetPrefCodes: [],
        representativeStationId: area.representativeStationId,
        stationLinks,
      };
    });
  }

  // 地方の場合: 同地方内の各県カルテ
  if (regionKey) {
    const prefsInRegion = getPrefsInRegion(regionKey);
    return prefsInRegion
      .filter((pMeta) => !childArticles || !!childArticles[pMeta.key])
      .map((pMeta) => {
        const article = childArticles?.[pMeta.key];
        return {
          key: pMeta.key,
          name: pMeta.label,
          color: pMeta.region.colorStrong,
          ...(article || ({} as ClimateArticleData)),
          targetPrefCodes: pMeta.code,
          representativeStationId: pMeta.representativeStationId,
          linkHref: `/japan/${regionKey}/${pMeta.key}`,
          linkLabel: `${pMeta.label}の詳しい気候解説・アメダス観測データへ`,
        };
      });
  }

  // 全国の場合: 各地方のカルテ一覧 + 所属都道府県リンク
  return REGION_LIST.map((regKey) => {
    const regMeta = RegionKey[regKey];
    const prefs = getPrefsInRegion(regKey);
    const prefLinks = prefs.map((p) => ({
      key: p.key,
      label: p.label,
      href: `/japan/${regKey}/${p.key}`,
    }));

    const article = childArticles?.[regKey];

    return {
      key: regKey,
      name: regMeta.label,
      color: regMeta.colorStrong,
      ...(article || ({} as ClimateArticleData)),
      targetPrefCodes: prefs.flatMap((p) => p.code),
      representativeStationId: regMeta.representativeStationId,
      linkHref: `/japan/${regKey}`,
      linkLabel: `${regMeta.label}地方の詳しい気候解説・都道府県一覧へ`,
      prefLinks,
    };
  });
}
