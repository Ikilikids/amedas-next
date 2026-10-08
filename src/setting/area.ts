import { PrefKey, PrefMeta, PrefValue } from "./pref";
export type AreaValue =
  | "011000"
  | "012010"
  | "012020"
  | "013010"
  | "013020"
  | "013030"
  | "014010"
  | "014020"
  | "014030"
  | "015010"
  | "015020"
  | "016010"
  | "016020"
  | "016030"
  | "017010"
  | "017020"
  | "020010"
  | "020020"
  | "020030"
  | "030010"
  | "030020"
  | "030030"
  | "040010"
  | "040020"
  | "050010"
  | "050020"
  | "060010"
  | "060020"
  | "060030"
  | "060040"
  | "070010"
  | "070020"
  | "070030"
  | "080010"
  | "080020"
  | "090010"
  | "090020"
  | "100010"
  | "100020"
  | "110010"
  | "110020"
  | "110030"
  | "120010"
  | "120020"
  | "120030"
  | "130010"
  | "130020"
  | "130030"
  | "130040"
  | "140010"
  | "140020"
  | "150010"
  | "150020"
  | "150030"
  | "150040"
  | "160010"
  | "160020"
  | "170010"
  | "170020"
  | "180010"
  | "180020"
  | "190010"
  | "190020"
  | "200010"
  | "200020"
  | "200030"
  | "210010"
  | "210020"
  | "220010"
  | "220020"
  | "220030"
  | "220040"
  | "230010"
  | "230020"
  | "240010"
  | "240020"
  | "250010"
  | "250020"
  | "260010"
  | "260020"
  | "270000"
  | "280010"
  | "280020"
  | "290010"
  | "290020"
  | "300010"
  | "300020"
  | "310010"
  | "310020"
  | "320010"
  | "320020"
  | "320030"
  | "330010"
  | "330020"
  | "340010"
  | "340020"
  | "350010"
  | "350020"
  | "350030"
  | "350040"
  | "360010"
  | "360020"
  | "370000"
  | "380010"
  | "380020"
  | "380030"
  | "390010"
  | "390020"
  | "390030"
  | "400010"
  | "400020"
  | "400030"
  | "400040"
  | "410010"
  | "410020"
  | "420010"
  | "420020"
  | "420030"
  | "420040"
  | "430010"
  | "430020"
  | "430030"
  | "430040"
  | "440010"
  | "440020"
  | "440030"
  | "440040"
  | "450010"
  | "450020"
  | "450030"
  | "450040"
  | "460010"
  | "460020"
  | "460030"
  | "460040"
  | "471010"
  | "471020"
  | "471030"
  | "472000"
  | "473000"
  | "474010"
  | "474020";

export type AreaMeta = {
  key: AreaValue;
  label: string;
  pref: PrefMeta;
};

type AreaMap = Record<AreaValue, AreaMeta>;

