import { PrefKey, PrefMeta, PrefValue } from "./pref";
import { ClimateArticleData } from "../data/types";
export type { ClimateArticleData };

import { area_100010, area_100020 } from "../data/area/42_gunma";
import { area_110010, area_110020, area_110030 } from "../data/area/43_saitama";
import { area_120010, area_120020, area_120030 } from "../data/area/45_chiba";
import { area_130010, area_130020, area_130030, area_130040 } from "../data/area/44_tokyo";
import { area_140010, area_140020 } from "../data/area/46_kanagawa";
import { area_150010, area_150020, area_150030, area_150040 } from "../data/area/54_niigata";
import { area_160010, area_160020 } from "../data/area/55_toyama";
import { area_170010, area_170020 } from "../data/area/56_ishikawa";
import { area_180010, area_180020 } from "../data/area/57_fukui";
import { area_190010, area_190020 } from "../data/area/49_yamanashi";
import { area_200010, area_200020, area_200030 } from "../data/area/48_nagano";
import { area_210010, area_210020 } from "../data/area/52_gifu";
import { area_220010, area_220020, area_220030, area_220040 } from "../data/area/50_shizuoka";
import { area_230010, area_230020 } from "../data/area/51_aichi";
import { area_240010, area_240020 } from "../data/area/53_mie";
import { area_250010, area_250020 } from "../data/area/60_shiga";
import { area_260010, area_260020 } from "../data/area/61_kyoto";
import { area_270000 } from "../data/area/62_osaka";
import { area_280010, area_280020 } from "../data/area/63_hyogo";
import { area_290010, area_290020 } from "../data/area/64_nara";
import { area_300010, area_300020 } from "../data/area/65_wakayama";
import { area_310010, area_310020 } from "../data/area/69_tottori";
import { area_320010, area_320020, area_320030 } from "../data/area/68_shimane";
import { area_330010, area_330020 } from "../data/area/66_okayama";
import { area_340010, area_340020 } from "../data/area/67_hiroshima";
import { area_350010, area_350020, area_350030, area_350040 } from "../data/area/81_yamaguchi";
import { area_360010, area_360020 } from "../data/area/71_tokushima";
import { area_370000 } from "../data/area/72_kagawa";
import { area_380010, area_380020, area_380030 } from "../data/area/73_ehime";
import { area_390010, area_390020, area_390030 } from "../data/area/74_kochi";
import { area_400010, area_400020, area_400030, area_400040 } from "../data/area/82_fukuoka";
import { area_410010, area_410020 } from "../data/area/85_saga";
import { area_420010, area_420020, area_420030, area_420040 } from "../data/area/84_nagasaki";
import { area_430010, area_430020, area_430030, area_430040 } from "../data/area/86_kumamoto";
import { area_440010, area_440020, area_440030, area_440040 } from "../data/area/83_oita";
import { area_450010, area_450020, area_450030, area_450040 } from "../data/area/87_miyazaki";
import { area_460010, area_460020, area_460030, area_460040 } from "../data/area/88_kagoshima";
import { area_471010, area_471020, area_471030 } from "../data/area/91_okinawa_main";
import { area_472000 } from "../data/area/92_okinawa_daito";
import { area_473000 } from "../data/area/93_okinawa_miyako";
import { area_474010, area_474020 } from "../data/area/94_okinawa_yaeyama";
import { area_011000, area_012010, area_012020 } from "../data/area/11_douhoku";
import { area_013010, area_013020, area_013030, area_014010, area_014020, area_014030 } from "../data/area/17_doutou";
import { area_015010, area_015020, area_016010, area_016020, area_016030 } from "../data/area/14_douou";
import { area_017010, area_017020 } from "../data/area/23_dounan";
import { area_020010, area_020020, area_020030 } from "../data/area/31_aomori";
import { area_030010, area_030020, area_030030 } from "../data/area/33_iwate";
import { area_040010, area_040020 } from "../data/area/34_miyagi";
import { area_050010, area_050020 } from "../data/area/32_akita";
import { area_060010, area_060020, area_060030, area_060040 } from "../data/area/35_yamagata";
import { area_070010, area_070020, area_070030 } from "../data/area/36_fukushima";
import { area_080010, area_080020 } from "../data/area/40_ibaraki";
import { area_090010, area_090020 } from "../data/area/41_tochigi";

