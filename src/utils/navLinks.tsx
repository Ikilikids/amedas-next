// src/data/navLinks.ts
import { AiFillSun } from "react-icons/ai";
import { BsCloudRainHeavyFill } from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";
import {
  FaMapLocationDot,
  FaTemperatureArrowDown,
  FaTemperatureArrowUp,
  FaTemperatureHigh,
} from "react-icons/fa6";
import { LiaSnowflake } from "react-icons/lia";
import { PiThermometerHotFill } from "react-icons/pi";
import { TbTemperature } from "react-icons/tb";
import React from "react";

export interface NavLink {
  href: string;
  Icon: React.ReactNode;
  title: string;
  description: string;
  iconClass?: string;
}

export const searchLinks: NavLink[] = [
  {
    href: "/live/realtime",
    Icon: <FaTemperatureHigh />,
    title: "現在の気温",
    description: "全国の最新観測データを表示",
    iconClass: "text-red-500",
  },
  {
    href: "/live/dailymax",
    Icon: <FaTemperatureHigh />,
    title: "今日の最高気温",
    description: "本日の最高気温ランキング",
    iconClass: "text-orange-500",
  },
  {
    href: "/map",
    Icon: <FaMapLocationDot />,
    title: "マップから探す",
    description: "地図を見ながらアメダスを選択できます",
  },
];
export const featureLinks: NavLink[] = [
  {
    href: "/feature/meteo",
    Icon: <FaBuilding />,
    title: "気象台まとめ",
    description: "都道府県の代表地点です",
  },

  {
    href: "/feature/hot",
    Icon: <PiThermometerHotFill />,
    title: "暑い地点まとめ",
    description: "夏季に良くニュースになる地点をまとめました",
    iconClass: "text-red-500",
  },
  /*{
    href: "/feature/rain",
    Icon: <BsCloudRainHeavyFill />,
    title: "雨が多い地点まとめ",
    description: "降水量が多い地点をまとめました",
    iconClass: "text-indigo-800",
  },*/
];
export const rankingLinks: NavLink[] = [
  {
    href: "/ranking_y/av_avtemp/2025",
    Icon: <TbTemperature />,
    title: "平均気温ランキング",
    description: "1991-2025の平均気温を年ごとにランキングにしました",
    iconClass: "text-orange-500",
  },
  {
    href: "/ranking_y/hitemp_35/2025",
    Icon: <PiThermometerHotFill />,
    title: "猛暑日ランキング",
    description: "1991-2025の猛暑日を年ごとにランキングにしました",
    iconClass: "text-red-500",
  },

  {
    href: "/ranking_y/sm_rain/2025",
    Icon: <BsCloudRainHeavyFill />,
    title: "降水量ランキング",
    description: "1991-2025の降水量を年ごとにランキングにしました",
    iconClass: "text-indigo-800",
  },
  {
    href: "/ranking_y/sm_snowing/2025",
    Icon: <LiaSnowflake />,
    title: "降雪量ランキング",
    description: "1991-2025の降雪量を年ごとにランキングにしました",
    iconClass: "text-teal-500",
  },
  {
    href: "/ranking_y/sm_sun/2025",
    Icon: <AiFillSun />,
    title: "日照時間ランキング",
    description: "1991-2025の日照時間を年ごとにランキングにしました",
    iconClass: "text-yellow-500",
  },
  /*{
    href: "/ranking_y/max_snowed/2025",
    Icon: <FaSnowman />,
    title: "最深積雪ランキング",
    description: "1991-2025の最大積雪量を年ごとにランキングにしました",
    iconClass: "text-teal-500",
  },*/
  {
    href: "/ranking_y/max_hitemp/2025",
    Icon: <FaTemperatureArrowUp />,
    title: "最高気温ランキング",
    description: "1991-2025の最高気温を年ごとにランキングにしました",
    iconClass: "text-pink-500",
  },
  {
    href: "/ranking_y/min_lwtemp/2025",
    Icon: <FaTemperatureArrowDown />,
    title: "最低気温ランキング",
    description: "1991-2025の最低気温を年ごとにランキングにしました",
    iconClass: "text-blue-500",
  },
];
