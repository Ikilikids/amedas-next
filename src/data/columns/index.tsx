import React from "react";
import { FaBuilding } from "react-icons/fa";
import { FaCloudSunRain } from "react-icons/fa6";
import { PiThermometerHotFill } from "react-icons/pi";
import { ArticleSectionItem } from "../../components/ArticleTemplate";
import { ArticleUonzuItem } from "../../utils/ssgLoader";
import { buildJapanClimateSections } from "./japanClimateClassification";
import { PREFECTURES_METEO_SECTIONS } from "./prefecturesMeteo";
import { HOT_STATIONS_SECTIONS } from "./hotStations";

export interface ColumnArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  summary: string;
  Icon: React.ReactNode;
  color: string;
}

export const COLUMNS: ColumnArticle[] = [
  {
    slug: "japan-climate-classification",
    title: "雨温図で読み解く日本の6大気候区分〜なぜ日本は地域によってこんなに天気が違うのか？〜",
    description:
      "太平洋側、日本海側、瀬戸内、中央高地、南西諸島、オホーツク海側の6大気候区分をアメダスの雨温図（平年値データ）とともに徹底解説。季節風と山脈がもたらす気候の違いの謎に迫ります。",
    category: "気候学・気象解説",
    publishedAt: "2026年9月14日",
    readTime: "約6分",
    summary:
      "日本列島は南北に長く、中央に険しい山脈が連なるため、わずか数十km離れるだけで別世界のような気候が広がります。本記事では雨温図の見方と6大気候区分のメカニズムを解説します。",
    Icon: <FaCloudSunRain />,
    color: "#2563eb",
  },
  {
    slug: "prefectures-meteo",
    title: "全国47都道府県の代表気象台・気候総まとめ〜雨温図と平年値で読み解く地域の個性〜",
    description:
      "全国47都道府県庁所在地・代表気象台の気候特性、平年値データ、雨温図、順位記録を地域別に徹底比較・解説。各地の気温差や雨・雪の特徴が一目で分かります。",
    category: "気候まとめ・データ比較",
    publishedAt: "2026年9月28日",
    readTime: "約15分",
    summary:
      "北は札幌から南は那覇まで、全国47都道府県の代表気象台の気象平年値（1991〜2020年）を網羅。各地域の気候特性や特徴的な観測記録を地域ブロックごとに解説します。",
    Icon: <FaBuilding />,
    color: "#e11d48",
  },
  {
    slug: "hot-stations",
    title: "日本一の暑さを誇る猛暑地点まとめ〜盆地・フェーン・熱帯夜のメカニズム〜",
    description:
      "多治見・日田・熊谷・伊勢崎・甲府など、夏季に連日ニュースを賑わせる日本有数の猛暑地点14選。国内最高記録や熱帯夜記録の背景にある地形・気象メカニズムを徹底解説します。",
    category: "気候まとめ・データ比較",
    publishedAt: "2026年9月28日",
    readTime: "約8分",
    summary:
      "40℃超えを連発する内陸盆地や、山越えのフェーン現象で記録的高温を叩き出す地点、夜間も気温が下がらない大都市まで、日本の代表的な暑い地点の観測記録と特徴をまとめました。",
    Icon: <PiThermometerHotFill />,
    color: "#dc2626",
  },
];

export const COLUMN_SECTIONS: Record<
  string,
  (uonzuItems?: ArticleUonzuItem[]) => ArticleSectionItem[]
> = {
  "japan-climate-classification": (uonzuItems) => buildJapanClimateSections(uonzuItems),
  "prefectures-meteo": () => PREFECTURES_METEO_SECTIONS,
  "hot-stations": () => HOT_STATIONS_SECTIONS,
};
