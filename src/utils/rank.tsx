import { StationId } from "../types/union";
export type RankMeta = {
  key: RankValue;
  rankingLabel: string;
  ratioLabel: string;
};

export const RankKey = {
  top: {
    key: "top",
    rankingLabel: "上位100地点",
    ratioLabel: "降順",
  },
  bot: {
    key: "bot",
    rankingLabel: "下位100地点",
    ratioLabel: "昇順",
  },
  island: {
    key: "island",
    rankingLabel: "島嶼部を除く",
    ratioLabel: "島除く",
  },
  region: {
    key: "region",
    rankingLabel: "地域別",
    ratioLabel: "地方別",
  },
  pre: {
    key: "pre",
    rankingLabel: "県別",
    ratioLabel: "県別",
  },
  meteo: {
    key: "meteo",
    rankingLabel: "気象台のみ",
    ratioLabel: "気象台",
  },
} as const satisfies Record<string, any>;

export const ISLAND_PREFIXES = [
  "886",
  "887",
  "888",
  "889",
  "4417",
  "442",
  "443",
  "9",
];

export const isIslandId = (id: StationId): boolean =>
  ISLAND_PREFIXES.some((p) => id.startsWith(p));

export type RankValue = keyof typeof RankKey;

export const NOT_METEO_PREFIXES = [
  "94081",
  "93041",
  "92011",
  "23232",
  "21323",
  "12442",
  "11016",
  "17341",
  "19432",
];

export const isNotMeteoId = (id: StationId): boolean =>
  NOT_METEO_PREFIXES.some((p) => id.startsWith(p));
