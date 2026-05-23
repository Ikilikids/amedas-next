import React from "react";
import { IconType } from "react-icons";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPlane,
  FaSatelliteDish,
} from "react-icons/fa";

export function getRegionColor(pre: string): string {
  if (pre.startsWith("北海道")) return "rgba(142,134,212,0.7)";

  const tohokus = ["青森", "岩手", "秋田", "宮城", "山形", "福島"];
  if (tohokus.some((p) => pre.startsWith(p))) return "rgba(50,191,204,0.7)";

  const kanto = ["茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川"];
  if (kanto.some((p) => pre.startsWith(p))) return "rgba(109,189,139,0.7)";

  const hokuriku = ["新潟", "富山", "石川", "福井"];
  if (hokuriku.some((p) => pre.startsWith(p))) return "rgba(200,200,80,0.7)";
  const chubu = ["山梨", "長野", "岐阜", "静岡", "愛知", "三重"];
  if (chubu.some((p) => pre.startsWith(p))) return "rgba(153,204,105,0.7)";

  const kinki = ["滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山"];
  if (kinki.some((p) => pre.startsWith(p))) return "rgba(236,173,114,0.7)";

  const chugoku = ["鳥取", "島根", "岡山", "広島", "山口"];
  if (chugoku.some((p) => pre.startsWith(p))) return "rgba(197,117,221,0.7)";

  const shikoku = ["徳島", "香川", "愛媛", "高知"];
  if (shikoku.some((p) => pre.startsWith(p))) return "rgba(233,130,187,0.7)";

  const kyushu = ["福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島"];
  if (kyushu.some((p) => pre.startsWith(p))) return "rgba(236,126,126,0.7)";

  const okinawa = ["沖縄"];
  if (okinawa.some((p) => pre.startsWith(p))) return "rgba(200,160,160,0.7)";

  return "rgba(128,128,128,0.7)";
}

export function getFullRegionColor(pre: string): string {
  if (pre.startsWith("北海道")) return "rgba(73,58,207,1)";

  const tohokus = ["青森", "岩手", "秋田", "宮城", "山形", "福島"];
  if (tohokus.some((p) => pre.startsWith(p))) return "rgba(61,189,209,1)";

  const kanto = ["茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川"];
  if (kanto.some((p) => pre.startsWith(p))) return "rgba(46,177,96,1)";
  const hokuriku = ["新潟", "富山", "石川", "福井"];
  if (hokuriku.some((p) => pre.startsWith(p))) return "rgba(160,160,20,0.7)";
  const chubu = ["山梨", "長野", "岐阜", "静岡", "愛知", "三重"];
  if (chubu.some((p) => pre.startsWith(p))) return "rgba(130,204,60,1)";

  const kinki = ["滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山"];
  if (kinki.some((p) => pre.startsWith(p))) return "rgba(233,142,58,1)";

  const chugoku = ["鳥取", "島根", "岡山", "広島", "山口"];
  if (chugoku.some((p) => pre.startsWith(p))) return "rgba(183,65,219,1)";

  const shikoku = ["徳島", "香川", "愛媛", "高知"];
  if (shikoku.some((p) => pre.startsWith(p))) return "rgba(228,69,156,1)";

  const kyushu = ["福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島"];
  if (kyushu.some((p) => pre.startsWith(p))) return "rgba(240,58,58,1)";
  const okinawa = ["沖縄"];
  if (okinawa.some((p) => pre.startsWith(p))) return "rgba(200,100,120,0.7)";

  return "rgba(128,128,128,0.7)"; // デフォルト
}

export function getMarkerColor(officialName: string): string {
  if (officialName.includes("航空")) return "#03D8F4";
  if (officialName.includes("気象台")) return "#F4367F";
  if (officialName.includes("アメダス")) return "#6FAF4C";
  return "#FF8800";
}

export function getIcon(officialName: string): React.ReactElement | null {
  if (officialName.includes("航空") || officialName == "3") return <FaPlane />;
  if (officialName.includes("気象台") || officialName == "1")
    return <FaBuilding />;
  if (officialName.includes("アメダス") || officialName == "4")
    return <FaMapMarkerAlt />;
  if (officialName.includes("地点を選んでください!!"))
    return <BsFillQuestionCircleFill />;
  return <FaSatelliteDish />;
}

