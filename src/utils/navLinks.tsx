// src/data/navLinks.ts
import { IconType } from "react-icons";
import { FaBuilding } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { GiJapan } from "react-icons/gi";
import { IoIosTrophy } from "react-icons/io";
import { PiThermometerHotFill } from "react-icons/pi";

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
