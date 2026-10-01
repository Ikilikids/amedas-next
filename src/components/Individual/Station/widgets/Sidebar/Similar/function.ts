import { RawSimilarStationData } from "../../../../../../types/raw";

export function getTopSimilarStations(
  items: RawSimilarStationData[],
  limit: number = 5
): RawSimilarStationData[] {
  return items.slice(0, limit);
}
