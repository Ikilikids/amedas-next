import { RawData, RawStationData } from "../../../../../../types/raw";
import { StationId } from "../../../../../../types/union";
import { RegionValue } from "../../../../../../setting/region";
import { PrefValue, getPrefsInRegion } from "../../../../../../setting/pref";
import { getAreasInPref } from "../../../../../../setting/area";
import { CategoryKey, CategoryValue } from "../../../../../../setting/category";
import { ArticleUonzuItem } from "../../../../../../utils/ssgLoader";
import { ClimateArticleData } from "../../../../../../data/types";

export interface IntroComputedData {
  uonzuItems: ArticleUonzuItem[];
}

export function computeIntroData(
  stationsMap: Record<StationId, RawData>,
  uonzuNames?: string[]
): IntroComputedData {
  // 代表雨温図の抽出
  const nameSet = new Set(uonzuNames || []);
  const uonzuItems: ArticleUonzuItem[] = Object.values(stationsMap)
    .filter((st) => st.station.station_name && nameSet.has(st.station.station_name))
    .map((st) => ({
      id: st.station.id ?? "",
      name: st.station.station_name || "",
      rawUonzu: st.climateData || {},
    }));

  return {
    uonzuItems,
  };
}

export interface ChildSectionItem extends ClimateArticleData {
  key: string;
  name: string;
  targetPrefCodes: readonly string[];
  representativeStationId?: string;
  linkHref?: string;
  linkLabel?: string;
  stationLinks?: { id: string; name: string; category?: string }[];
}

/**
 * 地方なら配下の各県カルテ情報、県なら管轄下の各エリア情報を生成する
 */
export function getChildSectionList(
  isPref: boolean,
  regionKey: RegionValue,
  prefKey?: PrefValue,
  stationsMap?: Record<StationId, RawData>
): ChildSectionItem[] {
  if (isPref && prefKey) {
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

      return {
        key: area.key,
        name: area.label,
        ...area.detail,
        targetPrefCodes: [],
        representativeStationId: area.representativeStationId,
        stationLinks,
      };
    });
  }

  // 地方の場合: 同地方内の各県カルテ
  const prefsInRegion = getPrefsInRegion(regionKey);
  return prefsInRegion
    .filter((pMeta) => !!pMeta.detail)
    .map((pMeta) => {
      return {
        key: pMeta.key,
        name: pMeta.label,
        ...pMeta.detail!,
        targetPrefCodes: pMeta.code,
        representativeStationId: pMeta.representativeStationId,
        linkHref: `/japan/${regionKey}/${pMeta.key}`,
        linkLabel: `${pMeta.label}の詳しい気候解説・アメダス観測データへ`,
      };
    });
}
