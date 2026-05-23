export const RankType = {
  Top: "top",
  Bot: "bot",
  Island: "island",
  Region: "region",
  Pre: "pre",
  Meteo: "meteo",
} as const;

export type RankType = (typeof RankType)[keyof typeof RankType];

export const rankTypes = {
  [RankType.Top]: { label: "上位100地点" },
  [RankType.Bot]: { label: "下位100地点" },
  [RankType.Island]: { label: "島嶼部を除く" },
  [RankType.Region]: { label: "地域別" },
  [RankType.Pre]: { label: "県別" },
  [RankType.Meteo]: { label: "気象台のみ" },
} as const;

export const MonthMap: { [key: string]: string } = {
  all: "通年",
  "1": "1月",
  "2": "2月",
  "3": "3月",
  "4": "4月",
  "5": "5月",
  "6": "6月",
  "7": "7月",
  "8": "8月",
  "9": "9月",
  "10": "10月",
  "11": "11月",
  "12": "12月",
};

export interface StationMaster {
  station_name: string;
  official_name: string;
  pref: string;
  city: string;
  category?: number;
  lat?: number;
  lon?: number;
}

export interface Station extends StationMaster {
  id: string;
  value: number;
  rank: number;
}
