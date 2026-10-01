import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { COLUMNS } from "../../data/columns";

interface Props {
  slug: string;
  data: any;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = COLUMNS.map((col) => ({
    params: { slug: col.slug },
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const article = COLUMNS.find((col) => col.slug === slug);
  if (!article) return { notFound: true };

  const data = article.loadData ? await article.loadData() : null;
  return { props: { slug, data } };
};

const ColumnDetailPage: NextPage<Props> = ({ slug, data }) => {
  const article = COLUMNS.find((col) => col.slug === slug);
  if (!article) return null;

  const PageComponent = article.Component;

  return <PageComponent data={data} />;
};

export default ColumnDetailPage;
