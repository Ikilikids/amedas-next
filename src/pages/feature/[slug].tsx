import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { IoIosTrophy } from "react-icons/io";

import Layout from "../../components/Layout";
import PageLayout from "../../components/PageLayout";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import Ranking from "../../components/Ranking";
import { RankingItem } from "../../components/Ranking/types";
import StationFeatureCard from "../../components/Feature/StationFeatureCard";

import { BsBookmarkStarFill } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
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

    // 特集ページ固有 of ratio フィルタリング
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
        <link rel="canonical" href={`https://amedas-zukan.jp/feature/${featureName}`} />
      </Head>

      <Layout>
        <main className="flex-1 max-w-[1280px] mx-auto p-4  my-4 w-full">
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: "気候特集" },
              { label: config.title },
            ]}
          />

          <PageLayout
            sidebar={
              <Sidebar
                tocItems={targetStations.map((s, idx) => ({
                  id: `station-${s.id}`,
                  label: `${idx + 1}. ${s.station_name}（${s.pref.label}）`,
                }))}
              />
            }
          >
            {/* 左カラム: 記事本文コンテナ */}
            <article className="bg-white border border-slate-200/80 rounded-3xl p-6  shadow-sm">
              {/* カテゴリバッジ */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-bold mb-4">
                <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full font-black flex items-center gap-1">
                  {Icon}
                  <span>気候特集</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  対象地点: {targetStations.length}地点
                </span>
              </div>

              {/* タイトル */}
              <h1 className="text-2xl   font-black text-slate-800 tracking-tight leading-tight mb-6">
                {config.title}
              </h1>

              {/* 概要ポイント枠 */}
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 text-sm  leading-relaxed mb-8">
                <p className="font-bold text-slate-700 mb-1">【特集の概要】</p>
                <p>{config.description}</p>
              </div>

              {/* モバイル用目次 (lg以上は右サイドバーに表示、開閉式・デフォルト閉) */}
              <div className="lg:hidden bg-blue-50/40 border border-blue-100 rounded-2xl p-5 mb-10">
                <details className="group">
                  <summary className="flex items-center justify-between font-black text-blue-900 text-sm  cursor-pointer list-none">
                    <div className="flex items-center gap-2">
                      <FaBookOpen className="text-blue-600" />
                      <span>目次</span>
                      <span className="text-xs text-blue-600/70 font-normal">
                        （全{targetStations.length}地点）
                      </span>
                    </div>
                    <span className="text-blue-600/70 group-open:rotate-180 transition-transform duration-200">
                      ▼
                    </span>
                  </summary>
                  <ul className="mt-4 pt-3 border-t border-blue-100 space-y-2 text-xs  font-bold text-slate-700 max-h-60 overflow-y-auto pr-2">
                    {targetStations.map((station, idx) => (
                      <li key={station.id}>
                        <a
                          href={`#station-${station.id}`}
                          className="hover:text-blue-600 transition-colors block py-0.5"
                        >
                          {idx + 1}. {station.station_name}（{station.pref.label}）
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              {/* 地点一覧セクション */}
              <div className="space-y-4">
                {targetStations.map((station, idx) => {
                  const rawData = data[station.id];
                  if (!rawData) return null;
                  const allData = toAllData(rawData);

                  return (
                    <StationFeatureCard
                      key={station.id}
                      allData={allData}
                      ratioInfo={config.ratioTabs}
                      uonzuInfo={config.uonzuTabs}
                      index={idx + 1}
                    />
                  );
                })}
              </div>
            </article>
          </PageLayout>
        </main>
      </Layout>
    </>
  );
};

export default FeaturePage;
