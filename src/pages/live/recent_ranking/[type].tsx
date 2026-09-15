import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import CategoryLegend from "../../../components/CategoryLegend";
import Layout from "../../../components/Layout";
import PageLayout from "../../../components/PageLayout";
import HeroSection from "../../../components/HeroSection";
import Sidebar from "../../../components/Sidebar";
import Breadcrumb from "../../../components/Breadcrumb";
import { RankingData, RawRankingData } from "../../../components/Ranking/types";
import RankingGrid from "../../../components/Ranking/RankingGrid";
import RankingScopeFilter from "../../../components/Ranking/RankingScopeFilter";
import { getMetricColor } from "../../../utils/colorUtils";
import { toStation } from "../../../utils/masterUtils";
import { PrefKey, PrefMeta } from "../../../setting/pref";
import { RankKey, RankMeta } from "../../../setting/rank";
import { processRankingData } from "../../../utils/rankingUtils";
import { RegionKey, RegionMeta } from "../../../setting/region";
import { loadMaster } from "../../../utils/ssgLoader";

import { colorWithAlpha } from "../../../components/LayeredPieChart/chartUtils";
import { RawStationData } from "../../../types/raw";
import { StationId } from "../../../types/union";
import {
  MetricGroup,
  MetricKey,
  MetricValue,
  RANKING_GROUP_META,
} from "../../../setting/metric";

interface Props {
  masterData: Record<string, RawStationData>;
  type: MetricGroup;
}

const RecentRankingDynamicPage: NextPage<Props> = ({ masterData, type }) => {
  const router = useRouter();
  const groupMeta = RANKING_GROUP_META[type];

  // このグループに属するメトリクスを自動抽出
  const groupMetrics = useMemo(
    () =>
      Object.values(MetricKey)
        .filter((m) => m.detail.group === type)
        .map((m) => m.key),
    [type]
  );

  const [metric, setMetric] = useState<MetricValue>(groupMetrics[0]);
  const [prevType, setPrevType] = useState<MetricGroup>(type);

  if (type !== prevType) {
    setPrevType(type);
    setMetric(groupMetrics[0]);
  }

  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);

  const [liveData, setLiveData] = useState<{
    metrics: Record<string, Array<{ id: string; val: number; d?: string }>>;
    lastUpdate: string;
  } | null>(null);

  useEffect(() => {
    // APIから最新の数字を取得
    fetch(`/api/live/recent-ranking?type=${type}`)
      .then((res) => res.json())
      .then(setLiveData)
      .catch(console.error);
  }, [type]);

  const config = useMemo(() => MetricKey[metric], [metric]);
  const detail = useMemo(() => config.detail, [config]);

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

  const pageTitle = `2026年${groupMeta.label}ランキング`;
  const pageDescription = `2026年の${groupMeta.label}に関する項目のランキングです。`;

  return (
    <>
      <Head>
        <title>{`2026年${config.label}ランキング - アメダス図鑑`}</title>
        <meta
          name="description"
          content={`2026年アメダス観測データに基づく最新の${config.label}に関する全国ランキング（月間・年間ランキングなど）を表示します。`}
        />
        <link rel="canonical" href={`https://amedas-zukan.jp/live/recent_ranking/${type}`} />
      </Head>
      <Layout>
        <main className="max-w-[1280px] mx-auto p-4  my-4 w-full">
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: "年間ランキング", href: "/clim_ranking" },
              { label: pageTitle },
            ]}
          />

          <PageLayout sidebar={<Sidebar />}>
            {/* 左メインエリア */}
            <div className="space-y-6">
              {/* ページヘッダーカード */}
              <HeroSection
                badgeText="Annual Ranking"
                Icon={config.highIcon}
                title={pageTitle}
                description={pageDescription}
                watermark="ANNUAL"
                gradient={detail.gradient}
                lastUpdateLabel="更新"
                lastUpdateValue={displayLastUpdate}
              />

              {/* 統合コントロールパネル（項目選択・絞り込み） */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
                {/* 1. 指標選択 */}
                <div className="flex flex-col gap-3 pb-5 border-b border-slate-100">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
                      指標:
                    </span>
                    {groupMetrics.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMetric(m)}
                        className={`px-4 py-1.5 rounded-xl text-xs  font-bold transition-all ${
                          metric === m
                            ? "text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                        style={
                          metric === m
                            ? { backgroundColor: MetricKey[m].color }
                            : {}
                        }
                      >
                        {MetricKey[m].label}
                      </button>
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
            className={`p-4 bg-white shadow-2xl rounded-full text-slate-400 border border-slate-100 transition-colors hover:text-slate-600`}
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
    paths: [
      { params: { type: "heat" } },
      { params: { type: "cold" } },
      { params: { type: "rain" } },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const type = params?.type as MetricGroup;
  if (!RANKING_GROUP_META[type]) {
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
        type,
      },
    };
  } catch (error) {
    console.error(
      `[SSG Error] Recent Ranking Shell generation failed for ${type}:`,
      error
    );
    return { notFound: true };
  }
};

export default RecentRankingDynamicPage;
