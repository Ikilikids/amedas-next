import { PrefKey, PrefMeta, PrefValue } from "./pref";
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
representativeStationId: string;
};

type AreaMap = Record<AreaValue, AreaMeta>;

export const AreaKey = {
  "100010": {
    key: "100010",
    representativeStationId: "42251",
    label: "南部",
    pref: PrefKey.gunma,
  },
  "100020": {
    key: "100020",
    representativeStationId: "42091",
    label: "北部",
    pref: PrefKey.gunma,
  },
  "110010": {
    key: "110010",
    representativeStationId: "43241",
    label: "南部",
    pref: PrefKey.saitama,
  },
  "110020": {
    key: "110020",
    representativeStationId: "43056",
    label: "北部",
    pref: PrefKey.saitama,
  },
  "110030": {
    key: "110030",
    representativeStationId: "43156",
    label: "秩父地方",
    pref: PrefKey.saitama,
  },
  "120010": {
    key: "120010",
    representativeStationId: "45212",
    label: "北西部",
    pref: PrefKey.chiba,
  },
  "120020": {
    key: "120020",
    representativeStationId: "45148",
    label: "北東部",
    pref: PrefKey.chiba,
  },
  "120030": {
    key: "120030",
    representativeStationId: "45401",
    label: "南部",
    pref: PrefKey.chiba,
  },
  "130010": {
    key: "130010",
    representativeStationId: "44132",
    label: "東京地方",
    pref: PrefKey.tokyo,
  },
  "130020": {
    key: "130020",
    representativeStationId: "44172",
    label: "伊豆諸島北部",
    pref: PrefKey.tokyo,
  },
  "130030": {
    key: "130030",
    representativeStationId: "44263",
    label: "伊豆諸島南部",
    pref: PrefKey.tokyo,
  },
  "130040": {
    key: "130040",
    representativeStationId: "44301",
    label: "小笠原諸島",
    pref: PrefKey.tokyo,
  },
  "140010": {
    key: "140010",
    representativeStationId: "46106",
    label: "東部",
    pref: PrefKey.kanagawa,
  },
  "140020": {
    key: "140020",
    representativeStationId: "46166",
    label: "西部",
    pref: PrefKey.kanagawa,
  },
  "150010": {
    key: "150010",
    representativeStationId: "54232",
    label: "下越",
    pref: PrefKey.niigata,
  },
  "150020": {
    key: "150020",
    representativeStationId: "54501",
    label: "中越",
    pref: PrefKey.niigata,
  },
  "150030": {
    key: "150030",
    representativeStationId: "54651",
    label: "上越",
    pref: PrefKey.niigata,
  },
  "150040": {
    key: "150040",
    representativeStationId: "54157",
    label: "佐渡",
    pref: PrefKey.niigata,
  },
  "160010": {
    key: "160010",
    representativeStationId: "55102",
    label: "東部",
    pref: PrefKey.toyama,
  },
  "160020": {
    key: "160020",
    representativeStationId: "55091",
    label: "西部",
    pref: PrefKey.toyama,
  },
  "170010": {
    key: "170010",
    representativeStationId: "56227",
    label: "加賀",
    pref: PrefKey.ishikawa,
  },
  "170020": {
    key: "170020",
    representativeStationId: "56052",
    label: "能登",
    pref: PrefKey.ishikawa,
  },
  "180010": {
    key: "180010",
    representativeStationId: "57066",
    label: "嶺北",
    pref: PrefKey.fukui,
  },
  "180020": {
    key: "180020",
    representativeStationId: "57248",
    label: "嶺南",
    pref: PrefKey.fukui,
  },
  "190010": {
    key: "190010",
    representativeStationId: "49142",
    label: "中・西部",
    pref: PrefKey.yamanashi,
  },
  "190020": {
    key: "190020",
    representativeStationId: "49251",
    label: "東部・富士五湖",
    pref: PrefKey.yamanashi,
  },
  "200010": {
    key: "200010",
    representativeStationId: "48156",
    label: "北部",
    pref: PrefKey.nagano,
  },
  "200020": {
    key: "200020",
    representativeStationId: "48361",
    label: "中部",
    pref: PrefKey.nagano,
  },
  "200030": {
    key: "200030",
    representativeStationId: "48767",
    label: "南部",
    pref: PrefKey.nagano,
  },
  "210010": {
    key: "210010",
    representativeStationId: "52586",
    label: "美濃地方",
    pref: PrefKey.gifu,
  },
  "210020": {
    key: "210020",
    representativeStationId: "52146",
    label: "飛騨地方",
    pref: PrefKey.gifu,
  },
  "220010": {
    key: "220010",
    representativeStationId: "50331",
    label: "中部",
    pref: PrefKey.shizuoka,
  },
  "220020": {
    key: "220020",
    representativeStationId: "50281",
    label: "伊豆",
    pref: PrefKey.shizuoka,
  },
  "220030": {
    key: "220030",
    representativeStationId: "50206",
    label: "東部",
    pref: PrefKey.shizuoka,
  },
  "220040": {
    key: "220040",
    representativeStationId: "50456",
    label: "西部",
    pref: PrefKey.shizuoka,
  },
  "230010": {
    key: "230010",
    representativeStationId: "51106",
    label: "西部",
    pref: PrefKey.aichi,
  },
  "230020": {
    key: "230020",
    representativeStationId: "51331",
    label: "東部",
    pref: PrefKey.aichi,
  },
  "240010": {
    key: "240010",
    representativeStationId: "53133",
    label: "北中部",
    pref: PrefKey.mie,
  },
  "240020": {
    key: "240020",
    representativeStationId: "53378",
    label: "南部",
    pref: PrefKey.mie,
  },
  "250010": {
    key: "250010",
    representativeStationId: "60216",
    label: "南部",
    pref: PrefKey.shiga,
  },
  "250020": {
    key: "250020",
    representativeStationId: "60131",
    label: "北部",
    pref: PrefKey.shiga,
  },
  "260010": {
    key: "260010",
    representativeStationId: "61286",
    label: "南部",
    pref: PrefKey.kyoto,
  },
  "260020": {
    key: "260020",
    representativeStationId: "61111",
    label: "北部",
    pref: PrefKey.kyoto,
  },
  "270000": {
    key: "270000",
    representativeStationId: "62078",
    label: "大阪府",
    pref: PrefKey.osaka,
  },
  "280010": {
    key: "280010",
    representativeStationId: "63518",
    label: "南部",
    pref: PrefKey.hyogo,
  },
  "280020": {
    key: "280020",
    representativeStationId: "63051",
    label: "北部",
    pref: PrefKey.hyogo,
  },
  "290010": {
    key: "290010",
    representativeStationId: "64036",
    label: "北部",
    pref: PrefKey.nara,
  },
  "290020": {
    key: "290020",
    representativeStationId: "64227",
    label: "南部",
    pref: PrefKey.nara,
  },
  "300010": {
    key: "300010",
    representativeStationId: "65042",
    label: "北部",
    pref: PrefKey.wakayama,
  },
  "300020": {
    key: "300020",
    representativeStationId: "65356",
    label: "南部",
    pref: PrefKey.wakayama,
  },
  "310010": {
    key: "310010",
    representativeStationId: "69122",
    label: "東部",
    pref: PrefKey.tottori,
  },
  "310020": {
    key: "310020",
    representativeStationId: "69076",
    label: "中・西部",
    pref: PrefKey.tottori,
  },
  "320010": {
    key: "320010",
    representativeStationId: "68132",
    label: "東部",
    pref: PrefKey.shimane,
  },
  "320020": {
    key: "320020",
    representativeStationId: "68376",
    label: "西部",
    pref: PrefKey.shimane,
  },
  "320030": {
    key: "320030",
    representativeStationId: "68022",
    label: "隠岐",
    pref: PrefKey.shimane,
  },
  "330010": {
    key: "330010",
    representativeStationId: "66408",
    label: "南部",
    pref: PrefKey.okayama,
  },
  "330020": {
    key: "330020",
    representativeStationId: "66186",
    label: "北部",
    pref: PrefKey.okayama,
  },
  "340010": {
    key: "340010",
    representativeStationId: "67437",
    label: "南部",
    pref: PrefKey.hiroshima,
  },
  "340020": {
    key: "340020",
    representativeStationId: "67116",
    label: "北部",
    pref: PrefKey.hiroshima,
  },
  "350010": {
    key: "350010",
    representativeStationId: "81428",
    label: "西部",
    pref: PrefKey.yamaguchi,
  },
  "350020": {
    key: "350020",
    representativeStationId: "81286",
    label: "中部",
    pref: PrefKey.yamaguchi,
  },
  "350030": {
    key: "350030",
    representativeStationId: "81481",
    label: "東部",
    pref: PrefKey.yamaguchi,
  },
  "350040": {
    key: "350040",
    representativeStationId: "81071",
    label: "北部",
    pref: PrefKey.yamaguchi,
  },
  "360010": {
    key: "360010",
    representativeStationId: "71106",
    label: "北部",
    pref: PrefKey.tokushima,
  },
  "360020": {
    key: "360020",
    representativeStationId: "71266",
    label: "南部",
    pref: PrefKey.tokushima,
  },
  "370000": {
    key: "370000",
    representativeStationId: "72086",
    label: "香川県",
    pref: PrefKey.kagawa,
  },
  "380010": {
    key: "380010",
    representativeStationId: "73166",
    label: "中予",
    pref: PrefKey.ehime,
  },
  "380020": {
    key: "380020",
    representativeStationId: "73136",
    label: "東予",
    pref: PrefKey.ehime,
  },
  "380030": {
    key: "380030",
    representativeStationId: "73442",
    label: "南予",
    pref: PrefKey.ehime,
  },
  "390010": {
    key: "390010",
    representativeStationId: "74182",
    label: "中部",
    pref: PrefKey.kochi,
  },
  "390020": {
    key: "390020",
    representativeStationId: "74372",
    label: "東部",
    pref: PrefKey.kochi,
  },
  "390030": {
    key: "390030",
    representativeStationId: "74516",
    label: "西部",
    pref: PrefKey.kochi,
  },
  "400010": {
    key: "400010",
    representativeStationId: "82182",
    label: "福岡地方",
    pref: PrefKey.fukuoka,
  },
  "400020": {
    key: "400020",
    representativeStationId: "82056",
    label: "北九州地方",
    pref: PrefKey.fukuoka,
  },
  "400030": {
    key: "400030",
    representativeStationId: "82136",
    label: "筑豊地方",
    pref: PrefKey.fukuoka,
  },
  "400040": {
    key: "400040",
    representativeStationId: "82306",
    label: "筑後地方",
    pref: PrefKey.fukuoka,
  },
  "410010": {
    key: "410010",
    representativeStationId: "85142",
    label: "南部",
    pref: PrefKey.saga,
  },
  "410020": {
    key: "410020",
    representativeStationId: "85116",
    label: "北部",
    pref: PrefKey.saga,
  },
  "420010": {
    key: "420010",
    representativeStationId: "84496",
    label: "南部",
    pref: PrefKey.nagasaki,
  },
  "420020": {
    key: "420020",
    representativeStationId: "84266",
    label: "北部",
    pref: PrefKey.nagasaki,
  },
  "420030": {
    key: "420030",
    representativeStationId: "84072",
    label: "壱岐・対馬",
    pref: PrefKey.nagasaki,
  },
  "420040": {
    key: "420040",
    representativeStationId: "84536",
    label: "五島",
    pref: PrefKey.nagasaki,
  },
  "430010": {
    key: "430010",
    representativeStationId: "86141",
    label: "熊本地方",
    pref: PrefKey.kumamoto,
  },
  "430020": {
    key: "430020",
    representativeStationId: "86111",
    label: "阿蘇地方",
    pref: PrefKey.kumamoto,
  },
  "430030": {
    key: "430030",
    representativeStationId: "86491",
    label: "天草・芦北地方",
    pref: PrefKey.kumamoto,
  },
  "430040": {
    key: "430040",
    representativeStationId: "86467",
    label: "球磨地方",
    pref: PrefKey.kumamoto,
  },
  "440010": {
    key: "440010",
    representativeStationId: "83216",
    label: "中部",
    pref: PrefKey.oita,
  },
  "440020": {
    key: "440020",
    representativeStationId: "83051",
    label: "北部",
    pref: PrefKey.oita,
  },
  "440030": {
    key: "440030",
    representativeStationId: "83137",
    label: "西部",
    pref: PrefKey.oita,
  },
  "440040": {
    key: "440040",
    representativeStationId: "83401",
    label: "南部",
    pref: PrefKey.oita,
  },
  "450010": {
    key: "450010",
    representativeStationId: "87376",
    label: "南部平野部",
    pref: PrefKey.miyazaki,
  },
  "450020": {
    key: "450020",
    representativeStationId: "87141",
    label: "北部平野部",
    pref: PrefKey.miyazaki,
  },
  "450030": {
    key: "450030",
    representativeStationId: "87426",
    label: "南部山沿い",
    pref: PrefKey.miyazaki,
  },
  "450040": {
    key: "450040",
    representativeStationId: "87041",
    label: "北部山沿い",
    pref: PrefKey.miyazaki,
  },
  "460010": {
    key: "460010",
    representativeStationId: "88317",
    label: "薩摩地方",
    pref: PrefKey.kagoshima,
  },
  "460020": {
    key: "460020",
    representativeStationId: "88442",
    label: "大隅地方",
    pref: PrefKey.kagoshima,
  },
  "460030": {
    key: "460030",
    representativeStationId: "88612",
    label: "種子島・屋久島地方",
    pref: PrefKey.kagoshima,
  },
  "460040": {
    key: "460040",
    representativeStationId: "88837",
    label: "奄美地方",
    pref: PrefKey.kagoshima,
  },
  "471010": {
    key: "471010",
    representativeStationId: "91197",
    label: "本島中南部",
    pref: PrefKey.okinawa_main,
  },
  "471020": {
    key: "471020",
    representativeStationId: "91107",
    label: "本島北部",
    pref: PrefKey.okinawa_main,
  },
  "471030": {
    key: "471030",
    representativeStationId: "91146",
    label: "久米島",
    pref: PrefKey.okinawa_main,
  },
  "472000": {
    key: "472000",
    representativeStationId: "92011",
    label: "大東島地方",
    pref: PrefKey.okinawa_daito,
  },
  "473000": {
    key: "473000",
    representativeStationId: "93041",
    label: "宮古島地方",
    pref: PrefKey.okinawa_miyako,
  },
  "474010": {
    key: "474010",
    representativeStationId: "94081",
    label: "石垣島地方",
    pref: PrefKey.okinawa_yaeyama,
  },
  "474020": {
    key: "474020",
    representativeStationId: "94017",
    label: "与那国島地方",
    pref: PrefKey.okinawa_yaeyama,
  },
  "011000": {
    key: "011000",
    representativeStationId: "11016",
    label: "宗谷地方",
    pref: PrefKey.hokkaido_douhoku,
  },
  "012010": {
    key: "012010",
    representativeStationId: "12442",
    label: "上川地方",
    pref: PrefKey.hokkaido_douhoku,
  },
  "012020": {
    key: "012020",
    representativeStationId: "13277",
    label: "留萌地方",
    pref: PrefKey.hokkaido_douhoku,
  },
  "013010": {
    key: "013010",
    representativeStationId: "17341",
    label: "網走地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "013020": {
    key: "013020",
    representativeStationId: "17521",
    label: "北見地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "013030": {
    key: "013030",
    representativeStationId: "17112",
    label: "紋別地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "014010": {
    key: "014010",
    representativeStationId: "18273",
    label: "根室地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "014020": {
    key: "014020",
    representativeStationId: "19432",
    label: "釧路地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "014030": {
    key: "014030",
    representativeStationId: "20432",
    label: "十勝地方",
    pref: PrefKey.hokkaido_doutou,
  },
  "015010": {
    key: "015010",
    representativeStationId: "21323",
    label: "胆振地方",
    pref: PrefKey.hokkaido_douou,
  },
  "015020": {
    key: "015020",
    representativeStationId: "22327",
    label: "日高地方",
    pref: PrefKey.hokkaido_douou,
  },
  "016010": {
    key: "016010",
    representativeStationId: "14163",
    label: "石狩地方",
    pref: PrefKey.hokkaido_douou,
  },
  "016020": {
    key: "016020",
    representativeStationId: "15356",
    label: "空知地方",
    pref: PrefKey.hokkaido_douou,
  },
  "016030": {
    key: "016030",
    representativeStationId: "16217",
    label: "後志地方",
    pref: PrefKey.hokkaido_douou,
  },
  "017010": {
    key: "017010",
    representativeStationId: "23232",
    label: "渡島地方",
    pref: PrefKey.hokkaido_dounan,
  },
  "017020": {
    key: "017020",
    representativeStationId: "24217",
    label: "檜山地方",
    pref: PrefKey.hokkaido_dounan,
  },
  "020010": {
    key: "020010",
    representativeStationId: "31312",
    label: "津軽",
    pref: PrefKey.aomori,
  },
  "020020": {
    key: "020020",
    representativeStationId: "31111",
    label: "下北",
    pref: PrefKey.aomori,
  },
  "020030": {
    key: "020030",
    representativeStationId: "31602",
    label: "三八上北",
    pref: PrefKey.aomori,
  },
  "030010": {
    key: "030010",
    representativeStationId: "33431",
    label: "内陸",
    pref: PrefKey.iwate,
  },
  "030020": {
    key: "030020",
    representativeStationId: "33472",
    label: "沿岸北部",
    pref: PrefKey.iwate,
  },
  "030030": {
    key: "030030",
    representativeStationId: "33877",
    label: "沿岸南部",
    pref: PrefKey.iwate,
  },
  "040010": {
    key: "040010",
    representativeStationId: "34392",
    label: "東部",
    pref: PrefKey.miyagi,
  },
  "040020": {
    key: "040020",
    representativeStationId: "34461",
    label: "西部",
    pref: PrefKey.miyagi,
  },
  "050010": {
    key: "050010",
    representativeStationId: "32402",
    label: "沿岸",
    pref: PrefKey.akita,
  },
  "050020": {
    key: "050020",
    representativeStationId: "32126",
    label: "内陸",
    pref: PrefKey.akita,
  },
  "060010": {
    key: "060010",
    representativeStationId: "35426",
    label: "村山",
    pref: PrefKey.yamagata,
  },
  "060020": {
    key: "060020",
    representativeStationId: "35552",
    label: "置賜",
    pref: PrefKey.yamagata,
  },
  "060030": {
    key: "060030",
    representativeStationId: "35052",
    label: "庄内",
    pref: PrefKey.yamagata,
  },
  "060040": {
    key: "060040",
    representativeStationId: "35162",
    label: "最上",
    pref: PrefKey.yamagata,
  },
  "070010": {
    key: "070010",
    representativeStationId: "36127",
    label: "中通り",
    pref: PrefKey.fukushima,
  },
  "070020": {
    key: "070020",
    representativeStationId: "36846",
    label: "浜通り",
    pref: PrefKey.fukushima,
  },
  "070030": {
    key: "070030",
    representativeStationId: "36361",
    label: "会津",
    pref: PrefKey.fukushima,
  },
  "080010": {
    key: "080010",
    representativeStationId: "40201",
    label: "北部",
    pref: PrefKey.ibaraki,
  },
  "080020": {
    key: "080020",
    representativeStationId: "40341",
    label: "南部",
    pref: PrefKey.ibaraki,
  },
  "090010": {
    key: "090010",
    representativeStationId: "41277",
    label: "南部",
    pref: PrefKey.tochigi,
  },
  "090020": {
    key: "090020",
    representativeStationId: "41141",
    label: "北部",
    pref: PrefKey.tochigi,
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
