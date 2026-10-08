import React from "react";
import { FaGlobeAsia, FaCompass, FaMapMarkerAlt } from "react-icons/fa";
import { RegionKey, RegionValue } from "./region";
import { PrefKey, PrefValue, getPrefsInRegion } from "./pref";
import { ClimateArticleData } from "../data/types";
import { ClimateScopeValue } from "./japan2";
import { getClimateDivisions, formatClimateDivisions } from "./division";
import {
  REGION_UONZU_STATIONS,
  PREF_UONZU_STATIONS,
} from "./uonzu";

export type { ClimateScopeValue };

// ==========================================
// ページ表示・UI メタ情報（画面描画専用）
// ==========================================
export interface ClimatePageDisplayMeta {
  scopeKey: ClimateScopeValue;
  currentKey: string;
  targetName: string;
  colorStrong: string;
  parentKey?: string;
  targetPrefCodes: readonly string[];
  representativeStationId?: string;
  uonzuList?: string[];
  category: string;
  readTime: string;
  icon: React.ReactNode;
  badgeText: string;
  rightBadge?: string;
  pageTitle: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  watermark: string;
  backHref: string;
  backLabel: string;
  breadcrumbs: { label: string; href?: string }[];
  hasRankingWidgets: boolean;
  top1RankScopeText: string;
  rainbowAreaName: string;
  overviewTitle: string;
  hideOverviewWidgets: boolean;
  childSectionPrefix: number;
  childSummaryOnly: boolean;
  childTitleSuffix: string;
  points: string[];
}

