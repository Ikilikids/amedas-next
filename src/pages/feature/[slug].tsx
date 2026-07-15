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
import StationFeatureCard from "./components/StationFeatureCard";

import { BsBookmarkStarFill } from "react-icons/bs";
import { FEATURE_CONFIGS, FeatureName, StationId, DescriptionData } from "../../types/union";
import { MonthMap, SectionWithDescription } from "../../utils/colorUtils";
import { toAllData, toStation } from "../../utils/masterUtils";
import { RawData, RawRatioData } from "../../types/raw";
import { getStation } from "../../utils/climateCache";
import { MetricKey, MetricValue } from "../../setting/metric";
import { assembleDisplayData } from "../../utils/rankingUtils";
import { ensureAllDataLoaded, loadMaster, readJson } from "../../utils/ssgLoader";

export interface FeaturePageProps {
  data: Record<StationId, RawData>;
  featureName: FeatureName;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { slug: "meteo" } },
      { params: { slug: "special" } },
      { params: { slug: "hot" } },
      { params: { slug: "warm" } },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<FeaturePageProps> = async (context) => {
  const slug = context.params?.slug as FeatureName;

  // キャッシュを埋める（マスターも内部でロードされる）
  ensureAllDataLoaded();
  const rawMasterAll = loadMaster();

  const descriptionData = readJson<Record<StationId, DescriptionData>>(
    "data",
    "feature",
    `${slug}.json`
  );

  if (!descriptionData) {
    return { notFound: true };
  }

  const idList = Object.keys(descriptionData) as StationId[];
  const result: Record<StationId, RawData> = {};

  for (const id of idList) {
    const station = rawMasterAll[id];
    // キャッシュから地点ごとのデータを取得
    const integratedData = getStation(id);
    const { overview, table, ratio, uonzu } =
      assembleDisplayData(integratedData);

    // 特集ページ固有の ratio フィルタリング
    const config = FEATURE_CONFIGS[slug];

    const allowedTabs = config.ratioTabs.map((info) => info.metricTab);

    const rankingMap = Object.fromEntries(
      config.ratioTabs.map((info) => [info.metricTab, info.ranking])
    );

    const filteredRatio: RawRatioData = {};

    Object.entries(ratio).forEach(([m, data]) => {
      const meta = MetricKey[m as MetricValue];

      if (meta && allowedTabs.includes(meta.tab)) {
        const ranking = rankingMap[meta.tab]; // "meteo" など

        filteredRatio[m] = data.map((d) => ({
          value: d.value,
          [ranking]: d[ranking],
        }));
      }
    });
    result[id] = {
      station,
      uonzu,
      ratio: filteredRatio,
      description: descriptionData[id],
    };
  }

  return {
    props: {
      data: result,
      featureName: slug,
    },
  };
};

const FeaturePage: NextPage<FeaturePageProps> = ({ data, featureName }) => {
  const router = useRouter();
  const config = FEATURE_CONFIGS[featureName];
  const [selectedRankingIndex, setSelectedRankingIndex] = useState(0);

  const currentSideRanking = config.sideRankings[selectedRankingIndex];

  const targetStations = useMemo(() => {
    return Object.values(data).map((d) => toStation(d.station));
  }, [data]);

  const handleStationClick = (station: RankingItem) => {
    router.push(`/station/${station.id}`);
  };

  const Icon = config.Icon;

  return (
    <>
      <Head>
        <title>{config.title} - アメダス図鑑</title>
        <meta
          name="description"
          content={`【アメダス図鑑特集】${config.title}。${config.description}`}
        />
        <link rel="canonical" href={`https://amedas-next--amedas-ppp.asia-east1.hosted.app/feature/${featureName}`} />
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
                <SectionWithDescription
                  icon={<BsBookmarkStarFill />}
                  title="地点の一覧"
                  bgColor={"#FF637E"}
                ></SectionWithDescription>
                <div className="flex flex-col gap-4 mt-2">
                  {targetStations.map((station) => {
                    const rawData = data[station.id];
                    if (!rawData) return null;
                    const allData = toAllData(rawData);

                    return (
                      <StationFeatureCard
                        key={station.id}
                        allData={allData}
                        ratioInfo={config.ratioTabs}
                        uonzuInfo={config.uonzuTabs}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="w-full lg:w-[360px] shrink-0">
                <div className="sticky top-4 h-[calc(100vh-32px)] bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col">
                  <div className="shrink-0">
                    <SectionWithDescription
                      icon={<IoIosTrophy />}
                      title={`${currentSideRanking.metric.label}のランキング`}
                      bgColor={currentSideRanking.metric.color}
                      description={[
                        "この特集グループ内の地点だけで比較したローカルランキングです。",
                      ]}
                    />
                  </div>

                  {/* セレクトボックスによる切り替え */}
                  {config.sideRankings.length > 1 && (
                    <div className="mt-4 shrink-0">
                      <select
                        className="w-full p-2.5 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                        value={selectedRankingIndex}
                        onChange={(e) =>
                          setSelectedRankingIndex(Number(e.target.value))
                        }
                      >
                        {config.sideRankings.map((ranking, index) => (
                          <option key={index} value={index}>
                            {ranking.metric.label} ({MonthMap[ranking.month] || "通年"})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="mt-4 flex-1 min-h-0 overflow-hidden">
                    <Ranking
                      isSimple={true}
                      initialSortKey={currentSideRanking.metric}
                      initialRankType={currentSideRanking.rank}
                      initialMonth={currentSideRanking.month}
                      onStationClick={handleStationClick}
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
