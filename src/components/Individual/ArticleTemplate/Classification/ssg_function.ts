import { climateDownload } from "../../../../utils/loading/1_downloader";
import { loadMaster } from "../../../../utils/loading/0_stationData";
import { RawData } from "../../../../types/raw";
import { CLIMATE_DIVISIONS } from "../../../../data/classification";
import { StationId } from "../../../../types/union";
import { AssembleTarget } from "../../../../setting/assemble";

export async function getJapanClimateArticleData(): Promise<{
  stationsMap: Record<StationId, RawData>;
}> {
  const allStationIds = CLIMATE_DIVISIONS.flatMap((div) => div.stationIds);
  const master = loadMaster();
  const config: Record<StationId, AssembleTarget[]> = {};
  for (const id of allStationIds) {
    config[id] = ["uonzu"];
  }

  const stationsMap = await climateDownload(config, master);
  return { stationsMap };
}
