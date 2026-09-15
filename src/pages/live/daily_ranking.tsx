import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import CategoryLegend from "../../components/CategoryLegend";
import Layout from "../../components/Layout";
import PageLayout from "../../components/PageLayout";
import HeroSection from "../../components/HeroSection";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import {
  RankingData,
  RankingItem,
  RawRankingData,
} from "../../components/Ranking/types";
import RankingGrid from "../../components/Ranking/RankingGrid";
import RankingScopeFilter from "../../components/Ranking/RankingScopeFilter";
import { toStation } from "../../utils/masterUtils";
import { PrefKey, PrefMeta } from "../../setting/pref";
import { RankKey, RankMeta } from "../../setting/rank";
import { processRankingData } from "../../utils/rankingUtils";
import { RegionKey, RegionMeta } from "../../setting/region";
import { loadMaster } from "../../utils/ssgLoader";

import { colorWithAlpha } from "../../components/LayeredPieChart/chartUtils";
import { RawStationData } from "../../types/raw";
import { StationId } from "../../types/union";
import { getMetricColor } from "../../utils/colorUtils";
import { MetricKey, MetricValue } from "../../setting/metric";

interface Props {
  masterData: Record<string, RawStationData>;
}

const DailyRankingPage: NextPage<Props> = ({ masterData }) => {
  const [metric, setMetric] = useState<MetricValue>("av_hitemp");
  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);

  // クライアントサイドで取得する動的データ
  const [jmaData, setJmaData] = useState<{
    av_hitemp: RankingItem[];
    av_lwtemp: RankingItem[];
    sm_rain: RankingItem[];
    lastUpdate?: string;
  } | null>(null);

  useEffect(() => {
    // APIから最新の数字を取得
    fetch("/api/live/daily-ranking")
      .then((res) => res.json())
      .then(setJmaData)
      .catch(console.error);
  }, []);

  const config = useMemo(() => MetricKey[metric], [metric]);
  const detail = useMemo(() => config.detail!, [config]);

  const displayList: RankingData[] = useMemo(() => {
    if (!jmaData) return [];

    const jmaList = jmaData[metric] || [];

    // 1. RawRankingData に変換 (SSGのマスターデータと合体)
    const rawList: RawRankingData[] = jmaList
      .map((item) => {
        const id = item.id!;
        const master = masterData[id];
        if (!master) return null;
        return {
          ...master,
          ...item,
        } as RawRankingData;
      })
      .filter((s): s is RawRankingData => s !== null);

    // 2. 共通ロジックでランキング処理 (ソート、フィルタリング、順位付け)
    const processed = processRankingData(
      rawList,
      rankMeta,
      selectedRegion,
      selectedPref,
      100
    );

    // 3. 表示用にRich化
    return processed.map((s) => ({
      ...toStation(s),
      value: s.value,
      rank: s.rank,
      time: s.time,
    }));
  }, [metric, jmaData, masterData, rankMeta, selectedRegion, selectedPref]);

  const dataBounds = useMemo(() => {
    if (!jmaData || !metric) return { min: 0, max: 0 };
    const list = jmaData[metric] || [];
    const values = list
      .map((s) => s.value)
      .filter((v): v is number => typeof v === "number");
    if (values.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [jmaData, metric]);

  const displayLastUpdate = useMemo(() => {
    if (!jmaData?.lastUpdate) return "読み込み中...";
    return new Date(jmaData.lastUpdate).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });
  }, [jmaData]);

  return (
    <>
      <Head>
        <title>{`今日の${config.label}ランキング - アメダス図鑑`}</title>
        <meta
          name="description"
          content={`全国アメダス観測所のデータから、今日これまでに観測された${config.label}の全国トップ10ランキングを表示。今日の最高気温・最低気温・最大降水量などの極値を素早く確認できます。`}
        />
        <link rel="canonical" href="https://amedas-zukan.jp/live/daily_ranking" />
      </Head>
      <Layout>
        <main className="max-w-[1280px] mx-auto p-4  my-4 w-full">
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: "本日の気象ランキング" },
            ]}
          />

          <PageLayout sidebar={<Sidebar />}>
            {/* 左メインエリア */}
            <div className="space-y-6">
              {/* ページヘッダーカード */}
              <HeroSection
                badgeText="Today's Ranking"
                Icon={config.highIcon}
                title={`今日の${config.label}ランキング`}
                description={`今日これまでに全国のアメダス観測所で観測された${config.label}の速報値ランキングです。`}
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
                  {(["av_hitemp", "av_lwtemp", "sm_rain"] as MetricValue[]).map(
                    (m) => (
                      <button
                        key={m}
                        onClick={() => setMetric(m)}
                        className={`px-4 py-1.5 rounded-xl text-xs  font-bold transition-all ${
                          metric === m
                            ? `text-white shadow-sm`
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
                    )
                  )}
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
                subTextPrefix="記録: "
                fractionDigits={metric === "sm_rain" ? 0 : 1}
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    // マスターデータのロードのみを行う (SSGの器として機能させる)
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
      },
    };
  } catch (error) {
    console.error(
      "[SSG Error] DailyRankingPage Shell generation failed:",
      error
    );
    return { notFound: true };
  }
};

export default DailyRankingPage;
