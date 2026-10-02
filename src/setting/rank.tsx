import React from "react";
import { FaSortAmountDown, FaSortAmountUp, FaWater, FaMapMarkedAlt, FaMapPin, FaFlag } from "react-icons/fa";
import { StationId } from "../types/union";
import { FaBuilding } from "react-icons/fa";

export type RankValue = "top" | "bot" | "island" | "region" | "pre" | "meteo";

export type RankMeta = {
  key: RankValue;
  rankingLabel: string;
  ratioLabel: string;
  color: string;
  icon: React.ReactNode;
};

export const RankKey: Record<RankValue, RankMeta> = {
  top: {
    key: "top",
    rankingLabel: "上位100地点",
    ratioLabel: "降順",
    color: "#f43f5e", //pink
    icon: <FaSortAmountDown />,
  },
  bot: {
    key: "bot",
    rankingLabel: "下位100地点",
    ratioLabel: "昇順",
    color: "#8b5cf6", // violet
    icon: <FaSortAmountUp />,
  },
  island: {
    key: "island",
    rankingLabel: "島嶼部を除く",
    ratioLabel: "島除く",
    color: "#06b6d4", // cyan
    icon: <FaWater />,
  },
  region: {
    key: "region",
    rankingLabel: "地域別",
    ratioLabel: "地方別",
    color: "#10b981", // emerald
    icon: <FaMapMarkedAlt />,
  },
  pre: {
    key: "pre",
    rankingLabel: "県別",
    ratioLabel: "県別",
    color: "#f97316", // orange
    icon: <FaMapPin />,
  },
  meteo: {
    key: "meteo",
    rankingLabel: "気象台",
    ratioLabel: "気象台",
    color: "#ef4444", // red
    icon: <FaBuilding />,
  },
};

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
