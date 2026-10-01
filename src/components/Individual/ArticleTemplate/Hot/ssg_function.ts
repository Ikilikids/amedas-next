import hotDataRaw from "../../../../../data/feature/hot.json";
import { resolvePref } from "../../../../utils/masterUtils";
import { loadMaster } from "../../../../utils/climateDataManager";
import { StationId } from "../../../../types/union";

export interface HotStationItem {
  id: string;
  name: string;
  prefName: string;
  record: string;
  bullets: string[];
}

export interface HotArticleData {
  stations: HotStationItem[];
}

export async function getHotArticleData(): Promise<HotArticleData> {
  const hotData = hotDataRaw as Record<
    string,
    {
      record: string;
      d1?: string;
      d2?: string;
      d3?: string;
      d4?: string;
      d5?: string;
    }
  >;
  const stations = loadMaster();

  const stationList: HotStationItem[] = [];

  for (const [id, data] of Object.entries(hotData)) {
    const st = stations[id as StationId];
    if (!st) continue;

    const prefInfo = resolvePref(st.pref);
    const prefName = prefInfo ? prefInfo.label : st.pref;

    const bullets: string[] = [];
    if (data.d1) bullets.push(data.d1);
    if (data.d2) bullets.push(data.d2);
    if (data.d3) bullets.push(data.d3);
    if (data.d4) bullets.push(data.d4);
    if (data.d5) bullets.push(data.d5);

    stationList.push({
      id,
      name: st.station_name,
      prefName,
      record: data.record,
      bullets,
    });
  }

  return { stations: stationList };
}
