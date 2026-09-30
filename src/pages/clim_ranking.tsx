import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoIosTrophy } from "react-icons/io";
import CategoryLegend from "../components/CategoryLegend";
import Layout from "../components/Layout";
import PageLayout from "../components/PageLayout";
import HeroSection from "../components/HeroSection";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import { colorWithAlpha } from "../components/LayeredPieChart/chartUtils";
import MetricPopup from "../components/Ranking/MetricPopup";
import RankingGrid from "../components/Ranking/RankingGrid";
import RankingScopeFilter from "../components/Ranking/RankingScopeFilter";
import { RankingData, RawRankingData } from "../components/Ranking/types";
import CustomSelect from "../components/UI/CustomSelect";
import { RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import { MonthMap, getMetricColor } from "../utils/colorUtils";
import { toStation } from "../utils/masterUtils";
import { MetricKey, MetricMeta, MetricValue } from "../setting/metric";
import { PrefKey, PrefMeta } from "../setting/pref";
import { RankKey, RankMeta } from "../setting/rank";
import { processRankingData } from "../utils/rankingUtils";
import { RegionKey, RegionMeta } from "../setting/region";
import { loadMaster } from "../utils/ssgLoader";
import { loadSingleMetric, pickStationData, resisterMaster } from "../utils/climateDataManager";
import { MonthlyEntry } from "../types/union";

interface Props {
  masterData: Record<string, RawStationData>;
}

const ClimatologicalRankingPage: NextPage<Props> = ({ masterData }) => {
  resisterMaster(masterData);
  const [metric, setMetric] = useState<MetricMeta>(MetricKey.av_avtemp);
  const [rankMeta, setRankMeta] = useState<RankMeta>(RankKey.top);
  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [showPopup, setShowPopup] = useState(false);

  // クライアントサイドで取得するデータ
  const [rankingRaw, setRankingRaw] = useState<Record<
    StationId,
    MonthlyEntry[]
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prevMetricKey, setPrevMetricKey] = useState(metric.key);

  if (metric.key !== prevMetricKey) {
    setPrevMetricKey(metric.key);
    setIsLoading(true);
    setRankingRaw(null);
  }

  useEffect(() => {
    let isMounted = true;
    const metricVal = metric.key.toLowerCase() as MetricValue;

    loadSingleMetric(metricVal)
      .then((data) => {
        if (isMounted) {
          setRankingRaw(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [metric.key, masterData]);

  const monthIdx = useMemo(
    () => (selectedMonth === "all" ? 12 : parseInt(selectedMonth) - 1),
    [selectedMonth]
  );

  const dataBounds = useMemo(() => {
    if (!rankingRaw) return { min: 0, max: 0 };
    const values = Object.values(rankingRaw)
      .map((entries) => entries[monthIdx]?.value)
      .filter((v): v is number => v !== null && v !== undefined);
    if (values.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [rankingRaw, monthIdx]);

  const displayList: RankingData[] = useMemo(() => {
    if (!rankingRaw || !masterData) return [];

    // 1. RawRankingData に変換
    const rawList: RawRankingData[] = Object.entries(rankingRaw)
      .map(([id, entries]) => {
        const master = masterData[id as StationId];
        if (!master) return null;
        const entry = entries[monthIdx];
        if (!entry || entry.value === undefined || entry.value === null) return null;
        return {
          ...master,
          id,
          value: entry.value,
          rank: 0,
        } as RawRankingData;
      })
      .filter((s): s is RawRankingData => s !== null);

    // 2. 共通ロジックでランキング処理
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
    }));
  }, [
    rankingRaw,
    masterData,
    monthIdx,
    rankMeta,
    selectedRegion,
    selectedPref,
  ]);

  const config = metric;
  const detail = useMemo(() => config.detail!, [config]);

  return (
    <>
      <Head>
        <title>{`${selectedMonth === "all" ? "通年" : selectedMonth + "月"}の${config.tab?.includes("日数") ? `${config.label}（${config.tab}）` : config.label
          }ランキング - アメダス図鑑`}</title>
        <meta
          name="description"
          content={`全国約1,300地点のアメダス観測データに基づき、${selectedMonth === "all" ? "通年" : `${selectedMonth}月`}の${config.tab?.includes("日数") ? `${config.tab}（${config.label}）` : config.label
            }平年値ランキングを表示。地域・都道府県別での絞り込み比較も可能です。`}
        />
        <link rel="canonical" href="https://amedas-zukan.jp/clim_ranking" />
      </Head>
      <Layout>
        <main className="max-w-[1280px] mx-auto p-4  my-4 w-full">
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: "気候ランキング" },
            ]}
          />

          <PageLayout sidebar={<Sidebar />}>
            {/* 左メインエリア */}
            <div className="space-y-6">
              {/* ページヘッダーカード */}
              <HeroSection
                badgeIcon={<IoIosTrophy className="text-amber-200" />}
                badgeText="Climatological Ranking"
                Icon={config.icon}
                title={`${selectedMonth === "all" ? "通年" : `${selectedMonth}月`}の${config.tab?.includes("日数") ? `${config.label}（${config.tab}）` : config.label
                  }ランキング`}
                description={`全国約1,300地点のアメダス平年値（1991〜2020年統計）に基づき、${config.tab?.includes("日数") ? `${config.tab}（${config.label}）` : config.label
                  }の全国・地域・都道府県別ランキングを掲載しています。`}
                watermark="RANKING"
                gradient={detail.gradient}
              />

              {/* 統合コントロールパネル（項目選択・月選択・絞り込み・凡例） */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
                {/* 1. 指標選択 & 月選択 */}
                <div className="flex flex-col  justify-between items-stretch  gap-4 pb-5 border-b border-slate-100">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
                      指標:
                    </span>
                    {Object.values(MetricKey)
                      .filter((m) => m.tab === "主要")
                      .map((m) => {
                        const isSelected = metric.key === m.key;
                        return (
                          <button
                            key={m.key}
                            onClick={() => setMetric(m)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isSelected
                              ? "text-white shadow-sm"
                              : "text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/70"
                              }`}
                            style={
                              isSelected ? { backgroundColor: m.color } : {}
                            }
                          >
                            <span>{m.icon}</span>
                            <span>{m.label}</span>
                          </button>
                        );
                      })}

                    {/* その他メトリック選択 */}
                    <button
                      onClick={() => setShowPopup(true)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${metric.tab !== "主要"
                        ? "text-white shadow-sm"
                        : "text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/70"
                        }`}
                      style={
                        metric.tab !== "主要"
                          ? { backgroundColor: metric.color }
                          : {}
                      }
                    >
                      {metric.tab !== "主要" && <span>{metric.icon}</span>}
                      <span>{metric.tab !== "主要" ? metric.label : "その他 ▸"}</span>
                    </button>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      期間:
                    </span>
                    <CustomSelect
                      value={selectedMonth}
                      onChange={(v) => setSelectedMonth(v)}
                      options={Object.entries(MonthMap).map(([k, v]) => ({
                        value: k,
                        label: v,
                      }))}
                    />
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

              <MetricPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                onApply={(m) => setMetric(m)}
                rankType={rankMeta}
                initialMetricKey={metric}
              />

              {/* ランキングリスト */}
              <RankingGrid
                items={displayList}
                unit={config.unit}
                minBound={dataBounds.min}
                maxBound={dataBounds.max}
                isLoading={isLoading}
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
    const masterData = loadMaster();
    const data = pickStationData(masterData, ["id", "category", "pref", "station_name"])

    return {
      props: {
        masterData: data,
      },
    };
  } catch (error) {
    console.error(
      "[SSG Error] ClimatologicalRankingPage Shell generation failed:",
      error
    );
    return { notFound: true };
  }
};

export default ClimatologicalRankingPage;
