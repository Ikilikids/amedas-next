// ==============================
// base types
// ==============================

import { AiFillSun } from "react-icons/ai";
import { BiWind } from "react-icons/bi";
import { BsCloudsFill, BsFillCloudRainHeavyFill } from "react-icons/bs";
import { FaHotjar } from "react-icons/fa";
import { FaSnowman } from "react-icons/fa6";
import { PiHairDryer, PiThermometerColdFill } from "react-icons/pi";
import { TbTemperaturePlus } from "react-icons/tb";

export type MetricUnit = "℃" | "mm" | "cm" | "m/s" | "時間" | "日";

export type MetricTab =
  | "主要"
  | "平均"
  | "気温日数"
  | "降水日数"
  | "降雪日数"
  | "積雪日数"
  | "風速日数"
  | "極値";

export type MetricCategory = "気温" | "降水" | "降雪" | "積雪" | "風" | "日照";

export type MetricMeta = {
  key: MetricValue;
  label: string;
  unit: MetricUnit;
  tab: MetricTab;
  category: MetricCategory;
  highIcon?: React.ReactNode;
  lowIcon?: React.ReactNode;
};

// ==============================
// definition（← これが本体）
// ==============================

export const MetricKey = {
  // ===== 主要 =====
  av_avtemp: {
    key: "av_avtemp",
    label: "平均気温",
    unit: "℃",
    tab: "主要",
    category: "気温",
    highIcon: <TbTemperaturePlus />,
    lowIcon: <PiThermometerColdFill />,
  },
  sm_sun: {
    key: "sm_sun",
    label: "日照時間",
    unit: "時間",
    tab: "主要",
    category: "日照",
    highIcon: <AiFillSun />,
    lowIcon: <BsCloudsFill />,
  },
  sm_rain: {
    key: "sm_rain",
    label: "降水量",
    unit: "mm",
    tab: "主要",
    category: "降水",
    highIcon: <BsFillCloudRainHeavyFill />,
    lowIcon: <PiHairDryer />,
  },
  sm_snowing: {
    key: "sm_snowing",
    label: "降雪量",
    unit: "cm",
    tab: "主要",
    category: "降雪",
    highIcon: <FaSnowman />,
  },

  // ===== 平均 =====
  av_hitemp: {
    key: "av_hitemp",
    label: "平均最高気温",
    unit: "℃",
    tab: "平均",
    category: "気温",
  },
  av_lwtemp: {
    key: "av_lwtemp",
    label: "平均最低気温",
    unit: "℃",
    tab: "平均",
    category: "気温",
  },
  av_wind: {
    key: "av_wind",
    label: "平均風速",
    unit: "m/s",
    tab: "平均",
    category: "風",
    highIcon: <BiWind />,
  },

  // ===== 気温日数 =====
  hitemp_25: {
    key: "hitemp_25",
    label: "夏日",
    unit: "日",
    tab: "気温日数",
    category: "気温",
  },
  hitemp_30: {
    key: "hitemp_30",
    label: "真夏日",
    unit: "日",
    tab: "気温日数",
    category: "気温",
  },
  hitemp_35: {
    key: "hitemp_35",
    label: "猛暑日",
    unit: "日",
    tab: "気温日数",
    category: "気温",
    highIcon: <FaHotjar />,
  },
  lwtemp_0: {
    key: "lwtemp_0",
    label: "冬日",
    unit: "日",
    tab: "気温日数",
    category: "気温",
  },
  hitemp_0: {
    key: "hitemp_0",
    label: "真冬日",
    unit: "日",
    tab: "気温日数",
    category: "気温",
  },
  lwtemp_25: {
    key: "lwtemp_25",
    label: "熱帯夜",
    unit: "日",
    tab: "気温日数",
    category: "気温",
  },

  // ===== 降水日数 =====
  rain_1: {
    key: "rain_1",
    label: "日降水量1mm以上",
    unit: "日",
    tab: "降水日数",
    category: "降水",
  },
  rain_10: {
    key: "rain_10",
    label: "日降水量10mm以上",
    unit: "日",
    tab: "降水日数",
    category: "降水",
  },
  rain_30: {
    key: "rain_30",
    label: "日降水量30mm以上",
    unit: "日",
    tab: "降水日数",
    category: "降水",
  },
  rain_50: {
    key: "rain_50",
    label: "日降水量50mm以上",
    unit: "日",
    tab: "降水日数",
    category: "降水",
  },
  rain_70: {
    key: "rain_70",
    label: "日降水量70mm以上",
    unit: "日",
    tab: "降水日数",
    category: "降水",
  },
  rain_100: {
    key: "rain_100",
    label: "日降水量100mm以上",
    unit: "日",
    tab: "降水日数",
    category: "降水",
  },

  // ===== 積雪日数 =====
  snowed_5: {
    key: "snowed_5",
    label: "日積雪量5cm以上",
    unit: "日",
    tab: "積雪日数",
    category: "積雪",
  },
  snowed_10: {
    key: "snowed_10",
    label: "日積雪量10cm以上",
    unit: "日",
    tab: "積雪日数",
    category: "積雪",
  },
  snowed_20: {
    key: "snowed_20",
    label: "日積雪量20cm以上",
    unit: "日",
    tab: "積雪日数",
    category: "積雪",
  },
  snowed_50: {
    key: "snowed_50",
    label: "日積雪量50cm以上",
    unit: "日",
    tab: "積雪日数",
    category: "積雪",
  },
  snowed_100: {
    key: "snowed_100",
    label: "日積雪量100cm以上",
    unit: "日",
    tab: "積雪日数",
    category: "積雪",
  },

  // ===== 降雪日数 =====
  snowing_3: {
    key: "snowing_3",
    label: "日降雪量3cm以上",
    unit: "日",
    tab: "降雪日数",
    category: "降雪",
  },
  snowing_5: {
    key: "snowing_5",
    label: "日降雪量5cm以上",
    unit: "日",
    tab: "降雪日数",
    category: "降雪",
  },
  snowing_10: {
    key: "snowing_10",
    label: "日降雪量10cm以上",
    unit: "日",
    tab: "降雪日数",
    category: "降雪",
  },
  snowing_20: {
    key: "snowing_20",
    label: "日降雪量20cm以上",
    unit: "日",
    tab: "降雪日数",
    category: "降雪",
  },
  snowing_50: {
    key: "snowing_50",
    label: "日降雪量50cm以上",
    unit: "日",
    tab: "降雪日数",
    category: "降雪",
  },

  // ===== 風速日数 =====
  wind_10: {
    key: "wind_10",
    label: "日平均風速10m/s以上",
    unit: "日",
    tab: "風速日数",
    category: "風",
  },
  wind_15: {
    key: "wind_15",
    label: "日平均風速15m/s以上",
    unit: "日",
    tab: "風速日数",
    category: "風",
  },
  wind_20: {
    key: "wind_20",
    label: "日平均風速20m/s以上",
    unit: "日",
    tab: "風速日数",
    category: "風",
  },
  wind_30: {
    key: "wind_30",
    label: "日平均風速30m/s以上",
    unit: "日",
    tab: "風速日数",
    category: "風",
  },
} as const satisfies Record<string, any>;

export type MetricValue = keyof typeof MetricKey;
export const METRIC_KEYS = Object.keys(MetricKey) as MetricValue[];
