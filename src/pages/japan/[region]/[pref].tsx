import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { REGION_LIST, RegionValue } from "../../../setting/region";
import { getPrefsInRegion, PrefValue } from "../../../setting/pref";
import ClimateArticlePageTemplate from "../../../components/Individual/ArticleTemplate/Climate";
import {
  loadClimateDetailPageData,
  ClimateDetailPageProps,
} from "../../../components/Individual/ArticleTemplate/Climate/ssg_function";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { region: string; pref: string } }[] = [];

  REGION_LIST.forEach((regionKey) => {
    const prefs = getPrefsInRegion(regionKey);
    prefs.forEach((pref) => {
      paths.push({
        params: { region: regionKey, pref: pref.key },
      });
    });
  });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<ClimateDetailPageProps> = async ({
  params,
}) => {
  const regionKey = params?.region as RegionValue;
  const prefKey = params?.pref as PrefValue;

  const data = await loadClimateDetailPageData(regionKey, prefKey);
  if (!data) return { notFound: true };

  return { props: data };
};

const PrefDetailPage: NextPage<ClimateDetailPageProps> = (props) => {
  if (!props.pref) return null;
  return <ClimateArticlePageTemplate data={props} />;
};

export default PrefDetailPage;
