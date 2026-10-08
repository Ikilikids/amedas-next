import { AreaValue, AreaKey } from "../area";
import { DivisionValue } from "../division";
import { PREF_CLIMATE_DIVISIONS } from "./pref";

/**
 * 一次細分区域ごとの気候区分
 * 特殊な地域（県内で気候区分が分かれる地域）を個別指定し、
 * それ以外は所属する県の気候区分（PREF_CLIMATE_DIVISIONS）を自動継承します。
 */
const AREA_CUSTOM_DIVISIONS: Partial<Record<AreaValue, DivisionValue[]>> = {
  // 群馬
  "100010": ["pacific"],   // 南部
  "100020": ["japansea"],  // 北部（みなかみ等、日本海側豪雪）


  // 長野
  "200010": ["japansea"],  // 北部
  "200020": ["central"],   // 中部
  "200030": ["central"],   // 南部

  // 岐阜
  "210010": ["pacific"],   // 美濃
  "210020": ["japansea"],  // 飛騨

  // 京都
  "260010": ["japansea"],  // 北部
  "260020": ["seto"],      // 南部

  // 兵庫
  "280010": ["seto"],      // 南部
  "280020": ["japansea"],  // 北部（但馬）

  // 鳥取
  "310010": ["japansea"],  // 東部
  "310020": ["japansea"],  // 中・西部

  // 島根
  "320010": ["japansea"],  // 東部
  "320020": ["japansea"],  // 西部
  "320030": ["japansea"],  // 隠岐

  // 岡山
  "330010": ["seto"],      // 南部
  "330020": ["japansea"],  // 北部

  // 広島
  "340010": ["seto"],      // 南部
  "340020": ["japansea"],  // 北部

  // 山口
  "350010": ["seto"],      // 西部
  "350020": ["seto"],      // 中部
  "350030": ["seto"],      // 東部
  "350040": ["japansea"],  // 北部

  // 愛媛
  "380010": ["seto"],      // 中予
  "380020": ["seto"],      // 東予
  "380030": ["pacific"],   // 南予

  // 高知
  "390010": ["pacific"],   // 中部
  "390020": ["pacific"],   // 東部
  "390030": ["pacific"],   // 西部

  // 福岡
  "400010": ["japansea"],  // 福岡
  "400020": ["japansea"],  // 北九州
  "400030": ["seto"],      // 筑豊
  "400040": ["pacific"],   // 筑後

  // 鹿児島
  "460010": ["pacific"],   // 薩摩
  "460020": ["pacific"],   // 大隅
  "460030": ["pacific"],   // 種子島・屋久島
  "460040": ["nansei"],    // 奄美
};

export const AREA_CLIMATE_DIVISIONS: Record<AreaValue, DivisionValue[]> = Object.fromEntries(
  (Object.keys(AreaKey) as AreaValue[]).map((areaKey) => {
    if (AREA_CUSTOM_DIVISIONS[areaKey]) {
      return [areaKey, AREA_CUSTOM_DIVISIONS[areaKey]!];
    }
    const prefKey = AreaKey[areaKey]?.pref?.key;
    const prefDivs = prefKey ? PREF_CLIMATE_DIVISIONS[prefKey] : ["pacific"];
    return [areaKey, prefDivs || ["pacific"]];
  })
) as Record<AreaValue, DivisionValue[]>;
