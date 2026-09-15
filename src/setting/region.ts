import { ClimateArticleData } from "../data/types";
export type { ClimateArticleData };
import { hokkaidoData } from "../data/regions/hokkaido";
import { tohokuData } from "../data/regions/tohoku";
import { kantoData } from "../data/regions/kanto";
import { hokurikuData } from "../data/regions/hokuriku";
import { chubuData } from "../data/regions/chubu";
import { kinkiData } from "../data/regions/kinki";
import { chugokuData } from "../data/regions/chugoku";
import { shikokuData } from "../data/regions/shikoku";
import { kyushuData } from "../data/regions/kyushu";
import { okinawaData } from "../data/regions/okinawa";



// ==============================
// 型
// ==============================
export type RegionMeta = {
  label: string;
  colorBase: string;
  colorStrong: string;
  detail: ClimateArticleData;
};

type RegionMap = Record<string, RegionMeta>;

// ==============================
// 定義（本体）
// ==============================
export const RegionKey = {
  hokkaido: {
    label: "北海道",
    colorBase: "#8e86d4b3",
    colorStrong: "#493acf",
    detail: hokkaidoData,
  },

  tohoku: {
    label: "東北",
    colorBase: "#32bfccb3",
    colorStrong: "#3db1d1",
    detail: tohokuData,
  },

  kanto: {
    label: "関東",
    colorBase: "#6dbd8bb3",
    colorStrong: "#2eb160",
    detail: kantoData,
  },

  hokuriku: {
    label: "北陸",
    colorBase: "#c8c850b3",
    colorStrong: "#a0a014",
    detail: hokurikuData,
  },

  chubu: {
    label: "中部",
    colorBase: "#99cc69b3",
    colorStrong: "#82cc3c",
    detail: chubuData,
  },

  kinki: {
    label: "近畿",
    colorBase: "#ecad72b3",
    colorStrong: "#e98e3a",
    detail: kinkiData,
  },

  chugoku: {
    label: "中国",
    colorBase: "#c575ddb3",
    colorStrong: "#b741db",
    detail: chugokuData,
  },

  shikoku: {
    label: "四国",
    colorBase: "#e982bbb3",
    colorStrong: "#e4459c",
    detail: shikokuData,
  },

  kyushu: {
    label: "九州",
    colorBase: "#ec7e7eb3",
    colorStrong: "#f03a3a",
    detail: kyushuData,
  },

  okinawa: {
    label: "沖縄",
    colorBase: "#c8a0a0b3",
    colorStrong: "#c86478",
    detail: okinawaData,
  },
} as const satisfies RegionMap;

// ==============================
// 型（key系）
// ==============================
export type RegionValue = keyof typeof RegionKey;
export type Region = (typeof RegionKey)[RegionValue];

// ==============================
// utils
// ==============================
export const REGION_LIST = Object.keys(RegionKey) as RegionValue[];

export function getRegionMeta(region: RegionValue): Region {
  return RegionKey[region];
}

