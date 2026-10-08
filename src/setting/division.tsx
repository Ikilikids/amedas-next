import React from "react";
import {
  FaCloudSun,
  FaSnowflake,
  FaSun,
  FaMountain,
  FaWater,
} from "react-icons/fa";

// ==============================
// 型
// ==============================
export type DivisionValue =
  | "pacific"
  | "japansea"
  | "seto"
  | "central"
  | "nansei"
  | "hokkaido";

export type DivisionMeta = {
  key: DivisionValue;
  number: string;
  name: string;
  fullName: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  stationIds: string[];
};

type DivisionMap = Record<DivisionValue, DivisionMeta>;

// ==============================
// 定義（本体）
// ==============================
export const DivisionKey = {
  pacific: {
    key: "pacific",
    number: "①",
    name: "太平洋側",
    fullName: "太平洋側気候",
    subtitle: "夏雨冬晴・典型的な大都市型",
    description:
      "夏は太平洋からの南東季節風や梅雨・台風の影響で雨が多く、高温多湿。冬は山脈を越えた乾いた北西のからっ風が吹き抜け、連日快晴が続いて湿度が極端に低下します。",
    icon: <FaCloudSun />,
    accentColor: "#f59e0b",
    stationIds: ["44132", "51106", "74182"],
  },
  japansea: {
    key: "japansea",
    number: "②",
    name: "日本海側",
    fullName: "日本海側気候",
    subtitle: "冬の豪雪と重い雲・夏フェーン",
    description:
      "シベリアからの冷たい季節風が対馬海流（暖流）の水蒸気を大量に取り込み、脊梁山脈にぶつかって冬に世界屈指の豪雪をもたらします。雨温図では12月〜2月の降水量（降雪換算）の山が突出するのが特徴です。夏は晴れ間が多く、山越えの南風によるフェーン現象で40℃近い猛暑を記録することもあります。",
    icon: <FaSnowflake />,
    accentColor: "#0ea5e9",
    stationIds: ["54232", "56227", "69122"],
  },
  seto: {
    key: "seto",
    number: "③",
    name: "瀬戸内海",
    fullName: "瀬戸内海気候",
    subtitle: "年中温暖・全国屈指の少雨",
    description:
      "南の四国山地と北の中国山地に挟まれているため、夏冬いずれの季節風も山脈で水蒸気を落とした後に吹き込みます。結果として年間を通じて降水量が1,000〜1,200mm程度と極めて少なく、晴天日数が多い温暖で穏やかな気候です。",
    icon: <FaSun />,
    accentColor: "#f97316",
    stationIds: ["66408", "72086", "67437"],
  },
  central: {
    key: "central",
    number: "④",
    name: "中央高地",
    fullName: "中央高地気候",
    subtitle: "強烈な寒暖差・乾いた空気",
    description:
      "周囲を日本アルプスなどの高峰に囲まれた山梨・長野の内陸盆地。海からの湿気が届きにくいため年間降水量は1,000mm前後と少なめ。標高が高いため冬の冷え込みが極めて厳しく、日較差（昼と夜の気温差）と年較差（夏冬の気温差）がいずれも日本一大きいエリアです。",
    icon: <FaMountain />,
    accentColor: "#059669",
    stationIds: ["48156", "49142", "48361"],
  },
  nansei: {
    key: "nansei",
    number: "⑤",
    name: "南西諸島",
    fullName: "南西諸島気候",
    subtitle: "常夏・豊かな雨量・冬も温暖",
    description:
      "沖縄や奄美群島など、黒潮暖流に囲まれた亜熱帯海洋性気候。年平均気温は23℃を超え、真冬でも15℃を下回ることがほとんどありません。5月の早い梅雨入りと、夏の台風直撃により年間降水量は2,000mmを超えます。気温の折れ線が年間を通じてなだらかな高山を描きます。",
    icon: <FaWater />,
    accentColor: "#0d9488",
    stationIds: ["91197", "94081", "88837"],
  },
  hokkaido: {
    key: "hokkaido",
    number: "⑥",
    name: "北海道",
    fullName: "北海道気候",
    subtitle: "冷帯・梅雨なし・流氷の海",
    description:
      "日本で唯一の「亜寒帯（冷帯）」に属する気候。本州のような明瞭な梅雨がなく、初夏は爽やかに晴れ渡ります。冬はシベリア寒気団に覆われ氷点下20〜30℃に達する極寒の世界に。オホーツク海側では冬に流氷が接岸し、年間降水量が800mm前後と全国で最も少ない乾燥地帯となります。",
    icon: <FaSnowflake />,
    accentColor: "#4f46e5",
    stationIds: ["14163", "12442", "17341"],
  },
} satisfies DivisionMap;

// ==============================
// utils
// ==============================
export const DIVISION_LIST = Object.keys(DivisionKey) as DivisionValue[];
export const CLIMATE_DIVISIONS = Object.values(DivisionKey);

export * from "./division/index";
