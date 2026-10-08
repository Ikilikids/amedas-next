import { RegionValue } from "../region";
import { DivisionValue } from "../division";

export const REGION_CLIMATE_DIVISIONS: Record<RegionValue, DivisionValue[]> = {
  hokkaido: ["hokkaido"],
  tohoku: ["japansea", "pacific"],
  kanto: ["pacific"],
  hokuriku: ["japansea"],
  chubu: ["japansea", "pacific", "central"],
  kinki: ["pacific", "seto", "japansea"],
  chugoku: ["seto", "japansea"],
  shikoku: ["pacific", "seto"],
  kyushu: ["pacific", "japansea"],
  okinawa: ["nansei"],
};
