import { RawSimilarStationData, RawStationData } from "../../../../../types/raw";

export function isSidebarDataAvailable(
  similarAll: RawSimilarStationData[] | undefined,
  similarMeteo: RawSimilarStationData[] | undefined,
  sameStations: RawStationData[],
  meteoStations: RawStationData[]
): boolean {
  return (
    (!!similarAll && similarAll.length > 0) ||
    (!!similarMeteo && similarMeteo.length > 0) ||
    sameStations.length > 0 ||
    meteoStations.length > 0
  );
}
