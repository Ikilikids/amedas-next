import React from "react";
import {
  FaCalendarCheck,
  FaSnowman,
  FaSeedling,
  FaUmbrella,
  FaSun,
} from "react-icons/fa";
import { FaToriiGate, FaUmbrellaBeach } from "react-icons/fa6";
import { GiFallingLeaf, GiPumpkin } from "react-icons/gi";
import { TbChristmasTree, TbFlowerFilled, TbWindsockFilled } from "react-icons/tb";
import { BsMoonStarsFill } from "react-icons/bs";

export type MonthValue = "all" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";

export type MonthMeta = {
  key: MonthValue;
  label: string;
  color: string;
  icon: React.ReactNode;
};

export const MonthKey: Record<MonthValue, MonthMeta> = {
  all: {
    key: "all",
    label: "通年",
    color: "#8b5cf6", // violet
    icon: <FaCalendarCheck />,
  },
  // 1月: 元旦・初詣 (鳥居)
  "1": {
    key: "1",
    label: "1月",
    color: "#ef4444", // red
    icon: <FaToriiGate />,
  },
  // 2月: 雪・寒さのピーク (雪だるま)
  "2": {
    key: "2",
    label: "2月",
    color: "#0ea5e9", // sky
    icon: <FaSnowman />,
  },
  // 3月: 早春・寒の戻り〜芽吹き (寒気または芽吹き)
  "3": {
    key: "3",
    label: "3月",
    color: "#f97316", // orange
    icon: <FaSeedling />,
  },
  // 4月: 桜 (花)
  "4": {
    key: "4",
    label: "4月",
    color: "#f43f5e", // rose
    icon: <TbFlowerFilled />,
  },
  // 5月: こいのぼり
  "5": {
    key: "5",
    label: "5月",
    color: "#10b981", // emerald
    icon: <TbWindsockFilled />,
  },
  // 6月: 雨・梅雨 (傘)
  "6": {
    key: "6",
    label: "6月",
    color: "#3b82f6", // blue
    icon: <FaUmbrella />,
  },
  // 7月: 海開き・ビーチ (ビーチパラソル/海)
  "7": {
    key: "7",
    label: "7月",
    color: "#06b6d4", // cyan
    icon: <FaUmbrellaBeach />,
  },
  // 8月: 晴れ・太陽・盛夏 (晴れ)
  "8": {
    key: "8",
    label: "8月",
    color: "#ef4444", // red
    icon: <FaSun />,
  },
  // 9月: 十五夜・月見 (月と星)
  "9": {
    key: "9",
    label: "9月",
    color: "#eab308", // amber
    icon: <BsMoonStarsFill />,
  },
  // 10月: ハロウィン (ジャック・オ・ランタン)
  "10": {
    key: "10",
    label: "10月",
    color: "#ea580c", // orange-600
    icon: <GiPumpkin />,
  },
  // 11月: 落ち葉 (枯葉)
  "11": {
    key: "11",
    label: "11月",
    color: "#b45309", // amber-700
    icon: <GiFallingLeaf />,
  },
  // 12月: クリスマス (ツリー)
  "12": {
    key: "12",
    label: "12月",
    color: "#16a34a", // green-600
    icon: <TbChristmasTree />,
  },
};