export const AreaKey = {
  "011000": {
    key: "011000",
    label: "宗谷地方",
    pref: PrefKey.hokkaido_douhoku,
  },
  "012010": {
    key: "012010",
    label: "上川地方",
    pref: PrefKey.hokkaido_douhoku,
  },
  "012020": {
    key: "012020",
    label: "留萌地方",
    pref: PrefKey.hokkaido_douhoku,
  },
  "013010": {
    key: "013010",
    label: "網走地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "013020": {
    key: "013020",
    label: "北見地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "013030": {
    key: "013030",
    label: "紋別地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "014010": {
    key: "014010",
    label: "根室地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "014020": {
    key: "014020",
    label: "釧路地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "014030": {
    key: "014030",
    label: "十勝地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "015010": {
    key: "015010",
    label: "胆振地方",
    pref: PrefKey.hokkaido_douou,
  },
  "015020": {
    key: "015020",
    label: "日高地方",
    pref: PrefKey.hokkaido_douou,
  },
  "016010": {
    key: "016010",
    label: "石狩地方",
    pref: PrefKey.hokkaido_douou,
  },
  "016020": {
    key: "016020",
    label: "空知地方",
    pref: PrefKey.hokkaido_douou,
  },
  "016030": {
    key: "016030",
    label: "後志地方",
    pref: PrefKey.hokkaido_douou,
  },
  "017010": {
    key: "017010",
    label: "渡島地方",
    pref: PrefKey.hokkaido_dounan,
  },
  "017020": {
    key: "017020",
    label: "檜山地方",
    pref: PrefKey.hokkaido_dounan,
  },
  "020010": {
    key: "020010",
    label: "津軽",
    pref: PrefKey.aomori,
  },
  "020020": {
    key: "020020",
    label: "下北",
    pref: PrefKey.aomori,
  },
  "020030": {
    key: "020030",
    label: "三八上北",
    pref: PrefKey.aomori,
  },
  "030010": {
    key: "030010",
    label: "内陸",
    pref: PrefKey.iwate,
  },
  "030020": {
    key: "030020",
    label: "沿岸北部",
    pref: PrefKey.iwate,
  },
  "030030": {
    key: "030030",
    label: "沿岸南部",
    pref: PrefKey.iwate,
  },
  "040010": {
    key: "040010",
    label: "東部",
    pref: PrefKey.miyagi,
  },
  "040020": {
    key: "040020",
    label: "西部",
    pref: PrefKey.miyagi,
  },
  "050010": {
    key: "050010",
    label: "沿岸",
    pref: PrefKey.akita,
  },
  "050020": {
    key: "050020",
    label: "内陸",
    pref: PrefKey.akita,
  },
  "060010": {
    key: "060010",
    label: "村山",
    pref: PrefKey.yamagata,
  },
  "060020": {
    key: "060020",
    label: "置賜",
    pref: PrefKey.yamagata,
  },
  "060030": {
    key: "060030",
    label: "庄内",
    pref: PrefKey.yamagata,
  },
  "060040": {
    key: "060040",
    label: "最上",
    pref: PrefKey.yamagata,
  },
  "070010": {
    key: "070010",
    label: "中通り",
    pref: PrefKey.fukushima,
  },
  "070020": {
    key: "070020",
    label: "浜通り",
    pref: PrefKey.fukushima,
  },
  "070030": {
    key: "070030",
    label: "会津",
    pref: PrefKey.fukushima,
  },
  "080010": {
    key: "080010",
    label: "北部",
    pref: PrefKey.ibaraki,
  },
  "080020": {
    key: "080020",
    label: "南部",
    pref: PrefKey.ibaraki,
  },
  "090010": {
    key: "090010",
    label: "南部",
    pref: PrefKey.tochigi,
  },
  "090020": {
    key: "090020",
    label: "北部",
    pref: PrefKey.tochigi,
  },
  "100010": {
    key: "100010",
    label: "南部",
    pref: PrefKey.gunma,
  },
  "100020": {
    key: "100020",
    label: "北部",
    pref: PrefKey.gunma,
  },
  "110010": {
    key: "110010",
    label: "南部",
    pref: PrefKey.saitama,
  },
  "110020": {
    key: "110020",
    label: "北部",
    pref: PrefKey.saitama,
  },
  "110030": {
    key: "110030",
    label: "秩父地方",
    pref: PrefKey.saitama,
  },
  "120010": {
    key: "120010",
    label: "北西部",
    pref: PrefKey.chiba,
  },
  "120020": {
    key: "120020",
    label: "北東部",
    pref: PrefKey.chiba,
  },
  "120030": {
    key: "120030",
    label: "南部",
    pref: PrefKey.chiba,
  },
  "130010": {
    key: "130010",
    label: "東京地方",
    pref: PrefKey.tokyo,
  },
  "130020": {
    key: "130020",
    label: "伊豆諸島北部",
    pref: PrefKey.tokyo,
  },
  "130030": {
    key: "130030",
    label: "伊豆諸島南部",
    pref: PrefKey.tokyo,
  },
  "130040": {
    key: "130040",
    label: "小笠原諸島",
    pref: PrefKey.tokyo,
  },
  "140010": {
    key: "140010",
    label: "東部",
    pref: PrefKey.kanagawa,
  },
  "140020": {
    key: "140020",
    label: "西部",
    pref: PrefKey.kanagawa,
  },
  "150010": {
    key: "150010",
    label: "下越",
    pref: PrefKey.niigata,
  },
  "150020": {
    key: "150020",
    label: "中越",
    pref: PrefKey.niigata,
  },
  "150030": {
    key: "150030",
    label: "上越",
    pref: PrefKey.niigata,
  },
  "150040": {
    key: "150040",
    label: "佐渡",
    pref: PrefKey.niigata,
  },
  "160010": {
    key: "160010",
    label: "東部",
    pref: PrefKey.toyama,
  },
  "160020": {
    key: "160020",
    label: "西部",
    pref: PrefKey.toyama,
  },
  "170010": {
    key: "170010",
    label: "加賀",
    pref: PrefKey.ishikawa,
  },
  "170020": {
    key: "170020",
    label: "能登",
    pref: PrefKey.ishikawa,
  },
  "180010": {
    key: "180010",
    label: "嶺北",
    pref: PrefKey.fukui,
  },
  "180020": {
    key: "180020",
    label: "嶺南",
    pref: PrefKey.fukui,
  },
  "190010": {
    key: "190010",
    label: "中・西部",
    pref: PrefKey.yamanashi,
  },
  "190020": {
    key: "190020",
    label: "東部・富士五湖",
    pref: PrefKey.yamanashi,
  },
  "200010": {
    key: "200010",
    label: "北部",
    pref: PrefKey.nagano,
  },
  "200020": {
    key: "200020",
    label: "中部",
    pref: PrefKey.nagano,
  },
  "200030": {
    key: "200030",
    label: "南部",
    pref: PrefKey.nagano,
  },
  "210010": {
    key: "210010",
    label: "美濃地方",
    pref: PrefKey.gifu,
  },
  "210020": {
    key: "210020",
    label: "飛騨地方",
    pref: PrefKey.gifu,
  },
  "220010": {
    key: "220010",
    label: "中部",
    pref: PrefKey.shizuoka,
  },
  "220020": {
    key: "220020",
    label: "伊豆",
    pref: PrefKey.shizuoka,
  },
  "220030": {
    key: "220030",
    label: "東部",
    pref: PrefKey.shizuoka,
  },
  "220040": {
    key: "220040",
    label: "西部",
    pref: PrefKey.shizuoka,
  },
  "230010": {
    key: "230010",
    label: "西部",
    pref: PrefKey.aichi,
  },
  "230020": {
    key: "230020",
    label: "東部",
    pref: PrefKey.aichi,
  },
  "240010": {
    key: "240010",
    label: "北中部",
    pref: PrefKey.mie,
  },
  "240020": {
    key: "240020",
    label: "南部",
    pref: PrefKey.mie,
  },
  "250010": {
    key: "250010",
    label: "南部",
    pref: PrefKey.shiga,
  },
  "250020": {
    key: "250020",
    label: "北部",
    pref: PrefKey.shiga,
  },
  "260010": {
    key: "260010",
    label: "南部",
    pref: PrefKey.kyoto,
  },
  "260020": {
    key: "260020",
    label: "北部",
    pref: PrefKey.kyoto,
  },
  "270000": {
    key: "270000",
    label: "大阪府",
    pref: PrefKey.osaka,
  },
  "280010": {
    key: "280010",
    label: "南部",
    pref: PrefKey.hyogo,
  },
  "280020": {
    key: "280020",
    label: "北部",
    pref: PrefKey.hyogo,
  },
  "290010": {
    key: "290010",
    label: "北部",
    pref: PrefKey.nara,
  },
  "290020": {
    key: "290020",
    label: "南部",
    pref: PrefKey.nara,
  },
  "300010": {
    key: "300010",
    label: "北部",
    pref: PrefKey.wakayama,
  },
  "300020": {
    key: "300020",
    label: "南部",
    pref: PrefKey.wakayama,
  },
  "310010": {
    key: "310010",
    label: "東部",
    pref: PrefKey.tottori,
  },
  "310020": {
    key: "310020",
    label: "中・西部",
    pref: PrefKey.tottori,
  },
  "320010": {
    key: "320010",
    label: "東部",
    pref: PrefKey.shimane,
  },
  "320020": {
    key: "320020",
    label: "西部",
    pref: PrefKey.shimane,
  },
  "320030": {
    key: "320030",
    label: "隠岐",
    pref: PrefKey.shimane,
  },
  "330010": {
    key: "330010",
    label: "南部",
    pref: PrefKey.okayama,
  },
  "330020": {
    key: "330020",
    label: "北部",
    pref: PrefKey.okayama,
  },
  "340010": {
    key: "340010",
    label: "南部",
    pref: PrefKey.hiroshima,
  },
  "340020": {
    key: "340020",
    label: "北部",
    pref: PrefKey.hiroshima,
  },
  "350010": {
    key: "350010",
    label: "西部",
    pref: PrefKey.yamaguchi,
  },
  "350020": {
    key: "350020",
    label: "中部",
    pref: PrefKey.yamaguchi,
  },
  "350030": {
    key: "350030",
    label: "東部",
    pref: PrefKey.yamaguchi,
  },
  "350040": {
    key: "350040",
    label: "北部",
    pref: PrefKey.yamaguchi,
  },
  "360010": {
    key: "360010",
    label: "北部",
    pref: PrefKey.tokushima,
  },
  "360020": {
    key: "360020",
    label: "南部",
    pref: PrefKey.tokushima,
  },
  "370000": {
    key: "370000",
    label: "香川県",
    pref: PrefKey.kagawa,
  },
  "380010": {
    key: "380010",
    label: "中予",
    pref: PrefKey.ehime,
  },
  "380020": {
    key: "380020",
    label: "東予",
    pref: PrefKey.ehime,
  },
  "380030": {
    key: "380030",
    label: "南予",
    pref: PrefKey.ehime,
  },
  "390010": {
    key: "390010",
    label: "中部",
    pref: PrefKey.kochi,
  },
  "390020": {
    key: "390020",
    label: "東部",
    pref: PrefKey.kochi,
  },
  "390030": {
    key: "390030",
    label: "西部",
    pref: PrefKey.kochi,
  },
  "400010": {
    key: "400010",
    label: "福岡地方",
    pref: PrefKey.fukuoka,
  },
  "400020": {
    key: "400020",
    label: "北九州地方",
    pref: PrefKey.fukuoka,
  },
  "400030": {
    key: "400030",
    label: "筑豊地方",
    pref: PrefKey.fukuoka,
  },
  "400040": {
    key: "400040",
    label: "筑後地方",
    pref: PrefKey.fukuoka,
  },
  "410010": {
    key: "410010",
    label: "南部",
    pref: PrefKey.saga,
  },
  "410020": {
    key: "410020",
    label: "北部",
    pref: PrefKey.saga,
  },
  "420010": {
    key: "420010",
    label: "南部",
    pref: PrefKey.nagasaki,
  },
  "420020": {
    key: "420020",
    label: "北部",
    pref: PrefKey.nagasaki,
  },
  "420030": {
    key: "420030",
    label: "壱岐・対馬",
    pref: PrefKey.nagasaki,
  },
  "420040": {
    key: "420040",
    label: "五島",
    pref: PrefKey.nagasaki,
  },
  "430010": {
    key: "430010",
    label: "熊本地方",
    pref: PrefKey.kumamoto,
  },
  "430020": {
    key: "430020",
    label: "阿蘇地方",
    pref: PrefKey.kumamoto,
  },
  "430030": {
    key: "430030",
    label: "天草・芦北地方",
    pref: PrefKey.kumamoto,
  },
  "430040": {
    key: "430040",
    label: "球磨地方",
    pref: PrefKey.kumamoto,
  },
  "440010": {
    key: "440010",
    label: "中部",
    pref: PrefKey.oita,
  },
  "440020": {
    key: "440020",
    label: "北部",
    pref: PrefKey.oita,
  },
  "440030": {
    key: "440030",
    label: "西部",
    pref: PrefKey.oita,
  },
  "440040": {
    key: "440040",
    label: "南部",
    pref: PrefKey.oita,
  },
  "450010": {
    key: "450010",
    label: "南部平野部",
    pref: PrefKey.miyazaki,
  },
  "450020": {
    key: "450020",
    label: "北部平野部",
    pref: PrefKey.miyazaki,
  },
  "450030": {
    key: "450030",
    label: "南部山沿い",
    pref: PrefKey.miyazaki,
  },
  "450040": {
    key: "450040",
    label: "北部山沿い",
    pref: PrefKey.miyazaki,
  },
  "460010": {
    key: "460010",
    label: "薩摩地方",
    pref: PrefKey.kagoshima,
  },
  "460020": {
    key: "460020",
    label: "大隅地方",
    pref: PrefKey.kagoshima,
  },
  "460030": {
    key: "460030",
    label: "種子島・屋久島地方",
    pref: PrefKey.kagoshima,
  },
  "460040": {
    key: "460040",
    label: "奄美地方",
    pref: PrefKey.kagoshima,
  },
  "471010": {
    key: "471010",
    label: "本島中南部",
    pref: PrefKey.okinawa_main,
  },
  "471020": {
    key: "471020",
    label: "本島北部",
    pref: PrefKey.okinawa_main,
  },
  "471030": {
    key: "471030",
    label: "久米島",
    pref: PrefKey.okinawa_main,
  },
  "472000": {
    key: "472000",
    label: "大東島地方",
    pref: PrefKey.okinawa_daito,
  },
  "473000": {
    key: "473000",
    label: "宮古島地方",
    pref: PrefKey.okinawa_miyako,
  },
  "474010": {
    key: "474010",
    label: "石垣島地方",
    pref: PrefKey.okinawa_yaeyama,
  },
  "474020": {
    key: "474020",
    label: "与那国島地方",
    pref: PrefKey.okinawa_yaeyama,
  },
} as const satisfies AreaMap;

// ==============================
// utils
// ==============================
export const AREA_LIST = Object.keys(AreaKey) as AreaValue[];

export function getAreasInPref(prefKey: PrefValue): AreaMeta[] {
  return Object.values(AreaKey).filter(
    (area) => area.pref === PrefKey[prefKey]
  );
}

