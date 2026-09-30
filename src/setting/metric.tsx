import React from "react";
import { AiFillSun } from "react-icons/ai";
import { BiWind } from "react-icons/bi";
import {
  BsCloudDrizzleFill,
  BsCloudRainFill,
  BsCloudsFill,
  BsFillCloudLightningRainFill,
  BsFillCloudRainFill,
  BsFillCloudRainHeavyFill,
  BsFillCloudSunFill,
  BsThermometerSnow,
} from "react-icons/bs";
import { IoThunderstormSharp } from "react-icons/io5";
import {
  FaSnowflake,
  FaSnowman,
  FaTemperatureArrowDown,
  FaTemperatureArrowUp,
} from "react-icons/fa6";
import { MdDryCleaning, MdOutlineNightsStay, MdWindPower } from "react-icons/md";
import { PiThermometerColdFill, PiThermometerHotDuotone, PiThermometerHotFill } from "react-icons/pi";
import { TbSnowman, TbTemperature, TbTemperaturePlus, TbWindOff } from "react-icons/tb";
import { ImFire } from "react-icons/im";
import { WiDayCloudy, WiNightSnowThunderstorm, WiSnow } from "react-icons/wi";
import { GiWhirlwind } from "react-icons/gi";
import { MetricDistribution, METRIC_DISTRIBUTIONS } from "./metricDistributions";

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

export type AssembleTarget =
  | "overview"
  | "table"
  | "ratio"
  | "uonzu";

export type MetricDirectionMeta = {
  label: string;
  thresholdText?: string;
  color: string;
  icon: React.ReactNode;
};

export type MetricStarLevel = {
  threshold: number;
  label: string;
};

export type MetricStarMeta = {
  baseLabel: string;
  levels: readonly MetricStarLevel[] | MetricStarLevel[];
};

