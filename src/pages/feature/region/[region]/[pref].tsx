import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { FaMapMarkerAlt } from "react-icons/fa";
import { REGION_LIST, RegionValue } from "../../../../setting/region";
import { getPrefsInRegion, PrefValue } from "../../../../setting/pref";
import ClimateArticlePageTemplate from "../../../../components/Article/ClimateArticlePageTemplate";
import {
  loadClimateDetailPageData,
  ClimateDetailPageProps,
} from "../../../../utils/climatePageDataLoader";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { region: string; pref: string } }[] = [];

  REGION_LIST.forEach((regionKey) => {
    const prefs = getPrefsInRegion(regionKey);
    prefs.forEach((pref) => {
      paths.push({
        params: { region: regionKey, pref: pref.key },
      });
    });
  });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<ClimateDetailPageProps> = async ({
  params,
}) => {
  const regionKey = params?.region as RegionValue;
  const prefKey = params?.pref as PrefValue;

  const data = loadClimateDetailPageData(regionKey, prefKey);
  if (!data) return { notFound: true };

  return { props: data };
};

const PrefDetailPage: NextPage<ClimateDetailPageProps> = ({
  region,
  pref,
  article,
  climateStars,
  uonzuItems,
  rainbowStations,
  top1Stations,
  childSections,
  siblings,
}) => {
  if (!pref) return null;
  const prefName = pref.label;
  const regionName = region.label;
  const colorStrong = region.colorStrong;

  return (
    <ClimateArticlePageTemplate
      seoTitle={`${prefName}の気候とアメダス観測所まとめ - アメダス図鑑`}
      seoDescription={`${prefName}（${regionName}地方）の気候特性、平年値の傾向、アメダス観測データについて解説。`}
      canonicalUrl={`https://amedas-zukan.jp/feature/region/${region.key}/${pref.key}`}
      breadcrumbs={[
        { label: "気候特集", href: "/feature/meteo" },
        { label: "地域別の気候解説", href: "/feature/region" },
        { label: `${regionName}地方`, href: `/feature/region/${region.key}` },
        { label: prefName },
      ]}
      hero={{
        badgeIcon: <FaMapMarkerAlt className="text-white/90" />,
        badgeText: `${prefName} (${regionName})`,
        title: `${prefName}の気候・観測データ`,
        description: article.heroDescription,
        watermark: pref.key.toUpperCase(),
        gradient: `linear-gradient(135deg, ${colorStrong} 0%, color-mix(in srgb, ${colorStrong} 75%, black) 100%)`,
        rightContent: (
          <div className="text-xs font-mono font-bold bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white shrink-0">
            PREF CODE: #{pref.code.join(", #")}
          </div>
        ),
      }}
      category="気候学・都道府県別解説"
      publishedAt="2026年9月16日"
      readTime="約4分"
      pageTitle={`${prefName}の気候特性〜風土・季節の特徴とアメダス観測データ〜`}
      points={[
        `気候区分: ${article.climateType}`,
        `キャッチコピー: ${article.catchphrase}`,
        `${prefName}内のアメダス観測所の雨温図・平年値データをまとめて確認可能`,
      ]}
      backHref={`/feature/region/${region.key}`}
      backLabel={`${regionName}地方の解説に戻る`}
      accentColor={colorStrong}
      overviewSection={{
        id: "overview",
        title: `1. ${prefName}の気候概況`,
        areaLabel: prefName,
        repStationName: climateStars?.repStationName,
        data: {
          ...article,
          climateStars,
        },
        uonzuTitle: `${prefName}の代表雨温図`,
        uonzuItems: uonzuItems,
      }}
      rainbowSection={{
        title: `2. ${prefName}の虹バッジ地点`,
        areaName: `${prefName}内`,
        stations: rainbowStations,
      }}
      top1Section={{
        title: `3. ${prefName}の気候極値（No.1）地点`,
        areaLabel: prefName,
        rankScopeText: "県内第1位（極値）",
        stations: top1Stations,
      }}
      childSections={childSections}
      siblingsNav={
        siblings && siblings.length > 1
          ? {
              title: `5. ${regionName}地方の他の地域・都道府県`,
              items: siblings.map((sib) => ({
                key: sib.key,
                label: sib.label,
                href: `/feature/region/${region.key}/${sib.key}`,
                isCurrent: sib.key === pref.key,
              })),
            }
          : undefined
      }
    />
  );
};

export default PrefDetailPage;
