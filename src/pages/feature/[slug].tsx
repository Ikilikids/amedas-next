import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { IoIosTrophy } from "react-icons/io";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HeroSection from "../../components/HeroSection";
import Ranking from "../../components/Ranking";
import { RankingItem } from "../../components/Ranking/types";
import StationFeatureCard from "../../components/StationFeatureCard";

import {
  FeaturePageProps,
  getFeatureStaticProps,
} from "../../features/feature/ssg";
import { FEATURE_CONFIGS, FeatureName } from "../../types/union";
import { MonthMap } from "../../utils/colorUtils";
import { toAllData, toStation } from "../../utils/masterUtils";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { slug: "meteo" } }, { params: { slug: "hot" } }],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<FeaturePageProps> = async (
  context
) => {
  const slug = context.params?.slug as FeatureName;
  const propsFetcher = getFeatureStaticProps(slug);
  return (propsFetcher as any)(context);
};

const FeaturePage: NextPage<FeaturePageProps> = ({ data, featureName }) => {
  const router = useRouter();
  const config = FEATURE_CONFIGS[featureName];
  const [selectedRankingIndex, setSelectedRankingIndex] = useState(0);

  const currentSideRanking = config.sideRankings[selectedRankingIndex];

  const targetStations = useMemo(() => {
    try {
      if (!data) return [];
      return Object.values(data)
        .map((d) => toStation(d?.station))
        .filter((s): s is NonNullable<typeof s> => s !== null && s.id !== undefined)
        .sort((a, b) => a.id.localeCompare(b.id));
    } catch (e) {
      console.error("Error in targetStations useMemo:", e);
      return [];
    }
  }, [data]);

  const handleStationClick = (station: RankingItem) => {
    router.push(`/station/${station.id}`);
  };

  const Icon = config.Icon;

  return (
    <>
      <Head>
        <title>{config.title} - アメダス図鑑</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Header />

        <main className="flex-1 pb-16">
          <HeroSection
            title={config.title}
            description={config.description}
            Icon={Icon}
            gradient={`bg-gradient-to-br ${config.gradient}`}
          />

          <div className="max-w-[1280px] mx-auto px-4 mt-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 min-w-0">
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

              {/* Sidebar Ranking */}
              <div className="w-full lg:w-[350px]">
                <div className="sticky top-4 h-[calc(100vh-120px)] bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b bg-slate-50 font-bold flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <IoIosTrophy className="text-yellow-500 w-5 h-5" />
                      <span>平年値ランキング</span>
                    </div>

                    <select
                      className="w-full p-2 text-sm border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedRankingIndex}
                      onChange={(e) =>
                        setSelectedRankingIndex(Number(e.target.value))
                      }
                    >
                      {config.sideRankings.map((ranking, index) => (
                        <option key={index} value={index}>
                          {ranking.metric.label} ({MonthMap[ranking.month]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <Ranking
                      onStationClick={handleStationClick}
                      isSimple={true}
                      initialSortKey={currentSideRanking.metric}
                      initialRankType={currentSideRanking.rank}
                      initialMonth={currentSideRanking.month}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FeaturePage;
