import React from "react";
import Link from "next/link";
import Layout from "../Layout";
import PageLayout from "../PageLayout";
import Sidebar, { TocItem } from "../Sidebar";
import Breadcrumb, { BreadcrumbItem } from "../Breadcrumb";
import HeroSection from "../HeroSection";
import { FaCalendarAlt, FaClock, FaBookOpen, FaArrowLeft } from "react-icons/fa";

export interface ArticleHeroProps {
  badgeIcon?: React.ReactNode;
  badgeText: string;
  title: string;
  description: string;
  watermark?: string;
  gradient?: string;
  rightContent?: React.ReactNode;
}

export interface ArticleSectionProps {
  id: string;
  title: string;
  accentColor?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * 記事内のセクション見出し（カラーバー付き）と本文の共通ラッパー
 */
export const ArticleSection: React.FC<ArticleSectionProps> = ({
  id,
  title,
  accentColor = "#2563eb", // デフォルトはblue-600
  children,
  className = "",
}) => {
  return (
    <section id={id} className={`scroll-mt-6 ${className}`}>
      <h2 className="text-xl font-black text-slate-800 pb-3 border-b border-slate-200 flex items-center gap-2 mb-4">
        <span
          className="w-1.5 h-6 rounded-full shrink-0"
          style={{ backgroundColor: accentColor }}
        />
        <span>{title}</span>
      </h2>
      {children}
    </section>
  );
};

export interface ArticleTemplateProps {
  breadcrumbs: BreadcrumbItem[];
  hero: ArticleHeroProps;
  category?: string;
  publishedAt?: string;
  readTime?: string;
  title: string;
  points?: string | string[];
  tocItems?: TocItem[];
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  sourceText?: string;
}

export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
  breadcrumbs,
  hero,
  category = "気候学・解説",
  publishedAt,
  readTime,
  title,
  points,
  tocItems = [],
  children,
  backHref,
  backLabel = "一覧に戻る",
  sourceText = "気象庁「過去の気象データ・平年値（1991〜2020年）」をもとに作成",
}) => {
  return (
    <Layout>
      <main className="flex-1 max-w-[1280px] mx-auto p-4 my-4 w-full overflow-x-hidden">
        {/* パンくずリスト */}
        <Breadcrumb items={breadcrumbs} />

        <PageLayout sidebar={<Sidebar tocItems={tocItems} />}>
          <div className="space-y-6">
            {/* メインヘッダー */}
            <HeroSection
              badgeIcon={hero.badgeIcon}
              badgeText={hero.badgeText}
              title={hero.title}
              description={hero.description}
              watermark={hero.watermark}
              gradient={hero.gradient}
              rightContent={hero.rightContent}
            />

            {/* 記事本文コンテナ */}
            <article className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm break-words">
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

              {/* モバイル用目次 */}
              {tocItems.length > 0 && (
                <div className="lg:hidden bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-10">
                  <div className="flex items-center gap-2 font-black text-blue-900 mb-3 text-sm">
                    <FaBookOpen className="text-blue-600" />
                    <span>目次</span>
                  </div>
                  <ul className="space-y-2 text-xs font-bold text-slate-700">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`} className="hover:text-blue-600 transition-colors">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 記事本文 */}
              <div className="space-y-10 text-slate-700 leading-relaxed text-sm">
                {children}
              </div>

              {/* 記事フッター */}
              {(backHref || sourceText) && (
                <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col justify-between items-center gap-4">
                  {backHref ? (
                    <Link
                      href={backHref}
                      className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaArrowLeft />
                      <span>{backLabel}</span>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {sourceText && (
                    <div className="text-xs text-slate-400 font-bold">
                      出典: {sourceText}
                    </div>
                  )}
                </div>
              )}
            </article>
          </div>
        </PageLayout>
      </main>
    </Layout>
  );
};

export default ArticleTemplate;
