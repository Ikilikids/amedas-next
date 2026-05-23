// ===== MetricKey =====
export const MetricKey = {
  Av_AvTemp: "Av_AvTemp",
  Av_HiTemp: "Av_HiTemp",
  Sm_Sun: "Sm_Sun",
  Sm_Rain: "Sm_Rain",
  Sm_Snowing: "Sm_Snowing",
  Av_LwTemp: "Av_LwTemp",
  Av_Wind: "Av_Wind",

  HiTemp_25: "HiTemp_25",
  HiTemp_30: "HiTemp_30",
  HiTemp_35: "HiTemp_35",
  LwTemp_0: "LwTemp_0",
  HiTemp_0: "HiTemp_0",
  LwTemp_25: "LwTemp_25",

  Rain_1: "Rain_1",
  Rain_10: "Rain_10",
  Rain_30: "Rain_30",
  Rain_50: "Rain_50",
  Rain_70: "Rain_70",
  Rain_100: "Rain_100",

  Snowed_5: "Snowed_5",
  Snowed_10: "Snowed_10",
  Snowed_20: "Snowed_20",
  Snowed_50: "Snowed_50",
  Snowed_100: "Snowed_100",

  Snowing_3: "Snowing_3",
  Snowing_5: "Snowing_5",
  Snowing_10: "Snowing_10",
  Snowing_20: "Snowing_20",
  Snowing_50: "Snowing_50",

  Wind_10: "Wind_10",
  Wind_15: "Wind_15",
  Wind_20: "Wind_20",
  Wind_30: "Wind_30",

  Max_Snowed: "Max_Snowed",
  Max_HiTemp: "Max_HiTemp",
  Min_LwTemp: "Min_LwTemp",
} as const;

export type MetricKey = (typeof MetricKey)[keyof typeof MetricKey];

// ===== MetricUnit =====
export const MetricUnit = {
  Temp: "℃",
  Rain: "mm",
  Snow: "cm",
  Wind: "m/s",
  Sun: "時間",
  Day: "日",
} as const;

export type MetricUnit = (typeof MetricUnit)[keyof typeof MetricUnit];

// ===== MetricTab =====
export const MetricTab = {
  Main: "主要",
  Avg: "平均",
  TempDays: "気温日数",
  RainDays: "降水日数",
  SnowDays: "降雪日数",
  SnowDepthDays: "積雪日数",
  WindDays: "風速日数",
  Extreme: "極値",
} as const;

export type MetricTab = (typeof MetricTab)[keyof typeof MetricTab];

// ===== MetricCategory =====
export const MetricCategory = {
  Temp: "気温",
  Rain: "降水",
  Snow: "降雪",
  SnowDepth: "積雪",
  Wind: "風",
  Sun: "日照",
} as const;

export type MetricCategory =
  (typeof MetricCategory)[keyof typeof MetricCategory];

// ===== interface =====
export interface Metric {
  label: string;
  tab: MetricTab;
  unit: MetricUnit;
  category: MetricCategory;
}

