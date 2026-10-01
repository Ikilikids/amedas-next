import React from "react";
import Link from "next/link";
import Layout, { LayoutSectionItem, SeoProps } from "../../Layout";
import { BreadcrumbItem } from "../../Layout/widgets/Breadcrumb";
import { FaCalendarAlt, FaClock, FaArrowLeft } from "react-icons/fa";

export interface ArticleHeroProps {
  badgeIcon?: React.ReactNode;
  badgeText: string;
  title: string;
  description: string;
  watermark?: string;
  gradient?: string;
  rightContent?: React.ReactNode;
}

export interface ArticleSectionItem {
  id: string;
  title: string;
  accentColor?: string;
  content: React.ReactNode;
  className?: string;
}

export const ArticleSection: React.FC<{
  id?: string;
  title?: string;
  accentColor?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ id, className, children }) => {
  return (
    <div id={id} className={`scroll-mt-24 ${className || ""}`}>
      {children}
    </div>
  );
};

export interface ArticleTemplateProps {
  seo: SeoProps;
  breadcrumbs: BreadcrumbItem[];
  hero: ArticleHeroProps;
  category?: string;
  publishedAt?: string;
  readTime?: string;
  title: string;
  points?: string | string[];
  sections: ArticleSectionItem[];
  backHref?: string;
  backLabel?: string;
  sourceText?: string;
}

export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
  seo,
  breadcrumbs,
  hero,
  category = "気候学・解説",
  publishedAt,
  readTime,
  title,
  points,
  sections,
  backHref,
  backLabel = "一覧に戻る",
  sourceText = "気象庁「過去の気象データ・平年値（1991〜2020年）」をもとに作成",
}) => {
  // sections を LayoutSectionItem にマッピング
  const layoutSections: LayoutSectionItem[] = sections.map((sec) => ({
    id: sec.id,
    label: sec.title,
    accentColor: sec.accentColor,
    className: sec.className,
    children: sec.content,
  }));

  // 目次上部の導入コンテンツ
  const introContent = (
    <>
      {/* メタ情報（カテゴリ・日付・読了時間） */}
      {(category || publishedAt || readTime) && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-bold mb-4">
          {category && (
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-black">
              {category}
            </span>
          )}
          {publishedAt && (
            <span className="flex items-center gap-1">
              <FaCalendarAlt />
              {publishedAt}
            </span>
          )}
          {readTime && (
            <span className="flex items-center gap-1">
              <FaClock />
              {readTime}
            </span>
          )}
        </div>
      )}

      {/* 記事大見出し */}
      <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-6">
        {title}
      </h1>

      {/* この記事のポイント */}
      {points && (
        <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 text-sm leading-relaxed mb-8">
          <p className="font-bold text-slate-700 mb-1">【この記事のポイント】</p>
          {Array.isArray(points) ? (
            <ul className="list-disc list-inside space-y-1 mt-1 text-slate-600">
              {points.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          ) : (
            <p>{points}</p>
          )}
        </div>
      )}
    </>
  );

  const footerContent = (backHref || sourceText) ? (
    <>
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft />
          <span>{backLabel}</span>
        </Link>
      ) : (
        <span />
      )}
      {sourceText && (
        <p className="text-xs text-slate-400 text-center">{sourceText}</p>
      )}
    </>
  ) : undefined;

  return (
    <Layout
      seo={seo}
      breadcrumbs={breadcrumbs}
      heroProps={{
        badgeIcon: hero.badgeIcon,
        badgeText: hero.badgeText,
        title: hero.title,
        description: hero.description,
        watermark: hero.watermark,
        gradient: hero.gradient,
        rightContent: hero.rightContent,
      }}
      introContent={introContent}
      sections={layoutSections}
      footerContent={footerContent}
    />
  );
};

export default ArticleTemplate;