export const prefToRegion: { [key: string]: string } = {
  北海道: "北海道",

  青森県: "東北",
  岩手県: "東北",
  宮城県: "東北",
  秋田県: "東北",
  山形県: "東北",
  福島県: "東北",

  茨城県: "関東",
  栃木県: "関東",
  群馬県: "関東",
  埼玉県: "関東",
  千葉県: "関東",
  東京都: "関東",
  神奈川県: "関東",

  新潟県: "北陸",
  富山県: "北陸",
  石川県: "北陸",
  福井県: "北陸",
  山梨県: "中部",
  長野県: "中部",
  岐阜県: "中部",
  静岡県: "中部",
  愛知県: "中部",

  三重県: "中部",
  滋賀県: "近畿",
  京都府: "近畿",
  大阪府: "近畿",
  兵庫県: "近畿",
  奈良県: "近畿",
  和歌山県: "近畿",

  鳥取県: "中国",
  島根県: "中国",
  岡山県: "中国",
  広島県: "中国",
  山口県: "中国",

  徳島県: "四国",
  香川県: "四国",
  愛媛県: "四国",
  高知県: "四国",

  福岡県: "九州",
  佐賀県: "九州",
  長崎県: "九州",
  熊本県: "九州",
  大分県: "九州",
  宮崎県: "九州",
  鹿児島県: "九州",
  沖縄県: "沖縄",
};
export const prefCodeMap: { [key: string]: string } = {
  "11": "北海道(宗谷地方)",
  "12": "北海道(上川地方)",
  "13": "北海道(留萌地方)",
  "14": "北海道(石狩地方)",
  "15": "北海道(空知地方)",
  "16": "北海道(後志地方)",
  "17": "北海道(オホーツク地方)",
  "18": "北海道(根室地方)",
  "19": "北海道(釧路地方)",
  "20": "北海道(十勝地方)",
  "21": "北海道(胆振地方)",
  "22": "北海道(日高地方)",
  "23": "北海道(渡島地方)",
  "24": "北海道(檜山地方)",
  "31": "青森県",
  "32": "秋田県",
  "33": "岩手県",
  "34": "宮城県",
  "35": "山形県",
  "36": "福島県",
  "40": "茨城県",
  "41": "栃木県",
  "42": "群馬県",
  "43": "埼玉県",
  "44": "東京都",
  "45": "千葉県",
  "46": "神奈川県",
  "48": "長野県",
  "49": "山梨県",
  "50": "静岡県",
  "51": "愛知県",
  "52": "岐阜県",
  "53": "三重県",
  "54": "新潟県",
  "55": "富山県",
  "56": "石川県",
  "57": "福井県",
  "60": "滋賀県",
  "61": "京都府",
  "62": "大阪府",
  "63": "兵庫県",
  "64": "奈良県",
  "65": "和歌山県",
  "66": "岡山県",
  "67": "広島県",
  "68": "島根県",
  "69": "鳥取県",
  "71": "徳島県",
  "72": "香川県",
  "73": "愛媛県",
  "74": "高知県",
  "81": "山口県",
  "82": "福岡県",
  "83": "大分県",
  "84": "長崎県",
  "85": "佐賀県",
  "86": "熊本県",
  "87": "宮崎県",
  "88": "鹿児島県",
  "91": "沖縄県(本島地方)",
  "92": "沖縄県(大東地方)",
  "93": "沖縄県(宮古地方)",
  "94": "沖縄県(八重山地方)",
};
// 表示用地域リスト（島嶼部を別枠に含める）
export const regionList: string[] = [
  "北海道",
  "東北",
  "関東",
  "中部",
  "北陸",
  "近畿",
  "中国",
  "四国",
  "九州",
  "沖縄",
  "太平洋島嶼部",
];

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
  Main: "メイン",
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

export const COLOR_MAP: { [key: string]: string } = {
  // temp
  "1.猛暑日": "rgba(230,40,70,0.8)", // 赤
  "2.真夏日": "rgba(230,100,40,0.8)", // 濃いオレンジ
  "3.夏日": "rgba(230,180,40,0.8)", // オレンジ
  "4.その他": "rgba(0,150,100,0.8)", // 緑
  "5.冬日": "rgba(0,100,218,0.8)", // 青
  "6.真冬日": "rgba(140,50,140,0.8)", // 紫

  // wind
  "1.~10m/s": "rgba(169,169,169,1)", // 軽い → 灰
  "2.10~15m/s": "rgba(144,255,144,1)", // 薄緑
  "3.15~20m/s": "rgba(100,220,100,1)", // 緑
  "4.20~30m/s": "rgba(50,200,50,1)", // 濃い緑
  "5.30m/s~": "rgba(25,150,25,1)", // 濃緑

  // rain - 青系
  "1.~1mm": "rgba(169,169,169,1)", // 灰
  "2.1~10mm": "rgba(120,200,255,1)", // 薄水色
  "3.10~30mm": "rgba(80,160,255,1)", // ライトスカイブルー
  "4.30~50mm": "rgba(60,120,220,1)", // ディープスカイブルー
  "5.50~70mm": "rgba(40,80,180,1)", // 青
  "6.70~100mm": "rgba(20,40,140,1)", // ネイビーブルー
  "7.100mm~": "rgba(10,20,100,1)", // 超濃紺

  // snowed - 紫系
  "1.~3cm": "rgba(169,169,169,1)", // 灰
  "2.3~5cm": "rgba(170,100,255,1)", // ミディアムスレートブルー
  "3.5~10cm": "rgba(140,70,225,1)", // 紫
  "4.10~20cm": "rgba(100,45,200,1)", // インディゴ
  "5.20~50cm": "rgba(75,30,150,1)", // 濃い紫
  "6.50cm~": "rgba(50,20,100,1)", // 超濃紫

  // snowed（積雪）- ピンク系
  "1.~5cm": "rgba(169,169,169,1)", // 灰
  "2.5~10cm": "rgba(255,180,220,1)", // ライトピンク
  "3.10~20cm": "rgba(255,140,180,1)", // ホットピンク
  "4.20~50cm": "rgba(200,110,150,1)", // ディープピンク
  "5.50~100cm": "rgba(160,70,110,1)", // パレオズバイオレット
  "6.100cm~": "rgba(125,30,75,1)", // ディープピンク系
};
// 漢字の地域名 → スラッグ
export function regionToSlug(region: string): string {
  const map: { [key: string]: string } = {
    北海道: "hokkaido",
    東北: "tohoku",
    関東: "kanto",
    中部: "chubu",
    北陸: "hokuriku",
    近畿: "kinki",
    中国: "chugoku",
    四国: "shikoku",
    九州: "kyushu",
    沖縄: "okinawa",
    太平洋島嶼部: "island",
  };

  return map[region] || region; // 該当がなければ null
}
export const slugToRegion: { [key: string]: string } = {
  hokkaido: "北海道",
  tohoku: "東北",
  kanto: "関東",
  chubu: "中部",
  hokuriku: "北陸",
  kinki: "近畿",
  chugoku: "中国",
  shikoku: "四国",
  kyushu: "九州",
  okinawa: "沖縄",
};