export type MetricDetail = {
  gradient: string; // CSS linear-gradient string
  hoverColor: string; // Hex color for hover text
  group?: MetricGroup;
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
    color: "#ea580c",
    icon: <TbTemperature />,
    useForJson: ["overview", "table", "ratio", "uonzu"],
    high: {
      label: "年平均気温(温暖)",
      color: "#ea580c",
      icon: <TbTemperaturePlus />,
    },
    low: {
      label: "年平均気温(寒冷)",
      color: "#0284c7",
      icon: <PiThermometerColdFill />,
    },
    detail: {
      gradient: "linear-gradient(to right, #ea580c, #fb923c)",
      hoverColor: "#ea580c",
    },
    star: {
      baseLabel: "極寒", // 富士山(-5.9℃)
      levels: [
        { threshold: 6.0, label: "厳寒" }, // 旭川(7.1℃)
        { threshold: 8.0, label: "強寒冷" }, // 札幌(9.2℃)
        { threshold: 10.0, label: "寒冷" }, // 盛岡(10.6℃)
        { threshold: 12.0, label: "冷涼" }, // 秋田(12.1℃)
        { threshold: 13.0, label: "やや冷涼" }, // 仙台(13.0℃)
        { threshold: 14.0, label: "涼しめ" }, // 宇都宮(14.2℃)
        { threshold: 15.0, label: "標準" }, // 東京(15.8℃)
        { threshold: 16.0, label: "やや温暖" }, // 名古屋(16.2℃)
        { threshold: 17.0, label: "温暖" }, // 大阪(17.1℃)
        { threshold: 18.0, label: "亜熱帯的" }, // 八丈島(18.0℃)
        { threshold: 23.0, label: "熱帯的" }, // 那覇(23.3℃)
      ],
    },
  },
  sm_sun: {
    key: "sm_sun",
    label: "日照時間",
    unit: "h",
    tab: "主要",
    color: "#eab308",
    icon: <AiFillSun />,
    useForJson: ["overview", "table", "ratio", "uonzu"],
    high: {
      label: "年間日照時間(多照)",
      color: "#eab308",
      icon: <AiFillSun />,
    },
    low: {
      label: "年間日照時間(僅照)",
      color: "#64748b",
      icon: <BsCloudsFill />,
    },
    detail: {
      gradient: "linear-gradient(to right, #eab308, #facc15)",
      hoverColor: "#ca8a04",
    },
    star: {
      baseLabel: "極僅照",
      levels: [
        { threshold: 1400, label: "僅照" },
        { threshold: 1500, label: "かなり寡照" },
        { threshold: 1600, label: "寡照" },
        { threshold: 1700, label: "やや寡照" },
        { threshold: 1800, label: "標準的" },
        { threshold: 1900, label: "やや多照" },
        { threshold: 2000, label: "多照" },
        { threshold: 2100, label: "非常に多照" },
        { threshold: 2200, label: "全国屈指の快晴" },
      ],
    },
  },
  sm_rain: {
    key: "sm_rain",
    label: "降水量",
    unit: "mm",
    tab: "主要",
    color: "#1d4ed8",
    icon: <BsFillCloudRainFill />,
    useForJson: ["overview", "table", "ratio", "uonzu"],
    high: {
      label: "年間降水量(多雨)",
      color: "#1d4ed8",
      icon: <BsFillCloudRainFill />,
    },
    low: {
      label: "年間降水量(少雨)",
      color: "#b45309",
      icon: <MdDryCleaning />,
    },
    detail: {
      gradient: "linear-gradient(to right, #1d4ed8, #445588)",
      hoverColor: "#1e3a8a",
      group: "rain",
    },
    star: {
      baseLabel: "極めて少雨",
      levels: [
        { threshold: 1000, label: "少雨" },
        { threshold: 1200, label: "やや少雨" },
        { threshold: 1400, label: "標準的" },
        { threshold: 1600, label: "適度な降雨" },
        { threshold: 1800, label: "やや多雨" },
        { threshold: 2000, label: "多雨" },
        { threshold: 2500, label: "強多雨" },
        { threshold: 3000, label: "極めて多雨" },
        { threshold: 3500, label: "全国屈指の多雨" },
      ],
    },
  },
  sm_snowing: {
    key: "sm_snowing",
    label: "降雪量",
    unit: "cm",
    tab: "主要",
    color: "#7e22ce",
    icon: <FaSnowflake />,
    useForJson: ["overview", "table", "ratio", "uonzu"],
    high: {
      label: "年間降雪量",
      color: "#7e22ce",
      icon: <FaSnowflake />,
    },
    detail: {
      gradient: "linear-gradient(to right, #7e22ce, #a855f7)",
      hoverColor: "#7e22ce",
    },
    star: {
      baseLabel: "無雪",
      levels: [
        { threshold: 1, label: "ほぼ無雪" },
        { threshold: 20, label: "微雪" },
        { threshold: 50, label: "やや少雪" },
        { threshold: 100, label: "適度な降雪" },
        { threshold: 200, label: "やや多雪" },
        { threshold: 300, label: "多雪" },
        { threshold: 500, label: "強多雪" },
        { threshold: 700, label: "極めて多雪" },
        { threshold: 1000, label: "全国屈指の豪雪" },
      ],
    },
  },

  // ===== 平均 =====
  av_hitemp: {
    key: "av_hitemp",
    label: "最高気温",
    unit: "℃",
    tab: "平均",
    color: "#b91c1c",
    icon: <FaTemperatureArrowUp />,
    useForJson: ["table", "ratio", "uonzu"],
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
    color: "#2563eb",
    icon: <FaTemperatureArrowDown />,
    useForJson: ["table", "ratio", "uonzu"],
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
    color: "#16a34a",
    icon: <BiWind />,
    useForJson: ["overview", "table", "ratio"],
    high: {
      label: "年平均風速",
      color: "#16a34a",
      icon: <BiWind />,
    },
    detail: {
      gradient: "linear-gradient(to right, #16a34a, #22c55e)",
      hoverColor: "#15803d",
    },
    star: {
      baseLabel: "極めて穏やか",
      levels: [
        { threshold: 1.0, label: "穏やか" },
        { threshold: 1.5, label: "やや弱め" },
        { threshold: 2.0, label: "標準的" },
        { threshold: 2.5, label: "風あり" },
        { threshold: 3, label: "やや強め" },
        { threshold: 4, label: "強風" },
        { threshold: 5, label: "かなり強風" },
        { threshold: 6, label: "暴風" },
      ],
    },
  },

  // ===== 極値 =====
  max_hitemp: {
    key: "max_hitemp",
    label: "最高気温",
    unit: "℃",
    color: "#9333ea",
    icon: <FaTemperatureArrowUp />,
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
    color: "#2563eb",
    icon: <FaTemperatureArrowDown />,
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
    color: "#b91c1c",
    icon: <ImFire />,
    useForJson: ["overview", "ratio"],
    high: {
      label: "猛暑日数",
      color: "#b91c1c",
      icon: <ImFire />,
    },
    chartOrder: 0,
    detail: {
      group: "heat",
      gradient: "linear-gradient(to right, #b91c1c, #ef4444)",
      hoverColor: "#b91c1c",
    },
    star: {
      baseLabel: "猛暑日なし",
      levels: [
        { threshold: 0.1, label: "ごく稀に発生" },
        { threshold: 3.0, label: "少なめ" },
        { threshold: 5.0, label: "標準的" },
        { threshold: 8.0, label: "やや多め" },
        { threshold: 10.0, label: "多め" },
        { threshold: 12.0, label: "かなり多め" },
        { threshold: 15.0, label: "激しい猛暑" },
        { threshold: 18.0, label: "日本屈指の灼熱" },
      ],
    },
  },
  hitemp_30: {
    key: "hitemp_30",
    label: "真夏日",
    unit: "日",
    tab: "気温日数",
    color: "#ea580c",
    icon: <PiThermometerHotDuotone />,
    useForJson: ["ratio"],
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
    color: "#fb923c",
    icon: <TbTemperaturePlus />,
    useForJson: ["ratio"],
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
    color: "#0891b2",
    icon: <PiThermometerColdFill />,
    useForJson: ["ratio"],
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
    color: "#7e22ce",
    icon: <BsThermometerSnow />,
    useForJson: ["ratio"],
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
    color: "#16a34a",
    icon: <MdOutlineNightsStay />,
    useForJson: ["ratio"],
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
    icon: <TbTemperature />,
    chartOrder: 3,
    detail: DEFAULT_DETAIL,
  },

  // ===== 降水日数 =====
  rain_15d: {
    key: "rain_15d",
    label: "15日降水",
    unit: "mm",
    color: "#4338ca",
    icon: <BsFillCloudRainHeavyFill />,
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
    color: "#4f46e5",
    icon: <BsFillCloudLightningRainFill />,
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
    color: "#0284c7",
    icon: <BsCloudDrizzleFill />,
    useForJson: ["ratio"],
    chartOrder: 5,
    detail: {
      gradient: "linear-gradient(to right, #0284c7, #38bdf8)",
      hoverColor: "#0284c7",
    },
  },
  rain_10: {
    key: "rain_10",
    label: "10mm~",
    unit: "日",
    tab: "降水日数",
    color: "#0369a1",
    icon: <BsCloudRainFill />,
    useForJson: ["ratio"],
    chartOrder: 4,
    detail: {
      gradient: "linear-gradient(to right, #0369a1, #0ea5e9)",
      hoverColor: "#0369a1",
    },
  },
  rain_30: {
    key: "rain_30",
    label: "30mm~",
    unit: "日",
    tab: "降水日数",
    color: "#1d4ed8",
    icon: <BsFillCloudRainFill />,
    useForJson: ["ratio"],
    chartOrder: 3,
    detail: {
      gradient: "linear-gradient(to right, #1d4ed8, #3b82f6)",
      hoverColor: "#1d4ed8",
    },
  },
  rain_50: {
    key: "rain_50",
    label: "50mm~",
    unit: "日",
    tab: "降水日数",
    color: "#1e40af",
    icon: <BsFillCloudRainHeavyFill />,
    useForJson: ["ratio"],
    chartOrder: 2,
    detail: {
      gradient: "linear-gradient(to right, #1e40af, #2563eb)",
      hoverColor: "#1e40af",
    },
  },
  rain_70: {
    key: "rain_70",
    label: "70mm~",
    unit: "日",
    tab: "降水日数",
    color: "#1e3a8a",
    icon: <BsFillCloudLightningRainFill />,
    useForJson: ["ratio"],
    chartOrder: 1,
    detail: {
      gradient: "linear-gradient(to right, #1e3a8a, #1d4ed8)",
      hoverColor: "#1e3a8a",
    },
  },
  rain_100: {
    key: "rain_100",
    label: "100mm~",
    unit: "日",
    tab: "降水日数",
    color: "#0f172a",
    icon: <IoThunderstormSharp />,
    useForJson: ["ratio"],
    chartOrder: 0,
    detail: {
      gradient: "linear-gradient(to right, #0f172a, #1e3a8a)",
      hoverColor: "#0f172a",
    },
  },
  rain_0: {
    key: "rain_0",
    label: "~1mm",
    unit: "日",
    tab: "降水日数",
    color: "#a9a9a9",
    icon: <BsFillCloudSunFill />,
    chartOrder: 6,
    detail: DEFAULT_DETAIL,
  },

  // ===== 積雪日数 =====
  snowed_5: {
    key: "snowed_5",
    label: "5cm~",
    unit: "日",
    tab: "積雪日数",
    color: "#ec4899",
    icon: <TbSnowman />,
    useForJson: ["ratio"],
    chartOrder: 4,
    detail: {
      gradient: "linear-gradient(to right, #ec4899, #f472b6)",
      hoverColor: "#db2777",
    },
  },
  snowed_10: {
    key: "snowed_10",
    label: "10cm~",
    unit: "日",
    tab: "積雪日数",
    color: "#db2777",
    icon: <TbSnowman />,
    useForJson: ["ratio"],
    chartOrder: 3,
    detail: {
      gradient: "linear-gradient(to right, #db2777, #ec4899)",
      hoverColor: "#be185d",
    },
  },
  snowed_20: {
    key: "snowed_20",
    label: "20cm~",
    unit: "日",
    tab: "積雪日数",
    color: "#be185d",
    icon: <TbSnowman />,
    useForJson: ["ratio"],
    chartOrder: 2,
    detail: {
      gradient: "linear-gradient(to right, #be185d, #db2777)",
      hoverColor: "#9d174d",
    },
  },
  snowed_50: {
    key: "snowed_50",
    label: "50cm~",
    unit: "日",
    tab: "積雪日数",
    color: "#9d174d",
    icon: <FaSnowman />,
    useForJson: ["ratio"],
    chartOrder: 1,
    detail: {
      gradient: "linear-gradient(to right, #9d174d, #be185d)",
      hoverColor: "#831843",
    },
  },
  snowed_100: {
    key: "snowed_100",
    label: "100cm~",
    unit: "日",
    tab: "積雪日数",
    color: "#701a75",
    icon: <FaSnowman />,
    useForJson: ["ratio"],
    chartOrder: 0,
    detail: {
      gradient: "linear-gradient(to right, #701a75, #831843)",
      hoverColor: "#701a75",
    },
  },
  snowed_0: {
    key: "snowed_0",
    label: "~5cm",
    unit: "日",
    tab: "積雪日数",
    color: "#a9a9a9",
    icon: <BsFillCloudSunFill />,
    chartOrder: 5,
    detail: DEFAULT_DETAIL,
  },

  // ===== 降雪日数 =====
  snowing_3: {
    key: "snowing_3",
    label: "3cm~",
    unit: "日",
    tab: "降雪日数",
    color: "#9333ea",
    icon: <WiSnow />,
    useForJson: ["ratio"],
    chartOrder: 4,
    detail: {
      gradient: "linear-gradient(to right, #9333ea, #a855f7)",
      hoverColor: "#7e22ce",
    },
  },
  snowing_5: {
    key: "snowing_5",
    label: "5cm~",
    unit: "日",
    tab: "降雪日数",
    color: "#7e22ce",
    icon: <WiSnow />,
    useForJson: ["ratio"],
    chartOrder: 3,
    detail: {
      gradient: "linear-gradient(to right, #7e22ce, #9333ea)",
      hoverColor: "#6b21a8",
    },
  },
  snowing_10: {
    key: "snowing_10",
    label: "10cm~",
    unit: "日",
    tab: "降雪日数",
    color: "#6b21a8",
    icon: <WiSnow />,
    useForJson: ["ratio"],
    chartOrder: 2,
    detail: {
      gradient: "linear-gradient(to right, #6b21a8, #7e22ce)",
      hoverColor: "#581c87",
    },
  },
  snowing_20: {
    key: "snowing_20",
    label: "20cm~",
    unit: "日",
    tab: "降雪日数",
    color: "#581c87",
    icon: <WiNightSnowThunderstorm />,
    useForJson: ["ratio"],
    chartOrder: 1,
    detail: {
      gradient: "linear-gradient(to right, #581c87, #6b21a8)",
      hoverColor: "#3b0764",
    },
  },
  snowing_50: {
    key: "snowing_50",
    label: "50cm~",
    unit: "日",
    tab: "降雪日数",
    color: "#3b0764",
    icon: <WiNightSnowThunderstorm />,
    useForJson: ["ratio"],
    chartOrder: 0,
    detail: {
      gradient: "linear-gradient(to right, #3b0764, #581c87)",
      hoverColor: "#2e1065",
    },
  },
  snowing_0: {
    key: "snowing_0",
    label: "~3cm",
    unit: "日",
    tab: "降雪日数",
    color: "#a9a9a9",
    icon: <BsFillCloudSunFill />,
    chartOrder: 5,
    detail: DEFAULT_DETAIL,
  },

  // ===== 風速日数 =====
  wind_10: {
    key: "wind_10",
    label: "10m/s~",
    unit: "日",
    tab: "風速日数",
    color: "#16a34a",
    icon: <MdWindPower />,
    useForJson: ["ratio"],
    chartOrder: 3,
    detail: {
      gradient: "linear-gradient(to right, #16a34a, #22c55e)",
      hoverColor: "#15803d",
    },
  },
  wind_15: {
    key: "wind_15",
    label: "15m/s~",
    unit: "日",
    tab: "風速日数",
    color: "#15803d",
    icon: <MdWindPower />,
    useForJson: ["ratio"],
    chartOrder: 2,
    detail: {
      gradient: "linear-gradient(to right, #15803d, #16a34a)",
      hoverColor: "#166534",
    },
  },
  wind_20: {
    key: "wind_20",
    label: "20m/s~",
    unit: "日",
    tab: "風速日数",
    color: "#166534",
    icon: <GiWhirlwind />,
    useForJson: ["ratio"],
    chartOrder: 1,
    detail: {
      gradient: "linear-gradient(to right, #166534, #15803d)",
      hoverColor: "#14532d",
    },
  },
  wind_30: {
    key: "wind_30",
    label: "30m/s~",
    unit: "日",
    tab: "風速日数",
    color: "#14532d",
    icon: <GiWhirlwind />,
    useForJson: ["ratio"],
    chartOrder: 0,
    detail: {
      gradient: "linear-gradient(to right, #14532d, #166534)",
      hoverColor: "#052e16",
    },
  },
  wind_0: {
    key: "wind_0",
    label: "~10m/s",
    unit: "日",
    tab: "風速日数",
    color: "#a9a9a9",
    icon: <TbWindOff />,
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
  color: string;
  icon?: React.ReactNode;
  detail: MetricDetail;
  chartOrder?: number;
  high?: MetricDirectionMeta;
  low?: MetricDirectionMeta;
  star?: MetricStarMeta;
  distribution?: MetricDistribution;
  useForJson?: readonly AssembleTarget[]
};



// MetricKey に distribution を join して export
const _rawMetricKeyTyped = _rawMetricKey as Record<string, Omit<MetricMeta, "distribution">>;
export const MetricKey: Record<MetricValue, MetricMeta> = Object.fromEntries(
  Object.entries(_rawMetricKeyTyped).map(([k, v]) => [
    k,
    { ...v, distribution: METRIC_DISTRIBUTIONS[k as MetricValue] },
  ])
) as Record<MetricValue, MetricMeta>;

// ==============================
// 4. Utilities
// ==============================
export const METRIC_LIST = Object.keys(MetricKey) as MetricValue[];

