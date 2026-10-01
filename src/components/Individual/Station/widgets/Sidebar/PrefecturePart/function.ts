import { RawStationData } from "../../../../../../types/raw";
import { resolveCategory } from "../../../../../../utils/masterUtils";

export function sortSamePrefStations(stations: RawStationData[]): RawStationData[] {
  return [...stations].sort((a, b) => {
    const aVal = a.category ? resolveCategory(a.category)?.value || 99 : 99;
    const bVal = b.category ? resolveCategory(b.category)?.value || 99 : 99;
    return aVal - bVal || (a.id || "").localeCompare(b.id || "");
  });
}

export function sortMeteoStations(stations: RawStationData[]): RawStationData[] {
  return [...stations].sort((a, b) => (a.id || "").localeCompare(b.id || ""));
}