export function getClimatePageDisplayMeta(
  regionKey?: RegionValue | null,
  prefKey?: PrefValue | null,
  article?: ClimateArticleData
): ClimatePageDisplayMeta {
  // ① 都道府県
  if (prefKey) {
    const pref = PrefKey[prefKey];
    const regionLabel = pref.region.label;
    const parentRegionKey = pref.region.key;
    const uonzuList = PREF_UONZU_STATIONS[prefKey] || [];

    return {
      scopeKey: "pref",
      currentKey: prefKey,
      targetName: pref.label,
      colorStrong: pref.region.colorStrong,
      parentKey: parentRegionKey,
      targetPrefCodes: [pref.code],
      representativeStationId: uonzuList[0],
      uonzuList,
      category: "気候学・都道府県別解説",
      readTime: "約4分",
      icon: pref.icon ?? <FaMapMarkerAlt className="text-white/90" />,
      badgeText: `${pref.label} (${regionLabel})`,
      rightBadge: `PREF CODE: #${pref.code}`,
      pageTitle: `${pref.label}の気候特性〜風土・季節の特徴とアメダス観測データ〜`,
      seoTitle: `${pref.label}の気候とアメダス観測所まとめ - アメダス図鑑`,
      seoDescription: `${pref.label}（${regionLabel}地方）の気候特性、平年値の傾向、アメダス観測データについて解説。`,
      canonicalUrl: `https://amedas-zukan.jp/japan/${parentRegionKey}/${prefKey}`,
      watermark: prefKey.toUpperCase(),
      backHref: `/japan/${parentRegionKey}`,
      backLabel: `${regionLabel}の解説に戻る`,
      breadcrumbs: [
        { label: "気候特集", href: "/column" },
        { label: "地域別の気候解説", href: "/japan" },
        { label: regionLabel, href: `/japan/${parentRegionKey}` },
        { label: pref.label },
      ],
      hasRankingWidgets: true,
      top1RankScopeText: "県内第1位（極値）",
      rainbowAreaName: `${pref.label}内`,
      overviewTitle: `1. ${pref.label}の気候概況`,
      hideOverviewWidgets: false,
      childSectionPrefix: 4,
      childSummaryOnly: false,
      childTitleSuffix: "",
      points: [
        `気候区分: ${formatClimateDivisions(getClimateDivisions(prefKey))}`,
        `キャッチコピー: ${article?.catchphrase ?? ""}`,
        `${pref.label}内のアメダス観測所の雨温図・平年値データをまとめて確認可能`,
      ],
    };
  }

  // ② 地方
  if (regionKey) {
    const region = RegionKey[regionKey];
    const prefs = getPrefsInRegion(regionKey);
    const targetName = `${region.label}地方`;
    const uonzuList = REGION_UONZU_STATIONS[regionKey] || [];

    return {
      scopeKey: "region",
      currentKey: regionKey,
      targetName,
      colorStrong: region.colorStrong,
      parentKey: undefined,
      targetPrefCodes: prefs.map((p) => p.code),
      representativeStationId: uonzuList[0],
      uonzuList,
      category: "気候学・地方別解説",
      readTime: "約7分",
      icon: <FaCompass className="text-white/90" />,
      badgeText: `${targetName} Climate`,
      rightBadge: `${prefs.length} 都道府県・地域`,
      pageTitle: `${targetName}の気候特性〜風土・季節風・地形のメカニズム〜`,
      seoTitle: `${targetName}の気候・都道府県別特徴まとめ - アメダス図鑑`,
      seoDescription: `${targetName}の気候特性・風土メカニズムと、都道府県別気候解説まとめ。`,
      canonicalUrl: `https://amedas-zukan.jp/japan/${regionKey}`,
      watermark: regionKey.toUpperCase(),
      backHref: "/japan",
      backLabel: "全地域一覧に戻る",
      breadcrumbs: [
        { label: "気候特集", href: "/column" },
        { label: "地域別の気候解説", href: "/japan" },
        { label: targetName },
      ],
      hasRankingWidgets: true,
      top1RankScopeText: "地方第1位（極値）",
      rainbowAreaName: targetName,
      overviewTitle: `1. ${targetName}の気候の特徴とメカニズム`,
      hideOverviewWidgets: false,
      childSectionPrefix: 4,
      childSummaryOnly: false,
      childTitleSuffix: "",
      points: [
        `気候区分: ${formatClimateDivisions(getClimateDivisions(regionKey))}`,
        `キャッチコピー: ${article?.catchphrase ?? ""}`,
        `${targetName}を構成する各地域の気候を見出し別に徹底解説`,
      ],
    };
  }

  // ③ 全国
  return {
    scopeKey: "national",
    currentKey: "national",
    targetName: "日本列島",
    colorStrong: "#2563eb",
    parentKey: undefined,
    targetPrefCodes: [] as readonly string[],
    representativeStationId: undefined,
    category: "気候学・地域別解説",
    readTime: "約8分",
    icon: <FaGlobeAsia className="text-white/90" />,
    badgeText: "Regional Climate Encyclopedia",
    rightBadge: "全国 10 地方・地域",
    pageTitle: "日本列島10地域の気候特性 〜地域ごとの気候の特徴〜",
    seoTitle: "日本の地域別気候解説・特徴まとめ - アメダス図鑑",
    seoDescription: "全国10地方（北海道から沖縄まで）の気候区分と特徴を一覧解説。気候メカニズムや雨温図の傾向を地域ごとに深掘りします。",
    canonicalUrl: "https://amedas-zukan.jp/japan",
    watermark: "REGIONS",
    backHref: "/column",
    backLabel: "コラム一覧に戻る",
    breadcrumbs: [
      { label: "気候特集", href: "/column" },
      { label: "地域別の気候解説" },
    ],
    hasRankingWidgets: false,
    top1RankScopeText: "",
    rainbowAreaName: "",
    overviewTitle: "1. 日本の地域別気候の特徴と多様性",
    hideOverviewWidgets: true,
    childSectionPrefix: 2,
    childSummaryOnly: true,
    childTitleSuffix: "地方",
    points: [
      "南北約3,000kmに連なる日本列島（亜寒帯〜亜熱帯）の気候帯と地形的メカニズムを総括",
      "全国10地方（北海道〜沖縄）の気候特性・季節風・降水パターンの違いを網羅解説",
      "各地方ブロックから詳細な地域個別ページや各都道府県の気候解説へアクセス可能",
    ],
  };
}
