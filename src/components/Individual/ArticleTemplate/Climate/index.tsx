import React, { useMemo } from "react";
import Link from "next/link";
import ArticleTemplate, { ArticleSectionItem } from "..";
import { ClimateIntroSection } from "./widgets/Intro/UI";
import { RainbowStationsSection } from "./widgets/Rainbow/UI";
import { Top1StationsSection } from "./widgets/Top1/UI";
import { getChildSectionList } from "./widgets/Intro/function";
import { ClimateDetailPageProps } from "./ssg_function";
import { getPrefsInRegion } from "../../../../setting/pref";
import { getClimatePageDisplayMeta } from "../../../../setting/japan";
import { getClimateDivisions, formatClimateDivisions } from "../../../../setting/division";

export const ClimateArticlePageTemplate: React.FC<ClimateDetailPageProps> = ({
  regionKey,
  prefKey,
  article,
  childArticles,
  stationsMap,
}) => {
  // 1. スコープ・表示メタ情報の一元取得（japan.tsxから取得）
  const meta = useMemo(() => {
    return getClimatePageDisplayMeta(regionKey, prefKey, article);
  }, [regionKey, prefKey, article]);

  const {
    scopeKey,
    currentKey,
    targetName,
    colorStrong,
    parentKey,
    targetPrefCodes,
    representativeStationId,
    uonzuList,
    category,
    readTime,
    icon,
    badgeText,
    rightBadge,
    pageTitle,
    seoTitle,
    seoDescription,
    canonicalUrl,
    watermark,
    backHref,
    backLabel,
    breadcrumbs,
    hasRankingWidgets,
    top1RankScopeText,
    rainbowAreaName,
    overviewTitle,
    hideOverviewWidgets,
    childSectionPrefix,
    childTitleSuffix,
    points,
  } = meta;

  // 2. 子階層セクション
  const childSections = useMemo(() => {
    return getChildSectionList(regionKey, prefKey, stationsMap, childArticles);
  }, [regionKey, prefKey, stationsMap, childArticles]);

  // 3. Hero 看板
  const hero = useMemo(() => {
    const divs = getClimateDivisions(currentKey);
    const divText = formatClimateDivisions(divs);
    const description = divText
      ? `${article.catchphrase}（${divText}）`
      : article.catchphrase;

    return {
      badgeIcon: icon,
      badgeText,
      title: pageTitle,
      description,
      watermark,
      gradient: `linear-gradient(135deg, ${colorStrong} 0%, color-mix(in srgb, ${colorStrong} 75%, black) 100%)`,
      rightContent: rightBadge ? (
        <div className="text-xs font-mono font-bold bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white shrink-0">
          {rightBadge}
        </div>
      ) : undefined,
    };
  }, [currentKey, icon, badgeText, pageTitle, article.catchphrase, watermark, colorStrong, rightBadge]);

  // 4. 同地方の他都道府県リンク
  const siblingPrefs = useMemo(() => {
    if (scopeKey !== "pref" || !parentKey) return [];
    return getPrefsInRegion(parentKey as any)
      .filter((p) => p.key !== currentKey)
      .map((p) => ({ key: p.key, label: p.label, href: `/japan/${parentKey}/${p.key}` }));
  }, [scopeKey, parentKey, currentKey]);

  // 5. 記事本文セクション
  const sections: ArticleSectionItem[] = useMemo(() => {
    const list: ArticleSectionItem[] = [
      {
        id: "overview",
        title: overviewTitle,
        accentColor: colorStrong,
        content: (
          <ClimateIntroSection
            item={{
              key: currentKey,
              name: targetName,
              color: colorStrong,
              targetPrefCodes,
              representativeStationId,
              uonzuList,
              ...article,
            }}
            stationsMap={stationsMap}
            hideWidgets={hideOverviewWidgets}
          />
        ),
      },
    ];

    if (hasRankingWidgets) {
      list.push({
        id: "rainbow-stations",
        title: `2. ${targetName}の虹バッジ地点`,
        accentColor: colorStrong,
        content: (
          <RainbowStationsSection
            areaName={rainbowAreaName}
            stationsMap={stationsMap}
          />
        ),
      });

      list.push({
        id: "top1-stations",
        title: `3. ${targetName}の気候極値（No.1）地点`,
        accentColor: colorStrong,
        content: (
          <Top1StationsSection
            areaLabel={targetName}
            rankScopeText={top1RankScopeText}
            stationsMap={stationsMap}
          />
        ),
      });
    }

    if (childSections && childSections.length > 0) {
      childSections.forEach((child, idx) => {
        list.push({
          id: child.key,
          title: `${childSectionPrefix}-${idx + 1}. ${child.name}${childTitleSuffix}の気候`,
          accentColor: child.color ?? colorStrong,
          content: (
            <ClimateIntroSection
              item={child}
              stationsMap={stationsMap}
              hideStarWidgets={scopeKey === "national"}
            />
          ),
        });
      });
    }

    if (siblingPrefs && siblingPrefs.length > 0) {
      list.push({
        id: "siblings",
        title: `5. 同地方の他の地域・都道府県`,
        accentColor: colorStrong,
        content: (
          <div className="flex flex-wrap gap-2">
            {siblingPrefs.map((sib) => (
              <Link
                key={sib.key}
                href={sib.href}
                className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 hover:bg-slate-200 text-slate-700"
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
    overviewTitle,
    colorStrong,
    currentKey,
    targetName,
    targetPrefCodes,
    representativeStationId,
    article,
    stationsMap,
    hideOverviewWidgets,
    hasRankingWidgets,
    rainbowAreaName,
    top1RankScopeText,
    childSections,
    childSectionPrefix,
    childTitleSuffix,
    scopeKey,
    siblingPrefs,
  ]);

  return (
    <ArticleTemplate
      seo={{
        title: seoTitle,
        description: seoDescription,
        canonical: canonicalUrl,
      }}
      breadcrumbs={breadcrumbs}
      hero={hero}
      category={category}
      publishedAt="2026年9月16日"
      readTime={readTime}
      title={hero.title}
      points={points}
      sections={sections}
      backHref={backHref}
      backLabel={backLabel}
    />
  );
};

export default ClimateArticlePageTemplate;
