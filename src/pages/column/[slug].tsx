import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import {
  COLUMNS,
  ColumnArticle,
  COLUMN_SECTIONS,
} from "../../data/columns";
import ArticleTemplate from "../../components/ArticleTemplate";
import { FaBookOpen } from "react-icons/fa";

import { assembleDisplayData } from "../../utils/rankingUtils";
import { loadMaster, resisterMaster } from "../../utils/climateDataManager";
import { ArticleUonzuItem } from "../../utils/ssgLoader";
import { CLIMATE_DIVISIONS } from "../../data/classification";
import { StationId } from "../../types/union";

interface Props {
  slug: string;
  uonzuItems?: ArticleUonzuItem[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = COLUMNS.map((col) => ({
    params: { slug: col.slug },
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const exists = COLUMNS.some((col) => col.slug === slug);
  if (!exists) return { notFound: true };

  let uonzuItems: ArticleUonzuItem[] | undefined;
  if (slug === "japan-climate-classification") {
    const allStationIds = CLIMATE_DIVISIONS.flatMap((div) => div.stationIds);
    const master = loadMaster();
    resisterMaster(master);
    const config: Record<StationId, ("uonzu")[]> = {};
    for (const id of allStationIds) {
      config[id] = ["uonzu"];
    }
    const stationMetricsMap = await assembleDisplayData(config);

    uonzuItems = Object.values(stationMetricsMap).map((st) => ({
      id: st.station.id,
      name: st.station.station_name || "",
      rawUonzu: st.climateData || {},
    }));
  }

  return { props: { slug, ...(uonzuItems ? { uonzuItems } : {}) } };
};

const ColumnDetailPage: NextPage<Props> = ({ slug, uonzuItems }) => {
  const article = COLUMNS.find((col) => col.slug === slug);
  const sections = COLUMN_SECTIONS[slug] ? COLUMN_SECTIONS[slug](uonzuItems) : [];
  if (!article) return null;

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
        points={article.summary || article.description}
        sections={sections}
        backHref="/column"
        backLabel="コラム一覧に戻る"
      />
    </>
  );
};

export default ColumnDetailPage;
