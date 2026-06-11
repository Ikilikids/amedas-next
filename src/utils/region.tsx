//
// ==============================
// 型
// ==============================
export type RegionMeta = {
  label: string;
  colorBase: string;
  colorStrong: string;
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
  },

  tohoku: {
    label: "東北",
    colorBase: "#32bfccb3",
    colorStrong: "#3db1d1",
  },

  kanto: {
    label: "関東",
    colorBase: "#6dbd8bb3",
    colorStrong: "#2eb160",
  },

  hokuriku: {
    label: "北陸",
    colorBase: "#c8c850b3",
    colorStrong: "#a0a014",
  },

  chubu: {
    label: "中部",
    colorBase: "#99cc69b3",
    colorStrong: "#82cc3c",
  },

  kinki: {
    label: "近畿",
    colorBase: "#ecad72b3",
    colorStrong: "#e98e3a",
  },

  chugoku: {
    label: "中国",
    colorBase: "#c575ddb3",
    colorStrong: "#b741db",
  },

  shikoku: {
    label: "四国",
    colorBase: "#e982bbb3",
    colorStrong: "#e4459c",
  },

  kyushu: {
    label: "九州",
    colorBase: "#ec7e7eb3",
    colorStrong: "#f03a3a",
  },

  okinawa: {
    label: "沖縄",
    colorBase: "#c8a0a0b3",
    colorStrong: "#c86478",
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
