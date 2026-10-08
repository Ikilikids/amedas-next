import { DivisionValue, DivisionKey } from "../division";
import { REGION_CLIMATE_DIVISIONS } from "./region";
import { PREF_CLIMATE_DIVISIONS } from "./pref";
import { AREA_CLIMATE_DIVISIONS } from "./area";
import { RegionValue } from "../region";
import { PrefValue } from "../pref";
import { AreaValue } from "../area";

export * from "./region";
export * from "./pref";
export * from "./area";

/**
 * key（地方・県・エリア）から気候区分のDivisionValue配列を取得するヘルパー
 */
export function getClimateDivisions(key: string): DivisionValue[] {
  if (key in REGION_CLIMATE_DIVISIONS) {
    return REGION_CLIMATE_DIVISIONS[key as RegionValue];
  }
  if (key in PREF_CLIMATE_DIVISIONS) {
    return PREF_CLIMATE_DIVISIONS[key as PrefValue];
  }
  if (key in AREA_CLIMATE_DIVISIONS) {
    return AREA_CLIMATE_DIVISIONS[key as AreaValue];
  }
  return [];
}

/**
 * 気候区分の日本語表示文字列（例: "太平洋側気候" または "太平洋側 / 日本海側気候"）を生成
 */
export function formatClimateDivisions(divisions: DivisionValue[]): string {
  if (!divisions || divisions.length === 0) return "";
  const names = divisions.map((d) => DivisionKey[d]?.name ?? d);
  return `${names.join(" / ")}気候`;
}
