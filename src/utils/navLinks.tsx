// src/data/navLinks.ts
import { IconType } from "react-icons";
import { FaBuilding } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { GiJapan } from "react-icons/gi";
import { IoIosTrophy } from "react-icons/io";
import { PiThermometerHotFill } from "react-icons/pi";
import { TbTemperature, TbTemperaturePlus } from "react-icons/tb";
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
];
export const rankingLinks: NavLink[] = [
  {
    href: "/ranking_y/hitemp_35/2025",
    Icon: PiThermometerHotFill,
    title: "猛暑日ランキング",
    description: "1991-2025の猛暑日を年ごとにランキングにしました",
    iconClass: "text-red-500",
  },
  {
    href: "/ranking_y/hitemp_30/2025",
    Icon: TbTemperaturePlus,
    title: "真夏日ランキング",
    description: "1991-2025の真夏日を年ごとにランキングにしました",
    iconClass: "text-orange-500",
  },
  {
    href: "/ranking_y/hitemp_25/2025",
    Icon: TbTemperature,
    title: "夏日ランキング",
    description: "1991-2025の夏日を年ごとにランキングにしました",
    iconClass: "text-yellow-500",
  },
];
