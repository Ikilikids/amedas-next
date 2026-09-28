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
    rankingLabel: "47都道府県",
    ratioLabel: "47都道府県",
  },
  special: {
    key: "special",
    rankingLabel: "気象台など",
    ratioLabel: "気象台など",
  },
} as const satisfies Record<string, any>;

export const ISLAND_PREFIXES = [
  "11046",
  "11091",
  "11151",
  "13146",
  "24101",
  "24146",
  "35002",
  "54012",
  "54041",
  "54157",
  "54166",
  "54271",
  "51261",
  "62101",
  "63517",
  "65036",
  "68022",
  "68046",
  "68056",
  "63551",
  "63571",
  "63588",
  "63491",
  "72061",
  "67471",
  "73001",
  "67576",
  "67556",
  "81486",
  "82068",
  "840",
  "84121",
  "84122",
  "84341",
  "84536",
  "84537",
  "86271",
  "86316",
  "86491",
  "88131",
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
