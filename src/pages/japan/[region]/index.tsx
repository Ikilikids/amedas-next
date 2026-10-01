import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { REGION_LIST, RegionValue } from "../../../setting/region";
import ClimateArticlePageTemplate from "../../../components/ArticleTemplate/Climate";
import {
  loadClimateDetailPageData,
  ClimateDetailPageProps,
} from "../../../utils/climatePageDataLoader";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = REGION_LIST.map((region) => ({
    params: { region },
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<ClimateDetailPageProps> = async ({
  params,
}) => {
  const regionKey = params?.region as RegionValue;
  const data = await loadClimateDetailPageData(regionKey);
  if (!data) return { notFound: true };

  return { props: data };
};

const RegionDetailPage: NextPage<ClimateDetailPageProps> = (props) => {
  return <ClimateArticlePageTemplate data={props} />;
};

export default RegionDetailPage;
