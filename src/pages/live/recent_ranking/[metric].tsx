import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Layout from "../../../components/Layout";
import PageLayout from "../../../components/PageLayout";
import HeroSection from "../../../components/HeroSection";
import Sidebar from "../../../components/Sidebar";
import Breadcrumb from "../../../components/Breadcrumb";
import { RankingData, RawRankingData } from "../../../components/Ranking/types";
import RankingGrid from "../../../components/Ranking/RankingGrid";
import RankingScopeFilter from "../../../components/Ranking/RankingScopeFilter";
import { toStation } from "../../../utils/masterUtils";
import { PrefKey, PrefMeta } from "../../../setting/pref";
import { RankKey, RankMeta } from "../../../setting/rank";
import { processRankingData } from "../../../utils/rankingUtils";
import { RegionKey, RegionMeta } from "../../../setting/region";
import { loadMaster } from "../../../utils/ssgLoader";

import { RawStationData } from "../../../types/raw";
import { StationId } from "../../../types/union";
import {
  MetricGroup,
  MetricKey,
  MetricValue,
} from "../../../setting/metric";

interface Props {
  masterData: Record<string, RawStationData>;
  targetMetric: MetricValue;
}

// ランキング対象となる全指標リスト（groupが設定されているもの）
const ALL_RANKING_METRICS = (Object.values(MetricKey) as Array<(typeof MetricKey)[MetricValue]>)
  .filter((m) => m.detail.group !== undefined)
  .map((m) => m.key);

// グループごとに分類した指標リスト
const GROUPS: { key: MetricGroup; label: string; metrics: MetricValue[] }[] = [
  {
    key: "heat",
    label: "暑さ",
    metrics: ALL_RANKING_METRICS.filter(
      (m) => MetricKey[m].detail.group === "heat"
    ),
  },
  {
    key: "cold",
    label: "寒さ",
    metrics: ALL_RANKING_METRICS.filter(
      (m) => MetricKey[m].detail.group === "cold"
    ),
  },
  {
    key: "rain",
    label: "降水",
    metrics: ALL_RANKING_METRICS.filter(
      (m) => MetricKey[m].detail.group === "rain"
    ),
  },
];