export type AreaValue =
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
  | "474020"
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
  | "090020";

export type AreaMeta = {
  key: AreaValue;
  label: string;
  pref: PrefMeta;
  detail: ClimateArticleData;
  representativeStationId: string;
};

type AreaMap = Record<AreaValue, AreaMeta>;

export const AreaKey = {
  "100010": {
    key: "100010",
    representativeStationId: "42251",
    label: "南部",
    pref: PrefKey.gunma,
    detail: area_100010,
  },
  "100020": {
    key: "100020",
    representativeStationId: "42091",
    label: "北部",
    pref: PrefKey.gunma,
    detail: area_100020,
  },
  "110010": {
    key: "110010",
    representativeStationId: "43241",
    label: "南部",
    pref: PrefKey.saitama,
    detail: area_110010,
  },
  "110020": {
    key: "110020",
    representativeStationId: "43056",
    label: "北部",
    pref: PrefKey.saitama,
    detail: area_110020,
  },
  "110030": {
    key: "110030",
    representativeStationId: "43156",
    label: "秩父地方",
    pref: PrefKey.saitama,
    detail: area_110030,
  },
  "120010": {
    key: "120010",
    representativeStationId: "45212",
    label: "北西部",
    pref: PrefKey.chiba,
    detail: area_120010,
  },
  "120020": {
    key: "120020",
    representativeStationId: "45148",
    label: "北東部",
    pref: PrefKey.chiba,
    detail: area_120020,
  },
  "120030": {
    key: "120030",
    representativeStationId: "45401",
    label: "南部",
    pref: PrefKey.chiba,
    detail: area_120030,
  },
  "130010": {
    key: "130010",
    representativeStationId: "44132",
    label: "東京地方",
    pref: PrefKey.tokyo,
    detail: area_130010,
  },
  "130020": {
    key: "130020",
    representativeStationId: "44172",
    label: "伊豆諸島北部",
    pref: PrefKey.tokyo,
    detail: area_130020,
  },
  "130030": {
    key: "130030",
    representativeStationId: "44263",
    label: "伊豆諸島南部",
    pref: PrefKey.tokyo,
    detail: area_130030,
  },
  "130040": {
    key: "130040",
    representativeStationId: "44301",
    label: "小笠原諸島",
    pref: PrefKey.tokyo,
    detail: area_130040,
  },
  "140010": {
    key: "140010",
    representativeStationId: "46106",
    label: "東部",
    pref: PrefKey.kanagawa,
    detail: area_140010,
  },
  "140020": {
    key: "140020",
    representativeStationId: "46166",
    label: "西部",
    pref: PrefKey.kanagawa,
    detail: area_140020,
  },
  "150010": {
    key: "150010",
    representativeStationId: "54232",
    label: "下越",
    pref: PrefKey.niigata,
    detail: area_150010,
  },
  "150020": {
    key: "150020",
    representativeStationId: "54501",
    label: "中越",
    pref: PrefKey.niigata,
    detail: area_150020,
  },
  "150030": {
    key: "150030",
    representativeStationId: "54651",
    label: "上越",
    pref: PrefKey.niigata,
    detail: area_150030,
  },
  "150040": {
    key: "150040",
    representativeStationId: "54157",
    label: "佐渡",
    pref: PrefKey.niigata,
    detail: area_150040,
  },
  "160010": {
    key: "160010",
    representativeStationId: "55102",
    label: "東部",
    pref: PrefKey.toyama,
    detail: area_160010,
  },
  "160020": {
    key: "160020",
    representativeStationId: "55091",
    label: "西部",
    pref: PrefKey.toyama,
    detail: area_160020,
  },
  "170010": {
    key: "170010",
    representativeStationId: "56227",
    label: "加賀",
    pref: PrefKey.ishikawa,
    detail: area_170010,
  },
  "170020": {
    key: "170020",
    representativeStationId: "56052",
    label: "能登",
    pref: PrefKey.ishikawa,
    detail: area_170020,
  },
  "180010": {
    key: "180010",
    representativeStationId: "57066",
    label: "嶺北",
    pref: PrefKey.fukui,
    detail: area_180010,
  },
  "180020": {
    key: "180020",
    representativeStationId: "57248",
    label: "嶺南",
    pref: PrefKey.fukui,
    detail: area_180020,
  },
  "190010": {
    key: "190010",
    representativeStationId: "49142",
    label: "中・西部",
    pref: PrefKey.yamanashi,
    detail: area_190010,
  },
  "190020": {
    key: "190020",
    representativeStationId: "49251",
    label: "東部・富士五湖",
    pref: PrefKey.yamanashi,
    detail: area_190020,
  },
  "200010": {
    key: "200010",
    representativeStationId: "48156",
    label: "北部",
    pref: PrefKey.nagano,
    detail: area_200010,
  },
  "200020": {
    key: "200020",
    representativeStationId: "48361",
    label: "中部",
    pref: PrefKey.nagano,
    detail: area_200020,
  },
  "200030": {
    key: "200030",
    representativeStationId: "48767",
    label: "南部",
    pref: PrefKey.nagano,
    detail: area_200030,
  },
  "210010": {
    key: "210010",
    representativeStationId: "52586",
    label: "美濃地方",
    pref: PrefKey.gifu,
    detail: area_210010,
  },
  "210020": {
    key: "210020",
    representativeStationId: "52146",
    label: "飛騨地方",
    pref: PrefKey.gifu,
    detail: area_210020,
  },
  "220010": {
    key: "220010",
    representativeStationId: "50331",
    label: "中部",
    pref: PrefKey.shizuoka,
    detail: area_220010,
  },
  "220020": {
    key: "220020",
    representativeStationId: "50281",
    label: "伊豆",
    pref: PrefKey.shizuoka,
    detail: area_220020,
  },
  "220030": {
    key: "220030",
    representativeStationId: "50206",
    label: "東部",
    pref: PrefKey.shizuoka,
    detail: area_220030,
  },
  "220040": {
    key: "220040",
    representativeStationId: "50456",
    label: "西部",
    pref: PrefKey.shizuoka,
    detail: area_220040,
  },
  "230010": {
    key: "230010",
    representativeStationId: "51106",
    label: "西部",
    pref: PrefKey.aichi,
    detail: area_230010,
  },
  "230020": {
    key: "230020",
    representativeStationId: "51331",
    label: "東部",
    pref: PrefKey.aichi,
    detail: area_230020,
  },
  "240010": {
    key: "240010",
    representativeStationId: "53133",
    label: "北中部",
    pref: PrefKey.mie,
    detail: area_240010,
  },
  "240020": {
    key: "240020",
    representativeStationId: "53378",
    label: "南部",
    pref: PrefKey.mie,
    detail: area_240020,
  },
  "250010": {
    key: "250010",
    representativeStationId: "60216",
    label: "南部",
    pref: PrefKey.shiga,
    detail: area_250010,
  },
  "250020": {
    key: "250020",
    representativeStationId: "60131",
    label: "北部",
    pref: PrefKey.shiga,
    detail: area_250020,
  },
  "260010": {
    key: "260010",
    representativeStationId: "61286",
    label: "南部",
    pref: PrefKey.kyoto,
    detail: area_260010,
  },
  "260020": {
    key: "260020",
    representativeStationId: "61111",
    label: "北部",
    pref: PrefKey.kyoto,
    detail: area_260020,
  },
  "270000": {
    key: "270000",
    representativeStationId: "62078",
    label: "大阪府",
    pref: PrefKey.osaka,
    detail: area_270000,
  },
  "280010": {
    key: "280010",
    representativeStationId: "63518",
    label: "南部",
    pref: PrefKey.hyogo,
    detail: area_280010,
  },
  "280020": {
    key: "280020",
    representativeStationId: "63051",
    label: "北部",
    pref: PrefKey.hyogo,
    detail: area_280020,
  },
  "290010": {
    key: "290010",
    representativeStationId: "64036",
    label: "北部",
    pref: PrefKey.nara,
    detail: area_290010,
  },
  "290020": {
    key: "290020",
    representativeStationId: "64227",
    label: "南部",
    pref: PrefKey.nara,
    detail: area_290020,
  },
  "300010": {
    key: "300010",
    representativeStationId: "65042",
    label: "北部",
    pref: PrefKey.wakayama,
    detail: area_300010,
  },
  "300020": {
    key: "300020",
    representativeStationId: "65356",
    label: "南部",
    pref: PrefKey.wakayama,
    detail: area_300020,
  },
  "310010": {
    key: "310010",
    representativeStationId: "69122",
    label: "東部",
    pref: PrefKey.tottori,
    detail: area_310010,
  },
  "310020": {
    key: "310020",
    representativeStationId: "69076",
    label: "中・西部",
    pref: PrefKey.tottori,
    detail: area_310020,
  },
  "320010": {
    key: "320010",
    representativeStationId: "68132",
    label: "東部",
    pref: PrefKey.shimane,
    detail: area_320010,
  },
  "320020": {
    key: "320020",
    representativeStationId: "68376",
    label: "西部",
    pref: PrefKey.shimane,
    detail: area_320020,
  },
  "320030": {
    key: "320030",
    representativeStationId: "68022",
    label: "隠岐",
    pref: PrefKey.shimane,
    detail: area_320030,
  },
  "330010": {
    key: "330010",
    representativeStationId: "66408",
    label: "南部",
    pref: PrefKey.okayama,
    detail: area_330010,
  },
  "330020": {
    key: "330020",
    representativeStationId: "66186",
    label: "北部",
    pref: PrefKey.okayama,
    detail: area_330020,
  },
  "340010": {
    key: "340010",
    representativeStationId: "67437",
    label: "南部",
    pref: PrefKey.hiroshima,
    detail: area_340010,
  },
  "340020": {
    key: "340020",
    representativeStationId: "67116",
    label: "北部",
    pref: PrefKey.hiroshima,
    detail: area_340020,
  },
  "350010": {
    key: "350010",
    representativeStationId: "81428",
    label: "西部",
    pref: PrefKey.yamaguchi,
    detail: area_350010,
  },
  "350020": {
    key: "350020",
    representativeStationId: "81286",
    label: "中部",
    pref: PrefKey.yamaguchi,
    detail: area_350020,
  },
  "350030": {
    key: "350030",
    representativeStationId: "81481",
    label: "東部",
    pref: PrefKey.yamaguchi,
    detail: area_350030,
  },
  "350040": {
    key: "350040",
    representativeStationId: "81071",
    label: "北部",
    pref: PrefKey.yamaguchi,
    detail: area_350040,
  },
  "360010": {
    key: "360010",
    representativeStationId: "71106",
    label: "北部",
    pref: PrefKey.tokushima,
    detail: area_360010,
  },
  "360020": {
    key: "360020",
    representativeStationId: "71266",
    label: "南部",
    pref: PrefKey.tokushima,
    detail: area_360020,
  },
  "370000": {
    key: "370000",
    representativeStationId: "72086",
    label: "香川県",
    pref: PrefKey.kagawa,
    detail: area_370000,
  },
  "380010": {
    key: "380010",
    representativeStationId: "73166",
    label: "中予",
    pref: PrefKey.ehime,
    detail: area_380010,
  },
  "380020": {
    key: "380020",
    representativeStationId: "73136",
    label: "東予",
    pref: PrefKey.ehime,
    detail: area_380020,
  },
  "380030": {
    key: "380030",
    representativeStationId: "73442",
    label: "南予",
    pref: PrefKey.ehime,
    detail: area_380030,
  },
  "390010": {
    key: "390010",
    representativeStationId: "74182",
    label: "中部",
    pref: PrefKey.kochi,
    detail: area_390010,
  },
  "390020": {
    key: "390020",
    representativeStationId: "74372",
    label: "東部",
    pref: PrefKey.kochi,
    detail: area_390020,
  },
  "390030": {
    key: "390030",
    representativeStationId: "74516",
    label: "西部",
    pref: PrefKey.kochi,
    detail: area_390030,
  },
  "400010": {
    key: "400010",
    representativeStationId: "82182",
    label: "福岡地方",
    pref: PrefKey.fukuoka,
    detail: area_400010,
  },
  "400020": {
    key: "400020",
    representativeStationId: "82056",
    label: "北九州地方",
    pref: PrefKey.fukuoka,
    detail: area_400020,
  },
  "400030": {
    key: "400030",
    representativeStationId: "82136",
    label: "筑豊地方",
    pref: PrefKey.fukuoka,
    detail: area_400030,
  },
  "400040": {
    key: "400040",
    representativeStationId: "82306",
    label: "筑後地方",
    pref: PrefKey.fukuoka,
    detail: area_400040,
  },
  "410010": {
    key: "410010",
    representativeStationId: "85142",
    label: "南部",
    pref: PrefKey.saga,
    detail: area_410010,
  },
  "410020": {
    key: "410020",
    representativeStationId: "85116",
    label: "北部",
    pref: PrefKey.saga,
    detail: area_410020,
  },
  "420010": {
    key: "420010",
    representativeStationId: "84496",
    label: "南部",
    pref: PrefKey.nagasaki,
    detail: area_420010,
  },
  "420020": {
    key: "420020",
    representativeStationId: "84266",
    label: "北部",
    pref: PrefKey.nagasaki,
    detail: area_420020,
  },
  "420030": {
    key: "420030",
    representativeStationId: "84072",
    label: "壱岐・対馬",
    pref: PrefKey.nagasaki,
    detail: area_420030,
  },
  "420040": {
    key: "420040",
    representativeStationId: "84536",
    label: "五島",
    pref: PrefKey.nagasaki,
    detail: area_420040,
  },
  "430010": {
    key: "430010",
    representativeStationId: "86141",
    label: "熊本地方",
    pref: PrefKey.kumamoto,
    detail: area_430010,
  },
  "430020": {
    key: "430020",
    representativeStationId: "86111",
    label: "阿蘇地方",
    pref: PrefKey.kumamoto,
    detail: area_430020,
  },
  "430030": {
    key: "430030",
    representativeStationId: "86491",
    label: "天草・芦北地方",
    pref: PrefKey.kumamoto,
    detail: area_430030,
  },
  "430040": {
    key: "430040",
    representativeStationId: "86467",
    label: "球磨地方",
    pref: PrefKey.kumamoto,
    detail: area_430040,
  },
  "440010": {
    key: "440010",
    representativeStationId: "83216",
    label: "中部",
    pref: PrefKey.oita,
    detail: area_440010,
  },
  "440020": {
    key: "440020",
    representativeStationId: "83051",
    label: "北部",
    pref: PrefKey.oita,
    detail: area_440020,
  },
  "440030": {
    key: "440030",
    representativeStationId: "83137",
    label: "西部",
    pref: PrefKey.oita,
    detail: area_440030,
  },
  "440040": {
    key: "440040",
    representativeStationId: "83401",
    label: "南部",
    pref: PrefKey.oita,
    detail: area_440040,
  },
  "450010": {
    key: "450010",
    representativeStationId: "87376",
    label: "南部平野部",
    pref: PrefKey.miyazaki,
    detail: area_450010,
  },
  "450020": {
    key: "450020",
    representativeStationId: "87141",
    label: "北部平野部",
    pref: PrefKey.miyazaki,
    detail: area_450020,
  },
  "450030": {
    key: "450030",
    representativeStationId: "87426",
    label: "南部山沿い",
    pref: PrefKey.miyazaki,
    detail: area_450030,
  },
  "450040": {
    key: "450040",
    representativeStationId: "87041",
    label: "北部山沿い",
    pref: PrefKey.miyazaki,
    detail: area_450040,
  },
  "460010": {
    key: "460010",
    representativeStationId: "88317",
    label: "薩摩地方",
    pref: PrefKey.kagoshima,
    detail: area_460010,
  },
  "460020": {
    key: "460020",
    representativeStationId: "88442",
    label: "大隅地方",
    pref: PrefKey.kagoshima,
    detail: area_460020,
  },
  "460030": {
    key: "460030",
    representativeStationId: "88612",
    label: "種子島・屋久島地方",
    pref: PrefKey.kagoshima,
    detail: area_460030,
  },
  "460040": {
    key: "460040",
    representativeStationId: "88837",
    label: "奄美地方",
    pref: PrefKey.kagoshima,
    detail: area_460040,
  },
  "471010": {
    key: "471010",
    representativeStationId: "91197",
    label: "本島中南部",
    pref: PrefKey.okinawa_main,
    detail: area_471010,
  },
  "471020": {
    key: "471020",
    representativeStationId: "91107",
    label: "本島北部",
    pref: PrefKey.okinawa_main,
    detail: area_471020,
  },
  "471030": {
    key: "471030",
    representativeStationId: "91146",
    label: "久米島",
    pref: PrefKey.okinawa_main,
    detail: area_471030,
  },
  "472000": {
    key: "472000",
    representativeStationId: "92011",
    label: "大東島地方",
    pref: PrefKey.okinawa_daito,
    detail: area_472000,
  },
  "473000": {
    key: "473000",
    representativeStationId: "93041",
    label: "宮古島地方",
    pref: PrefKey.okinawa_miyako,
    detail: area_473000,
  },
  "474010": {
    key: "474010",
    representativeStationId: "94081",
    label: "石垣島地方",
    pref: PrefKey.okinawa_yaeyama,
    detail: area_474010,
  },
  "474020": {
    key: "474020",
    representativeStationId: "94017",
    label: "与那国島地方",
    pref: PrefKey.okinawa_yaeyama,
    detail: area_474020,
  },
  "011000": {
    key: "011000",
    representativeStationId: "11016",
    label: "宗谷地方",
    pref: PrefKey.hokkaido_douhoku,
    detail: area_011000,
  },
  "012010": {
    key: "012010",
    representativeStationId: "12442",
    label: "上川地方",
    pref: PrefKey.hokkaido_douhoku,
    detail: area_012010,
  },
  "012020": {
    key: "012020",
    representativeStationId: "13277",
    label: "留萌地方",
    pref: PrefKey.hokkaido_douhoku,
    detail: area_012020,
  },
  "013010": {
    key: "013010",
    representativeStationId: "17341",
    label: "網走地方",
    pref: PrefKey.hokkaido_doutou,
    detail: area_013010,
  },
  "013020": {
    key: "013020",
    representativeStationId: "17521",
    label: "北見地方",
    pref: PrefKey.hokkaido_doutou,
    detail: area_013020,
  },
  "013030": {
    key: "013030",
    representativeStationId: "17112",
    label: "紋別地方",
    pref: PrefKey.hokkaido_doutou,
    detail: area_013030,
  },
  "014010": {
    key: "014010",
    representativeStationId: "18273",
    label: "根室地方",
    pref: PrefKey.hokkaido_doutou,
    detail: area_014010,
  },
  "014020": {
    key: "014020",
    representativeStationId: "19432",
    label: "釧路地方",
    pref: PrefKey.hokkaido_doutou,
    detail: area_014020,
  },
  "014030": {
    key: "014030",
    representativeStationId: "20432",
    label: "十勝地方",
    pref: PrefKey.hokkaido_doutou,
    detail: area_014030,
  },
  "015010": {
    key: "015010",
    representativeStationId: "21323",
    label: "胆振地方",
    pref: PrefKey.hokkaido_douou,
    detail: area_015010,
  },
  "015020": {
    key: "015020",
    representativeStationId: "22327",
    label: "日高地方",
    pref: PrefKey.hokkaido_douou,
    detail: area_015020,
  },
  "016010": {
    key: "016010",
    representativeStationId: "14163",
    label: "石狩地方",
    pref: PrefKey.hokkaido_douou,
    detail: area_016010,
  },
  "016020": {
    key: "016020",
    representativeStationId: "15356",
    label: "空知地方",
    pref: PrefKey.hokkaido_douou,
    detail: area_016020,
  },
  "016030": {
    key: "016030",
    representativeStationId: "16217",
    label: "後志地方",
    pref: PrefKey.hokkaido_douou,
    detail: area_016030,
  },
  "017010": {
    key: "017010",
    representativeStationId: "23232",
    label: "渡島地方",
    pref: PrefKey.hokkaido_dounan,
    detail: area_017010,
  },
  "017020": {
    key: "017020",
    representativeStationId: "24217",
    label: "檜山地方",
    pref: PrefKey.hokkaido_dounan,
    detail: area_017020,
  },
  "020010": {
    key: "020010",
    representativeStationId: "31312",
    label: "津軽",
    pref: PrefKey.aomori,
    detail: area_020010,
  },
  "020020": {
    key: "020020",
    representativeStationId: "31111",
    label: "下北",
    pref: PrefKey.aomori,
    detail: area_020020,
  },
  "020030": {
    key: "020030",
    representativeStationId: "31602",
    label: "三八上北",
    pref: PrefKey.aomori,
    detail: area_020030,
  },
  "030010": {
    key: "030010",
    representativeStationId: "33431",
    label: "内陸",
    pref: PrefKey.iwate,
    detail: area_030010,
  },
  "030020": {
    key: "030020",
    representativeStationId: "33472",
    label: "沿岸北部",
    pref: PrefKey.iwate,
    detail: area_030020,
  },
  "030030": {
    key: "030030",
    representativeStationId: "33877",
    label: "沿岸南部",
    pref: PrefKey.iwate,
    detail: area_030030,
  },
  "040010": {
    key: "040010",
    representativeStationId: "34392",
    label: "東部",
    pref: PrefKey.miyagi,
    detail: area_040010,
  },
  "040020": {
    key: "040020",
    representativeStationId: "34461",
    label: "西部",
    pref: PrefKey.miyagi,
    detail: area_040020,
  },
  "050010": {
    key: "050010",
    representativeStationId: "32402",
    label: "沿岸",
    pref: PrefKey.akita,
    detail: area_050010,
  },
  "050020": {
    key: "050020",
    representativeStationId: "32126",
    label: "内陸",
    pref: PrefKey.akita,
    detail: area_050020,
  },
  "060010": {
    key: "060010",
    representativeStationId: "35426",
    label: "村山",
    pref: PrefKey.yamagata,
    detail: area_060010,
  },
  "060020": {
    key: "060020",
    representativeStationId: "35552",
    label: "置賜",
    pref: PrefKey.yamagata,
    detail: area_060020,
  },
  "060030": {
    key: "060030",
    representativeStationId: "35052",
    label: "庄内",
    pref: PrefKey.yamagata,
    detail: area_060030,
  },
  "060040": {
    key: "060040",
    representativeStationId: "35162",
    label: "最上",
    pref: PrefKey.yamagata,
    detail: area_060040,
  },
  "070010": {
    key: "070010",
    representativeStationId: "36127",
    label: "中通り",
    pref: PrefKey.fukushima,
    detail: area_070010,
  },
  "070020": {
    key: "070020",
    representativeStationId: "36846",
    label: "浜通り",
    pref: PrefKey.fukushima,
    detail: area_070020,
  },
  "070030": {
    key: "070030",
    representativeStationId: "36361",
    label: "会津",
    pref: PrefKey.fukushima,
    detail: area_070030,
  },
  "080010": {
    key: "080010",
    representativeStationId: "40201",
    label: "北部",
    pref: PrefKey.ibaraki,
    detail: area_080010,
  },
  "080020": {
    key: "080020",
    representativeStationId: "40341",
    label: "南部",
    pref: PrefKey.ibaraki,
    detail: area_080020,
  },
  "090010": {
    key: "090010",
    representativeStationId: "41277",
    label: "南部",
    pref: PrefKey.tochigi,
    detail: area_090010,
  },
  "090020": {
    key: "090020",
    representativeStationId: "41141",
    label: "北部",
    pref: PrefKey.tochigi,
    detail: area_090020,
  },
} satisfies AreaMap;

export const AREA_LIST = Object.keys(AreaKey) as AreaValue[];

export function getAreasInPref(prefKey: PrefValue): AreaMeta[] {
  return Object.values(AreaKey).filter(
    (area) => area.pref === PrefKey[prefKey]
  );
}

export const AREA_REPRESENTATIVE_STATIONS: Record<AreaValue, string> = Object.fromEntries(
  Object.entries(AreaKey).map(([k, v]) => [k, v.representativeStationId])
) as Record<AreaValue, string>;
