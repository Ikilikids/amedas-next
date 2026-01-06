// src/data/navLinks.ts
import { IconType } from "react-icons";
import { AiFillSun } from "react-icons/ai";
import { BsCloudRainHeavyFill } from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";
import {
  FaMapLocationDot,
  FaTemperatureArrowDown,
  FaTemperatureArrowUp,
} from "react-icons/fa6";
import { GiJapan } from "react-icons/gi";
import { IoIosTrophy } from "react-icons/io";
import { LiaSnowflake } from "react-icons/lia";
import { PiThermometerHotFill } from "react-icons/pi";
import { TbTemperature } from "react-icons/tb";
export interface NavLink {
  href: string;
  Icon: IconType;
  title: string;
  description: string;
  iconClass?: string;
}

export const searchLinks: NavLink[] = [
  {
    href: "/map",
    Icon: FaMapLocationDot,
    title: "マップから探す",
    description: "地図を見ながらアメダスを選択できます",
  },
  {
    href: "/ranking/av_avtemp/top/default",
    Icon: IoIosTrophy,
    title: "ランキングから探す",
    description: "雨量や気温のランキングからアメダスを探せます",
  },
  {
    href: "/prefecture",
    Icon: GiJapan,
    title: "都道府県から探す",
    description: "都道府県ごとにアメダスをまとめています",
  },
];
export const featureLinks: NavLink[] = [
  {
    href: "/feature/meteo",
    Icon: FaBuilding,
    title: "気象台まとめ",
    description: "都道府県の代表地点です",
  },

  {
    href: "/feature/hot",
    Icon: PiThermometerHotFill,
    title: "暑い地点まとめ",
    description: "夏季に良くニュースになる地点をまとめました",
    iconClass: "text-red-500",
  },
  /*{
    href: "/feature/rain",
    Icon: BsCloudRainHeavyFill,
    title: "雨が多い地点まとめ",
    description: "降水量が多い地点をまとめました",
    iconClass: "text-indigo-800",
  },*/
];
export const rankingLinks: NavLink[] = [
  {
    href: "/ranking_y/av_avtemp/2025",
    Icon: TbTemperature,
    title: "平均気温ランキング",
    description: "1991-2025の平均気温を年ごとにランキングにしました",
    iconClass: "text-orange-500",
  },
  {
    href: "/ranking_y/hitemp_35/2025",
    Icon: PiThermometerHotFill,
    title: "猛暑日ランキング",
    description: "1991-2025の猛暑日を年ごとにランキングにしました",
    iconClass: "text-red-500",
  },

  {
    href: "/ranking_y/sm_rain/2025",
    Icon: BsCloudRainHeavyFill,
    title: "降水量ランキング",
    description: "1991-2025の降水量を年ごとにランキングにしました",
    iconClass: "text-indigo-800",
  },
  {
    href: "/ranking_y/sm_snowing/2025",
    Icon: LiaSnowflake,
    title: "降雪量ランキング",
    description: "1991-2025の降雪量を年ごとにランキングにしました",
    iconClass: "text-teal-500",
  },
  {
    href: "/ranking_y/sm_sun/2025",
    Icon: AiFillSun,
    title: "日照時間ランキング",
    description: "1991-2025の日照時間を年ごとにランキングにしました",
    iconClass: "text-yellow-500",
  },
  /*{
    href: "/ranking_y/max_snowed/2025",
    Icon: FaSnowman,
    title: "最深積雪ランキング",
    description: "1991-2025の最大積雪量を年ごとにランキングにしました",
    iconClass: "text-teal-500",
  },*/
  {
    href: "/ranking_y/max_hitemp/2025",
    Icon: FaTemperatureArrowUp,
    title: "最高気温ランキング",
    description: "1991-2025の最高気温を年ごとにランキングにしました",
    iconClass: "text-pink-500",
  },
  {
    href: "/ranking_y/min_lwtemp/2025",
    Icon: FaTemperatureArrowDown,
    title: "最低気温ランキング",
    description: "1991-2025の最低気温を年ごとにランキングにしました",
    iconClass: "text-blue-500",
  },
];
