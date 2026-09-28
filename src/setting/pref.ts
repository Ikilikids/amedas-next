import { RegionKey, RegionMeta, RegionValue } from "./region";
import { ClimateArticleData } from "../data/types";
import {
  hokkaidoDououData,
  hokkaidoDounanData,
  hokkaidoDoutouData,
  hokkaidoDouhokuData,
} from "../data/prefs/1_hokkaido";
import {
  aomoriData,
  akitaData,
  iwateData,
  miyagiData,
  yamagataData,
  fukushimaData,
} from "../data/prefs/2_tohoku";
import {
  tokyoData,
  kanagawaData,
  saitamaData,
  chibaData,
  ibarakiData,
  tochigiData,
  gunmaData,
} from "../data/prefs/3_kanto";
import {
  niigataData,
  toyamaData,
  ishikawaData,
  fukuiData,
} from "../data/prefs/4_hokuriku";
import {
  naganoData,
  yamanashiData,
  shizuokaData,
  aichiData,
  gifuData,
  mieData,
} from "../data/prefs/5_chubu";
import {
  shigaData,
  kyotoData,
  osakaData,
  hyogoData,
  naraData,
  wakayamaData,
} from "../data/prefs/6_kinki";
import {
  okayamaData,
  hiroshimaData,
  shimaneData,
  tottoriData,
  yamaguchiData,
} from "../data/prefs/7_chugoku";
import {
  tokushimaData,
  kagawaData,
  ehimeData,
  kochiData,
} from "../data/prefs/8_shikoku";
import {
  fukuokaData,
  oitaData,
  nagasakiData,
  sagaData,
  kumamotoData,
  miyazakiData,
  kagoshimaData,
} from "../data/prefs/9_kyushu";
import {
  okinawaMainData,
  okinawaDaitoData,
  okinawaMiyakoData,
  okinawaYaeyamaData,
} from "../data/prefs/10_okinawa";


export type { ClimateArticleData };

// ==============================
// 型
// ==============================
export type PrefValue =
  | "hokkaido_douou"
  | "hokkaido_dounan"
  | "hokkaido_doutou"
  | "hokkaido_douhoku"
  | "aomori"
  | "akita"
  | "iwate"
  | "miyagi"
  | "yamagata"
  | "fukushima"
  | "ibaraki"
  | "tochigi"
  | "gunma"
  | "saitama"
  | "tokyo"
  | "chiba"
  | "kanagawa"
  | "nagano"
  | "yamanashi"
  | "shizuoka"
  | "aichi"
  | "gifu"
  | "mie"
  | "niigata"
  | "toyama"
  | "ishikawa"
  | "fukui"
  | "shiga"
  | "kyoto"
  | "osaka"
  | "hyogo"
  | "nara"
  | "wakayama"
  | "okayama"
  | "hiroshima"
  | "shimane"
  | "tottori"
  | "yamaguchi"
  | "tokushima"
  | "kagawa"
  | "ehime"
  | "kochi"
  | "fukuoka"
  | "oita"
  | "nagasaki"
  | "saga"
  | "kumamoto"
  | "miyazaki"
  | "kagoshima"
  | "okinawa_main"
  | "okinawa_daito"
  | "okinawa_miyako"
  | "okinawa_yaeyama";



export type PrefMeta = {
  key: PrefValue;
  code: string[];
  label: string;
  region: RegionMeta;
  detail?: ClimateArticleData;
  representativeStationId?: string;
};

type PrefMap = Record<PrefValue, PrefMeta>;

