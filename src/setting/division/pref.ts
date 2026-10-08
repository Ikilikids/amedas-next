import { PrefValue } from "../pref";
import { DivisionValue } from "../division";

export const PREF_CLIMATE_DIVISIONS: Record<PrefValue, DivisionValue[]> = {
  // 北海道
  hokkaido_douou: ["hokkaido"],
  hokkaido_dounan: ["hokkaido"],
  hokkaido_doutou: ["hokkaido"],
  hokkaido_douhoku: ["hokkaido"],

  // 東北
  aomori: ["japansea", "pacific"],
  akita: ["japansea"],
  iwate: ["pacific"],
  miyagi: ["pacific"],
  yamagata: ["japansea"],
  fukushima: ["japansea", "pacific"],

  // 関東
  ibaraki: ["pacific"],
  tochigi: ["pacific"],
  gunma: ["pacific"],
  saitama: ["pacific"],
  tokyo: ["pacific"],
  chiba: ["pacific"],
  kanagawa: ["pacific"],

  // 中部
  niigata: ["japansea"],
  toyama: ["japansea"],
  ishikawa: ["japansea"],
  fukui: ["japansea"],
  yamanashi: ["central"],
  nagano: ["central", "japansea"],
  shizuoka: ["pacific"],
  aichi: ["pacific"],
  gifu: ["pacific", "japansea"],
  mie: ["pacific"],

  // 近畿
  shiga: ["japansea", "pacific"],
  kyoto: ["japansea", "seto"],
  osaka: ["seto"],
  hyogo: ["seto", "japansea"],
  nara: ["seto", "pacific"],
  wakayama: ["pacific"],

  // 中国
  tottori: ["japansea"],
  shimane: ["japansea"],
  okayama: ["seto", "japansea"],
  hiroshima: ["seto", "japansea"],
  yamaguchi: ["seto", "japansea"],

  // 四国
  tokushima: ["seto", "pacific"],
  kagawa: ["seto"],
  ehime: ["seto", "pacific"],
  kochi: ["pacific"],

  // 九州
  fukuoka: ["japansea", "seto"],
  saga: ["japansea", "pacific"],
  nagasaki: ["pacific"],
  kumamoto: ["pacific"],
  oita: ["seto", "pacific"],
  miyazaki: ["pacific"],
  kagoshima: ["pacific", "nansei"],

  // 沖縄
  okinawa_main: ["nansei"],
  okinawa_daito: ["nansei"],
  okinawa_miyako: ["nansei"],
  okinawa_yaeyama: ["nansei"],
};