// 単位判定
export function detectUnitFromPath(filePath: string): string {
  const lower = filePath.toLowerCase().replace(/\\/g, "/");

  // ranking / ranking_y 両対応
  const match = lower.match(/ranking(_y)?\/([^/]+)\//);
  const sortKey = match ? match[2] : "";

  // ★ 数字を含んでいたら最優先で「日」
  if (/\d/.test(sortKey)) {
    return "日";
  }

  return sortKey.includes("temp")
    ? "℃"
    : sortKey.includes("rain")
    ? "mm"
    : sortKey.includes("snow")
    ? "cm"
    : sortKey.includes("wind")
    ? "m/s"
    : sortKey.includes("sun")
    ? "時間"
    : "日";
}

// 月別データを安全に抽出（undefined → null）
export function getMonthly(data: any, field: string): (number | null)[] {
  const src = data.data[field] || {};

  return Object.keys(src)
    .filter((k) => k !== "all")
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const v = src[k]?.value;
      return v === undefined ? null : v;
    });
}

interface ValuesArray {
  list: (number | null)[];
  month: string;
  type: string;
}

// single 内の指定フィールドから all.value を安全に取り出して配列化
export function getValuesArrayFromData(
  data: any,
  month: string,
  type: string
): ValuesArray {
  let fields: string[];
  if (type.includes("temp")) {
    fields = tempFields;
  } else if (type.includes("rain")) {
    fields = rainFields;
  } else if (type.includes("snowing")) {
    fields = snowingFields;
  } else if (type.includes("snowed")) {
    fields = snowedFields;
  } else {
    fields = [];
  }
  // data の構造は想定: data.data[field].all.value
  return {
    list: fields.map((field) => {
      try {
        // 安全にネストを辿る
        const v = data?.data?.[field]?.[month]?.value;
        // value が undefined なら null に置換
        return v === undefined ? null : v;
      } catch (e) {
        return null;
      }
    }),
    month: month,
    type: type,
  };
}

const tempFields: string[] = [
  "hitemp_35",
  "hitemp_30",
  "hitemp_25",
  "lwtemp_0",
  "hitemp_0",
];

const rainFields: string[] = [
  "rain_100",
  "rain_70",
  "rain_50",
  "rain_30",
  "rain_10",
  "rain_1",
];
const snowingFields: string[] = [
  "snowing_50",
  "snowing_20",
  "snowing_10",
  "snowing_5",
  "snowing_3",
];
const snowedFields: string[] = [
  "snowed_100",
  "snowed_50",
  "snowed_20",
  "snowed_10",
  "snowed_5",
];

interface SectionWithDescriptionProps {
  icon: IconType;
  title: string;
  bgColor: string;
  description?: string[];
  children?: React.ReactNode;
}

export function SectionWithDescription({
  icon: Icon,
  title,
  bgColor,
  description,
  children,
}: SectionWithDescriptionProps): React.ReactElement {
  return (
    <div className="">
      <div
        className="flex flex-row items-center justify-between w-full z-10 p-1 rounded"
        style={{ backgroundColor: bgColor }}
      >
        <h2 className="flex items-center font-bold text-base sm:text-xl text-left gap-1">
          {Icon && <Icon />}
          {title}
        </h2>
        {/* childrenをここに置くと右端に */}
        {children && <div>{children}</div>}
      </div>

      {description && (
        <div className="text-sm pt-2">
          {description.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
