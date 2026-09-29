import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { FaCompass } from "react-icons/fa";
import { REGION_LIST, RegionValue } from "../../../setting/region";
import ClimateArticlePageTemplate from "../../../components/ArticleTemplate/Climate";
import {
  loadClimateDetailPageData,
  ClimateDetailPageProps,
} from "../../../utils/climatePageDataLoader";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = REGION_LIST.map((region) => ({
    params: { region },
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<ClimateDetailPageProps> = async ({
  params,
}) => {
  const regionKey = params?.region as RegionValue;
  const data = await loadClimateDetailPageData(regionKey);
  if (!data) return { notFound: true };

  return { props: data };
};

const RegionDetailPage: NextPage<ClimateDetailPageProps> = ({
  region,
  article,
  climateStars,
  uonzuItems,
  rainbowStations,
  top1Stations,
  childSections,
}) => {
  const regionName = region.label;
  const colorStrong = region.colorStrong;

  return (
    <ClimateArticlePageTemplate
      seoTitle={`${regionName}地方の気候・都道府県別特徴まとめ - アメダス図鑑`}
      seoDescription={`${regionName}地方の気候特性・風土メカニズムと、${childSections
        .map((p) => p.name)
        .join("・")}の都道府県別気候解説まとめ。`}
      canonicalUrl={`https://amedas-zukan.jp/japan/${region.key}`}
      breadcrumbs={[
        { label: "気候特集", href: "/column" },
        { label: "地域別の気候解説", href: "/japan" },
        { label: `${regionName}地方` },
      ]}
      hero={{
        badgeIcon: <FaCompass className="text-white/90" />,
        badgeText: `${regionName} Region Climate`,
        title: `${regionName}地方の気候特性・特徴まとめ`,
        description: article.heroDescription,
        watermark: region.key.toUpperCase(),
        gradient: `linear-gradient(135deg, ${colorStrong} 0%, color-mix(in srgb, ${colorStrong} 75%, black) 100%)`,
        rightContent: (
          <div className="text-xs font-bold bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white shrink-0">
            {childSections.length} 都道府県・地域
          </div>
        ),
      }}
      category="気候学・地方別解説"
      publishedAt="2026年9月16日"
      readTime="約7分"
      pageTitle={`${regionName}地方の気候特性〜風土・季節風・地形のメカニズム〜`}
      points={[
        `気候区分: ${article.climateType}`,
        `キャッチコピー: ${article.catchphrase}`,
        `${regionName}地方を構成する全${childSections.length}都道県・地域の気候を見出し別に徹底解説`,
      ]}
      backHref="/japan"
      backLabel="全地域一覧に戻る"
      accentColor={colorStrong}
      overviewSection={{
        id: "intro",
        title: `1. ${regionName}地方の気候の特徴とメカニズム`,
        areaLabel: `${regionName}地方`,
        repStationName: climateStars?.repStationName,
        data: {
          ...article,
          climateStars,
        },
        uonzuTitle: `${regionName}地方の代表雨温図`,
        uonzuItems: uonzuItems,
      }}
      rainbowSection={{
        title: `2. ${regionName}地方の虹バッジ地点`,
        areaName: `${regionName}地方`,
        stations: rainbowStations,
      }}
      top1Section={{
        title: `3. ${regionName}地方の気候極値（No.1）地点`,
        areaLabel: `${regionName}地方`,
        rankScopeText: "地方第1位（極値）",
        stations: top1Stations,
      }}
      childSections={childSections}
    />
  );
};

export default RegionDetailPage;
