import React, { useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { FaCompass, FaMapMarkerAlt } from "react-icons/fa";
import ArticleTemplate, { ArticleSectionItem } from "..";
import { ClimateIntroSection } from "./part/Intro";
import { RainbowStationsSection } from "./part/Rainbow";
import { Top1StationsSection } from "./part/Top1";
import { ClimateChildSections } from "./part/ChildSections";
import { ClimateDetailPageProps } from "../../../utils/climatePageDataLoader";

export interface ClimateArticlePageTemplateProps {
  data: ClimateDetailPageProps;
}

export const ClimateArticlePageTemplate: React.FC<ClimateArticlePageTemplateProps> = ({
  data,
}) => {
  const {
    region,
    pref,
    article,
    climateStars,
    uonzuItems,
    rainbowStations,
    top1Stations,
    childSections,
    siblings,
  } = data;

  const isPref = !!pref;
  const regionName = region.label;
  const prefName = pref?.label;
  const targetName = isPref ? prefName! : `${regionName}地方`;
  const colorStrong = region.colorStrong;

  // 1. SEO 関連
  const seoTitle = isPref
    ? `${prefName}の気候とアメダス観測所まとめ - アメダス図鑑`
    : `${regionName}地方の気候・都道府県別特徴まとめ - アメダス図鑑`;

  const seoDescription = isPref
    ? `${prefName}（${regionName}地方）の気候特性、平年値の傾向、アメダス観測データについて解説。`
    : `${regionName}地方の気候特性・風土メカニズムと、${childSections
        .map((p) => p.name)
        .join("・")}の都道府県別気候解説まとめ。`;

  const canonicalUrl = isPref
    ? `https://amedas-zukan.jp/japan/${region.key}/${pref!.key}`
    : `https://amedas-zukan.jp/japan/${region.key}`;

  const breadcrumbs: { label: string; href?: string }[] = useMemo(() => {
    const base: { label: string; href?: string }[] = [
      { label: "気候特集", href: "/column" },
      { label: "地域別の気候解説", href: "/japan" },
    ];
    if (isPref) {
      base.push({ label: `${regionName}地方`, href: `/japan/${region.key}` });
      base.push({ label: prefName! });
    } else {
      base.push({ label: `${regionName}地方` });
    }
    return base;
  }, [isPref, regionName, prefName, region.key]);

  // 2. Hero 看板関連
  const hero = useMemo(
    () => ({
      badgeIcon: isPref ? (
        <FaMapMarkerAlt className="text-white/90" />
      ) : (
        <FaCompass className="text-white/90" />
      ),
      badgeText: isPref
        ? `${prefName} (${regionName})`
        : `${regionName} Region Climate`,
      title: isPref
        ? `${prefName}の気候・観測データ`
        : `${regionName}地方の気候特性・特徴まとめ`,
      description: article.heroDescription,
      watermark: (pref?.key ?? region.key).toUpperCase(),
      gradient: `linear-gradient(135deg, ${colorStrong} 0%, color-mix(in srgb, ${colorStrong} 75%, black) 100%)`,
      rightContent: isPref ? (
        <div className="text-xs font-mono font-bold bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white shrink-0">
          PREF CODE: #{pref!.code.join(", #")}
        </div>
      ) : (
        <div className="text-xs font-bold bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white shrink-0">
          {childSections.length} 都道府県・地域
        </div>
      ),
    }),
    [isPref, prefName, regionName, pref, region.key, article.heroDescription, colorStrong, childSections.length]
  );

  // 3. 記事メタ
  const category = isPref ? "気候学・都道府県別解説" : "気候学・地方別解説";
  const publishedAt = "2026年9月16日";
  const readTime = isPref ? "約4分" : "約7分";
  const pageTitle = isPref
    ? `${prefName}の気候特性〜風土・季節の特徴とアメダス観測データ〜`
    : `${regionName}地方の気候特性〜風土・季節風・地形のメカニズム〜`;

  const points = useMemo(() => {
    const list = [
      `気候区分: ${article.climateType}`,
      `キャッチコピー: ${article.catchphrase}`,
    ];
    if (isPref) {
      list.push(`${prefName}内のアメダス観測所の雨温図・平年値データをまとめて確認可能`);
    } else {
      list.push(
        `${regionName}地方を構成する全${childSections.length}都道県・地域の気候を見出し別に徹底解説`
      );
    }
    return list;
  }, [article.climateType, article.catchphrase, isPref, prefName, regionName, childSections.length]);

  const backHref = isPref ? `/japan/${region.key}` : "/japan";
  const backLabel = isPref ? `${regionName}地方の解説に戻る` : "全地域一覧に戻る";

  // 4. セクション組み立て
  const sections: ArticleSectionItem[] = useMemo(() => {
    const list: ArticleSectionItem[] = [
      // セクション1: 気候の特徴と概況
      {
        id: "overview",
        title: isPref
          ? `1. ${prefName}の気候概況`
          : `1. ${regionName}地方の気候の特徴とメカニズム`,
        accentColor: colorStrong,
        content: (
          <ClimateIntroSection
            id="overview"
            title={
              isPref
                ? `1. ${prefName}の気候概況`
                : `1. ${regionName}地方の気候の特徴とメカニズム`
            }
            accentColor={colorStrong}
            areaLabel={targetName}
            data={article}
            climateStars={climateStars ?? undefined}
            repStationName={climateStars?.repStationName}
            uonzuTitle={`${targetName}の代表雨温図`}
            uonzuItems={uonzuItems}
          />
        ),
      },
      // セクション2: 虹バッジ地点
      {
        id: "rainbow-stations",
        title: `2. ${targetName}の虹バッジ地点`,
        accentColor: colorStrong,
        content: (
          <RainbowStationsSection
            title={`2. ${targetName}の虹バッジ地点`}
            accentColor={colorStrong}
            areaName={isPref ? `${prefName}内` : `${regionName}地方`}
            rainbowStations={rainbowStations}
          />
        ),
      },
      // セクション3: 記録 No.1地点
      {
        id: "top1-stations",
        title: `3. ${targetName}の気候極値（No.1）地点`,
        accentColor: colorStrong,
        content: (
          <Top1StationsSection
            title={`3. ${targetName}の気候極値（No.1）地点`}
            accentColor={colorStrong}
            areaLabel={targetName}
            rankScopeText={isPref ? "県内第1位（極値）" : "地方第1位（極値）"}
            top1Stations={top1Stations}
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
          accentColor: colorStrong,
          content: (
            <ClimateChildSections
              startNumber={4 + idx}
              accentColor={colorStrong}
              items={[child]}
            />
          ),
        });
      });
    }

    // 末尾ナビゲーション
    if (isPref && siblings && siblings.length > 1) {
      list.push({
        id: "siblings",
        title: `5. ${regionName}地方の他の地域・都道府県`,
        accentColor: colorStrong,
        content: (
          <div className="flex flex-wrap gap-2">
            {siblings.map((sib) => (
              <Link
                key={sib.key}
                href={`/japan/${region.key}/${sib.key}`}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  sib.key === pref!.key
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
    isPref,
    prefName,
    regionName,
    targetName,
    colorStrong,
    article,
    climateStars,
    uonzuItems,
    rainbowStations,
    top1Stations,
    childSections,
    siblings,
    region.key,
    pref,
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
