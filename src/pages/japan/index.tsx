import React from "react";
import { GetStaticProps, NextPage } from "next";
import { ClimateArticlePageTemplate } from "../../components/Individual/ArticleTemplate/Climate";
import {
  ClimateDetailPageProps,
  loadClimateDetailPageData,
} from "../../components/Individual/ArticleTemplate/Climate/ssg_function";

const JapanClimateIndexPage: NextPage<ClimateDetailPageProps> = (props) => {
  return <ClimateArticlePageTemplate {...props} />;
};

export const getStaticProps: GetStaticProps<ClimateDetailPageProps> = async () => {
  const data = await loadClimateDetailPageData();
  if (!data) {
    return { notFound: true };
  }

  return {
    props: data,
  };
};

export default JapanClimateIndexPage;
