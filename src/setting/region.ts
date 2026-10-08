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
  },

  tohoku: {
    key: "tohoku",
    label: "東北",
    colorBase: "#32bfccb3",
    colorStrong: "#3db1d1",
  },

  kanto: {
    key: "kanto",
    label: "関東",
    colorBase: "#6dbd8bb3",
    colorStrong: "#2eb160",
  },

  hokuriku: {
    key: "hokuriku",
    label: "北陸",
    colorBase: "#c8c850b3",
    colorStrong: "#a0a014",
  },

  chubu: {
    key: "chubu",
    label: "中部",
    colorBase: "#99cc69b3",
    colorStrong: "#82cc3c",
  },

  kinki: {
    key: "kinki",
    label: "近畿",
    colorBase: "#ecad72b3",
    colorStrong: "#e98e3a",
  },

  chugoku: {
    key: "chugoku",
    label: "中国",
    colorBase: "#c575ddb3",
    colorStrong: "#b741db",
  },

  shikoku: {
    key: "shikoku",
    label: "四国",
    colorBase: "#e982bbb3",
    colorStrong: "#e4459c",
  },

  kyushu: {
    key: "kyushu",
    label: "九州",
    colorBase: "#ec7e7eb3",
    colorStrong: "#f03a3a",
  },

  okinawa: {
    key: "okinawa",
    label: "沖縄",
    colorBase: "#c8a0a0b3",
    colorStrong: "#c86478",
  },
} satisfies RegionMap;

// ==============================
// utils
// ==============================
export const REGION_LIST = Object.keys(RegionKey) as RegionValue[];
