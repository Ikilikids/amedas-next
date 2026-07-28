import React from "react";
import { AiFillSun } from "react-icons/ai";
import { BiWind } from "react-icons/bi";
import {
  BsCloudsFill,
  BsFillCloudLightningRainFill,
  BsFillCloudRainFill,
  BsFillCloudRainHeavyFill,
  BsThermometerSnow,
} from "react-icons/bs";
import {
  FaSnowman,
  FaTemperatureArrowDown,
  FaTemperatureArrowUp,
} from "react-icons/fa6";
import { MdDryCleaning, MdOutlineNightsStay } from "react-icons/md";
import { PiThermometerColdFill, PiThermometerHotFill } from "react-icons/pi";
import { TbTemperature, TbTemperaturePlus } from "react-icons/tb";

// ==============================
// 1. Types & Definitions (No dependencies)
// ==============================
export type MetricUnit = "℃" | "mm" | "cm" | "m/s" | "h" | "日";

export type MetricTab =
  | "主要"
  | "平均"
  | "気温日数"
  | "降水日数"
  | "降雪日数"
  | "積雪日数"
  | "風速日数"
  | "極値";

export type MetricGroup = "heat" | "cold" | "rain";

export type MetricDetail = {
  gradient: string; // CSS linear-gradient string
  hoverColor: string; // Hex color for hover text
  group?: MetricGroup;
};

export type RankingGroupMeta = {
  label: string;
  color: string;
  borderColor: string;
  shadowColor: string;
};

export const RANKING_GROUP_META: Record<MetricGroup, RankingGroupMeta> = {
  heat: {
    label: "暑さ",
    color: "#dc2626",
    borderColor: "#f87171",
    shadowColor: "#fecaca",
  },
  cold: {
    label: "寒さ",
    color: "#2563eb",
    borderColor: "#60a5fa",
    shadowColor: "#dbeafe",
  },
  rain: {
    label: "降水",
    color: "#0891b2",
    borderColor: "#22d3ee",
    shadowColor: "#cffafe",
  },
};

// Default detail for metrics that don't need special ranking UI but need to exist
const DEFAULT_DETAIL: MetricDetail = {
  gradient: "linear-gradient(to right, #94a3b8, #64748b)",
  hoverColor: "#475569",
};

