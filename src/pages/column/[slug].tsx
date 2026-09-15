import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { COLUMNS, ColumnArticle } from "../../data/columns";
import { COLUMN_COMPONENTS } from "../../components/Column/articles";
import ArticleTemplate from "../../components/Article/ArticleTemplate";
import { FaBookOpen } from "react-icons/fa";

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
    <>
      <Head>
        <title>{`${article.title} - アメダス図鑑`}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={`https://amedas-zukan.jp/column/${article.slug}`} />
      </Head>

      <ArticleTemplate
        breadcrumbs={[
          { label: "気象コラム", href: "/column" },
          { label: article.title },
        ]}
        hero={{
          badgeIcon: <FaBookOpen className="text-sky-300" />,
          badgeText: "Weather Column & Insights",
          title: "気象コラム・解説",
          description:
            "雨温図の見方から日本の気候区分の秘密、気象データの面白い読み解き方まで。アメダス観測データをより深く楽しむための解説記事一覧です。",
          watermark: "COLUMN",
          gradient: "bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600",
        }}
        category={article.category}
        publishedAt={article.publishedAt}
        readTime={article.readTime}
        title={article.title}
        points={article.description}
        tocItems={tocItems}
        backHref="/column"
        backLabel="コラム一覧に戻る"
      >
        {ArticleComponent ? (
          <ArticleComponent />
        ) : (
          <div className="py-12 text-center text-slate-400 font-bold">
            記事コンテンツの読み込み準備中です。
          </div>
        )}
      </ArticleTemplate>
    </>
  );
};

export default ColumnDetailPage;