export const PrefKey: PrefMap = {
  // ===== 北海道（4区分に集約） =====
  hokkaido_douou: {
    key: "hokkaido_douou", code: ["14", "15", "16", "21", "22"],
    label: "道央",
    region: RegionKey.hokkaido,
    detail: hokkaidoDououData,
    representativeStationId: "14163", // 札幌
  },
  hokkaido_dounan: {
    key: "hokkaido_dounan", code: ["23", "24"],
    label: "道南",
    region: RegionKey.hokkaido,
    detail: hokkaidoDounanData,
    representativeStationId: "23232", // 函館
  },
  hokkaido_doutou: {
    key: "hokkaido_doutou", code: ["17", "18", "19", "20"],
    label: "道東",
    region: RegionKey.hokkaido,
    detail: hokkaidoDoutouData,
    representativeStationId: "20432", // 帯広
  },
  hokkaido_douhoku: {
    key: "hokkaido_douhoku", code: ["11", "12", "13"],
    label: "道北",
    region: RegionKey.hokkaido,
    detail: hokkaidoDouhokuData,
    representativeStationId: "12442", // 旭川
  },

  // ===== 東北 =====
  aomori: { key: "aomori", code: ["31"], label: "青森県", region: RegionKey.tohoku, detail: aomoriData },
  akita: { key: "akita", code: ["32"], label: "秋田県", region: RegionKey.tohoku, detail: akitaData },
  iwate: { key: "iwate", code: ["33"], label: "岩手県", region: RegionKey.tohoku, detail: iwateData },
  miyagi: { key: "miyagi", code: ["34"], label: "宮城県", region: RegionKey.tohoku, detail: miyagiData },
  yamagata: { key: "yamagata", code: ["35"], label: "山形県", region: RegionKey.tohoku, detail: yamagataData },
  fukushima: { key: "fukushima", code: ["36"], label: "福島県", region: RegionKey.tohoku, detail: fukushimaData },

  // ===== 関東 =====
  ibaraki: { key: "ibaraki", code: ["40"], label: "茨城県", region: RegionKey.kanto, detail: ibarakiData },
  tochigi: { key: "tochigi", code: ["41"], label: "栃木県", region: RegionKey.kanto, detail: tochigiData },
  gunma: { key: "gunma", code: ["42"], label: "群馬県", region: RegionKey.kanto, detail: gunmaData },
  saitama: { key: "saitama", code: ["43"], label: "埼玉県", region: RegionKey.kanto, detail: saitamaData },
  tokyo: { key: "tokyo", code: ["44"], label: "東京都", region: RegionKey.kanto, detail: tokyoData },
  chiba: { key: "chiba", code: ["45"], label: "千葉県", region: RegionKey.kanto, detail: chibaData },
  kanagawa: { key: "kanagawa", code: ["46"], label: "神奈川県", region: RegionKey.kanto, detail: kanagawaData },

  // ===== 中部 =====
  nagano: { key: "nagano", code: ["48"], label: "長野県", region: RegionKey.chubu, detail: naganoData },
  yamanashi: { key: "yamanashi", code: ["49"], label: "山梨県", region: RegionKey.chubu, detail: yamanashiData },
  shizuoka: { key: "shizuoka", code: ["50"], label: "静岡県", region: RegionKey.chubu, detail: shizuokaData },
  aichi: { key: "aichi", code: ["51"], label: "愛知県", region: RegionKey.chubu, detail: aichiData },
  gifu: { key: "gifu", code: ["52"], label: "岐阜県", region: RegionKey.chubu, detail: gifuData },
  mie: { key: "mie", code: ["53"], label: "三重県", region: RegionKey.chubu, detail: mieData },

  // ===== 北陸 =====
  niigata: { key: "niigata", code: ["54"], label: "新潟県", region: RegionKey.hokuriku, detail: niigataData },
  toyama: { key: "toyama", code: ["55"], label: "富山県", region: RegionKey.hokuriku, detail: toyamaData },
  ishikawa: { key: "ishikawa", code: ["56"], label: "石川県", region: RegionKey.hokuriku, detail: ishikawaData },
  fukui: { key: "fukui", code: ["57"], label: "福井県", region: RegionKey.hokuriku, detail: fukuiData },

  // ===== 近畿 =====
  shiga: { key: "shiga", code: ["60"], label: "滋賀県", region: RegionKey.kinki, detail: shigaData },
  kyoto: { key: "kyoto", code: ["61"], label: "京都府", region: RegionKey.kinki, detail: kyotoData },
  osaka: { key: "osaka", code: ["62"], label: "大阪府", region: RegionKey.kinki, detail: osakaData },
  hyogo: { key: "hyogo", code: ["63"], label: "兵庫県", region: RegionKey.kinki, detail: hyogoData },
  nara: { key: "nara", code: ["64"], label: "奈良県", region: RegionKey.kinki, detail: naraData },
  wakayama: { key: "wakayama", code: ["65"], label: "和歌山県", region: RegionKey.kinki, detail: wakayamaData },

  // ===== 中国 =====
  okayama: { key: "okayama", code: ["66"], label: "岡山県", region: RegionKey.chugoku, detail: okayamaData },
  hiroshima: { key: "hiroshima", code: ["67"], label: "広島県", region: RegionKey.chugoku, detail: hiroshimaData },
  shimane: { key: "shimane", code: ["68"], label: "島根県", region: RegionKey.chugoku, detail: shimaneData },
  tottori: { key: "tottori", code: ["69"], label: "鳥取県", region: RegionKey.chugoku, detail: tottoriData },
  yamaguchi: { key: "yamaguchi", code: ["81"], label: "山口県", region: RegionKey.chugoku, detail: yamaguchiData },

  // ===== 四国 =====
  tokushima: { key: "tokushima", code: ["71"], label: "徳島県", region: RegionKey.shikoku, detail: tokushimaData },
  kagawa: { key: "kagawa", code: ["72"], label: "香川県", region: RegionKey.shikoku, detail: kagawaData },
  ehime: { key: "ehime", code: ["73"], label: "愛媛県", region: RegionKey.shikoku, detail: ehimeData },
  kochi: { key: "kochi", code: ["74"], label: "高知県", region: RegionKey.shikoku, detail: kochiData },

  // ===== 九州 =====
  fukuoka: { key: "fukuoka", code: ["82"], label: "福岡県", region: RegionKey.kyushu, detail: fukuokaData },
  oita: { key: "oita", code: ["83"], label: "大分県", region: RegionKey.kyushu, detail: oitaData },
  nagasaki: { key: "nagasaki", code: ["84"], label: "長崎県", region: RegionKey.kyushu, detail: nagasakiData },
  saga: { key: "saga", code: ["85"], label: "佐賀県", region: RegionKey.kyushu, detail: sagaData },
  kumamoto: { key: "kumamoto", code: ["86"], label: "熊本県", region: RegionKey.kyushu, detail: kumamotoData },
  miyazaki: { key: "miyazaki", code: ["87"], label: "宮崎県", region: RegionKey.kyushu, detail: miyazakiData },
  kagoshima: { key: "kagoshima", code: ["88"], label: "鹿児島県", region: RegionKey.kyushu, detail: kagoshimaData },

  // ===== 沖縄 =====
  okinawa_main: {
    key: "okinawa_main", code: ["91"],
    label: "沖縄県(本島地方)",
    region: RegionKey.okinawa,
    detail: okinawaMainData,
    representativeStationId: "91197", // 那覇
  },
  okinawa_daito: {
    key: "okinawa_daito", code: ["92"],
    label: "沖縄県(大東地方)",
    region: RegionKey.okinawa,
    detail: okinawaDaitoData,
    representativeStationId: "92011", // 南大東島
  },
  okinawa_miyako: {
    key: "okinawa_miyako", code: ["93"],
    label: "沖縄県(宮古地方)",
    region: RegionKey.okinawa,
    detail: okinawaMiyakoData,
    representativeStationId: "93041", // 宮古島
  },
  okinawa_yaeyama: {
    key: "okinawa_yaeyama", code: ["94"],
    label: "沖縄県(八重山地方)",
    region: RegionKey.okinawa,
    detail: okinawaYaeyamaData,
    representativeStationId: "94081", // 石垣島
  },
};

// ==============================
// utils
// ==============================
export const PREF_LIST = Object.keys(PrefKey) as PrefValue[];

export function getPrefsInRegion(regionKey: RegionValue): PrefMeta[] {
  return Object.values(PrefKey).filter(
    (pref) => pref.region === RegionKey[regionKey]
  );
}