// ==============================
// 2. Metric Master (Internal Raw Definition for auto-extraction)
// ==============================
const _rawMetricKey = {
  // ===== 主要 =====
  av_avtemp: {
    key: "av_avtemp",
    label: "平均気温",
    unit: "℃",
    tab: "主要",
    color: "#e66428",
    highIcon: <TbTemperaturePlus />,
    lowIcon: <PiThermometerColdFill />,
    detail: {
      gradient: "linear-gradient(to right, #ea580c, #fb923c)",
      hoverColor: "#ea580c",
    },
  },
  sm_sun: {
    key: "sm_sun",
    label: "日照時間",
    unit: "h",
    tab: "主要",
    color: "#eab308",
    highIcon: <AiFillSun />,
    lowIcon: <BsCloudsFill />,
    detail: {
      gradient: "linear-gradient(to right, #eab308, #facc15)",
      hoverColor: "#ca8a04",
    },
  },
  sm_rain: {
    key: "sm_rain",
    label: "累計降水",
    unit: "mm",
    tab: "主要",
    color: "#1e40af",
    highIcon: <BsFillCloudRainFill />,
    lowIcon: <MdDryCleaning />,
    detail: {
      gradient: "linear-gradient(to right, #1d4ed8, #445588)",
      hoverColor: "#1e3a8a",
      group: "rain",
    },
  },
  sm_snowing: {
    key: "sm_snowing",
    label: "降雪量",
    unit: "cm",
    tab: "主要",
    color: "#9333ea",
    highIcon: <FaSnowman />,
    detail: {
      gradient: "linear-gradient(to right, #7e22ce, #a855f7)",
      hoverColor: "#7e22ce",
    },
  },

  // ===== 平均 =====
  av_hitemp: {
    key: "av_hitemp",
    label: "最高気温",
    unit: "℃",
    tab: "平均",
    color: "#e62846",
    highIcon: <FaTemperatureArrowUp />,
    detail: {
      gradient: "linear-gradient(to right, #b91c1c, #ef4444)",
      hoverColor: "#b91c1c",
    },
  },
  av_lwtemp: {
    key: "av_lwtemp",
    label: "最低気温",
    unit: "℃",
    tab: "平均",
    color: "#3b82f6",
    highIcon: <FaTemperatureArrowDown />,
    detail: {
      gradient: "linear-gradient(to right, #2563eb, #0891b2)",
      hoverColor: "#2563eb",
    },
  },
  av_wind: {
    key: "av_wind",
    label: "平均風速",
    unit: "m/s",
    tab: "平均",
    color: "#199619",
    highIcon: <BiWind />,
    detail: DEFAULT_DETAIL,
  },

  // ===== 極値 =====
  max_hitemp: {
    key: "max_hitemp",
    label: "最高気温",
    unit: "℃",
    color: "#a855f7",
    highIcon: <FaTemperatureArrowUp />,
    detail: {
      gradient: "linear-gradient(to right, #9333ea, #2563eb)",
      hoverColor: "#9333ea",
      group: "heat",
    },
  },
  min_lwtemp: {
    key: "min_lwtemp",
    label: "最低気温",
    unit: "℃",
    color: "#3b82f6",
    highIcon: <FaTemperatureArrowDown />,
    detail: {
      gradient: "linear-gradient(to right, #2563eb, #0891b2)",
      hoverColor: "#2563eb",
      group: "cold",
    },
  },
  hitemp_35: {
    key: "hitemp_35",
    label: "猛暑日",
    unit: "日",
    tab: "気温日数",
    color: "#e62846",
    highIcon: <PiThermometerHotFill />,
    chartOrder: 0,
    detail: {
      group: "heat",
      gradient: "linear-gradient(to right, #b91c1c, #ef4444)",
      hoverColor: "#b91c1c",
    },
  },
  hitemp_30: {
    key: "hitemp_30",
    label: "真夏日",
    unit: "日",
    tab: "気温日数",
    color: "#e66428",
    highIcon: <TbTemperaturePlus />,
    chartOrder: 1,
    detail: {
      gradient: "linear-gradient(to right, #ea580c, #fb923c)",
      hoverColor: "#ea580c",
      group: "heat",
    },
  },
  hitemp_25: {
    key: "hitemp_25",
    label: "夏日",
    unit: "日",
    tab: "気温日数",
    color: "#e6b428",
    highIcon: <TbTemperature />,
    chartOrder: 2,
    detail: {
      gradient: "linear-gradient(to right, #fb923c, #facc15)",
      hoverColor: "#f59e0b",
      group: "heat",
    },
  },

  lwtemp_0: {
    key: "lwtemp_0",
    label: "冬日",
    unit: "日",
    tab: "気温日数",
    color: "#0064da",
    highIcon: <PiThermometerColdFill />,
    chartOrder: 4,
    detail: {
      gradient: "linear-gradient(to right, #0891b2, #3b82f6)",
      hoverColor: "#0891b2",
      group: "cold",
    },
  },
  hitemp_0: {
    key: "hitemp_0",
    label: "真冬日",
    unit: "日",
    tab: "気温日数",
    color: "#8c328c",
    highIcon: <BsThermometerSnow />,
    chartOrder: 5,
    detail: {
      gradient: "linear-gradient(to right, #7e22ce, #a855f7)",
      hoverColor: "#7e22ce",
      group: "cold",
    },
  },
  lwtemp_25: {
    key: "lwtemp_25",
    label: "熱帯夜",
    unit: "日",
    tab: "気温日数",
    color: "#22c55e",
    highIcon: <MdOutlineNightsStay />,
    detail: {
      gradient: "linear-gradient(to right, #16a34a, #4ade80)",
      hoverColor: "#16a34a",
      group: "heat",
    },
  },
  temp_other: {
    key: "temp_other",
    label: "その他",
    unit: "日",
    tab: "気温日数",
    color: "#009664",
    chartOrder: 3,
    detail: DEFAULT_DETAIL,
  },

  // ===== 降水日数 =====
  rain_15d: {
    key: "rain_15d",
    label: "15日降水",
    unit: "mm",
    color: "#4f46e5",
    highIcon: <BsFillCloudRainHeavyFill />,
    detail: {
      gradient: "linear-gradient(to right, #4338ca, #1d4ed8)",
      hoverColor: "#4338ca",
      group: "rain",
    },
  },
  rain_7d: {
    key: "rain_7d",
    label: "7日降水",
    unit: "mm",
    color: "#6366f1",
    highIcon: <BsFillCloudLightningRainFill />,
    detail: {
      gradient: "linear-gradient(to right, #4f46e5, #2563eb)",
      hoverColor: "#4f46e5",
      group: "rain",
    },
  },

  // ===== 降水日数 (Days) =====
  rain_1: {
    key: "rain_1",
    label: "1mm~",
    unit: "日",
    tab: "降水日数",
    color: "#78c8ff",
    chartOrder: 5,
    detail: DEFAULT_DETAIL,
  },
  rain_10: {
    key: "rain_10",
    label: "10mm~",
    unit: "日",
    tab: "降水日数",
    color: "#50a0ff",
    chartOrder: 4,
    detail: DEFAULT_DETAIL,
  },
  rain_30: {
    key: "rain_30",
    label: "30mm~",
    unit: "日",
    tab: "降水日数",
    color: "#3c78dc",
    chartOrder: 3,
    detail: DEFAULT_DETAIL,
  },
  rain_50: {
    key: "rain_50",
    label: "50mm~",
    unit: "日",
    tab: "降水日数",
    color: "#2850b4",
    chartOrder: 2,
    detail: DEFAULT_DETAIL,
  },
  rain_70: {
    key: "rain_70",
    label: "70mm~",
    unit: "日",
    tab: "降水日数",
    color: "#14288c",
    chartOrder: 1,
    detail: DEFAULT_DETAIL,
  },
  rain_100: {
    key: "rain_100",
    label: "100mm~",
    unit: "日",
    tab: "降水日数",
    color: "#0a1464",
    chartOrder: 0,
    detail: DEFAULT_DETAIL,
  },
  rain_0: {
    key: "rain_0",
    label: "~1mm",
    unit: "日",
    tab: "降水日数",
    color: "#a9a9a9",
    chartOrder: 6,
    detail: DEFAULT_DETAIL,
  },

  // ===== 積雪日数 =====
  snowed_5: {
    key: "snowed_5",
    label: "5cm~",
    unit: "日",
    tab: "積雪日数",
    color: "#ffb4dc",
    chartOrder: 4,
    detail: DEFAULT_DETAIL,
  },
  snowed_10: {
    key: "snowed_10",
    label: "10cm~",
    unit: "日",
    tab: "積雪日数",
    color: "#ff8cb4",
    chartOrder: 3,
    detail: DEFAULT_DETAIL,
  },
  snowed_20: {
    key: "snowed_20",
    label: "20cm~",
    unit: "日",
    tab: "積雪日数",
    color: "#c86e96",
    chartOrder: 2,
    detail: DEFAULT_DETAIL,
  },
  snowed_50: {
    key: "snowed_50",
    label: "50cm~",
    unit: "日",
    tab: "積雪日数",
    color: "#a0466e",
    chartOrder: 1,
    detail: DEFAULT_DETAIL,
  },
  snowed_100: {
    key: "snowed_100",
    label: "100cm~",
    unit: "日",
    tab: "積雪日数",
    color: "#7d1e4b",
    chartOrder: 0,
    detail: DEFAULT_DETAIL,
  },
  snowed_0: {
    key: "snowed_0",
    label: "~5cm",
    unit: "日",
    tab: "積雪日数",
    color: "#a9a9a9",
    chartOrder: 5,
    detail: DEFAULT_DETAIL,
  },

  // ===== 降雪日数 =====
  snowing_3: {
    key: "snowing_3",
    label: "3cm~",
    unit: "日",
    tab: "降雪日数",
    color: "#aa64ff",
    chartOrder: 4,
    detail: DEFAULT_DETAIL,
  },
  snowing_5: {
    key: "snowing_5",
    label: "5cm~",
    unit: "日",
    tab: "降雪日数",
    color: "#8c46e1",
    chartOrder: 3,
    detail: DEFAULT_DETAIL,
  },
  snowing_10: {
    key: "snowing_10",
    label: "10cm~",
    unit: "日",
    tab: "降雪日数",
    color: "#642dc8",
    chartOrder: 2,
    detail: DEFAULT_DETAIL,
  },
  snowing_20: {
    key: "snowing_20",
    label: "20cm~",
    unit: "日",
    tab: "降雪日数",
    color: "#4b1e96",
    chartOrder: 1,
    detail: DEFAULT_DETAIL,
  },
  snowing_50: {
    key: "snowing_50",
    label: "50cm~",
    unit: "日",
    tab: "降雪日数",
    color: "#321464",
    chartOrder: 0,
    detail: DEFAULT_DETAIL,
  },
  snowing_0: {
    key: "snowing_0",
    label: "~3cm",
    unit: "日",
    tab: "降雪日数",
    color: "#a9a9a9",
    chartOrder: 5,
    detail: DEFAULT_DETAIL,
  },

  // ===== 風速日数 =====
  wind_10: {
    key: "wind_10",
    label: "10m/s~",
    unit: "日",
    tab: "風速日数",
    color: "#78f078",
    chartOrder: 3,
    detail: DEFAULT_DETAIL,
  },
  wind_15: {
    key: "wind_15",
    label: "15m/s~",
    unit: "日",
    tab: "風速日数",
    color: "#50dc50",
    chartOrder: 2,
    detail: DEFAULT_DETAIL,
  },
  wind_20: {
    key: "wind_20",
    label: "20m/s~",
    unit: "日",
    tab: "風速日数",
    color: "#32c832",
    chartOrder: 1,
    detail: DEFAULT_DETAIL,
  },
  wind_30: {
    key: "wind_30",
    label: "30m/s~",
    unit: "日",
    tab: "風速日数",
    color: "#199619",
    chartOrder: 0,
    detail: DEFAULT_DETAIL,
  },
  wind_0: {
    key: "wind_0",
    label: "~10m/s",
    unit: "日",
    tab: "風速日数",
    color: "#a9a9a9",
    chartOrder: 4,
    detail: DEFAULT_DETAIL,
  },
} as const;

// ==============================
// 3. Derived Types (Auto-extracted from internal raw master)
// ==============================
export type MetricValue = keyof typeof _rawMetricKey;

export type MetricMeta = {
  key: MetricValue;
  label: string;
  unit: MetricUnit;
  tab?: MetricTab;
  highIcon?: React.ReactNode;
  lowIcon?: React.ReactNode;
  detail: MetricDetail;
  color: string;
  chartOrder?: number;
};

// Expose MetricKey with unified Record type to prevent optional property access issues
export const MetricKey: Record<MetricValue, MetricMeta> = _rawMetricKey;

// ==============================
// 4. Utilities
// ==============================
export const METRIC_LIST = Object.keys(MetricKey) as MetricValue[];
