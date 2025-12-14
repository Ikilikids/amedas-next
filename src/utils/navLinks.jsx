// src/data/navLinks.js

import { FaBuilding } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { GiJapan } from "react-icons/gi";
import { IoIosTrophy } from "react-icons/io";
import { PiThermometerHotFill } from "react-icons/pi";
//import { FaRegSnowflake } from "react-icons/fa6";
//import { BsCloudRainFill } from "react-icons/bs";
//import { PiThermometerColdFill, PiThermometerHotFill } from "react-icons/pi";
// Home 用（アイコン付き）

export const searchLinks = [
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
export const featureLinks = [
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
  /*
  {
    href: "/feature/cold",
    Icon: PiThermometerColdFill,
    title: "寒い地点まとめ",
    description: "主に北海道、東北、標高が高い地点をまとめました",
    iconClass: "text-blue-500",
  },
  {
    href: "/feature/warm",
    Icon: TbTemperaturePlus,
    title: "暖かい地点まとめ",
    description: "主に島嶼部、九州など温暖な地点をまとめました",
    iconClass: "text-orange-500",
  } 
  {
    href: "/feature/rain",
    Icon: BsCloudRainFill,
    title: "降水量が多い地点まとめ",
    description: "主に山間部、九州、太平洋沿岸の地域です",
    iconClass: "text-blue-800",
  },
  {
    href: "/feature/snow",
    Icon: FaRegSnowflake,
    title: "降雪量が多い地点まとめ",
    description: "主に北陸などの日本海側の地域です",
    iconClass: "text-cyan-300",
  },
  */
  ,
];
