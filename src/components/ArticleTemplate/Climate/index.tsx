import React, { useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import ArticleTemplate, { ArticleSectionItem } from "..";
import { ClimateIntroSection } from "./part/Intro";
import { RainbowStationsSection } from "./part/Rainbow";
import { Top1StationsSection } from "./part/Top1";
import { ClimateChildSections, ClimateChildSectionItem } from "./part/ChildSections";
import { ClimateArticleData, ClimateSection } from "../../../data/types";
import {
  ArticleUonzuItem,
  RegionRainbowStationItem,
  RegionTop1Item,
} from "../../../utils/ssgLoader";
import { ClimateStarEntry } from "./part/StarPanel";
import { ClimateStarsResult } from "../../../utils/climateStarCalculator";

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
    data: ClimateArticleData & {
      climateStars?: ClimateStarsResult;
    };
    uonzuTitle?: string;
    uonzuItems: ArticleUonzuItem[];
  };

  // セクション2: 虹バッジ地点
  rainbowSection: {
    title: string;
    areaName: string;
    stations: RegionRainbowStationItem[];
  };

  // セクション3: No.1地点
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
  const sections: ArticleSectionItem[] = useMemo(() => {
    const list: ArticleSectionItem[] = [
      // セクション1: 気候の特徴と概況
      {
        id: overviewSection.id || "overview",
        title: overviewSection.title,
        accentColor,
        content: (
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
        ),
      },
      // セクション2: 虹バッジ地点
      {
        id: "rainbow-stations",
        title: rainbowSection.title,
        accentColor,
        content: (
          <RainbowStationsSection
            title={rainbowSection.title}
            accentColor={accentColor}
            areaName={rainbowSection.areaName}
            rainbowStations={rainbowSection.stations}
          />
        ),
      },
      // セクション3: 記録 No.1地点
      {
        id: "top1-stations",
        title: top1Section.title,
        accentColor,
        content: (
          <Top1StationsSection
            title={top1Section.title}
            accentColor={accentColor}
            areaLabel={top1Section.areaLabel}
            rankScopeText={top1Section.rankScopeText}
            top1Stations={top1Section.stations}
          />
        ),
      },
    ];

    // セクション4〜: 子要素の気候解説
    if (childSections && childSections.length > 0) {
      childSections.forEach((child, idx) => {
        list.push({
          id: child.key,
          title: `4-${idx + 1}. ${child.name}の気候`,
          accentColor,
          content: (
            <ClimateChildSections
              startNumber={4 + idx}
              accentColor={accentColor}
              items={[child]}
            />
          ),
        });
      });
    }

    // 末尾ナビゲーション
    if (siblingsNav && siblingsNav.items.length > 1) {
      list.push({
        id: "siblings",
        title: siblingsNav.title,
        accentColor,
        content: (
          <div className="flex flex-wrap gap-2">
            {siblingsNav.items.map((sib) => (
              <Link
                key={sib.key}
                href={sib.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${sib.isCurrent
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
              >
                {sib.label}
              </Link>
            ))}
          </div>
        ),
      });
    }

    return list;
  }, [
    overviewSection,
    rainbowSection,
    top1Section,
    childSections,
    siblingsNav,
    accentColor,
  ]);

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
        sections={sections}
        backHref={backHref}
        backLabel={backLabel}
      />
    </>
  );
};

export default ClimateArticlePageTemplate;
