import React from "react";
import { IconType } from "react-icons";

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

export const MonthMap: { [key: string]: string } = {
  all: "通年",
  "1": "1月",
  "2": "2月",
  "3": "3月",
  "4": "4月",
  "5": "5月",
  "6": "6月",
  "7": "7月",
  "8": "8月",
  "9": "9月",
  "10": "10月",
  "11": "11月",
  "12": "12月",
};
