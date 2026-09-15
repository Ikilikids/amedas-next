import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import PageLayout from "../../components/PageLayout";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import { COLUMNS, ColumnArticle } from "../../data/columns";
import { COLUMN_COMPONENTS } from "../../components/Column/articles";
import {
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,
  FaBookOpen,
} from "react-icons/fa";

interface Props {
  article: ColumnArticle;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = COLUMNS.map((col) => ({
    params: { slug: col.slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const article = COLUMNS.find((col) => col.slug === slug);
  if (!article) return { notFound: true };
  return { props: { article } };
};

const ColumnDetailPage: NextPage<Props> = ({ article }) => {
  const articleContent = COLUMN_COMPONENTS[article.slug];
  const ArticleComponent = articleContent?.component;
  const tocItems = articleContent?.tocItems || [];

  return (
    <Layout>
      <Head>
        <title>{`${article.title} - アメダス図鑑`}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={`https://amedas-zukan.jp/column/${article.slug}`} />
      </Head>

      <main className="flex-1 max-w-[1280px] mx-auto p-4  my-4 w-full overflow-x-hidden">
        {/* パンくずリスト */}
        <Breadcrumb
          items={[
            { label: "気象コラム", href: "/column" },
            { label: article.title },
          ]}
        />

        <PageLayout sidebar={<Sidebar tocItems={tocItems} />}>
          {/* 左カラム: 記事本文 */}
          <article className="bg-white border border-slate-200/80 rounded-3xl p-4   shadow-sm break-words">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-bold mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-black">
                {article.category}
              </span>
              <span className="flex items-center gap-1">
                <FaCalendarAlt />
                {article.publishedAt}
              </span>
              <span className="flex items-center gap-1">
                <FaClock />
                {article.readTime}
              </span>
            </div>

            <h1 className="text-2xl   font-black text-slate-800 tracking-tight leading-tight mb-6">
              {article.title}
            </h1>

            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 text-sm  leading-relaxed mb-8">
              <p className="font-bold text-slate-700 mb-1">【この記事のポイント】</p>
              <p>{article.description}</p>
            </div>

            {/* モバイル用目次 (lg以上は右サイドバーに表示) */}
            {tocItems.length > 0 && (
              <div className="lg:hidden bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-10">
                <div className="flex items-center gap-2 font-black text-blue-900 mb-3 text-sm ">
                  <FaBookOpen className="text-blue-600" />
                  <span>目次</span>
                </div>
                <ul className="space-y-2 text-xs  font-bold text-slate-700">
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

            {/* 本文コンポーネント */}
            {ArticleComponent ? (
              <ArticleComponent />
            ) : (
              <div className="py-12 text-center text-slate-400 font-bold">
                記事コンテンツの読み込み準備中です。
              </div>
            )}

            {/* 記事フッター */}
            <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col justify-between items-center gap-4">
              <Link
                href="/column"
                className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaArrowLeft />
                <span>コラム一覧に戻る</span>
              </Link>
              <div className="text-xs text-slate-400 font-bold">
                出典: 気象庁「過去の気象データ・平年値（1991〜2020年）」をもとに作成
              </div>
            </div>
          </article>
        </PageLayout>
      </main>
    </Layout>
  );
};

export default ColumnDetailPage;
