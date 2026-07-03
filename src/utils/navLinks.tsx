// src/utils/navLinks.tsx
import React from "react";
import {
  FaBalanceScaleLeft,
  FaBuilding,
  FaClock,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import { FaMapLocationDot, FaSatelliteDish } from "react-icons/fa6";
import { IoIosTrophy } from "react-icons/io";
import { PiRankingDuotone, PiThermometerHotFill } from "react-icons/pi";
import { TbTemperaturePlus, TbTemperatureSun } from "react-icons/tb";

export interface NavLink {
  href: string;
  Icon: React.ReactNode;
  title: string;
  description: string;
  iconClass?: string;
}

export interface NavSection {
  id: string;
  title: string;
  description: string;
  Icon: React.ReactNode;
  bgColor: string;
  links: NavLink[];
}

export const realtimeLinks: NavLink[] = [
  {
    href: "/live/realtime",
    Icon: <TbTemperatureSun />,
    title: "現在の気温",
    description: "全国の最新観測データを表示",
    iconClass: "text-orange-500",
  },
  {
    href: "/live/daily_ranking",
    Icon: <PiRankingDuotone />,
    title: "今日のランキング",
    description: "本日の気温・降水ランキング",
    iconClass: "text-yellow-500",
  },
];

export const yearlyRankingLinks: NavLink[] = [
  {
    href: "/live/recent_ranking/heat",
    Icon: <IoIosTrophy />,
    title: "暑さのランキング",
    description: "今年の最高気温や猛暑日など",
    iconClass: "text-red-600",
  },
  {
    href: "/live/recent_ranking/cold",
    Icon: <IoIosTrophy />,
    title: "寒さのランキング",
    description: "今年の最低気温や冬日など",
    iconClass: "text-sky-400",
  },
  {
    href: "/live/recent_ranking/rain",
    Icon: <IoIosTrophy />,
    title: "降水量のランキング",
    description: "最近の降水量や今年の累計など",
    iconClass: "text-indigo-800",
  },
];

export const searchLinks: NavLink[] = [
  {
    href: "/clim_ranking",
    Icon: <IoIosTrophy />,
    title: "平年値ランキング",
    description: "全国の平年値データをランキング形式で比較できます",
    iconClass: "text-yellow-500",
  },
  {
    href: "/compare",
    Icon: <FaBalanceScaleLeft />,
    title: "地点を比較する",
    description: "2つの地点を並べて気候の違いを確認できます",
    iconClass: "text-blue-500",
  },
  {
    href: "/map",
    Icon: <FaMapLocationDot />,
    title: "マップから探す",
    description: "地図を見ながらアメダスを選択できます",
    iconClass: "text-green-600",
  },
];

export const featureLinks: NavLink[] = [
  {
    href: "/feature/meteo",
    Icon: <FaBuilding />,
    title: "47都道府県まとめ",
    description: "都道府県の代表地点です",
    iconClass: "text-red-500",
  },
  {
    href: "/feature/special",
    Icon: <FaSatelliteDish />,
    title: "特別観測所まとめ",
    description: "地域の代表地点です",
    iconClass: "text-yellow-500",
  },
  {
    href: "/feature/hot",
    Icon: <PiThermometerHotFill />,
    title: "暑い地点まとめ",
    description: "夏季に良くニュースになる地点をまとめました",
    iconClass: "text-red-700",
  },
  {
    href: "/feature/warm",
    Icon: <TbTemperaturePlus />,
    title: "暖かい地点まとめ",
    description: "主に島などの暖かい地点をまとめました",
    iconClass: "text-orange-500",
  },
];

export const navSections: NavSection[] = [
  {
    id: "realtime",
    title: "リアルタイム更新",
    description: "現在の気温や、今日のランキングを確認できます。",
    Icon: <FaClock />,
    bgColor: "#ef4444",
    links: realtimeLinks,
  },
  {
    id: "yearly",
    title: "今年のランキング",
    description:
      "今年これまでの最高気温、最低気温、降水量などのランキングです。",
    Icon: <IoIosTrophy />,
    bgColor: "#f59e0b",
    links: yearlyRankingLinks,
  },
  {
    id: "search",
    title: "アメダスを探す",
    description: "マップや平年値のランキングから地点を探すことができます。",
    Icon: <FaSearch />,
    bgColor: "#3b82f6",
    links: searchLinks,
  },
  {
    id: "feature",
    title: "アメダス特集",
    description:
      "気象台や特定の気候的特徴を持つ地点をピックアップして紹介しています。",
    Icon: <FaStar />,
    bgColor: "#8b5cf6",
    links: featureLinks,
  },
];