// ===== 本体 =====
export const metrics = {
  // ===== 主要・平均 =====
  [MetricKey.Av_AvTemp]: {
    label: "平均気温",
    tab: MetricTab.Main,
    unit: MetricUnit.Temp,
    category: MetricCategory.Temp,
  },
  [MetricKey.Av_HiTemp]: {
    label: "平均最高気温",
    tab: MetricTab.Avg,
    unit: MetricUnit.Temp,
    category: MetricCategory.Temp,
  },
  [MetricKey.Av_LwTemp]: {
    label: "平均最低気温",
    tab: MetricTab.Avg,
    unit: MetricUnit.Temp,
    category: MetricCategory.Temp,
  },
  [MetricKey.Sm_Sun]: {
    label: "日照時間",
    tab: MetricTab.Main,
    unit: MetricUnit.Sun,
    category: MetricCategory.Sun,
  },
  [MetricKey.Sm_Rain]: {
    label: "降水量",
    tab: MetricTab.Main,
    unit: MetricUnit.Rain,
    category: MetricCategory.Rain,
  },
  [MetricKey.Sm_Snowing]: {
    label: "降雪量",
    tab: MetricTab.Main,
    unit: MetricUnit.Snow,
    category: MetricCategory.Snow,
  },
  [MetricKey.Av_Wind]: {
    label: "平均風速",
    tab: MetricTab.Avg,
    unit: MetricUnit.Wind,
    category: MetricCategory.Wind,
  },

  // ===== 気温日数 =====
  [MetricKey.HiTemp_25]: {
    label: "夏日",
    tab: MetricTab.TempDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Temp,
  },
  [MetricKey.HiTemp_30]: {
    label: "真夏日",
    tab: MetricTab.TempDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Temp,
  },
  [MetricKey.HiTemp_35]: {
    label: "猛暑日",
    tab: MetricTab.TempDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Temp,
  },
  [MetricKey.LwTemp_0]: {
    label: "冬日",
    tab: MetricTab.TempDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Temp,
  },
  [MetricKey.HiTemp_0]: {
    label: "真冬日",
    tab: MetricTab.TempDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Temp,
  },
  [MetricKey.LwTemp_25]: {
    label: "熱帯夜",
    tab: MetricTab.TempDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Temp,
  },

  // ===== 降水日数 =====
  [MetricKey.Rain_1]: {
    label: "日降水量1mm以上",
    tab: MetricTab.RainDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Rain,
  },
  [MetricKey.Rain_10]: {
    label: "日降水量10mm以上",
    tab: MetricTab.RainDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Rain,
  },
  [MetricKey.Rain_30]: {
    label: "日降水量30mm以上",
    tab: MetricTab.RainDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Rain,
  },
  [MetricKey.Rain_50]: {
    label: "日降水量50mm以上",
    tab: MetricTab.RainDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Rain,
  },
  [MetricKey.Rain_70]: {
    label: "日降水量70mm以上",
    tab: MetricTab.RainDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Rain,
  },
  [MetricKey.Rain_100]: {
    label: "日降水量100mm以上",
    tab: MetricTab.RainDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Rain,
  },

  // ===== 積雪日数 =====
  [MetricKey.Snowed_5]: {
    label: "日積雪量5cm以上",
    tab: MetricTab.SnowDepthDays,
    unit: MetricUnit.Day,
    category: MetricCategory.SnowDepth,
  },
  [MetricKey.Snowed_10]: {
    label: "日積雪量10cm以上",
    tab: MetricTab.SnowDepthDays,
    unit: MetricUnit.Day,
    category: MetricCategory.SnowDepth,
  },
  [MetricKey.Snowed_20]: {
    label: "日積雪量20cm以上",
    tab: MetricTab.SnowDepthDays,
    unit: MetricUnit.Day,
    category: MetricCategory.SnowDepth,
  },
  [MetricKey.Snowed_50]: {
    label: "日積雪量50cm以上",
    tab: MetricTab.SnowDepthDays,
    unit: MetricUnit.Day,
    category: MetricCategory.SnowDepth,
  },
  [MetricKey.Snowed_100]: {
    label: "日積雪量100cm以上",
    tab: MetricTab.SnowDepthDays,
    unit: MetricUnit.Day,
    category: MetricCategory.SnowDepth,
  },

  // ===== 降雪日数 =====
  [MetricKey.Snowing_3]: {
    label: "日降雪量3cm以上",
    tab: MetricTab.SnowDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Snow,
  },
  [MetricKey.Snowing_5]: {
    label: "日降雪量5cm以上",
    tab: MetricTab.SnowDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Snow,
  },
  [MetricKey.Snowing_10]: {
    label: "日降雪量10cm以上",
    tab: MetricTab.SnowDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Snow,
  },
  [MetricKey.Snowing_20]: {
    label: "日降雪量20cm以上",
    tab: MetricTab.SnowDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Snow,
  },
  [MetricKey.Snowing_50]: {
    label: "日降雪量50cm以上",
    tab: MetricTab.SnowDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Snow,
  },

  // ===== 風速日数 =====
  [MetricKey.Wind_10]: {
    label: "日平均風速10m/s以上",
    tab: MetricTab.WindDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Wind,
  },
  [MetricKey.Wind_15]: {
    label: "日平均風速15m/s以上",
    tab: MetricTab.WindDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Wind,
  },
  [MetricKey.Wind_20]: {
    label: "日平均風速20m/s以上",
    tab: MetricTab.WindDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Wind,
  },
  [MetricKey.Wind_30]: {
    label: "日平均風速30m/s以上",
    tab: MetricTab.WindDays,
    unit: MetricUnit.Day,
    category: MetricCategory.Wind,
  },

  // ===== 極値 =====
  [MetricKey.Max_Snowed]: {
    label: "最深積雪",
    tab: MetricTab.Extreme,
    unit: MetricUnit.Snow,
    category: MetricCategory.SnowDepth,
  },
  [MetricKey.Max_HiTemp]: {
    label: "最高気温",
    tab: MetricTab.Extreme,
    unit: MetricUnit.Temp,
    category: MetricCategory.Temp,
  },
  [MetricKey.Min_LwTemp]: {
    label: "最低気温",
    tab: MetricTab.Extreme,
    unit: MetricUnit.Temp,
    category: MetricCategory.Temp,
  },
} as const satisfies Record<MetricKey, Metric>;

export const metricList = Object.entries(metrics).map(([key, value]) => {
  return {
    key: key as keyof typeof metrics,
    ...value,
  };
});
