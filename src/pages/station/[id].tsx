import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { StationId } from "../../types/union";
import {
  getStationStaticPaths,
  loadStationDetailPageData,
  StationDetailPageProps,
} from "../../components/Individual/Station/ssg_function";
import StationDetailPageTemplate from "../../components/Individual/Station";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getStationStaticPaths(),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<StationDetailPageProps> = async ({
  params,
}) => {
  const id = params?.id as StationId;
  const data = await loadStationDetailPageData(id);
  if (!data) return { notFound: true };

  return { props: data };
};

const StationPage: NextPage<StationDetailPageProps> = (data) => {
  return <StationDetailPageTemplate data={data} />;
};

export default StationPage;
