import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Layout from "../../../components/Layout";
import PageLayout from "../../../components/PageLayout";
import HeroSection from "../../../components/HeroSection";
import Sidebar from "../../../components/Sidebar";
import Breadcrumb from "../../../components/Breadcrumb";
import {
  RankingData,
  RankingItem,
  RawRankingData,
} from "../../../components/Ranking/types";
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
import { MetricKey, MetricValue } from "../../../setting/metric";

interface Props {
  masterData: Record<string, RawStationData>;
  targetMetric: MetricValue;
}

// 今日のランキングで提供している指標一覧
const DAILY_METRICS: MetricValue[] = ["av_hitemp", "av_lwtemp", "sm_rain"];

const DailyRankingMetricPage: NextPage<Props> = ({
  masterData,
  targetMetric,
}) => {
  const router = useRouter();

  // 現在選択中の指標（URLパラメータまたは初期値）
  const metric = (router.query.metric as MetricValue) || targetMetric;
  const config = useMemo(
    () => MetricKey[metric] || MetricKey[targetMetric],
    [metric, targetMetric]
  );
  const detail = useMemo(() => config.detail, [config]);

  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);

  // クライアントサイドで取得する動的速報データ（1回だけフェッチ）
  const [jmaData, setJmaData] = useState<{
    av_hitemp: RankingItem[];
    av_lwtemp: RankingItem[];
    sm_rain: RankingItem[];
    lastUpdate?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/live/daily-ranking")
      .then((res) => res.json())
      .then(setJmaData)
      .catch(console.error);
  }, []);

  // 指標切り替えハンドラ（shallow routingでURLを瞬時に更新）
  const handleSelectMetric = (nextMetric: MetricValue) => {
    if (nextMetric === metric) return;
    router.push(`/live/daily_ranking/${nextMetric}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const displayList: RankingData[] = useMemo(() => {
    if (!jmaData) return [];

    const jmaList = (jmaData as any)[metric] || [];

    // 1. RawRankingData に変換 (SSGのマスターデータと合体)
    const rawList: RawRankingData[] = jmaList
      .map((item: RankingItem) => {
        const id = item.id!;
        const master = masterData[id];
        if (!master) return null;
        return {
          ...master,
          ...item,
        } as RawRankingData;
      })
      .filter((s: RawRankingData | null): s is RawRankingData => s !== null);

    // 2. 共通ロジックでランキング処理 (ソート、フィルタリング、順位付け)
    const processed = processRankingData(
      rawList,
      rankMeta,
      selectedRegion,
      selectedPref,
      100
    );

    // 3. UI表示用の型にマッピング
    return processed.map((s) => ({
      ...toStation(s),
      value: s.value,
      rank: s.rank,
      time: s.time,
    }));
  }, [metric, jmaData, masterData, rankMeta, selectedRegion, selectedPref]);

  const displayLastUpdate = useMemo(() => {
    if (!jmaData || !jmaData.lastUpdate) return "読み込み中...";
    return new Date(jmaData.lastUpdate).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });
  }, [jmaData]);

  const dataBounds = useMemo(() => {
    if (!jmaData || !metric) return { min: 0, max: 0 };
    const list = (jmaData as any)[metric] || [];
    const values = list.map((item: any) => item.value);
    if (values.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [jmaData, metric]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const pageTitle = `今日の${config.label}ランキング`;
  const pageDescription = `今日これまでに全国のアメダス観測所で観測された${config.label}の速報値ランキングです。`;

  return (
    <>
      <Head>
        <title>{`${pageTitle} - アメダス図鑑`}</title>
        <meta name="description" content={pageDescription} />
        <link
          rel="canonical"
          href={`https://amedas-zukan.jp/live/daily_ranking/${metric}`}
        />
      </Head>
      <Layout>
        <main className="max-w-[1280px] mx-auto p-4 my-4 w-full">
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: "今日のランキング" },
              { label: config.label },
            ]}
          />

          <PageLayout sidebar={<Sidebar />}>
            {/* 左メインエリア */}
            <div className="space-y-6">
              {/* ページヘッダーカード */}
              <HeroSection
                badgeText="Today's Ranking"
                Icon={config.icon || config.high?.icon}
                title={pageTitle}
                description={pageDescription}
                watermark="TODAY"
                gradient={detail.gradient}
                lastUpdateLabel="更新"
                lastUpdateValue={displayLastUpdate}
              />

              {/* 統合コントロールパネル（メトリック選択・絞り込み） */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
                {/* 1. メトリック選択 */}
                <div className="flex flex-wrap gap-1.5 items-center pb-5 border-b border-slate-100">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
                    指標:
                  </span>
                  {DAILY_METRICS.map((m) => {
                    const isSelected = metric === m;
                    const mConfig = MetricKey[m];
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectMetric(m)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "text-white shadow-sm"
                            : "text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/70"
                        }`}
                        style={
                          isSelected ? { backgroundColor: mConfig.color } : {}
                        }
                      >
                        <span>{mConfig.icon}</span>
                        <span>{mConfig.label}</span>
                      </button>
                    );
                  })}
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
                subTextPrefix="観測時刻: "
                fractionDigits={metric === "sm_rain" ? 0 : 1}
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
    paths: DAILY_METRICS.map((metric) => ({
      params: { metric },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const metric = params?.metric as MetricValue;

  if (!DAILY_METRICS.includes(metric)) {
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
      `[SSG Error] DailyRankingPage Shell generation failed for ${metric}:`,
      error
    );
    return { notFound: true };
  }
};

export default DailyRankingMetricPage;
