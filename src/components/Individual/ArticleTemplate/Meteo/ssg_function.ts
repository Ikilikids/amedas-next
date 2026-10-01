import meteoDataRaw from "../../../../../data/feature/meteo.json";
import { resolvePref } from "../../../../utils/masterUtils";
import { RegionValue } from "../../../../setting/region";
import { loadMaster } from "../../../../utils/climateDataManager";
import { StationId } from "../../../../types/union";

export interface MeteoItem {
  record: string;
  prime: string;
  temp: string;
  rain: string;
  other: string;
}

export interface MeteoStationItem {
  id: string;
  name: string;
  officialName: string;
  prefLabel: string;
  data: MeteoItem;
}

export interface MeteoRegionGroup {
  key: RegionValue;
  label: string;
  color: string;
  stations: MeteoStationItem[];
}

export interface MeteoArticleData {
  groups: MeteoRegionGroup[];
}

const REGION_ORDER: { key: RegionValue; label: string }[] = [
  { key: "hokkaido", label: "北海道地方" },
  { key: "tohoku", label: "東北地方" },
  { key: "kanto", label: "関東地方" },
  { key: "hokuriku", label: "北陸地方" },
  { key: "chubu", label: "中部地方" },
  { key: "kinki", label: "近畿地方" },
  { key: "chugoku", label: "中国地方" },
  { key: "shikoku", label: "四国地方" },
  { key: "kyushu", label: "九州地方" },
  { key: "okinawa", label: "沖縄地方" },
];

export async function getMeteoArticleData(): Promise<MeteoArticleData> {
  const meteoData = meteoDataRaw as Record<string, MeteoItem>;
  const stations = loadMaster();

  const groupsMap: Record<string, MeteoRegionGroup> = {};

  for (const [id, data] of Object.entries(meteoData)) {
    const st = stations[id as StationId];
    if (!st) continue;

    const prefInfo = resolvePref(st.pref);
    if (!prefInfo) continue;

    const rKey = prefInfo.region.key;
    if (!groupsMap[rKey]) {
      groupsMap[rKey] = {
        key: rKey,
        label: prefInfo.region.label,
        color: prefInfo.region.colorStrong || "#3b82f6",
        stations: [],
      };
    }

    groupsMap[rKey].stations.push({
      id,
      name: st.station_name,
      officialName: st.official_name || st.station_name,
      prefLabel: prefInfo.label,
      data,
    });
  }

  const sortedGroups = REGION_ORDER.map((ro) => groupsMap[ro.key]).filter(
    Boolean
  );

  return { groups: sortedGroups };
}
