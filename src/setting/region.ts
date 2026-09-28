import { ClimateArticleData } from "../data/types";
export type { ClimateArticleData };
import { hokkaidoData } from "../data/regions/1_hokkaido";
import { tohokuData } from "../data/regions/2_tohoku";
import { kantoData } from "../data/regions/3_kanto";
import { hokurikuData } from "../data/regions/4_hokuriku";
import { chubuData } from "../data/regions/5_chubu";
import { kinkiData } from "../data/regions/6_kinki";
import { chugokuData } from "../data/regions/7_chugoku";
import { shikokuData } from "../data/regions/8_shikoku";
import { kyushuData } from "../data/regions/9_kyushu";
import { okinawaData } from "../data/regions/10_okinawa";




// ==============================
// 型
// ==============================
export type RegionValue =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "hokuriku"
  | "chubu"
  | "kinki"
  | "chugoku"
  | "shikoku"
  | "kyushu"
  | "okinawa";

export type RegionMeta = {
  key: RegionValue;
  label: string;
  colorBase: string;
  colorStrong: string;
  detail: ClimateArticleData;
  representativeStationId?: string;
};

type RegionMap = Record<RegionValue, RegionMeta>;

// ==============================
// 定義（本体）
// ==============================
export const RegionKey = {
  hokkaido: {
    key: "hokkaido",
    label: "北海道",
    colorBase: "#8e86d4b3",
    colorStrong: "#493acf",
    detail: hokkaidoData,
    representativeStationId: "14163", // 札幌
  },

  tohoku: {
    key: "tohoku",
    label: "東北",
    colorBase: "#32bfccb3",
    colorStrong: "#3db1d1",
    detail: tohokuData,
    representativeStationId: "34392", // 仙台
  },

  kanto: {
    key: "kanto",
    label: "関東",
    colorBase: "#6dbd8bb3",
    colorStrong: "#2eb160",
    detail: kantoData,
    representativeStationId: "44132", // 東京
  },

  hokuriku: {
    key: "hokuriku",
    label: "北陸",
    colorBase: "#c8c850b3",
    colorStrong: "#a0a014",
    detail: hokurikuData,
    representativeStationId: "54232", // 新潟
  },

  chubu: {
    key: "chubu",
    label: "中部",
    colorBase: "#99cc69b3",
    colorStrong: "#82cc3c",
    detail: chubuData,
    representativeStationId: "51106", // 名古屋
  },

  kinki: {
    key: "kinki",
    label: "近畿",
    colorBase: "#ecad72b3",
    colorStrong: "#e98e3a",
    detail: kinkiData,
    representativeStationId: "62078", // 大阪
  },

  chugoku: {
    key: "chugoku",
    label: "中国",
    colorBase: "#c575ddb3",
    colorStrong: "#b741db",
    detail: chugokuData,
    representativeStationId: "67437", // 広島
  },

  shikoku: {
    key: "shikoku",
    label: "四国",
    colorBase: "#e982bbb3",
    colorStrong: "#e4459c",
    detail: shikokuData,
    representativeStationId: "72086", // 高松
  },

  kyushu: {
    key: "kyushu",
    label: "九州",
    colorBase: "#ec7e7eb3",
    colorStrong: "#f03a3a",
    detail: kyushuData,
    representativeStationId: "82182", // 福岡
  },

  okinawa: {
    key: "okinawa",
    label: "沖縄",
    colorBase: "#c8a0a0b3",
    colorStrong: "#c86478",
    detail: okinawaData,
    representativeStationId: "91197", // 那覇
  },
} satisfies RegionMap;

// ==============================
// utils
// ==============================
export const REGION_LIST = Object.keys(RegionKey) as RegionValue[];