const RecentRankingDynamicPage: NextPage<Props> = ({
  masterData,
  targetMetric,
}) => {
  const router = useRouter();

  // 現在選択中の指標（URLパラメータまたは初期値）
  const metric = (router.query.metric as MetricValue) || targetMetric;
  const config = useMemo(() => MetricKey[metric] || MetricKey[targetMetric], [metric, targetMetric]);
  const detail = useMemo(() => config.detail, [config]);

  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);

  // Firestoreから全指標の速報ランキングを取得（1回のみ読み込み）
  const [liveData, setLiveData] = useState<{
    metrics: Record<string, Array<{ id: string; val: number; d?: string }>>;
    lastUpdate: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/live/recent-ranking")
      .then((res) => res.json())
      .then(setLiveData)
      .catch(console.error);
  }, []);

  // 指標切り替えハンドラ（shallow routingでリロードなしでURLを変更）
  const handleSelectMetric = (nextMetric: MetricValue) => {
    if (nextMetric === metric) return;
    router.push(`/live/recent_ranking/${nextMetric}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const displayList: RankingData[] = useMemo(() => {
    if (!liveData || !liveData.metrics) return [];

    const metricData = liveData.metrics[metric] || [];

    const rawList: RawRankingData[] = metricData
      .map((item) => {
        const master = masterData[item.id];
        if (!master) return null;
        return {
          ...master,
          value: item.val,
          time: item.d || null,
        } as RawRankingData;
      })
      .filter((s): s is RawRankingData => s !== null);

    const processed = processRankingData(
      rawList,
      rankMeta,
      selectedRegion,
      selectedPref,
      100
    );

    return processed.map((s) => ({
      ...toStation(s),
      value: s.value,
      rank: s.rank,
      time: s.time,
    }));
  }, [metric, liveData, masterData, rankMeta, selectedRegion, selectedPref]);

  const displayLastUpdate = useMemo(() => {
    if (!liveData) return "読み込み中...";
    return new Date(liveData.lastUpdate).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });
  }, [liveData]);

  const dataBounds = useMemo(() => {
    if (!liveData || !liveData.metrics || !metric) return { min: 0, max: 0 };
    const list = liveData.metrics[metric] || [];
    const values = list.map((item) => item.val);
    if (values.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [liveData, metric]);

  const isRainMetric = metric.includes("rain");
  const isCountMetric =
    metric.includes("hitemp_") || metric.includes("lwtemp_");

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const currentYear = new Date().getFullYear();
  const pageTitle = `${currentYear}年${config.label}ランキング`;
  const pageDescription = `${currentYear}年アメダス観測データに基づく全国の${config.label}ランキングです。`;

  return (
    <>
      <Head>
        <title>{`${pageTitle} - アメダス図鑑`}</title>
        <meta name="description" content={pageDescription} />
        <link
          rel="canonical"
          href={`https://amedas-zukan.jp/live/recent_ranking/${metric}`}
        />
      </Head>
      <Layout>
        <main className="max-w-[1280px] mx-auto p-4 my-4 w-full">
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: "今年のランキング" },
              { label: config.label },
            ]}
          />

          <PageLayout sidebar={<Sidebar />}>
            {/* 左メインエリア */}
            <div className="space-y-6">
              {/* ページヘッダーカード */}
              <HeroSection
                badgeText="Annual Ranking"
                Icon={config.icon || config.high?.icon}
                title={pageTitle}
                description={pageDescription}
                watermark="ANNUAL"
                gradient={detail.gradient}
                lastUpdateLabel="更新"
                lastUpdateValue={displayLastUpdate}
              />

              {/* 統合コントロールパネル（項目選択・絞り込み） */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
                {/* 1. 指標選択（グループ別に整理） */}
                <div className="flex flex-col gap-3 pb-5 border-b border-slate-100">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    ランキング指標を選択:
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {GROUPS.map((grp) => (
                      <div
                        key={grp.key}
                        className="flex flex-wrap items-center gap-1.5"
                      >
                        <span className="text-xs font-black text-slate-500 w-12 shrink-0">
                          {grp.label}
                        </span>
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {grp.metrics.map((m) => {
                            const isSelected = metric === m;
                            const mConfig = MetricKey[m];
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={() => handleSelectMetric(m)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                  isSelected
                                    ? "text-white shadow-sm"
                                    : "text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/70"
                                }`}
                                style={
                                  isSelected
                                    ? { backgroundColor: mConfig.color }
                                    : {}
                                }
                              >
                                <span>{mConfig.icon}</span>
                                <span>{mConfig.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. しぼりこみナビゲーション */}
                <RankingScopeFilter
                  rankMeta={rankMeta}
                  setRankMeta={setRankMeta}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  selectedPref={selectedPref}
                  setSelectedPref={setSelectedPref}
                  accentColor={config.color}
                />
              </div>

              {/* ランキングリスト */}
              <RankingGrid
                items={displayList}
                unit={config.unit}
                minBound={dataBounds.min}
                maxBound={dataBounds.max}
                subTextPrefix="観測日: "
                fractionDigits={isRainMetric || isCountMetric ? 0 : 1}
              />
            </div>
          </PageLayout>
        </main>

        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-4 bg-white shadow-2xl rounded-full text-slate-400 border border-slate-100 transition-colors hover:text-slate-600"
          >
            <FaChevronDown className="transform rotate-180" />
          </button>
        </div>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ALL_RANKING_METRICS.map((metric) => ({
      params: { metric },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const metric = params?.metric as MetricValue;

  // 存在しない指標、またはランキンググループ未定義の指標は404
  if (!MetricKey[metric] || !MetricKey[metric].detail.group) {
    return { notFound: true };
  }

  try {
    const masterData = loadMaster();
    const data: Record<StationId, RawStationData> = Object.fromEntries(
      Object.entries(masterData).map(
        ([id, { lon, lat, similar, height, city, official_name, ...rest }]) => [
          id,
          rest,
        ]
      )
    );

    return {
      props: {
        masterData: data,
        targetMetric: metric,
      },
    };
  } catch (error) {
    console.error(
      `[SSG Error] Recent Ranking Shell generation failed for ${metric}:`,
      error
    );
    return { notFound: true };
  }
};

export default RecentRankingDynamicPage;
