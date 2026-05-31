import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useMemo } from "react";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import StationFeatureCard from "../../components/StationFeatureCard";

import { FeaturePageProps, getFeatureStaticProps } from "../../features/feature/ssg";
import { FEATURE_CONFIGS, FeatureName } from "../../types/union";
import { toAllData, toStation } from "../../utils/masterUtils";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { slug: "meteo" } },
      { params: { slug: "hot" } },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<FeaturePageProps> = async (context) => {
  const slug = context.params?.slug as FeatureName;
  const propsFetcher = getFeatureStaticProps(slug);
  return (propsFetcher as any)(context);
};

const FeaturePage: NextPage<FeaturePageProps> = ({ data, featureName }) => {
  const config = FEATURE_CONFIGS[featureName];

  const targetStations = useMemo(() => {
    return Object.values(data)
      .map((d) => toStation(d.station))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [data]);

  const Icon = config.Icon;
// ...

  return (
    <>
      <Head>
        <title>{config.title} - アメダス図鑑</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Header />

        <main className="flex-1 pb-16">
          <div className={`bg-gradient-to-br ${config.gradient} text-white py-14 px-4 mb-8`}>
            <div className="max-w-[1000px] mx-auto">
              <h1 className="text-4xl font-black flex items-center gap-4 mb-6">
                <Icon className="w-12 h-12" />
                {config.title}
              </h1>
              <p className="text-white/90 text-lg font-medium">
                {config.description}
              </p>
            </div>
          </div>

          <div className="max-w-[1000px] mx-auto px-4">
            <div className="flex flex-col gap-4">
              {targetStations.map((station) => {
                const rawData = data[station.id];
                if (!rawData) return null;
                const allData = toAllData(rawData);

                return (
                  <StationFeatureCard
                    key={station.id}
                    allData={allData}
                    ratioInfo={config.ratioTabs}
                  />
                );
              })}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FeaturePage;
