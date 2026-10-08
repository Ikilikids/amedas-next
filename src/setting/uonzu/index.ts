import { RegionValue } from "../region";
import { PrefValue } from "../pref";
import { AreaValue } from "../area";
import { StationId } from "../../data/types";
import { REGION_UONZU_STATIONS } from "./region";
import { PREF_UONZU_STATIONS } from "./pref";
import { AREA_UONZU_STATIONS } from "./area";

export { REGION_UONZU_STATIONS } from "./region";
export { PREF_UONZU_STATIONS } from "./pref";
export { AREA_UONZU_STATIONS } from "./area";

/**
 * 任意のキー（地方・都道府県・エリア）から雨温図地点ID配列を取得する統合ヘルパー
 */
export function getUonzuStationIds(key: string): StationId[] {
  if (key in REGION_UONZU_STATIONS) {
    return REGION_UONZU_STATIONS[key as RegionValue];
  }
  if (key in PREF_UONZU_STATIONS) {
    return PREF_UONZU_STATIONS[key as PrefValue];
  }
  if (key in AREA_UONZU_STATIONS) {
    return AREA_UONZU_STATIONS[key as AreaValue];
  }
  return [];
}
