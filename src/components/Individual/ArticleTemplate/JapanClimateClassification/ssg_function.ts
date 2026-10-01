import { climateDownload } from "../../../../utils/downloader";
import { loadMaster } from "../../../../utils/climateDataManager";
import { ArticleUonzuItem } from "../../../../utils/ssgLoader";
import { CLIMATE_DIVISIONS } from "../../../../data/classification";
import { StationId } from "../../../../types/union";

export interface JapanClimateArticleData {
  uonzuItems: ArticleUonzuItem[];
}

export async function getJapanClimateArticleData(): Promise<JapanClimateArticleData> {
  const allStationIds = CLIMATE_DIVISIONS.flatMap((div) => div.stationIds);
  const master = loadMaster();
  const config: Record<StationId, ("uonzu")[]> = {};
  for (const id of allStationIds) {
    config[id] = ["uonzu"];
  }

  const stationMetricsMap = await climateDownload(config, master);

  const uonzuItems: ArticleUonzuItem[] = Object.values(stationMetricsMap).map((st) => ({
    id: st.station.id,
    name: st.station.station_name || "",
    rawUonzu: st.climateData || {},
  }));

  return { uonzuItems };
}
