import React from "react";
import Head from "next/head";
import Link from "next/link";
import ArticleTemplate, { ArticleSection } from "./ArticleTemplate";
import { TocItem } from "../Sidebar";
import ClimateIntroSection from "./ClimateIntroSection";
import RainbowStationsSection from "./RainbowStationsSection";
import Top1StationsSection from "./Top1StationsSection";
import { ClimateChildSections, ClimateChildSectionItem } from "./ClimateChildSections";
import { ClimateArticleData, ClimateSection } from "../../data/types";
import {
  ArticleUonzuItem,
  RegionRainbowStationItem,
  RegionTop1Item,
} from "../../utils/ssgLoader";
import { ClimateStarEntry } from "./ArticleClimateStarPanel";
import { ClimateStarsResult } from "../../utils/climateStarCalculator";

export interface SiblingNavItem {
  key: string;
  label: string;
  href: string;
  isCurrent?: boolean;
}

export interface ClimateArticlePageTemplateProps {
  // メタ情報・SEO
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;

  // パンくず & Hero
  breadcrumbs: { label: string; href?: string }[];
  hero: {
    badgeIcon: React.ReactNode;
    badgeText: string;
    title: string;
    description: string;
    watermark: string;
    gradient: string;
    rightContent?: React.ReactNode;
  };
  category: string;
  publishedAt: string;
  readTime: string;
  pageTitle: string;
  points: string[];
  backHref: string;
  backLabel: string;

  // テーマ色
  accentColor: string;

  // セクション1: 概況・雨温図
  overviewSection: {
    id?: string;
    title: string;
    areaLabel: string;
    repStationName?: string;
    data: {
      catchphrase: string;
      climateType: string;
      heroDescription: string;
      description: ClimateSection[];
      highlights: string[];
      climateStars?: Partial<Record<string, ClimateStarEntry>> | ClimateStarsResult | null;
    };
    uonzuTitle: string;
    uonzuItems: ArticleUonzuItem[];
  };

  // セクション2: 虹バッジ
  rainbowSection: {
    title: string;
    areaName: string;
    stations: RegionRainbowStationItem[];
  };

  // セクション3: 気候極値 No.1
  top1Section: {
    title: string;
    areaLabel: string;
    rankScopeText: string;
    stations: RegionTop1Item[];
  };

  // セクション4〜: 子階層見出し展開（地方なら都道府県、都道府県ならサブエリア）
  childSections?: ClimateChildSectionItem[];

  // 末尾ナビゲーション（地方なら他地方一覧、都道府県なら同地方内の他都道府県一覧）
  siblingsNav?: {
    title: string;
    items: SiblingNavItem[];
  };
}

export const ClimateArticlePageTemplate: React.FC<ClimateArticlePageTemplateProps> = ({
  seoTitle,
  seoDescription,
  canonicalUrl,
  breadcrumbs,
  hero,
  category,
  publishedAt,
  readTime,
  pageTitle,
  points,
  backHref,
  backLabel,
  accentColor,
  overviewSection,
  rainbowSection,
  top1Section,
  childSections,
  siblingsNav,
}) => {
  const tocItems: TocItem[] = [
    { id: overviewSection.id || "overview", label: overviewSection.title },
    { id: "rainbow-stations", label: rainbowSection.title },
    { id: "top1-stations", label: top1Section.title },
    ...(childSections || []).map((child, idx) => ({
      id: child.key,
      label: `4-${idx + 1}. ${child.name}の気候`,
    })),
    ...(siblingsNav && siblingsNav.items.length > 1
      ? [{ id: "siblings", label: siblingsNav.title }]
      : []),
  ];

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <ArticleTemplate
        breadcrumbs={breadcrumbs}
        hero={hero}
        category={category}
        publishedAt={publishedAt}
        readTime={readTime}
        title={pageTitle}
        points={points}
        tocItems={tocItems}
        backHref={backHref}
        backLabel={backLabel}
      >
        {/* セクション1: 気候の特徴と概況 */}
        <ClimateIntroSection
          id={overviewSection.id || "overview"}
          title={overviewSection.title}
          accentColor={accentColor}
          areaLabel={overviewSection.areaLabel}
          data={overviewSection.data}
          climateStars={overviewSection.data.climateStars}
          repStationName={overviewSection.repStationName}
          uonzuTitle={overviewSection.uonzuTitle}
          uonzuItems={overviewSection.uonzuItems}
        />

        {/* セクション2: 虹バッジ地点 */}
        <RainbowStationsSection
          title={rainbowSection.title}
          accentColor={accentColor}
          areaName={rainbowSection.areaName}
          rainbowStations={rainbowSection.stations}
        />

        {/* セクション3: 気候極値 No.1地点 */}
        <Top1StationsSection
          title={top1Section.title}
          accentColor={accentColor}
          areaLabel={top1Section.areaLabel}
          rankScopeText={top1Section.rankScopeText}
          top1Stations={top1Section.stations}
        />

        {/* セクション4〜: 子要素の気候解説 */}
        {childSections && childSections.length > 0 && (
          <ClimateChildSections
            startNumber={4}
            accentColor={accentColor}
            items={childSections}
          />
        )}

        {/* 末尾ナビゲーション（他の地域・都道府県など） */}
        {siblingsNav && siblingsNav.items.length > 1 && (
          <ArticleSection
            id="siblings"
            title={siblingsNav.title}
            accentColor={accentColor}
          >
            <div className="flex flex-wrap gap-2">
              {siblingsNav.items.map((sib) => (
                <Link
                  key={sib.key}
                  href={sib.href}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    sib.isCurrent
                      ? "bg-slate-800 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {sib.label}
                </Link>
              ))}
            </div>
          </ArticleSection>
        )}
      </ArticleTemplate>
    </>
  );
};

export default ClimateArticlePageTemplate;
