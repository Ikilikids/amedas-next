import { RawMonthlyData, RawStationData } from "../../../../../types/raw";
import { computeStationBadges } from "../../function";

export function getHeaderData(
  stationData: RawStationData,
  climateData: RawMonthlyData | null
) {
  return {
    badges: computeStationBadges(stationData, climateData),
  };
}
