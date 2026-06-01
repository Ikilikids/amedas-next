import { IconType } from "react-icons";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPlane,
  FaSatelliteDish,
} from "react-icons/fa";

// ==============================
// 型
// ==============================
export type CategoryMeta = {
  label: string;
  value: number;
  colorBase: string;
  colorBorder: string;
  colorFull: string;
  icon: IconType;
  description: string;
};
// ==============================
// 定義（本体）
// ==============================
export const CATEGORY_KEYS = {
  meteo: {
    label: "気象台",
    value: 1,
    colorBase: "rgba(239, 68, 68, 0.1)",
    colorBorder: "rgba(239, 68, 68, 0.2)",
    colorFull: "rgba(239, 68, 68, 1)",
    icon: FaBuilding,
    description: "地域気象の中核を担う地点（赤色）",
  },
  special: {
    label: "特別地域気象観測所",
    value: 2,
    colorBase: "rgba(245, 158, 11, 0.1)",
    colorBorder: "rgba(245, 158, 11, 0.2)",
    colorFull: "rgba(245, 158, 11, 1)",
    icon: FaSatelliteDish,
    description: "気象台に次ぐ高度な観測地点（黄色）",
  },
  aviation: {
    label: "航空気象観測所",
    value: 3,
    colorBase: "rgba(56, 189, 248, 0.1)",
    colorBorder: "rgba(56, 189, 248, 0.2)",
    colorFull: "rgba(56, 189, 248, 1)",
    icon: FaPlane,
    description: "空港に設置される観測地点（青色）",
  },
  amedas: {
    label: "アメダス",
    value: 4,
    colorBase: "rgba(100, 116, 139, 0.05)",
    colorBorder: "rgba(100, 116, 139, 0.2)",
    colorFull: "rgba(80, 96, 110, 1)",
    icon: FaMapMarkerAlt,
    description: "全国に展開される観測地点（白色）",
  },
} as const satisfies Record<string, CategoryMeta>;

// ==============================
// 型
// ==============================
export type CategoryValue = keyof typeof CATEGORY_KEYS;
export type Category = (typeof CATEGORY_KEYS)[CategoryValue];

// ==============================
// utils
// ==============================
export const CATEGORY_LIST = Object.keys(CATEGORY_KEYS) as CategoryValue[];

export function getCategoryMeta(cat: CategoryValue): Category {
  return CATEGORY_KEYS[cat];
}
