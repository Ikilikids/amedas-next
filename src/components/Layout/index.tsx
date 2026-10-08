import React from "react";
import Head from "next/head";
import Header from "./widgets/Header";
import Footer from "./widgets/Footer";
import HeroSection, { HeroSectionProps } from "./widgets/HeroSection";
import Breadcrumb, { BreadcrumbItem } from "./widgets/Breadcrumb";
import Sidebar, { TocItem } from "./widgets/Sidebar";
import { FaBookOpen } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

export type { HeroSectionProps, BreadcrumbItem, TocItem };

export interface LayoutSectionItem {
  id: string;
  label: string;
  subLabel?: React.ReactNode;
  accentColor?: string;
  className?: string;
  defaultOpen?: boolean; // 最初開いているかどうか（デフォルト: true）
  children: React.ReactNode;
}

export interface SeoProps {
  title: string;
  description: string;
  canonical: string;
}

interface LayoutProps {
  seo: SeoProps;
  breadcrumbs?: BreadcrumbItem[];
  heroProps: HeroSectionProps;
  sidebar?: React.ReactNode; // ページ固有のサイドバーウィジェット（類似地点など）
  introContent?: React.ReactNode; // 目次上部に表示する前置きコンテンツ
  sections?: LayoutSectionItem[]; // 目次と連動するセクション配列
  footerContent?: React.ReactNode; // 記事フッターコンテンツ（戻るリンク等）
  children?: React.ReactNode; // sections を使わない場合のフォールバック用
}

const CollapsibleSection: React.FC<{ sec: LayoutSectionItem }> = ({ sec }) => {
  const [isOpen, setIsOpen] = React.useState(sec.defaultOpen ?? true);

  return (
    <section
      id={sec.id}
      className={`scroll-mt-24 ${sec.className || ""}`}
    >
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="group cursor-pointer select-none pb-3 border-b border-slate-200 mb-4 flex items-center justify-between transition-colors hover:border-slate-300"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-1.5 h-6 rounded-full shrink-0"
            style={{
              backgroundColor: sec.accentColor || "#2563eb",
            }}
          />
          <h2 className="text-xl font-black text-slate-800 truncate">
            {sec.label}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2">
          <span>{isOpen ? "閉じる" : "開く"}</span>
          <FaChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </div>
      </div>
      {sec.subLabel && (
        <div className="text-xs text-slate-500 -mt-2 mb-4">
          {sec.subLabel}
        </div>
      )}
      {isOpen && sec.children}
    </section>
  );
};

export const Layout: React.FC<LayoutProps> = ({
  seo,
  breadcrumbs,
  heroProps,
  sidebar,
  introContent,
  sections,
  footerContent,
  children,
}) => {
  // sections から自動で目次項目を生成
  const tocItems: TocItem[] | undefined = sections
    ? sections.map((sec) => ({ id: sec.id, label: sec.label }))
    : undefined;

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans relative">
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
      </Head>
      <Header />

      <div className="flex-1 w-full flex justify-center relative">
        <main className="w-full max-w-[1280px] min-w-0 flex-1 p-3 xl:p-4 my-4 overflow-x-hidden">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb items={breadcrumbs} />
          )}

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* メインカラム */}
            <div className="flex-1 min-w-0 w-full space-y-6">
              <HeroSection {...heroProps} />

              {sections && sections.length > 0 ? (
                <article className="bg-white border border-slate-200/80 rounded-3xl p-4 xl:p-6 shadow-sm break-words">
                  {/* 目次上部の導入コンテンツ */}
                  {introContent && <div className="mb-6">{introContent}</div>}

                  {/* モバイル用目次 (lg:hidden) */}
                  <div className="lg:hidden bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-10">
                    <div className="flex items-center gap-2 font-black text-blue-900 mb-3 text-sm">
                      <FaBookOpen className="text-blue-600" />
                      <span>目次</span>
                    </div>
                    <ul className="space-y-2 text-xs font-bold text-slate-700">
                      {sections.map((sec) => (
                        <li key={sec.id}>
                          <a
                            href={`#${sec.id}`}
                            className="hover:text-blue-600 transition-colors block py-0.5"
                          >
                            {sec.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* セクション群 */}
                  <div className="space-y-12 text-slate-700 leading-relaxed text-sm">
                    {sections.map((sec) => (
                      <CollapsibleSection key={sec.id} sec={sec} />
                    ))}
                  </div>

                  {/* 記事フッター */}
                  {footerContent && (
                    <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col justify-between items-center gap-4">
                      {footerContent}
                    </div>
                  )}
                </article>
              ) : (
                children
              )}
            </div>

            {/* サイドバー: 目次を自動展開 + ページ固有のウィジェット */}
            <Sidebar tocItems={tocItems}>
              {sidebar}
            </Sidebar>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;