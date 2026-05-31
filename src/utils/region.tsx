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
    colorBase: "rgba(142,134,212,0.7)",
    colorStrong: "rgba(73,58,207,1)",
  },

  tohoku: {
    label: "東北",
    colorBase: "rgba(50,191,204,0.7)",
    colorStrong: "rgba(61,189,209,1)",
  },

  kanto: {
    label: "関東",
    colorBase: "rgba(109,189,139,0.7)",
    colorStrong: "rgba(46,177,96,1)",
  },

  hokuriku: {
    label: "北陸",
    colorBase: "rgba(200,200,80,0.7)",
    colorStrong: "rgba(160,160,20,1)",
  },

  chubu: {
    label: "中部",
    colorBase: "rgba(153,204,105,0.7)",
    colorStrong: "rgba(130,204,60,1)",
  },

  kinki: {
    label: "近畿",
    colorBase: "rgba(236,173,114,0.7)",
    colorStrong: "rgba(233,142,58,1)",
  },

  chugoku: {
    label: "中国",
    colorBase: "rgba(197,117,221,0.7)",
    colorStrong: "rgba(183,65,219,1)",
  },

  shikoku: {
    label: "四国",
    colorBase: "rgba(233,130,187,0.7)",
    colorStrong: "rgba(228,69,156,1)",
  },

  kyushu: {
    label: "九州",
    colorBase: "rgba(236,126,126,0.7)",
    colorStrong: "rgba(240,58,58,1)",
  },

  okinawa: {
    label: "沖縄",
    colorBase: "rgba(200,160,160,0.7)",
    colorStrong: "rgba(200,100,120,1)",
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
