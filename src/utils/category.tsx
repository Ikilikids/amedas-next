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
  icon: React.ReactNode;
  description: string;
};
// ==============================
// 定義（本体）
// ==============================
export const CATEGORY_KEYS = {
  meteo: {
    label: "気象台",
    value: 1,
    colorBase: "#ef44441a",
    colorBorder: "#ef444433",
    colorFull: "#ef4444",
    icon: <FaBuilding />,
    description: "地域気象の中核を担う地点（赤色）",
  },
  submeteo: {
    label: "気象台",
    value: 2,
    colorBase: "#ef44441a",
    colorBorder: "#ef444433",
    colorFull: "#ef4444",
    icon: <FaBuilding />,
    description: "地域気象の中核を担う地点（赤色）",
  },
  special: {
    label: "特別地域気象観測所",
    value: 3,
    colorBase: "#f59e0b1a",
    colorBorder: "#f59e0b33",
    colorFull: "#f59e0b",
    icon: <FaSatelliteDish />,
    description: "気象台に次ぐ高度な観測地点（黄色）",
  },
  aviation: {
    label: "航空気象観測所",
    value: 4,
    colorBase: "#38bdf81a",
    colorBorder: "#38bdf833",
    colorFull: "#38bdf8",
    icon: <FaPlane />,
    description: "空港に設置される観測地点（青色）",
  },
  amedas: {
    label: "アメダス",
    value: 5,
    colorBase: "#64748b0d",
    colorBorder: "#64748b33",
    colorFull: "#324250",
    icon: <FaMapMarkerAlt />,
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
