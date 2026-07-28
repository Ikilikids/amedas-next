import { RegionKey, RegionMeta } from "./region";

export type PrefMeta = {
  code: string;
  label: string;
  region: RegionMeta;
};

type PrefMap = Record<string, PrefMeta>;

export const PrefKey = {
  // ===== 北海道 =====
  hokkaido_souya: {
    code: "11",
    label: "北海道(宗谷地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_kamikawa: {
    code: "12",
    label: "北海道(上川地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_rumoi: {
    code: "13",
    label: "北海道(留萌地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_ishikari: {
    code: "14",
    label: "北海道(石狩地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_sorachi: {
    code: "15",
    label: "北海道(空知地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_shiribeshi: {
    code: "16",
    label: "北海道(後志地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_okhotsk: {
    code: "17",
    label: "北海道(オホーツク地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_nemuro: {
    code: "18",
    label: "北海道(根室地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_kushiro: {
    code: "19",
    label: "北海道(釧路地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_tokachi: {
    code: "20",
    label: "北海道(十勝地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_iburi: {
    code: "21",
    label: "北海道(胆振地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_hidaka: {
    code: "22",
    label: "北海道(日高地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_oshima: {
    code: "23",
    label: "北海道(渡島地方)",
    region: RegionKey.hokkaido,
  },
  hokkaido_hiyama: {
    code: "24",
    label: "北海道(檜山地方)",
    region: RegionKey.hokkaido,
  },

  // ===== 東北 =====
  aomori: { code: "31", label: "青森県", region: RegionKey.tohoku },
  akita: { code: "32", label: "秋田県", region: RegionKey.tohoku },
  iwate: { code: "33", label: "岩手県", region: RegionKey.tohoku },
  miyagi: { code: "34", label: "宮城県", region: RegionKey.tohoku },
  yamagata: { code: "35", label: "山形県", region: RegionKey.tohoku },
  fukushima: { code: "36", label: "福島県", region: RegionKey.tohoku },

  // ===== 関東 =====
  ibaraki: { code: "40", label: "茨城県", region: RegionKey.kanto },
  tochigi: { code: "41", label: "栃木県", region: RegionKey.kanto },
  gunma: { code: "42", label: "群馬県", region: RegionKey.kanto },
  saitama: { code: "43", label: "埼玉県", region: RegionKey.kanto },
  tokyo: { code: "44", label: "東京都", region: RegionKey.kanto },
  chiba: { code: "45", label: "千葉県", region: RegionKey.kanto },
  kanagawa: { code: "46", label: "神奈川県", region: RegionKey.kanto },

  // ===== 中部 =====
  nagano: { code: "48", label: "長野県", region: RegionKey.chubu },
  yamanashi: { code: "49", label: "山梨県", region: RegionKey.chubu },
  shizuoka: { code: "50", label: "静岡県", region: RegionKey.chubu },
  aichi: { code: "51", label: "愛知県", region: RegionKey.chubu },
  gifu: { code: "52", label: "岐阜県", region: RegionKey.chubu },
  mie: { code: "53", label: "三重県", region: RegionKey.chubu },

  // ===== 北陸 =====
  niigata: { code: "54", label: "新潟県", region: RegionKey.hokuriku },
  toyama: { code: "55", label: "富山県", region: RegionKey.hokuriku },
  ishikawa: { code: "56", label: "石川県", region: RegionKey.hokuriku },
  fukui: { code: "57", label: "福井県", region: RegionKey.hokuriku },

  // ===== 近畿 =====
  shiga: { code: "60", label: "滋賀県", region: RegionKey.kinki },
  kyoto: { code: "61", label: "京都府", region: RegionKey.kinki },
  osaka: { code: "62", label: "大阪府", region: RegionKey.kinki },
  hyogo: { code: "63", label: "兵庫県", region: RegionKey.kinki },
  nara: { code: "64", label: "奈良県", region: RegionKey.kinki },
  wakayama: { code: "65", label: "和歌山県", region: RegionKey.kinki },

  // ===== 中国 =====
  okayama: { code: "66", label: "岡山県", region: RegionKey.chugoku },
  hiroshima: { code: "67", label: "広島県", region: RegionKey.chugoku },
  shimane: { code: "68", label: "島根県", region: RegionKey.chugoku },
  tottori: { code: "69", label: "鳥取県", region: RegionKey.chugoku },
  yamaguchi: { code: "81", label: "山口県", region: RegionKey.chugoku },

  // ===== 四国 =====
  tokushima: { code: "71", label: "徳島県", region: RegionKey.shikoku },
  kagawa: { code: "72", label: "香川県", region: RegionKey.shikoku },
  ehime: { code: "73", label: "愛媛県", region: RegionKey.shikoku },
  kochi: { code: "74", label: "高知県", region: RegionKey.shikoku },

  // ===== 九州 =====
  fukuoka: { code: "82", label: "福岡県", region: RegionKey.kyushu },
  oita: { code: "83", label: "大分県", region: RegionKey.kyushu },
  nagasaki: { code: "84", label: "長崎県", region: RegionKey.kyushu },
  saga: { code: "85", label: "佐賀県", region: RegionKey.kyushu },
  kumamoto: { code: "86", label: "熊本県", region: RegionKey.kyushu },
  miyazaki: { code: "87", label: "宮崎県", region: RegionKey.kyushu },
  kagoshima: { code: "88", label: "鹿児島県", region: RegionKey.kyushu },

  // ===== 沖縄 =====
  okinawa_main: {
    code: "91",
    label: "沖縄県(本島地方)",
    region: RegionKey.okinawa,
  },
  okinawa_daito: {
    code: "92",
    label: "沖縄県(大東地方)",
    region: RegionKey.okinawa,
  },
  okinawa_miyako: {
    code: "93",
    label: "沖縄県(宮古地方)",
    region: RegionKey.okinawa,
  },
  okinawa_yaeyama: {
    code: "94",
    label: "沖縄県(八重山地方)",
    region: RegionKey.okinawa,
  },
} as const satisfies PrefMap;

// ==============================
// 型
// ==============================
export type PrefValue = keyof typeof PrefKey;

// ==============================
// utils
// ==============================
export const PREF_LIST = Object.keys(PrefKey) as PrefValue[];

export function getPrefMeta(pref: PrefValue): PrefMeta {
  return PrefKey[pref];
}

export function getRegionMeta(prefCode: string): RegionMeta {
  const pref: PrefMeta = Object.values(PrefKey).find(
    (p) => p.code === prefCode
  );
  return pref.region;
}
